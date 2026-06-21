import { getVercelStorageStatus } from '../lib/vercel-data-store.js'

export default function handler(request, response) {
  response.setHeader('Cache-Control', 'no-store')
  return response.status(200).json({
    ok: true,
    api: 'vercel-function',
    storage: getVercelStorageStatus(),
  })
}
