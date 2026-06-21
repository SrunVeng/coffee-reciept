import { list, put } from '@vercel/blob'
import { readFile } from 'node:fs/promises'
import { randomUUID } from 'node:crypto'
import process from 'node:process'

const environment = process.env.VERCEL_ENV === 'production' ? 'production' : 'preview'
const prefix = `receipt-data/${environment}/`

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

export async function readVercelData() {
  if (!hasBlobCredentials()) {
    return {
      data: await seedData(),
      persistent: false,
    }
  }

  const blobs = []
  let cursor
  do {
    const page = await list({ prefix, limit: 1000, cursor, ...blobOptions() })
    blobs.push(...page.blobs)
    cursor = page.hasMore ? page.cursor : undefined
  } while (cursor)

  if (!blobs.length) {
    const data = await seedData()
    await saveVercelData(data)
    return { data, persistent: true }
  }

  const latest = [...blobs].sort((a, b) => a.pathname.localeCompare(b.pathname)).at(-1)
  const response = await fetch(`${latest.url}?version=${encodeURIComponent(latest.pathname)}`, {
    cache: 'no-store',
  })
  if (!response.ok) throw new Error('Could not read recipe data from Vercel Blob.')
  return {
    data: await response.json(),
    persistent: true,
  }
}

export async function saveVercelData(data) {
  if (!hasBlobCredentials()) {
    throw new Error('Vercel Blob is not connected. Add a Blob store to this Vercel project and redeploy.')
  }

  const version = `${Date.now().toString().padStart(13, '0')}-${randomUUID()}.json`
  await put(`${prefix}${version}`, `${JSON.stringify(data, null, 2)}\n`, {
    access: 'public',
    addRandomSuffix: false,
    contentType: 'application/json',
    ...blobOptions(),
  })
}
