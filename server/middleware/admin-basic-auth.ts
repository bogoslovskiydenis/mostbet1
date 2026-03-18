import { defineEventHandler, getHeader, setResponseHeader, setResponseStatus } from 'h3'

function unauthorized(event: any) {
  setResponseStatus(event, 401)
  setResponseHeader(event, 'WWW-Authenticate', 'Basic realm="Admin"')
  setResponseHeader(event, 'Cache-Control', 'no-store')
  return 'Unauthorized'
}

export default defineEventHandler((event) => {
  const path = event.path || ''
  if (!path.startsWith('/admin') && !path.startsWith('/api/admin')) {
    return
  }

  const expectedUser = process.env.NUXT_ADMIN_USER || 'admin'
  const expectedPass = process.env.NUXT_ADMIN_PASS || 'admin'

  const auth = getHeader(event, 'authorization')
  if (!auth || !auth.startsWith('Basic ')) {
    return unauthorized(event)
  }

  let decoded = ''
  try {
    decoded = Buffer.from(auth.slice(6), 'base64').toString('utf-8')
  } catch {
    return unauthorized(event)
  }

  const idx = decoded.indexOf(':')
  if (idx === -1) {
    return unauthorized(event)
  }

  const user = decoded.slice(0, idx)
  const pass = decoded.slice(idx + 1)

  if (user !== expectedUser || pass !== expectedPass) {
    return unauthorized(event)
  }
})

