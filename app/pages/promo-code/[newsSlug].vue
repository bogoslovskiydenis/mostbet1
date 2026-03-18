<script setup lang="ts">
import { Icon } from '@iconify/vue'

const route = useRoute()
const { locale } = useAppLocale()

const newsSlug = computed(() => String(route.params.newsSlug || ''))

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

const { data: page, error, pending } = useFetch<PageItem | null>('/api/admin/pages', {
  query: { slug: newsSlug },
})

const localePage = computed<LocaleContent | null>(() => {
  if (!page.value?.locales) return null
  return page.value.locales[locale.value]
    || page.value.locales['en']
    || Object.values(page.value.locales)[0]
    || null
})

const bannerSrc = computed(() => page.value?.bannerUrl || '')
</script>

<template>
  <main class="npage">
    <div v-if="pending" class="npage__state">Загрузка...</div>

    <div v-else-if="error || !page || !localePage" class="npage__state">
      Страница не найдена
    </div>

    <template v-else>
      <header class="npage__header">
        <nav class="npage__breadcrumbs">
          <NuxtLink to="/" class="npage__crumb npage__crumb--home">
            <Icon icon="mdi:home-outline" class="npage__homeIcon" />
            <span>Home</span>
          </NuxtLink>
          <span class="npage__crumbSep">/</span>
          <NuxtLink to="/promo-code" class="npage__crumb npage__crumb--link">
            Promo Code
          </NuxtLink>
          <span class="npage__crumbSep">/</span>
          <span class="npage__crumb npage__crumb--current">{{ localePage.title }}</span>
        </nav>

        <div v-if="localePage.badge" class="npage__badge">{{ localePage.badge }}</div>
        <h1 class="npage__title">{{ localePage.title }}</h1>
      </header>

      <section v-if="bannerSrc" class="npage__hero">
        <div class="npage__heroImage">
          <img :src="bannerSrc" :alt="localePage.title" loading="lazy">
        </div>
      </section>

      <article class="npage__body" v-html="localePage.content" />
    </template>
  </main>
</template>

<style scoped>
.npage {
  max-width: 960px;
  margin: 0 auto;
  padding: 32px 16px 80px;
}

.npage__state {
  font-size: 14px;
  color: var(--muted);
}

.npage__header {
  margin-bottom: 20px;
}

.npage__breadcrumbs {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: var(--muted);
  margin-bottom: 12px;
}

.npage__crumb {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.npage__crumb--home {
  color: #fff;
  padding: 4px 10px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.08);
  text-decoration: none;
}

.npage__crumb--link {
  color: var(--muted);
  text-decoration: none;
}

.npage__crumb--link:hover {
  color: #fff;
}

.npage__crumb--current {
  font-weight: 600;
}

.npage__homeIcon {
  font-size: 14px;
}

.npage__crumbSep {
  color: var(--muted);
}

.npage__badge {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #ff6a00;
  margin-bottom: 6px;
}

.npage__title {
  margin: 0 0 8px;
  font-size: 26px;
  font-weight: 700;
}

.npage__hero {
  margin-bottom: 24px;
}

.npage__heroImage {
  width: 100%;
  border-radius: 16px;
  overflow: hidden;
}

.npage__heroImage img {
  display: block;
  width: 100%;
  height: auto;
}

.npage__body {
  font-size: 14px;
  line-height: 1.7;
  color: var(--muted);
}

.npage__body :deep(h2) {
  margin: 24px 0 10px;
  font-size: 20px;
  font-weight: 700;
  color: #fff;
}

.npage__body :deep(h3) {
  margin: 18px 0 8px;
  font-size: 16px;
  font-weight: 700;
  color: #fff;
}

.npage__body :deep(p) { margin: 0 0 12px; }

.npage__body :deep(ul),
.npage__body :deep(ol) {
  margin: 0 0 14px 18px;
  padding: 0;
}

.npage__body :deep(li + li) { margin-top: 4px; }

.npage__body :deep(table) {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
  margin: 16px 0;
}

.npage__body :deep(th) {
  background: #003366;
  color: #fff;
  padding: 10px 12px;
  text-align: left;
}

.npage__body :deep(td) {
  padding: 10px 12px;
  text-align: left;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.npage__body :deep(a) {
  color: #ff6a00;
  text-decoration: underline;
}

.npage__body :deep(img) {
  display: block;
  width: 100%;
  height: auto;
  border-radius: 14px;
  margin: 12px 0 18px;
}

@media (max-width: 599px) {
  .npage { padding-top: 20px; }
  .npage__title { font-size: 22px; }
}
</style>
