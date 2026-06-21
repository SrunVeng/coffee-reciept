import { getVercelStorageStatus } from '../lib/vercel-data-store.js'
import { getAuthStatus } from '../lib/auth.js'

export default function handler(request, response) {
  response.setHeader('Cache-Control', 'no-store')
  return response.status(200).json({
    ok: true,
    api: 'vercel-function',
    authentication: getAuthStatus(),
    storage: getVercelStorageStatus(),
  })
}
