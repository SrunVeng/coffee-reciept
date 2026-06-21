import { createReadStream } from 'node:fs'
import { mkdir, readFile, rename, stat, writeFile } from 'node:fs/promises'
import { createServer } from 'node:http'
import { extname, join, normalize } from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import { processRecipeRequest } from './lib/recipe-service.js'
import { clearSessionCookie, createSessionCookie, getAuthStatus, isAuthenticated, verifyPassword } from './lib/auth.js'

const root = fileURLToPath(new URL('.', import.meta.url))
try {
  process.loadEnvFile(join(root, '.env.local'))
} catch (error) {
  if (error.code !== 'ENOENT') throw error
}
const dataFile = join(root, 'data', 'data.json')
const isDev = process.argv.includes('--dev')
const port = Number(process.env.PORT || 5173)
const host = process.env.HOST || '0.0.0.0'

const mimeTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
}

let mutationQueue = Promise.resolve()

async function readData() {
  const data = JSON.parse(await readFile(dataFile, 'utf8'))
  return {
    ...data,
    recipes: Array.isArray(data.recipes) ? data.recipes : [],
    ingredients: Array.isArray(data.ingredients) ? data.ingredients : [],
    preparations: Array.isArray(data.preparations) ? data.preparations : [],
  }
}

async function saveData(data) {
  await mkdir(join(root, 'data'), { recursive: true })
  const temporaryFile = `${dataFile}.tmp`
  await writeFile(temporaryFile, `${JSON.stringify(data, null, 2)}\n`, 'utf8')
  await rename(temporaryFile, dataFile)
}

function sendJson(response, status, body, headers = {}) {
  response.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    ...headers,
  })
  response.end(JSON.stringify(body))
}

async function readBody(request) {
  let body = ''
  for await (const chunk of request) {
    body += chunk
    if (body.length > 1_000_000) {
      const error = new Error('Request is too large')
      error.statusCode = 413
      throw error
    }
  }
  try {
    return body ? JSON.parse(body) : {}
  } catch (cause) {
    const error = new Error('Invalid JSON body', { cause })
    error.statusCode = 400
    throw error
  }
}

async function runRecipeRequest(request, response, pathname, body) {
  const data = await readData()
  const result = processRecipeRequest({
    method: request.method,
    pathname,
    body,
    data,
  })

  if (result.changed) await saveData(result.data)
  sendJson(response, result.status, result.body)
  return result.handled
}

async function handleApi(request, response, pathname) {
  if (pathname === '/api/health') {
    const authentication = getAuthStatus()
    if (request.method === 'GET') {
      sendJson(response, 200, {
        ok: true,
        api: 'local-node',
        authenticated: isAuthenticated(request),
        authentication,
        storage: { configured: true, environment: 'local' },
      })
      return true
    }
    if (request.method !== 'POST') {
      sendJson(response, 405, { error: 'Method not allowed' }, { Allow: 'GET, POST' })
      return true
    }

    if (!authentication.configured) {
      sendJson(response, 503, { error: 'App authentication is not configured.', code: 'AUTH_NOT_CONFIGURED' })
      return true
    }

    const body = await readBody(request)
    if (body.action === 'logout') {
      sendJson(response, 200, { authenticated: false }, { 'Set-Cookie': clearSessionCookie() })
      return true
    }
    if (body.action === 'login') {
      if (!verifyPassword(body.password)) {
        await new Promise((resolve) => setTimeout(resolve, 500))
        sendJson(response, 401, { error: 'Incorrect password.', code: 'INVALID_PASSWORD' })
        return true
      }
      sendJson(response, 200, { authenticated: true }, { 'Set-Cookie': createSessionCookie() })
      return true
    }
    sendJson(response, 400, { error: 'Invalid authentication action', code: 'INVALID_AUTH_ACTION' })
    return true
  }

  if (!isAuthenticated(request)) {
    sendJson(response, 401, { error: 'Authentication required.', code: 'UNAUTHORIZED' })
    return true
  }

  const body = ['POST', 'PUT', 'PATCH'].includes(request.method)
    ? await readBody(request)
    : {}
  if (request.method === 'POST' && pathname === '/api/data' && body.action === 'bulk-delete' && !verifyPassword(body.password)) {
    sendJson(response, 403, { error: 'Incorrect password.', code: 'INVALID_PASSWORD' })
    return true
  }
  const execute = () => runRecipeRequest(request, response, pathname, body)

  if (request.method === 'GET') {
    await mutationQueue
    return execute()
  }

  const queuedRequest = mutationQueue.then(execute, execute)
  mutationQueue = queuedRequest.catch(() => {})
  return queuedRequest
}

async function serveStatic(request, response) {
  const requestPath = decodeURIComponent(new URL(request.url, `http://${request.headers.host}`).pathname)
  const safePath = normalize(requestPath).replace(/^(\.\.(\/|\\|$))+/, '')
  let filePath = join(root, 'dist', safePath === '/' ? 'index.html' : safePath)

  try {
    const info = await stat(filePath)
    if (info.isDirectory()) filePath = join(filePath, 'index.html')
  } catch {
    filePath = join(root, 'dist', 'index.html')
  }

  const isHtml = extname(filePath) === '.html'
  response.writeHead(200, {
    'Content-Type': mimeTypes[extname(filePath)] || 'application/octet-stream',
    'Cache-Control': isHtml ? 'no-cache' : 'public, max-age=31536000, immutable',
  })
  createReadStream(filePath).pipe(response)
}

let vite
if (isDev) {
  const { createServer: createViteServer } = await import('vite')
  vite = await createViteServer({ server: { middlewareMode: true }, appType: 'spa' })
}

const server = createServer(async (request, response) => {
  try {
    const pathname = new URL(request.url, `http://${request.headers.host}`).pathname
    if (pathname.startsWith('/api/')) {
      const handled = await handleApi(request, response, pathname)
      if (!handled && !response.headersSent) sendJson(response, 404, { error: 'Not found' })
      return
    }
    if (isDev) {
      vite.middlewares(request, response, () => {
        response.writeHead(404)
        response.end('Not found')
      })
      return
    }
    await serveStatic(request, response)
  } catch (error) {
    const status = error.statusCode || 500
    if (status >= 500) console.error(error)
    if (!response.headersSent) sendJson(response, status, { error: error.message || 'Server error' })
    else response.end()
  }
})

server.listen(port, host, () => {
  console.log(`Phin & Pour running at http://127.0.0.1:${port}`)
})
