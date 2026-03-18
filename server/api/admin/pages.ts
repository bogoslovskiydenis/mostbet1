import { defineEventHandler, readBody, getQuery, createError } from 'h3'
import { promises as fs } from 'node:fs'
import { join } from 'node:path'

type PageItem = {
  slug: string
  title: string
  content: string
  bannerUrl?: string
  badge?: string
  description?: string
  ctaText?: string
}

const filePath = join(process.cwd(), 'app/utils/pages.json')

async function readPages(): Promise<PageItem[]> {
  const raw = await fs.readFile(filePath, 'utf-8')
  return JSON.parse(raw) as PageItem[]
}

async function writePages(pages: PageItem[]): Promise<void> {
  await fs.writeFile(filePath, JSON.stringify(pages, null, 2), 'utf-8')
}

export default defineEventHandler(async (event) => {
  const method = event.method.toUpperCase()

  if (method === 'GET') {
    const query = getQuery(event)
    const slug = typeof query.slug === 'string' ? query.slug : undefined
    const pages = await readPages()

    if (!slug) {
      return pages
    }

    const page = pages.find((p) => p.slug === slug)
    if (!page) {
      throw createError({ statusCode: 404, statusMessage: 'Page not found' })
    }

    return page
  }

  if (method === 'POST' || method === 'PUT') {
    const body = await readBody<PageItem>(event)

    if (!body?.slug || !body?.title) {
      throw createError({ statusCode: 400, statusMessage: 'slug and title are required' })
    }

    const pages = await readPages()
    const index = pages.findIndex((p) => p.slug === body.slug)

    if (method === 'POST' && index !== -1) {
      throw createError({ statusCode: 409, statusMessage: 'Page with this slug already exists' })
    }

    const next: PageItem = {
      slug: body.slug,
      title: body.title,
      content: body.content ?? '',
      ...(body.bannerUrl !== undefined && { bannerUrl: body.bannerUrl }),
      ...(body.badge !== undefined && { badge: body.badge }),
      ...(body.description !== undefined && { description: body.description }),
      ...(body.ctaText !== undefined && { ctaText: body.ctaText }),
    }

    if (index === -1) {
      pages.push(next)
    } else {
      pages[index] = next
    }

    await writePages(pages)
    return next
  }

  if (method === 'DELETE') {
    const body = await readBody<{ slug?: string }>(event)
    if (!body?.slug) {
      throw createError({ statusCode: 400, statusMessage: 'slug is required' })
    }

    const pages = await readPages()
    const next = pages.filter((p) => p.slug !== body.slug)
    await writePages(next)

    return { ok: true }
  }

  throw createError({ statusCode: 405, statusMessage: 'Method not allowed' })
})

