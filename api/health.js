import { getVercelStorageStatus } from '../lib/vercel-data-store.js'
import {
  clearSessionCookie,
  createSessionCookie,
  getAuthStatus,
  isAuthenticated,
  verifyPassword,
} from '../lib/auth.js'

const wait = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds))

export default async function handler(request, response) {
  response.setHeader('Cache-Control', 'no-store')
  const authentication = getAuthStatus()

  if (request.method === 'GET') {
    return response.status(200).json({
      ok: true,
      api: 'vercel-function',
      authenticated: isAuthenticated(request),
      authentication,
      storage: getVercelStorageStatus(),
    })
  }

  if (request.method !== 'POST') {
    response.setHeader('Allow', 'GET, POST')
    return response.status(405).json({ error: 'Method not allowed' })
  }

  if (!authentication.configured) {
    return response.status(503).json({
      error: 'App authentication is not configured.',
      code: 'AUTH_NOT_CONFIGURED',
    })
  }

  const action = request.body?.action
  if (action === 'logout') {
    response.setHeader('Set-Cookie', clearSessionCookie())
    return response.status(200).json({ authenticated: false })
  }

  if (action === 'login') {
    if (!verifyPassword(request.body?.password)) {
      await wait(500)
      return response.status(401).json({ error: 'Incorrect password.', code: 'INVALID_PASSWORD' })
    }

    response.setHeader('Set-Cookie', createSessionCookie())
    return response.status(200).json({ authenticated: true })
  }

  return response.status(400).json({
    error: 'Invalid authentication action',
    code: 'INVALID_AUTH_ACTION',
  })
}
