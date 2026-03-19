<script setup lang="ts">
definePageMeta({ layout: 'admin' })

type LocaleContent = {
  title: string
  content: string
}
type PageItem = {
  slug: string
  newsPlacement?: 'home' | 'promocode' | 'review'
  locales?: Record<string, LocaleContent>
}

const { data: pages, refresh, pending } = useFetch<PageItem[]>('/api/admin/pages')

const newsPages = computed(() =>
  (pages.value || []).filter(p =>
    !p.slug.startsWith('_')
    && p.slug !== 'promo-code'
    && p.slug !== 'review',
  ),
)

function getPageTitle(page: PageItem) {
  return page.locales?.['en']?.title
    || page.locales?.[Object.keys(page.locales || {})[0]]?.title
    || page.slug
}

function getPlacementLabel(page: PageItem) {
  const placement = page.newsPlacement || (page.slug.startsWith('promo-news-') ? 'promocode' : 'home')
  if (placement === 'promocode') return 'Промокод'
  if (placement === 'review') return 'Review'
  return 'Главная'
}

function goCreate() {
  navigateTo('/admin/news-editor')
}

function goEdit(slug: string) {
  navigateTo(`/admin/news-editor?slug=${encodeURIComponent(slug)}`)
}

async function remove(slug: string) {
  if (!confirm(`Удалить страницу "${slug}"?`)) return
  try {
    await $fetch('/api/admin/pages', { method: 'DELETE', body: { slug } })
    await refresh()
  } catch {}
}
</script>

<template>
  <div class="ap">
    <div class="ap__listHead">
      <h2 class="ap__listTitle">News</h2>
      <button type="button" class="ap__btn ap__btn--primary" @click="goCreate">
        Создать новость
      </button>
    </div>

    <div v-if="pending" class="ap__hint">Загрузка...</div>

    <table v-if="newsPages.length" class="ap__table">
      <thead>
        <tr>
          <th>Slug</th>
          <th>Заголовок (EN)</th>
          <th>Опубликовано</th>
          <th />
        </tr>
      </thead>
      <tbody>
        <tr v-for="page in newsPages" :key="page.slug">
          <td><code>{{ page.slug }}</code></td>
          <td>{{ getPageTitle(page) }}</td>
          <td><span class="ap__placement">{{ getPlacementLabel(page) }}</span></td>
          <td class="ap__tableActions">
            <button type="button" class="ap__btn ap__btn--ghost" @click="goEdit(page.slug)">
              Редактировать
            </button>
            <button type="button" class="ap__btn ap__btn--danger" @click="remove(page.slug)">
              Удалить
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <p v-else-if="!pending" class="ap__hint">Новостей пока нет.</p>
  </div>
</template>

<style scoped>
.ap__listHead {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
  gap: 12px;
}

.ap__listTitle {
  margin: 0;
  font-size: 15px;
  font-weight: 700;
}

.ap__table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

.ap__table th,
.ap__table td {
  padding: 8px 10px;
  border-bottom: 1px solid #e5e5e5;
  text-align: left;
}

.ap__tableActions {
  display: flex;
  gap: 6px;
  justify-content: flex-end;
}

.ap__placement {
  display: inline-flex;
  align-items: center;
  padding: 2px 8px;
  border-radius: 999px;
  background: rgba(31, 111, 235, 0.12);
  color: #1f6feb;
  font-size: 12px;
  font-weight: 600;
}

.ap__btn {
  border: none;
  border-radius: 6px;
  padding: 6px 12px;
  font-size: 13px;
  cursor: pointer;
  background: #f3f4f6;
  white-space: nowrap;
}

.ap__btn--primary { background: #1f6feb; color: #fff; }
.ap__btn--ghost { background: #fff; border: 1px solid #d0d0d0;  color: black; }
.ap__btn--danger { background: #dc2626; color: #fff; }

.ap__hint {
  margin: 8px 0 0;
  font-size: 13px;
  color: #666666;
}
</style>

