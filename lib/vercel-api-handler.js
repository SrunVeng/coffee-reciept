import { processRecipeRequest } from './recipe-service.js'
import { readVercelData, saveVercelData } from './vercel-data-store.js'
import { BlobPreconditionFailedError } from '@vercel/blob'

export async function handleVercelApi(request, response, pathname) {
  try {
    const store = await readVercelData()
    const body = request.body && typeof request.body === 'object' ? request.body : {}
    const result = processRecipeRequest({
      method: request.method,
      pathname,
      body,
      data: store.data,
    })

    if (result.changed && !store.persistent) {
      return response.status(503).json({
        error: 'Vercel Blob is not connected. Reading works, but saving requires a connected Blob store and a redeploy.',
        code: 'STORAGE_NOT_CONFIGURED',
      })
    }

    if (result.changed) await saveVercelData(result.data, store.etag)
    response.setHeader('Cache-Control', 'no-store')
    response.setHeader('X-Recipe-Storage', store.persistent ? 'vercel-blob' : 'read-only-seed')
    return response.status(result.status).json(result.body)
  } catch (error) {
    if (error instanceof BlobPreconditionFailedError) {
      return response.status(409).json({
        error: 'Recipe data changed on another device. Reload and try again.',
        code: 'DATA_CHANGED',
      })
    }
    console.error(error)
    return response.status(500).json({ error: error.message || 'Server error' })
  }
}
