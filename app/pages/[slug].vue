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
const isReviewPage = computed(() => slug.value === 'review')

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
  newsPlacement?: 'home' | 'promocode' | 'review'
  locales?: Record<string, LocaleContent>
}

const { data: page, error, pending } = useFetch<PageItem | null>(
  () => (isSystemSlug.value ? null : '/api/admin/pages'),
  { query: { slug } },
)

const { data: allPages } = useFetch<PageItem[]>(
  () => ((slug.value === 'promo-code' || isReviewPage.value) ? '/api/admin/pages' : null),
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
const reviewPage = computed(() =>
  (allPages.value || []).find(p => p.slug === 'review') || null,
)
const reviewLocalePage = computed<LocaleContent | null>(() => {
  if (!reviewPage.value?.locales) return null
  return reviewPage.value.locales[locale.value]
    || reviewPage.value.locales['en']
    || Object.values(reviewPage.value.locales)[0]
    || null
})

const newsPages = computed(() =>
  (allPages.value || []).filter(p => p.newsPlacement === 'promocode' || (!p.newsPlacement && p.slug.startsWith('promo-news-'))),
)
const reviewNewsPages = computed(() =>
  (allPages.value || []).filter(p => p.newsPlacement === 'review'),
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

const activeId = ref('')
const showCrypto = ref(false)

type ReviewItem = {
  rank: number
  name: string
  offer: string
  score: string
  scoreVotes: number
  visitLabel: string
  promo: string
  subtitle: string
  extra: string
  terms: string
  getBonusLabel?: string
  findOutLabel?: string
  offerLink?: string
  findOutLink?: string
  visitLink?: string
}

type ReviewConfig = {
  heroTitle?: string
  heroDescription?: string
  sectionTitle?: string
  articleHtml?: string
  articleTocTitle?: string
  showCryptoLabel?: string
  showCryptoDefault?: boolean
  columns?: {
    playerRating?: string
    ourScore?: string
    secure?: string
    trusted?: string
    verified?: string
  }
  cards?: ReviewItem[]
}

function parseReviewConfig(content?: string): ReviewConfig {
  if (!content?.trim()) return {}
  try {
    const parsed = JSON.parse(content)
    if (parsed && typeof parsed === 'object') return parsed as ReviewConfig
  } catch {
    // ignore invalid JSON and fallback to defaults
  }
  return {}
}

const reviewConfig = computed<Required<Omit<ReviewConfig, 'cards' | 'columns'>> & {
  columns: Required<NonNullable<ReviewConfig['columns']>>
  cards: ReviewItem[]
}>(() => {
  const parsed = parseReviewConfig(reviewLocalePage.value?.content)
  return {
    heroTitle: parsed.heroTitle || reviewLocalePage.value?.title || 'Review',
    heroDescription: parsed.heroDescription || reviewLocalePage.value?.description || 'Detailed review of the official MostBet website.',
    sectionTitle: parsed.sectionTitle || 'Top Betting Sites',
    articleHtml: parsed.articleHtml || '',
    articleTocTitle: parsed.articleTocTitle || 'On this page',
    showCryptoLabel: parsed.showCryptoLabel || 'Show crypto',
    showCryptoDefault: Boolean(parsed.showCryptoDefault),
    columns: {
      playerRating: parsed.columns?.playerRating || 'Player Rating',
      ourScore: parsed.columns?.ourScore || 'Our Score',
      secure: parsed.columns?.secure || 'Secure',
      trusted: parsed.columns?.trusted || 'Trusted',
      verified: parsed.columns?.verified || 'Verified',
    },
    cards: Array.isArray(parsed.cards) ? parsed.cards : [],
  }
})

function withHeadingIds(html: string, prefix: string) {
  let i = 0
  return html.replace(/<h2>([\s\S]*?)<\/h2>/gi, (_, raw) => {
    const label = String(raw).replace(/<[^>]+>/g, '').trim()
    const base = slugifyHeading(label) || `section-${i + 1}`
    const id = `${prefix}-${base}-${++i}`
    return `<h2 id="${id}">${raw}</h2>`
  })
}

const reviewArticleHtml = computed(() => withHeadingIds(reviewConfig.value.articleHtml || '', 'review-article'))
const reviewArticleToc = computed<TocItem[]>(() => {
  const html = reviewArticleHtml.value
  if (!html) return []
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
const activeReviewId = ref('')

watch(
  () => reviewConfig.value.showCryptoDefault,
  (next) => {
    showCrypto.value = next
  },
  { immediate: true },
)

let observer: IntersectionObserver | null = null
let reviewObserver: IntersectionObserver | null = null

function setupObserver() {
  observer?.disconnect()
  if (!promoToc.value.length) return

  const ids = promoToc.value.map(t => t.id)
  const headings = ids
    .map(id => document.getElementById(id))
    .filter(Boolean) as HTMLElement[]

  if (!headings.length) return

  observer = new IntersectionObserver(
    (entries) => {
      const visible = entries.filter(e => e.isIntersecting)
      if (visible.length) {
        activeId.value = visible[0].target.id
      }
    },
    { rootMargin: '-10% 0px -80% 0px', threshold: 0 },
  )

  headings.forEach(h => observer!.observe(h))
}

function setupReviewObserver() {
  reviewObserver?.disconnect()
  if (!reviewArticleToc.value.length) return

  const ids = reviewArticleToc.value.map(t => t.id)
  const headings = ids
    .map(id => document.getElementById(id))
    .filter(Boolean) as HTMLElement[]

  if (!headings.length) return

  reviewObserver = new IntersectionObserver(
    (entries) => {
      const visible = entries.filter(e => e.isIntersecting)
      if (visible.length) activeReviewId.value = visible[0].target.id
    },
    { rootMargin: '-10% 0px -80% 0px', threshold: 0 },
  )

  headings.forEach(h => reviewObserver!.observe(h))
}

function tocClick(id: string) {
  activeId.value = id
}

function reviewTocClick(id: string) {
  activeReviewId.value = id
}

watch(promoToc, async () => {
  await nextTick()
  setupObserver()
}, { immediate: false })

watch(reviewArticleToc, async () => {
  await nextTick()
  setupReviewObserver()
}, { immediate: false })

onMounted(async () => {
  await nextTick()
  setupObserver()
  setupReviewObserver()
})

onUnmounted(() => {
  observer?.disconnect()
  reviewObserver?.disconnect()
})
</script>

<template>
  <main class="dpage" :class="{ 'dpage--review': isReviewPage }">
    <template v-if="isReviewPage">
      <header class="reviewHero">
        <div class="reviewHero__inner">
          <nav class="reviewHero__breadcrumbs">
            <NuxtLink to="/" class="reviewHero__crumb reviewHero__crumb--home">
              <Icon icon="mdi:home-outline" class="reviewHero__homeIcon" />
            </NuxtLink>
            <span class="reviewHero__sep">/</span>
            <span class="reviewHero__crumb reviewHero__crumb--current">{{ reviewConfig.heroTitle }}</span>
          </nav>
          <h1 class="reviewHero__title">{{ reviewConfig.heroTitle }}</h1>
          <p class="reviewHero__text">{{ reviewConfig.heroDescription }}</p>
        </div>
      </header>

      <section class="reviewWrap">
        <div class="reviewWrap__inner">
          <h2 class="reviewWrap__title">{{ reviewConfig.sectionTitle }}</h2>

          <div class="reviewHeader">
            <span>{{ reviewConfig.columns.playerRating }}</span>
            <span>{{ reviewConfig.columns.ourScore }}</span>
            <span>{{ reviewConfig.columns.secure }}</span>
            <span>{{ reviewConfig.columns.trusted }}</span>
            <span>{{ reviewConfig.columns.verified }}</span>
          </div>

          <article v-for="item in reviewConfig.cards" :key="`${item.rank}-${item.name}`" class="reviewCard">
            <div class="reviewCard__rank">{{ item.rank }}</div>
            <div class="reviewCard__brand">
              <div class="reviewCard__logo">{{ item.name }}</div>
            </div>

            <div class="reviewCard__offer">
              <p class="reviewCard__amount">{{ item.offer }}</p>
              <p class="reviewCard__subtitle">{{ item.subtitle }}</p>
              <p class="reviewCard__promo">{{ item.extra }}: <strong>{{ item.promo }}</strong></p>
            </div>

            <div class="reviewCard__rating">
              <div class="reviewCard__stars">
                <Icon v-for="i in 5" :key="i" icon="mdi:star" />
              </div>
              <span class="reviewCard__votes">Rate It! ({{ item.scoreVotes }})</span>
            </div>

            <div class="reviewCard__score">
              <strong>{{ item.score }}</strong>
              <a :href="item.findOutLink || '#'" class="reviewCard__link">{{ item.findOutLabel || 'Find out more' }}</a>
            </div>

            <div class="reviewCard__cta">
              <a :href="item.offerLink || '#'" class="reviewCard__btn">{{ item.getBonusLabel || 'Get Bonus' }}</a>
              <a :href="item.visitLink || '#'" class="reviewCard__visit">{{ item.visitLabel }}</a>
            </div>

            <p class="reviewCard__terms">{{ item.terms }}</p>
          </article>
        </div>
      </section>
      <section v-if="reviewNewsPages.length" class="reviewNewsSection">
        <div class="reviewNewsSection__inner">
          <div class="reviewNews">
            <p class="reviewNews__title">Related Articles</p>
            <NuxtLink
              v-for="item in reviewNewsPages"
              :key="item.slug"
              class="reviewNews__card"
              :to="`/${item.slug}`"
            >
              <div v-if="resolveBannerUrl(item.bannerUrl)" class="reviewNews__img">
                <img
                  :src="resolveBannerUrl(item.bannerUrl)"
                  :alt="getLocaleData(item)?.title || item.slug"
                  loading="lazy"
                >
              </div>
              <div class="reviewNews__body">
                <div v-if="getLocaleData(item)?.badge" class="reviewNews__badge">{{ getLocaleData(item)!.badge }}</div>
                <span class="reviewNews__name">{{ getLocaleData(item)?.title || item.slug }}</span>
              </div>
            </NuxtLink>
          </div>
        </div>
      </section>
      <section v-if="reviewArticleHtml" class="reviewArticleSection">
        <div class="reviewArticleSection__inner">
          <div class="reviewArticleSection__grid">
            <article class="reviewArticleSection__body" v-html="reviewArticleHtml" />
            <aside class="reviewArticleSection__aside">
              <nav v-if="reviewArticleToc.length" class="reviewToc" aria-label="Review article navigation">
                <p class="reviewToc__title">{{ reviewConfig.articleTocTitle }}</p>
                <a
                  v-for="item in reviewArticleToc"
                  :key="item.id"
                  class="reviewToc__item"
                  :class="{ 'reviewToc__item--active': activeReviewId === item.id }"
                  :href="`#${item.id}`"
                  @click="reviewTocClick(item.id)"
                >
                  {{ item.label }}
                </a>
              </nav>
            </aside>
          </div>
        </div>
      </section>
    </template>

    <template v-else>
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

      <article v-if="!isPromoCodePage" class="dpage__body" v-html="localePage.content" />

      <section v-else class="promo">
        <div class="promo__grid">
          <article class="promo__body" v-html="promoHtml" />

          <aside class="promo__aside">
            <nav v-if="promoToc.length" class="promoNav" aria-label="Promo navigation">
              <a
                v-for="item in promoToc"
                :key="item.id"
                class="promoNav__item"
                :class="{ 'promoNav__item--active': activeId === item.id }"
                :href="`#${item.id}`"
                @click="tocClick(item.id)"
              >
                {{ item.label }}
              </a>
            </nav>

            <div v-if="newsPages.length" class="promoNews">
              <p class="promoNews__title">Related Articles</p>
              <NuxtLink
                v-for="item in newsPages"
                :key="item.slug"
                class="promoNews__card"
                :to="`/promo-code/${item.slug}`"
              >
                <div v-if="resolveBannerUrl(item.bannerUrl)" class="promoNews__img">
                  <img
                    :src="resolveBannerUrl(item.bannerUrl)"
                    :alt="getLocaleData(item)?.title || item.slug"
                    loading="lazy"
                  >
                </div>
                <div class="promoNews__body">
                  <div v-if="getLocaleData(item)?.badge" class="promoNews__badge">{{ getLocaleData(item)!.badge }}</div>
                  <span class="promoNews__name">{{ getLocaleData(item)?.title || item.slug }}</span>
                </div>
              </NuxtLink>
            </div>
          </aside>
        </div>
      </section>
    </template>
    </template>
  </main>
</template>

<style scoped>
.dpage {
  max-width: 960px;
  margin: 0 auto;
  padding: 32px 16px 0;
}

.dpage--review {
  max-width: none;
  margin: 0;
  padding: 0 0 24px;
}


.reviewHero__inner,
.reviewWrap__inner {
  max-width: 1040px;
  margin: 0 auto;
  padding: 0 16px;
}

.reviewHero__inner {
  min-height: 220px;
  padding-top: 18px;
  padding-bottom: 34px;
}

.reviewHero__breadcrumbs {
  display: flex;
  align-items: center;
  gap: 6px;
  color: rgba(255, 255, 255, 0.76);
  font-size: 12px;
}

.reviewHero__crumb--home {
  width: 20px;
  height: 20px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  color: #fff;
  background: rgba(255, 255, 255, 0.08);
}

.reviewHero__homeIcon {
  font-size: 13px;
}

.reviewHero__crumb--current {
  color: #fff;
}

.reviewHero__title {
  margin: 18px 0 8px;
  font-size: 48px;
  line-height: 1;
}

.reviewHero__text {
  margin: 0;
  font-size: 27px;
  max-width: 720px;
}

.reviewWrap {
  padding: 22px 0 12px;
}

.reviewNewsSection {
  padding: 6px 0 16px;
}

.reviewNewsSection__inner {
  max-width: 1040px;
  margin: 0 auto;
  padding: 0 16px;
}

.reviewArticleSection {
  padding: 6px 0 20px;
}

.reviewArticleSection__inner {
  max-width: 1040px;
  margin: 0 auto;
  padding: 0 16px;
}

.reviewArticleSection__grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 300px;
  gap: 20px;
  align-items: start;
}

.reviewArticleSection__body {
  background: #eceff3;
  border-radius: 12px;
  padding: 26px 24px;
  color: #1a1d23;
  font-size: 18px;
  line-height: 1.55;
}

.reviewArticleSection__body :deep(h2) {
  margin: 0 0 14px;
  color: #1a1d23;
  font-size: 30px;
  line-height: 1.15;
  scroll-margin-top: 90px;
}

.reviewArticleSection__body :deep(h2 + p) {
  margin-top: 0;
}

.reviewArticleSection__body :deep(p) {
  margin: 0 0 14px;
}

.reviewArticleSection__body :deep(a) {
  color: #1f6feb;
  text-decoration: underline;
}

.reviewArticleSection__aside {
  position: sticky;
  top: 92px;
}

.reviewToc {
  background: #eceff3;
  border-radius: 12px;
  padding: 12px 12px 10px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.reviewToc__title {
  margin: 0 0 6px;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #6b7280;
}

.reviewToc__item {
  display: block;
  padding: 8px 10px;
  border-radius: 8px;
  text-decoration: none;
  color: #2b3443;
  font-size: 14px;
  line-height: 1.3;
}

.reviewToc__item:hover {
  background: rgba(31, 111, 235, 0.08);
}

.reviewToc__item--active {
  background: rgba(31, 111, 235, 0.12);
  color: #1f6feb;
  font-weight: 600;
}

.reviewWrap__title {
  margin: 0 0 14px;
  font-size: 40px;
  line-height: 1.1;
}

.reviewHeader {
  display: grid;
  grid-template-columns: 1.3fr 1fr 90px 90px 90px;
  gap: 16px;
  justify-items: start;
  font-size: 14px;
  padding: 0 12px 6px 272px;
}

.reviewCard {
  position: relative;
  display: grid;
  grid-template-columns: 44px 170px minmax(220px, 1.1fr) 130px 110px 170px;
  gap: 14px;
  align-items: center;
  background: #fff;
  border-radius: 12px;
  border: 1px solid #e2e6ec;
  padding: 10px 12px 28px;
  margin-bottom: 14px;
}

.reviewCard__rank {
  color: #111;
  font-size: 28px;
  font-weight: 700;
  text-align: center;
}

.reviewCard__brand {
  display: flex;
  align-items: center;
  justify-content: center;
}

.reviewCard__logo {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 12px;
  background: #0f3c88;
  color: #fff;
  font-size: 15px;
  font-weight: 700;
}

.reviewCard__offer {
  color: #222;
}

.reviewCard__amount {
  margin: 0 0 2px;
  font-size: 38px;
  color: #ff6a00;
  font-weight: 700;
  line-height: 1;
}

.reviewCard__subtitle {
  margin: 0 0 4px;
  color: #13171d;
  font-size: 28px;
  line-height: 1.15;
}

.reviewCard__promo {
  margin: 0;
  font-size: 20px;
  color: #3e444d;
}

.reviewCard__rating {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.reviewCard__stars {
  color: #ffbf24;
  display: inline-flex;
  font-size: 22px;
}

.reviewCard__votes {
  font-size: 16px;
  color: #616b78;
}

.reviewCard__score strong {
  display: block;
  color: #111;
  font-size: 68px;
  line-height: 0.9;
  letter-spacing: -0.02em;
}

.reviewCard__link {
  display: inline-block;
  margin-top: 6px;
  font-size: 16px;
  color: #5f6976;
  text-decoration: underline;
}

.reviewCard__cta {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8px;
}

.reviewCard__btn {
  min-width: 150px;
  text-align: center;
  border-radius: 10px;
  padding: 12px 16px;
  font-size: 33px;
  font-weight: 700;
  color: #fff;
  background: #ff6a00;
}

.reviewCard__visit {
  font-size: 16px;
  color: #616b78;
  text-decoration: underline;
}

.reviewCard__terms {
  position: absolute;
  left: 14px;
  right: 14px;
  bottom: 8px;
  margin: 0;
  color: #8a9098;
  font-size: 11px;
  line-height: 1.3;
}

.reviewNews {
  margin-top: 20px;
  display: grid;
  gap: 10px;
}

.reviewNews__title {
  margin: 0 0 6px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #6b7280;
}

.reviewNews__card {
  display: flex;
  flex-direction: column;
  border-radius: 10px;
  overflow: hidden;
  background: #fff;
  border: 1px solid #e2e6ec;
  text-decoration: none;
  color: inherit;
}

.reviewNews__img {
  height: 140px;
  overflow: hidden;
}

.reviewNews__img img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.reviewNews__body {
  padding: 10px 12px 12px;
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.reviewNews__badge {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.07em;
  text-transform: uppercase;
  color: #ff6a00;
}

.reviewNews__name {
  font-size: 14px;
  font-weight: 600;
  color: #111;
  line-height: 1.4;
}

@media (max-width: 1199px) {
  .reviewHero__title { font-size: 42px; }
  .reviewHero__text { font-size: 24px; max-width: 620px; }
  .reviewWrap__title { font-size: 34px; }
  .reviewHeader { display: none; }
  .reviewCard {
    grid-template-columns: 34px 120px minmax(0, 1fr);
    gap: 12px;
    padding: 10px 10px 62px;
  }
  .reviewCard__rating,
  .reviewCard__score,
  .reviewCard__cta {
    grid-column: 3;
  }
  .reviewCard__score strong { font-size: 42px; }
  .reviewCard__btn { min-width: 132px; font-size: 20px; padding: 10px 14px; }
  .reviewCard__amount { font-size: 28px; }
  .reviewCard__subtitle { font-size: 18px; }
  .reviewCard__promo { font-size: 14px; }
  .reviewArticleSection__grid {
    grid-template-columns: minmax(0, 1fr);
  }
  .reviewArticleSection__aside {
    position: static;
  }
}

@media (max-width: 699px) {
  .reviewHero__inner { min-height: auto; padding-bottom: 24px; }
  .reviewHero__title { font-size: 34px; }
  .reviewHero__text { font-size: 16px; }
  .reviewWrap__title { font-size: 28px; }
  .reviewCard {
    grid-template-columns: 1fr;
    padding-bottom: 64px;
  }
  .reviewCard__rank,
  .reviewCard__brand {
    justify-content: flex-start;
    text-align: left;
  }
  .reviewCard__logo {
    width: 64px;
    height: 64px;
    font-size: 10px;
  }
  .reviewCard__rating,
  .reviewCard__score,
  .reviewCard__cta {
    grid-column: auto;
    align-items: flex-start;
  }
  .reviewCard__score strong { font-size: 34px; }
  .reviewArticleSection__body {
    padding: 18px 16px;
    font-size: 16px;
  }
  .reviewArticleSection__body :deep(h2) {
    font-size: 24px;
  }
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

.promoNews {
  margin-top: 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.promoNews__title {
  margin: 0 0 4px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--muted);
  padding: 0 10px;
}

.promoNews__card {
  display: flex;
  flex-direction: column;
  border-radius: 10px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  text-decoration: none;
  color: inherit;
  transition: background 0.18s;
}

.promoNews__card:hover {
  background: rgba(255, 255, 255, 0.08);
}

.promoNews__img {
  height: 100px;
  overflow: hidden;
}

.promoNews__img img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.promoNews__body {
  padding: 8px 10px 10px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.promoNews__badge {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.07em;
  text-transform: uppercase;
  color: #ff6a00;
}

.promoNews__name {
  font-size: 13px;
  font-weight: 600;
  color: #fff;
  line-height: 1.4;
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

.promo__aside {
  position: sticky;
  top: 92px;
  max-height: calc(100vh - 110px);
  overflow-y: auto;
  scrollbar-width: none;
  display: flex;
  flex-direction: column;
  gap: 0;
}

.promo__aside::-webkit-scrollbar {
  display: none;
}

.promoNav {
  border-radius: 12px;
  border: 1px solid rgba(255,255,255,0.08);
  background: rgba(255, 255, 255, 0.04);
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex-shrink: 0;
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

.promoNav__item--active {
  color: #fff;
  background: rgba(255, 255, 255, 0.08);
  border-left: 2px solid #ff6a00;
  padding-left: 8px;
}

@media (max-width: 899px) {
  .promo__grid {
    display: flex;
    flex-direction: column;
  }

  .promo__body {
    order: 1;
  }

  .promo__aside {
    order: 2;
    position: static;
    max-height: none;
    overflow-y: visible;
  }

  .promoNav {
    display: none;
  }

  .promoNews {
    margin-top: 0;
  }
}
</style>
