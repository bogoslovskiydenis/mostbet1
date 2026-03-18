import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

const filePath = join(process.env.NUXT_DATA_DIR || process.cwd(), 'server/data/locales.json')

export default defineEventHandler(async (event) => {
  const code = getRouterParam(event, 'code')
  const raw = await readFile(filePath, 'utf-8')
  const data = JSON.parse(raw)
  const messages = data.messages?.[code as string] || {}
  return messages as Record<string, string>
})
