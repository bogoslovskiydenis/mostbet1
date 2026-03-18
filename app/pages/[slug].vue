<script setup lang="ts">
const route = useRoute()

const slug = computed(() => String(route.params.slug || ''))
const isSystemSlug = computed(() => slug.value.startsWith('_'))

type PageItem = {
  slug: string
  title: string
  content: string
}

const { data: page, error, pending } = useFetch<PageItem | null>(() => (isSystemSlug.value ? null : '/api/admin/pages'), {
  query: { slug },
})
</script>

<template>
  <main class="dynamic-page">
    <div v-if="pending" class="dynamic-page__state">
      Загрузка...
    </div>

    <div v-else-if="isSystemSlug || error || !page" class="dynamic-page__state">
      Страница не найдена
    </div>

    <article v-else class="dynamic-page__content">
      <h1 class="dynamic-page__title">
        {{ page.title }}
      </h1>

      <div
        class="dynamic-page__body"
        v-html="page.content"
      />
    </article>
  </main>
</template>

<style scoped>
.dynamic-page {
  max-width: 860px;
  margin: 0 auto;
  padding: 32px 16px 80px;
}

.dynamic-page__state {
  font-size: 14px;
  color: #666666;
}

.dynamic-page__title {
  margin: 0 0 16px;
  font-size: 26px;
  font-weight: 700;
}

.dynamic-page__body {
  font-size: 14px;
  line-height: 1.6;
  color: #111111;
}
</style>

