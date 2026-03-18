import { defineEventHandler, setResponseHeader, setResponseStatus } from 'h3'

export default defineEventHandler((event) => {
  // BasicAuth не поддерживает "logout" сервером как сессия.
  // Здесь важно не триггерить browser prompt (WWW-Authenticate).
  setResponseStatus(event, 204)
  setResponseHeader(event, 'Cache-Control', 'no-store')
  setResponseHeader(event, 'Clear-Site-Data', '"cache", "cookies", "storage"')
  return ''
})

