import { createReadStream } from 'node:fs'
import { mkdir, readFile, rename, stat, writeFile } from 'node:fs/promises'
import { createServer } from 'node:http'
import { extname, join, normalize } from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('.', import.meta.url))
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

async function readData() {
  return JSON.parse(await readFile(dataFile, 'utf8'))
}

async function saveData(data) {
  await mkdir(join(root, 'data'), { recursive: true })
  const temporaryFile = `${dataFile}.tmp`
  await writeFile(temporaryFile, `${JSON.stringify(data, null, 2)}\n`, 'utf8')
  await rename(temporaryFile, dataFile)
}

function sendJson(response, status, body) {
  response.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
  })
  response.end(JSON.stringify(body))
}

async function readBody(request) {
  let body = ''
  for await (const chunk of request) {
    body += chunk
    if (body.length > 1_000_000) throw new Error('Request is too large')
  }
  return body ? JSON.parse(body) : {}
}

function makeId(name) {
  const slug = String(name || 'item')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
  return `${slug || 'item'}-${Date.now().toString(36)}`
}

function validateRecipe(recipe, ingredientIds, preparationIds) {
  if (!recipe.name?.trim()) return 'Recipe name is required'
  if (!recipe.category?.trim()) return 'Category is required'
  if (!Array.isArray(recipe.ingredients) || recipe.ingredients.length === 0) {
    return 'Add at least one ingredient'
  }
  if (recipe.ingredients.some((item) => !ingredientIds.has(item.ingredientId))) {
    return 'A selected ingredient no longer exists'
  }
  if (recipe.ingredients.some((item) => Number(item.amount) <= 0 || !item.unit?.trim())) {
    return 'Every ingredient needs an amount and unit'
  }
  if (recipe.preparations?.some((item) => !preparationIds.has(item.preparationId))) {
    return 'A selected preparation no longer exists'
  }
  if (recipe.preparations?.some((item) => Number(item.amount) <= 0 || !item.unit?.trim())) {
    return 'Every preparation needs an amount and unit'
  }
  if (!Array.isArray(recipe.steps) || recipe.steps.length === 0) return 'Add at least one step'
  if (!Number.isFinite(Number(recipe.price)) || Number(recipe.price) <= 0) {
    return 'Price must be greater than zero'
  }
  return null
}

function validatePreparation(preparation, ingredientIds) {
  if (!preparation.name?.trim()) return 'Preparation name is required'
  if (!Array.isArray(preparation.ingredients) || preparation.ingredients.length === 0) {
    return 'Add at least one ingredient'
  }
  if (preparation.ingredients.some((item) => !ingredientIds.has(item.ingredientId))) {
    return 'A selected ingredient no longer exists'
  }
  if (preparation.ingredients.some((item) => Number(item.amount) <= 0 || !item.unit?.trim())) {
    return 'Every ingredient needs an amount and unit'
  }
  if (!Array.isArray(preparation.steps) || preparation.steps.length === 0) {
    return 'Add at least one step'
  }
  if (Number(preparation.yieldAmount) <= 0 || !preparation.yieldUnit?.trim()) {
    return 'Yield amount and unit are required'
  }
  return null
}

async function handleApi(request, response, pathname) {
  const data = await readData()

  if (request.method === 'GET' && pathname === '/api/data') {
    sendJson(response, 200, data)
    return true
  }

  if (request.method === 'POST' && pathname === '/api/ingredients') {
    const body = await readBody(request)
    if (!body.name?.trim() || !body.defaultUnit?.trim()) {
      sendJson(response, 400, { error: 'Ingredient name and unit are required' })
      return true
    }
    if (data.ingredients.some((item) => item.name.toLowerCase() === body.name.trim().toLowerCase())) {
      sendJson(response, 409, { error: 'That ingredient already exists' })
      return true
    }
    const ingredient = {
      id: makeId(body.name),
      name: body.name.trim(),
      nameKm: body.nameKm?.trim() || '',
      category: body.category?.trim() || 'Other',
      defaultUnit: body.defaultUnit.trim(),
    }
    data.ingredients.push(ingredient)
    await saveData(data)
    sendJson(response, 201, ingredient)
    return true
  }

  const ingredientMatch = pathname.match(/^\/api\/ingredients\/([^/]+)$/)
  if (ingredientMatch && request.method === 'PUT') {
    const index = data.ingredients.findIndex((item) => item.id === ingredientMatch[1])
    if (index < 0) {
      sendJson(response, 404, { error: 'Ingredient not found' })
      return true
    }
    const body = await readBody(request)
    if (!body.name?.trim() || !body.defaultUnit?.trim()) {
      sendJson(response, 400, { error: 'Ingredient name and unit are required' })
      return true
    }
    data.ingredients[index] = {
      ...data.ingredients[index],
      name: body.name.trim(),
      nameKm: body.nameKm?.trim() || '',
      category: body.category?.trim() || 'Other',
      defaultUnit: body.defaultUnit.trim(),
    }
    await saveData(data)
    sendJson(response, 200, data.ingredients[index])
    return true
  }

  if (ingredientMatch && request.method === 'DELETE') {
    const isUsed = data.recipes.some((recipe) =>
      recipe.ingredients.some((item) => item.ingredientId === ingredientMatch[1]),
    ) || data.preparations?.some((preparation) =>
      preparation.ingredients.some((item) => item.ingredientId === ingredientMatch[1]),
    )
    if (isUsed) {
      sendJson(response, 409, { error: 'This ingredient is used in a recipe and cannot be deleted' })
      return true
    }
    data.ingredients = data.ingredients.filter((item) => item.id !== ingredientMatch[1])
    await saveData(data)
    sendJson(response, 200, { ok: true })
    return true
  }

  if (request.method === 'POST' && pathname === '/api/preparations') {
    const body = await readBody(request)
    const error = validatePreparation(body, new Set(data.ingredients.map((item) => item.id)))
    if (error) {
      sendJson(response, 400, { error })
      return true
    }
    const preparation = cleanPreparation(body, makeId(body.name))
    data.preparations = data.preparations || []
    data.preparations.unshift(preparation)
    await saveData(data)
    sendJson(response, 201, preparation)
    return true
  }

  const preparationMatch = pathname.match(/^\/api\/preparations\/([^/]+)$/)
  if (preparationMatch && request.method === 'PUT') {
    const index = (data.preparations || []).findIndex((item) => item.id === preparationMatch[1])
    if (index < 0) {
      sendJson(response, 404, { error: 'Preparation not found' })
      return true
    }
    const body = await readBody(request)
    const error = validatePreparation(body, new Set(data.ingredients.map((item) => item.id)))
    if (error) {
      sendJson(response, 400, { error })
      return true
    }
    data.preparations[index] = cleanPreparation(body, data.preparations[index].id)
    await saveData(data)
    sendJson(response, 200, data.preparations[index])
    return true
  }

  if (preparationMatch && request.method === 'DELETE') {
    const isUsed = data.recipes.some((recipe) =>
      recipe.preparations?.some((item) => item.preparationId === preparationMatch[1]),
    )
    if (isUsed) {
      sendJson(response, 409, { error: 'This preparation is used in a drink and cannot be deleted' })
      return true
    }
    const before = (data.preparations || []).length
    data.preparations = (data.preparations || []).filter((item) => item.id !== preparationMatch[1])
    if (data.preparations.length === before) {
      sendJson(response, 404, { error: 'Preparation not found' })
      return true
    }
    await saveData(data)
    sendJson(response, 200, { ok: true })
    return true
  }

  if (request.method === 'POST' && pathname === '/api/recipes') {
    const body = await readBody(request)
    const error = validateRecipe(
      body,
      new Set(data.ingredients.map((item) => item.id)),
      new Set((data.preparations || []).map((item) => item.id)),
    )
    if (error) {
      sendJson(response, 400, { error })
      return true
    }
    const recipe = cleanRecipe(body, makeId(body.name))
    data.recipes.unshift(recipe)
    await saveData(data)
    sendJson(response, 201, recipe)
    return true
  }

  const recipeMatch = pathname.match(/^\/api\/recipes\/([^/]+)$/)
  if (recipeMatch && request.method === 'PUT') {
    const index = data.recipes.findIndex((item) => item.id === recipeMatch[1])
    if (index < 0) {
      sendJson(response, 404, { error: 'Recipe not found' })
      return true
    }
    const body = await readBody(request)
    const error = validateRecipe(
      body,
      new Set(data.ingredients.map((item) => item.id)),
      new Set((data.preparations || []).map((item) => item.id)),
    )
    if (error) {
      sendJson(response, 400, { error })
      return true
    }
    data.recipes[index] = cleanRecipe(body, data.recipes[index].id)
    await saveData(data)
    sendJson(response, 200, data.recipes[index])
    return true
  }

  if (recipeMatch && request.method === 'DELETE') {
    const before = data.recipes.length
    data.recipes = data.recipes.filter((item) => item.id !== recipeMatch[1])
    if (data.recipes.length === before) {
      sendJson(response, 404, { error: 'Recipe not found' })
      return true
    }
    await saveData(data)
    sendJson(response, 200, { ok: true })
    return true
  }

  return false
}

function cleanPreparation(body, id) {
  return {
    id,
    name: body.name.trim(),
    nameKm: body.nameKm?.trim() || '',
    description: body.description?.trim() || '',
    descriptionKm: body.descriptionKm?.trim() || '',
    type: body.type?.trim() || 'Other',
    prepTime: Number(body.prepTime) || 1,
    yieldAmount: Number(body.yieldAmount),
    yieldUnit: body.yieldUnit.trim(),
    ingredients: body.ingredients.map((item) => ({
      ingredientId: item.ingredientId,
      amount: Number(item.amount),
      unit: item.unit.trim(),
    })),
    steps: body.steps.map((step) => step.trim()).filter(Boolean),
    stepsKm: body.steps.map((_, index) => body.stepsKm?.[index]?.trim() || ''),
    storage: body.storage?.trim() || '',
    storageKm: body.storageKm?.trim() || '',
    sources: Array.isArray(body.sources) ? body.sources : [],
  }
}

function cleanRecipe(body, id) {
  return {
    id,
    name: body.name.trim(),
    nameKm: body.nameKm?.trim() || '',
    category: body.category.trim(),
    description: body.description?.trim() || '',
    descriptionKm: body.descriptionKm?.trim() || '',
    prepTime: Number(body.prepTime) || 1,
    price: Number(body.price),
    ingredients: body.ingredients.map((item) => ({
      ingredientId: item.ingredientId,
      amount: Number(item.amount),
      unit: item.unit.trim(),
    })),
    preparations: (body.preparations || []).map((item) => ({
      preparationId: item.preparationId,
      amount: Number(item.amount),
      unit: item.unit.trim(),
    })),
    steps: body.steps.map((step) => step.trim()).filter(Boolean),
    stepsKm: body.steps.map((_, index) => body.stepsKm?.[index]?.trim() || ''),
    notes: body.notes?.trim() || '',
    notesKm: body.notesKm?.trim() || '',
    sources: Array.isArray(body.sources) ? body.sources : [],
  }
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

  response.writeHead(200, {
    'Content-Type': mimeTypes[extname(filePath)] || 'application/octet-stream',
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
      if (!handled) sendJson(response, 404, { error: 'Not found' })
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
    console.error(error)
    if (!response.headersSent) sendJson(response, 500, { error: error.message || 'Server error' })
    else response.end()
  }
})

server.listen(port, host, () => {
  console.log(`Phin & Pour running at http://127.0.0.1:${port}`)
})
