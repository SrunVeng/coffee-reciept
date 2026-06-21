import { createHmac, randomBytes, scryptSync, timingSafeEqual } from 'node:crypto'
import { Buffer } from 'node:buffer'
import process from 'node:process'

const cookieName = 'receipt_session'
const sessionSeconds = 60 * 60 * 24 * 7

function passwordParts() {
  const [algorithm, salt, hash] = String(process.env.APP_PASSWORD_HASH || '').split('$')
  if (algorithm !== 'scrypt' || !salt || !hash) return null
  return { salt: Buffer.from(salt, 'hex'), hash: Buffer.from(hash, 'hex') }
}

function sessionSecret() {
  return process.env.SESSION_SECRET || ''
}

function encode(value) {
  return Buffer.from(value).toString('base64url')
}

function sign(value) {
  return createHmac('sha256', sessionSecret()).update(value).digest('base64url')
}

function secureCookie() {
  return process.env.VERCEL === '1' || process.env.NODE_ENV === 'production'
}

function cookieValue(request, name) {
  const cookieHeader = request.headers?.cookie || ''
  const entry = cookieHeader.split(';').map((item) => item.trim()).find((item) => item.startsWith(`${name}=`))
  return entry ? decodeURIComponent(entry.slice(name.length + 1)) : ''
}

export function getAuthStatus() {
  return {
    configured: Boolean(passwordParts() && sessionSecret()),
    hasPasswordHash: Boolean(passwordParts()),
    hasSessionSecret: Boolean(sessionSecret()),
  }
}

export function verifyPassword(password) {
  const parts = passwordParts()
  if (!parts || typeof password !== 'string') return false
  const candidate = scryptSync(password, parts.salt, parts.hash.length)
  return candidate.length === parts.hash.length && timingSafeEqual(candidate, parts.hash)
}

export function createSessionCookie() {
  const payload = encode(JSON.stringify({
    exp: Date.now() + sessionSeconds * 1000,
    nonce: randomBytes(12).toString('base64url'),
  }))
  const token = `${payload}.${sign(payload)}`
  return [
    `${cookieName}=${encodeURIComponent(token)}`,
    'Path=/',
    'HttpOnly',
    'SameSite=Strict',
    `Max-Age=${sessionSeconds}`,
    ...(secureCookie() ? ['Secure'] : []),
  ].join('; ')
}

export function clearSessionCookie() {
  return [
    `${cookieName}=`,
    'Path=/',
    'HttpOnly',
    'SameSite=Strict',
    'Max-Age=0',
    ...(secureCookie() ? ['Secure'] : []),
  ].join('; ')
}

export function isAuthenticated(request) {
  if (!getAuthStatus().configured) return false
  const token = cookieValue(request, cookieName)
  const separator = token.lastIndexOf('.')
  if (separator < 1) return false
  const payload = token.slice(0, separator)
  const signature = token.slice(separator + 1)
  const expected = sign(payload)
  const signatureBuffer = Buffer.from(signature)
  const expectedBuffer = Buffer.from(expected)
  if (signatureBuffer.length !== expectedBuffer.length || !timingSafeEqual(signatureBuffer, expectedBuffer)) return false

  try {
    const session = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'))
    return Number(session.exp) > Date.now()
  } catch {
    return false
  }
}
