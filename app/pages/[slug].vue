<script setup lang="ts">
import { Icon } from '@iconify/vue'

const route = useRoute()

const slug = computed(() => String(route.params.slug || ''))
const isSystemSlug = computed(() => slug.value.startsWith('_'))

type PageItem = {
  slug: string
  title: string
  content: string
  bannerUrl?: string
  badge?: string
  description?: string
  ctaText?: string
}

const { data: page, error, pending } = useFetch<PageItem | null>(() => (isSystemSlug.value ? null : '/api/admin/pages'), {
  query: { slug },
})
</script>

<template>
  <main class="dpage">
    <div v-if="pending" class="dpage__state">Загрузка...</div>

    <div v-else-if="isSystemSlug || error || !page" class="dpage__state">
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
          <span class="dpage__crumb dpage__crumb--current">{{ page.title }}</span>
        </nav>

        <div v-if="page.badge" class="dpage__badge">{{ page.badge }}</div>
        <h1 class="dpage__title">{{ page.title }}</h1>
      </header>

      <section v-if="page.bannerUrl" class="dpage__hero">
        <div class="dpage__heroImage">
          <img :src="page.bannerUrl" :alt="page.title" loading="lazy">
        </div>
      </section>

      <article class="dpage__body" v-html="page.content" />
    </template>
  </main>
</template>

<style scoped>
.dpage {
  max-width: 960px;
  margin: 0 auto;
  padding: 32px 16px 80px;
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

.dpage__body :deep(p) {
  margin: 0 0 12px;
}

.dpage__body :deep(ul),
.dpage__body :deep(ol) {
  margin: 0 0 14px 18px;
  padding: 0;
}

.dpage__body :deep(li + li) {
  margin-top: 4px;
}

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
  .dpage {
    padding-top: 20px;
  }
  .dpage__title {
    font-size: 22px;
  }
}
</style>
