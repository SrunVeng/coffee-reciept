import { processRecipeRequest } from './recipe-service.js'
import { readVercelData, saveVercelData } from './vercel-data-store.js'

export async function handleVercelApi(request, response, pathname) {
  try {
    const data = await readVercelData()
    const body = request.body && typeof request.body === 'object' ? request.body : {}
    const result = processRecipeRequest({
      method: request.method,
      pathname,
      body,
      data,
    })

    if (result.changed) await saveVercelData(result.data)
    response.setHeader('Cache-Control', 'no-store')
    return response.status(result.status).json(result.body)
  } catch (error) {
    console.error(error)
    return response.status(500).json({ error: error.message || 'Server error' })
  }
}
