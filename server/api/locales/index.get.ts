import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

const filePath = join(process.cwd(), 'server/data/locales.json')

export default defineEventHandler(async () => {
  const raw = await readFile(filePath, 'utf-8')
  const data = JSON.parse(raw)
  return data.locales as { code: string; name: string }[]
})
