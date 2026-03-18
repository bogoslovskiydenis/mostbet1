<script setup lang="ts">
import { Icon } from '@iconify/vue'
import promoBannerUrl from '~/assets/bonus/promocode.png?url'
import howtoMostbetUrl from '~/assets/bonus/mostbet.webp?url'
import howtoRegisterUrl from '~/assets/bonus/register_mostbet.webp?url'
import howtoPromoCodeUrl from '~/assets/bonus/promocode_huge.webp?url'
import howtoGetBonusUrl from '~/assets/bonus/get_bonus.webp?url'

const route = useRoute()
const { locale } = useAppLocale()

const slug = computed(() => String(route.params.slug || ''))
const isSystemSlug = computed(() => slug.value.startsWith('_'))

type LocaleContent = {
  title: string
  badge?: string
  description?: string
  ctaText?: string
  content: string
}
type PageItem = {
  slug: string
  bannerUrl?: string
  locales?: Record<string, LocaleContent>
}

const { data: page, error, pending } = useFetch<PageItem | null>(
  () => (isSystemSlug.value ? null : '/api/admin/pages'),
  { query: { slug } },
)

const { data: allPages } = useFetch<PageItem[]>(
  () => (slug.value === 'promo-code' ? '/api/admin/pages' : null),
)

const localePage = computed<LocaleContent | null>(() => {
  if (!page.value?.locales) return null
  return page.value.locales[locale.value]
    || page.value.locales['en']
    || Object.values(page.value.locales)[0]
    || null
})

function getLocaleData(p: PageItem) {
  if (!p.locales) return null
  return p.locales[locale.value] || p.locales['en'] || Object.values(p.locales)[0] || null
}

const bannerSrc = computed(() => {
  const url = page.value?.bannerUrl || ''
  if (url === '__asset:promocode__') return promoBannerUrl
  return url
})

const isPromoCodePage = computed(() => slug.value === 'promo-code')

const newsPages = computed(() =>
  (allPages.value || []).filter(p => p.slug.startsWith('promo-news-')),
)

function resolveBannerUrl(url?: string) {
  if (!url) return ''
  if (url === '__asset:promocode__') return promoBannerUrl
  return url
}

type TocItem = { id: string; label: string }

function slugifyHeading(text: string) {
  return text
    .toLowerCase()
    .replace(/&amp;/g, 'and')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

const promoHtml = computed(() => {
  const html = localePage.value?.content || ''
  if (!isPromoCodePage.value) return html
  let i = 0
  const withIds = html.replace(/<h2>([\s\S]*?)<\/h2>/gi, (_, raw) => {
    const label = String(raw).replace(/<[^>]+>/g, '').trim()
    const base = slugifyHeading(label) || `section-${i + 1}`
    const id = `${base}-${++i}`
    return `<h2 id="${id}">${raw}</h2>`
  })
  return withIds
    .replaceAll('__asset:mostbet__', howtoMostbetUrl)
    .replaceAll('__asset:register_mostbet__', howtoRegisterUrl)
    .replaceAll('__asset:promocode_huge__', howtoPromoCodeUrl)
    .replaceAll('__asset:get_bonus__', howtoGetBonusUrl)
})

const promoToc = computed<TocItem[]>(() => {
  if (!isPromoCodePage.value) return []
  const html = promoHtml.value
  const out: TocItem[] = []
  const re = /<h2[^>]*id="([^"]+)"[^>]*>([\s\S]*?)<\/h2>/gi
  let m: RegExpExecArray | null
  while ((m = re.exec(html))) {
    const id = m[1]
    const label = String(m[2]).replace(/<[^>]+>/g, '').trim()
    if (id && label) out.push({ id, label })
  }
  return out
})
</script>

<template>
  <main class="dpage">
    <div v-if="pending" class="dpage__state">Загрузка...</div>

    <div v-else-if="isSystemSlug || error || !page || !localePage" class="dpage__state">
      Страница не найдена
    </div>

    <template v-else>
      <header class="dpage__header">
        <nav class="dpage__breadcrumbs">
          <NuxtLink to="/" class="dpage__crumb dpage__crumb--home">
            <Icon icon="mdi:home-outline" class="dpage__homeIcon" />
            <span>Home</span>
          </NuxtLink>
          <span class="dpage__crumbSep">/</span>
          <span class="dpage__crumb dpage__crumb--current">{{ localePage.title }}</span>
        </nav>

        <div v-if="localePage.badge" class="dpage__badge">{{ localePage.badge }}</div>
        <h1 class="dpage__title">{{ localePage.title }}</h1>
      </header>

      <section v-if="bannerSrc" class="dpage__hero">
        <div class="dpage__heroImage" :class="{ 'dpage__heroImage--compact': isPromoCodePage }">
          <img :src="bannerSrc" :alt="localePage.title" loading="lazy">
        </div>
      </section>

      <section v-if="isPromoCodePage && newsPages.length" class="dpage__news">
        <div class="dpage__newsList">
          <NuxtLink
            v-for="item in newsPages"
            :key="item.slug"
            class="promo-card"
            :to="`/promo-code/${item.slug}`"
          >
            <div class="promo-card__image">
              <img
                v-if="resolveBannerUrl(item.bannerUrl)"
                :src="resolveBannerUrl(item.bannerUrl)"
                :alt="getLocaleData(item)?.title || item.slug"
                loading="lazy"
              >
            </div>
            <div class="promo-card__body">
              <template v-if="getLocaleData(item)">
                <div v-if="getLocaleData(item)!.badge" class="promo-card__badge">{{ getLocaleData(item)!.badge }}</div>
                <h3 class="promo-card__title">{{ getLocaleData(item)!.title }}</h3>
                <p v-if="getLocaleData(item)!.description" class="promo-card__text">{{ getLocaleData(item)!.description }}</p>
                <span v-if="getLocaleData(item)!.ctaText" class="promo-card__cta">{{ getLocaleData(item)!.ctaText }}</span>
              </template>
            </div>
          </NuxtLink>
        </div>
      </section>

      <article v-if="!isPromoCodePage" class="dpage__body" v-html="localePage.content" />

      <section v-else class="promo">
        <div class="promo__grid">
          <article class="promo__body" v-html="promoHtml" />

          <aside v-if="promoToc.length" class="promo__aside">
            <nav class="promoNav" aria-label="Promo navigation">
              <a
                v-for="item in promoToc"
                :key="item.id"
                class="promoNav__item"
                :href="`#${item.id}`"
              >
                {{ item.label }}
              </a>
            </nav>
          </aside>
        </div>
      </section>
    </template>
  </main>
</template>

<style scoped>
.dpage {
  max-width: 960px;
  margin: 0 auto;
  padding: 32px 16px 0;
}

.dpage__state {
  font-size: 14px;
  color: #666;
}

.dpage__header {
  margin-bottom: 20px;
}

.dpage__breadcrumbs {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: var(--muted);
  margin-bottom: 12px;
}

.dpage__crumb {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.dpage__crumb--home {
  color: #fff;
  padding: 4px 10px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.08);
  text-decoration: none;
}

.dpage__homeIcon {
  font-size: 14px;
}

.dpage__crumbSep {
  color: var(--muted);
}

.dpage__crumb--current {
  font-weight: 600;
}

.dpage__badge {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #ff6a00;
  margin-bottom: 6px;
}

.dpage__title {
  margin: 0 0 8px;
  font-size: 26px;
  font-weight: 700;
}

.dpage__hero {
  margin-bottom: 24px;
}

.dpage__heroImage {
  width: 100%;
  border-radius: 16px;
  overflow: hidden;
}

.dpage__heroImage img {
  display: block;
  width: 100%;
  height: auto;
}

.dpage__heroImage--compact {
  max-height: 420px;
}

.dpage__heroImage--compact img {
  object-fit: cover;
  object-position: center;
}

.dpage__news {
  margin-bottom: 32px;
}

.dpage__newsList {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 20px;
}

.promo-card {
  display: flex;
  flex-direction: column;
  border-radius: 14px;
  overflow: hidden;
  background: #fff;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.16);
  text-decoration: none;
  color: inherit;
}

.promo-card__image {
  height: 140px;
  background: #f0f4ff;
  overflow: hidden;
}

.promo-card__image img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.promo-card__body {
  padding: 14px 14px 16px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.promo-card__badge {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #ff6a00;
}

.promo-card__title {
  margin: 0;
  font-size: 15px;
  font-weight: 700;
  color: #000;
}

.promo-card__text {
  margin: 0;
  font-size: 13px;
  color: #333;
}

.promo-card__cta {
  margin-top: 8px;
  align-self: flex-start;
  padding: 6px 14px;
  border-radius: 999px;
  background: #ff6a00;
  color: #fff;
  font-size: 12px;
  font-weight: 700;
}

.dpage__body {
  font-size: 14px;
  line-height: 1.7;
  color: var(--muted);
}

.dpage__body :deep(h2) {
  margin: 24px 0 10px;
  font-size: 20px;
  font-weight: 700;
  color: #fff;
}

.dpage__body :deep(h3) {
  margin: 18px 0 8px;
  font-size: 16px;
  font-weight: 700;
  color: #fff;
}

.dpage__body :deep(p) { margin: 0 0 12px; }

.dpage__body :deep(ul),
.dpage__body :deep(ol) {
  margin: 0 0 14px 18px;
  padding: 0;
}

.dpage__body :deep(li + li) { margin-top: 4px; }

.dpage__body :deep(table) {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
  margin: 16px 0;
}

.dpage__body :deep(th) {
  background: #003366;
  color: #fff;
  padding: 10px 12px;
  text-align: left;
}

.dpage__body :deep(td) {
  padding: 10px 12px;
  text-align: left;
  border-bottom: 1px solid rgba(255,255,255,0.08);
}

.dpage__body :deep(a) {
  color: #ff6a00;
  text-decoration: underline;
}

@media (max-width: 599px) {
  .dpage { padding-top: 20px; }
  .dpage__title { font-size: 22px; }
}

.promo {
  margin-top: 10px;
}

.promo__grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 280px;
  gap: 24px;
  align-items: start;
}

.promo__body {
  font-size: 14px;
  line-height: 1.7;
  color: var(--muted);
}

.promo__body :deep(h2) {
  margin: 24px 0 10px;
  font-size: 20px;
  font-weight: 700;
  color: #fff;
  scroll-margin-top: 90px;
}

.promo__body :deep(h3) {
  margin: 18px 0 8px;
  font-size: 16px;
  font-weight: 700;
  color: #fff;
}

.promo__body :deep(p) { margin: 0 0 12px; }

.promo__body :deep(ul),
.promo__body :deep(ol) {
  margin: 0 0 14px 18px;
  padding: 0;
}

.promo__body :deep(li + li) { margin-top: 4px; }

.promo__body :deep(table) {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
  margin: 16px 0;
}

.promo__body :deep(th) {
  background: #003366;
  color: #fff;
  padding: 10px 12px;
  text-align: left;
}

.promo__body :deep(td) {
  padding: 10px 12px;
  text-align: left;
  border-bottom: 1px solid rgba(255,255,255,0.08);
}

.promo__body :deep(a) {
  color: #ff6a00;
  text-decoration: underline;
}

.promo__body :deep(.promoImage) {
  display: block;
  width: 100%;
  height: auto;
  border-radius: 14px;
  margin: 12px 0 18px;
}

.promoNav {
  position: sticky;
  top: 92px;
  border-radius: 12px;
  border: 1px solid rgba(255,255,255,0.08);
  background: rgba(255, 255, 255, 0.04);
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.promoNav__item {
  padding: 8px 10px;
  border-radius: 10px;
  color: var(--muted);
  font-weight: 600;
  font-size: 13px;
  text-decoration: none;
}

.promoNav__item:hover {
  color: #fff;
  background: rgba(255, 255, 255, 0.06);
}

@media (max-width: 899px) {
  .promo__grid { grid-template-columns: minmax(0, 1fr); }
  .promo__aside { display: none; }
}
</style>
