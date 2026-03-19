<script setup lang="ts">
definePageMeta({ layout: 'admin' })

type LocaleEntry = { code: string; name: string }
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
type NewsPlacement = 'home' | 'promocode' | 'review'

const { data: pages, refresh, pending } = useFetch<PageItem[]>('/api/admin/pages')
const { data: localesData } = useFetch<{ locales: LocaleEntry[] }>('/api/admin/locales')

const newsPages = computed(() =>
  (pages.value || []).filter(p =>
    !p.slug.startsWith('_')
    && p.slug !== 'promo-code'
    && p.slug !== 'review'
  ),
)

const availableLocales = computed(() => localesData.value?.locales || [{ code: 'en', name: 'English' }])

const activeLocale = ref('en')
const isEditing = ref(false)
const initialSlug = ref<string | null>(null)
const saving = ref(false)
const errorMessage = ref('')
const addBanner = ref(false)

const form = reactive({
  slug: '',
  bannerUrl: '',
  newsPlacement: 'home' as NewsPlacement,
  title: '',
  badge: '',
  description: '',
  ctaText: '',
  content: '',
})

function startCreate() {
  isEditing.value = false
  initialSlug.value = null
  form.slug = ''
  form.bannerUrl = ''
  form.newsPlacement = 'home'
  resetLocaleFields()
  addBanner.value = false
  errorMessage.value = ''
}

function resetLocaleFields() {
  form.title = ''
  form.badge = ''
  form.description = ''
  form.ctaText = ''
  form.content = ''
}

function loadLocaleFields(page: PageItem, locale: string) {
  const lc = page.locales?.[locale]
  form.title = lc?.title || ''
  form.badge = lc?.badge || ''
  form.description = lc?.description || ''
  form.ctaText = lc?.ctaText || ''
  form.content = lc?.content || ''
}

function startEdit(page: PageItem) {
  isEditing.value = true
  initialSlug.value = page.slug
  form.slug = page.slug
  form.bannerUrl = page.bannerUrl || ''
  form.newsPlacement = page.newsPlacement || (page.slug.startsWith('promo-news-') ? 'promocode' : 'home')
  addBanner.value = !!page.bannerUrl
  loadLocaleFields(page, activeLocale.value)
  errorMessage.value = ''
}

watch(activeLocale, () => {
  if (!isEditing.value) return
  const page = newsPages.value.find(p => p.slug === initialSlug.value)
  if (page) loadLocaleFields(page, activeLocale.value)
})

async function submitForm() {
  try {
    saving.value = true
    errorMessage.value = ''
    if (form.slug.trim() === 'review') {
      errorMessage.value = 'Slug "review" редактируется только в разделе Review'
      return
    }
    const method = isEditing.value ? 'PUT' : 'POST'
    await $fetch('/api/admin/pages', {
      method,
      body: {
        slug: form.slug.trim(),
        bannerUrl: addBanner.value ? form.bannerUrl.trim() : '',
        newsPlacement: form.newsPlacement,
        locale: activeLocale.value,
        title: form.title.trim(),
        badge: form.badge.trim(),
        description: form.description.trim(),
        ctaText: form.ctaText.trim(),
        content: form.content,
      },
    })
    await refresh()
    if (!isEditing.value) startCreate()
    else {
      const updated = newsPages.value.find(p => p.slug === initialSlug.value)
      if (updated) loadLocaleFields(updated, activeLocale.value)
    }
  } catch (error: any) {
    errorMessage.value = error?.data?.statusMessage || 'Ошибка сохранения'
  } finally {
    saving.value = false
  }
}

async function remove(slug: string) {
  if (!confirm(`Удалить страницу "${slug}"?`)) return
  try {
    await $fetch('/api/admin/pages', { method: 'DELETE', body: { slug } })
    await refresh()
    if (isEditing.value && initialSlug.value === slug) startCreate()
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
    <div class="ap__columns">
      <div class="ap__col ap__col--list">
        <div class="ap__listHead">
          <h2 class="ap__listTitle">News</h2>
          <button type="button" class="ap__btn ap__btn--primary" @click="startCreate">
            Создать новость
          </button>
        </div>

        <div v-if="pending" class="ap__hint">Загрузка...</div>

        <table v-if="newsPages.length" class="ap__table">
          <thead>
            <tr>
              <th>Slug</th>
              <th>Заголовок (EN)</th>
              <th />
            </tr>
          </thead>
          <tbody>
            <tr v-for="page in newsPages" :key="page.slug">
              <td><code>{{ page.slug }}</code></td>
              <td>{{ getPageTitle(page) }}</td>
              <td class="ap__tableActions">
                <button type="button" class="ap__btn ap__btn--ghost" @click="startEdit(page)">
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

      <div class="ap__col ap__col--form">
        <h2 class="ap__formTitle">
          {{ isEditing ? 'Редактирование новости' : 'Новая новость' }}
        </h2>

        <form class="ap__form" @submit.prevent="submitForm">
          <label class="ap__field">
            <span class="ap__label">Slug</span>
            <input
              v-model="form.slug"
              type="text"
              class="ap__input"
              placeholder="пример: news-1"
              :disabled="isEditing"
              required
            >
          </label>

          <label class="ap__field">
            <span class="ap__label">Куда публиковать</span>
            <select v-model="form.newsPlacement" class="ap__input">
              <option value="home">Главная</option>
              <option value="promocode">Промокод</option>
              <option value="review">Review</option>
            </select>
          </label>

          <label class="ap__checkboxRow">
            <input v-model="addBanner" type="checkbox" class="ap__checkbox">
            <span class="ap__label">Добавить баннер</span>
          </label>

          <label v-if="addBanner" class="ap__field">
            <span class="ap__label">URL баннера (общий для всех языков)</span>
            <input
              v-model="form.bannerUrl"
              type="text"
              class="ap__input"
              placeholder="https://... или /img/banner.jpg"
            >
          </label>

          <div class="ap__localeRow">
            <span class="ap__label">Язык контента</span>
            <div class="ap__localeTabs">
              <button
                v-for="l in availableLocales"
                :key="l.code"
                type="button"
                class="ap__localeTab"
                :class="{ 'ap__localeTab--active': activeLocale === l.code }"
                @click="activeLocale = l.code"
              >
                {{ l.code.toUpperCase() }}
              </button>
            </div>
          </div>

          <label class="ap__field">
            <span class="ap__label">Заголовок</span>
            <input v-model="form.title" type="text" class="ap__input" required>
          </label>

          <label class="ap__field">
            <span class="ap__label">Badge (метка над заголовком)</span>
            <input v-model="form.badge" type="text" class="ap__input" placeholder="PRAGMATIC PRIZE POOL">
          </label>

          <label class="ap__field">
            <span class="ap__label">Краткое описание (для карточки)</span>
            <input v-model="form.description" type="text" class="ap__input">
          </label>

          <label class="ap__field">
            <span class="ap__label">Текст кнопки CTA</span>
            <input v-model="form.ctaText" type="text" class="ap__input" placeholder="Играть">
          </label>

          <label class="ap__field">
            <span class="ap__label">HTML контент</span>
            <textarea v-model="form.content" class="ap__textarea" rows="10" placeholder="Текст страницы (поддерживается HTML)" />
          </label>

          <p v-if="errorMessage" class="ap__error">{{ errorMessage }}</p>

          <button type="submit" class="ap__btn ap__btn--primary ap__btn--full" :disabled="saving">
            {{ saving ? 'Сохранение...' : `Сохранить (${activeLocale.toUpperCase()})` }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.ap__columns {
  display: grid;
  grid-template-columns: minmax(0, 1.2fr) minmax(0, 1.5fr);
  gap: 24px;
  align-items: flex-start;
}

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

.ap__formTitle {
  margin: 0 0 12px;
  font-size: 18px;
  font-weight: 600;
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

.ap__form {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.ap__field {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.ap__checkboxRow {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.ap__checkbox {
  width: 16px;
  height: 16px;
  cursor: pointer;
}

.ap__label {
  font-size: 13px;
  color: #666666;
}

.ap__localeRow {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.ap__localeTabs {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.ap__localeTab {
  padding: 4px 12px;
  border: 1px solid #d0d0d0;
  border-radius: 6px;
  background: #fff;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  color: #333;
}

.ap__localeTab--active {
  background: #1f6feb;
  color: #fff;
  border-color: #1f6feb;
}

.ap__input,
.ap__textarea {
  width: 100%;
  padding: 8px 10px;
  border-radius: 6px;
  border: 1px solid #d0d0d0;
  font-size: 14px;
  font-family: inherit;
  resize: vertical;
  background: #fff;
  color: #111;
}

.ap__input:focus,
.ap__textarea:focus {
  outline: none;
  border-color: #1f6feb;
  box-shadow: 0 0 0 1px rgba(31, 111, 235, 0.15);
}

.ap__input:disabled {
  background: #f5f5f5;
  color: #888;
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
.ap__btn--ghost { background: #fff; border: 1px solid #d0d0d0; }
.ap__btn--danger { background: #dc2626; color: #fff; }
.ap__btn--full { width: 100%; padding: 10px; font-size: 14px; }

.ap__error {
  margin: 0;
  font-size: 13px;
  color: #dc2626;
}

.ap__hint {
  margin: 8px 0 0;
  font-size: 13px;
  color: #666666;
}

@media (max-width: 899px) {
  .ap__columns { grid-template-columns: minmax(0, 1fr); }
}
</style>

