import { handleVercelApi } from '../../lib/vercel-api-handler.js'

export default function handler(request, response) {
  return handleVercelApi(request, response, '/api/preparations')
}
