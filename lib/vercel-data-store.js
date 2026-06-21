import { BlobNotFoundError, head, list, put } from '@vercel/blob'
import { readFile } from 'node:fs/promises'
import process from 'node:process'

const environment = process.env.VERCEL_ENV === 'production' ? 'production' : 'preview'
const prefix = `receipt-data/${environment}/`
const currentDataPath = `${prefix}current.json`

function hasBlobCredentials() {
  return Boolean(
    process.env.BLOB_READ_WRITE_TOKEN
    || (process.env.VERCEL_OIDC_TOKEN && process.env.BLOB_STORE_ID),
  )
}

function blobOptions() {
  return process.env.BLOB_READ_WRITE_TOKEN
    ? { token: process.env.BLOB_READ_WRITE_TOKEN }
    : {}
}

export function getVercelStorageStatus() {
  return {
    configured: hasBlobCredentials(),
    hasReadWriteToken: Boolean(process.env.BLOB_READ_WRITE_TOKEN),
    hasStoreId: Boolean(process.env.BLOB_STORE_ID),
    hasOidcToken: Boolean(process.env.VERCEL_OIDC_TOKEN),
    environment: process.env.VERCEL_ENV || 'local',
  }
}

async function seedData() {
  const file = new URL('../data/data.json', import.meta.url)
  return JSON.parse(await readFile(file, 'utf8'))
}

async function readBlob(blob) {
  const response = await fetch(`${blob.url}?version=${encodeURIComponent(blob.etag || blob.pathname)}`, {
    cache: 'no-store',
    headers: {
      'Cache-Control': 'no-cache, no-store, max-age=0',
      Pragma: 'no-cache',
    },
  })
  if (!response.ok) throw new Error('Could not read recipe data from Vercel Blob.')
  return response.json()
}

async function findCurrentBlob() {
  try {
    return await head(currentDataPath, blobOptions())
  } catch (error) {
    if (error instanceof BlobNotFoundError) return null
    throw error
  }
}

async function findLegacyBlob() {
  const blobs = []
  let cursor
  do {
    const page = await list({ prefix, limit: 1000, cursor, ...blobOptions() })
    blobs.push(...page.blobs.filter((blob) => blob.pathname !== currentDataPath))
    cursor = page.hasMore ? page.cursor : undefined
  } while (cursor)

  return blobs.sort((a, b) => a.pathname.localeCompare(b.pathname)).at(-1)
}

export async function readVercelData() {
  if (!hasBlobCredentials()) {
    return {
      data: await seedData(),
      persistent: false,
    }
  }

  const currentBlob = await findCurrentBlob()
  if (currentBlob) {
    return {
      data: await readBlob(currentBlob),
      etag: currentBlob.etag,
      persistent: true,
    }
  }

  const legacyBlob = await findLegacyBlob()
  const data = legacyBlob ? await readBlob(legacyBlob) : await seedData()
  const saved = await saveVercelData(data)
  return {
    data,
    etag: saved.etag,
    persistent: true,
  }
}

export async function saveVercelData(data, etag) {
  if (!hasBlobCredentials()) {
    throw new Error('Vercel Blob is not connected. Add a Blob store to this Vercel project and redeploy.')
  }

  return put(currentDataPath, `${JSON.stringify(data, null, 2)}\n`, {
    access: 'public',
    addRandomSuffix: false,
    allowOverwrite: true,
    cacheControlMaxAge: 60,
    contentType: 'application/json',
    ...(etag ? { ifMatch: etag } : {}),
    ...blobOptions(),
  })
}
