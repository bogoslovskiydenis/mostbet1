import { readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'

type LocaleEntry = { code: string; name: string }
type LocalesData = {
  locales: LocaleEntry[]
  messages: Record<string, Record<string, string>>
}

const filePath = join(process.cwd(), 'server/data/locales.json')

async function read(): Promise<LocalesData> {
  const raw = await readFile(filePath, 'utf-8')
  return JSON.parse(raw) as LocalesData
}

async function write(data: LocalesData): Promise<void> {
  await writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8')
}

export default defineEventHandler(async (event) => {
  const method = event.method.toUpperCase()

  // GET — весь объект (локали + все сообщения)
  if (method === 'GET') {
    return read()
  }

  // POST — добавить новый язык
  if (method === 'POST') {
    const body = await readBody<{ code: string; name: string }>(event)
    if (!body?.code || !body?.name) {
      throw createError({ statusCode: 400, statusMessage: 'code and name are required' })
    }
    const data = await read()
    if (data.locales.find(l => l.code === body.code)) {
      throw createError({ statusCode: 409, statusMessage: 'Locale already exists' })
    }
    data.locales.push({ code: body.code, name: body.name })
    data.messages[body.code] = {}
    await write(data)
    return { ok: true }
  }

  // PUT — обновить сообщения для локали
  if (method === 'PUT') {
    const body = await readBody<{ code: string; messages: Record<string, string> }>(event)
    if (!body?.code) {
      throw createError({ statusCode: 400, statusMessage: 'code is required' })
    }
    const data = await read()
    data.messages[body.code] = body.messages || {}
    await write(data)
    return { ok: true }
  }

  // DELETE — удалить язык
  if (method === 'DELETE') {
    const query = getQuery(event)
    const code = String(query.code || '')
    if (!code) {
      throw createError({ statusCode: 400, statusMessage: 'code is required' })
    }
    const data = await read()
    data.locales = data.locales.filter(l => l.code !== code)
    delete data.messages[code]
    await write(data)
    return { ok: true }
  }

  throw createError({ statusCode: 405, statusMessage: 'Method not allowed' })
})
