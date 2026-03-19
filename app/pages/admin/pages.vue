<script setup lang="ts">
definePageMeta({ layout: 'admin' })

type LocaleContent = {
  title: string
  content: string
}
type PageItem = {
  slug: string
  locales?: Record<string, LocaleContent>
}

const { data: pages, refresh, pending } = useFetch<PageItem[]>('/api/admin/pages')

const promoPages = computed(() =>
  (pages.value || []).filter(p => p.slug === 'promo-code'),
)

function goCreate() {
  navigateTo('/admin/pages-editor')
}

function goEdit(slug: string) {
  navigateTo(`/admin/pages-editor?slug=${encodeURIComponent(slug)}`)
}

async function remove(slug: string) {
  if (!confirm(`Удалить страницу "${slug}"?`)) return
  try {
    await $fetch('/api/admin/pages', { method: 'DELETE', body: { slug } })
    await refresh()
  } catch {}
}

function getPageTitle(page: PageItem) {
  return page.locales?.['en']?.title
    || page.locales?.[Object.keys(page.locales || {})[0]]?.title
    || page.slug
}
</script>

<template>
  <div class="ap">
    <div class="ap__listHead">
      <h2 class="ap__listTitle">Pages</h2>
      <button
        type="button"
        class="ap__btn ap__btn--primary"
        @click="goCreate"
      >
        Создать страницу
      </button>
    </div>

    <div v-if="pending" class="ap__hint">Загрузка...</div>

    <table v-if="promoPages.length" class="ap__table">
      <thead>
        <tr>
          <th>Slug</th>
          <th>Заголовок (EN)</th>
          <th />
        </tr>
      </thead>
      <tbody>
        <tr v-for="page in promoPages" :key="page.slug">
          <td><code>{{ page.slug }}</code></td>
          <td>{{ getPageTitle(page) }}</td>
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

    <p v-else-if="!pending" class="ap__hint">Страниц пока нет.</p>
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
.ap__btn--ghost { background: #fff; border: 1px solid #d0d0d0; color: #000; }
.ap__btn--danger { background: #dc2626; color: #fff; }

.ap__hint {
  margin: 8px 0 0;
  font-size: 13px;
  color: #666666;
}
</style>

