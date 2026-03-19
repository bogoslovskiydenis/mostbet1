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
  locales?: Record<string, LocaleContent>
}

const route = useRoute()
const editSlug = computed(() => {
  const value = route.query.slug
  return typeof value === 'string' ? value : ''
})
const isEditing = computed(() => Boolean(editSlug.value))

const { data: pages, refresh } = useFetch<PageItem[]>('/api/admin/pages')
const { data: localesData } = useFetch<{ locales: LocaleEntry[] }>('/api/admin/locales')

const availableLocales = computed(() => localesData.value?.locales || [{ code: 'en', name: 'English' }])
const activeLocale = ref('en')
const saving = ref(false)
const errorMessage = ref('')
const addBanner = ref(false)

const form = reactive({
  slug: '',
  bannerUrl: '',
  title: '',
  badge: '',
  description: '',
  ctaText: '',
  content: '',
})

const editingPage = computed(() =>
  (pages.value || []).find(p => p.slug === editSlug.value),
)

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

function initCreateMode() {
  form.slug = ''
  form.bannerUrl = ''
  resetLocaleFields()
  addBanner.value = false
  errorMessage.value = ''
}

function initEditMode() {
  const page = editingPage.value
  if (!page) return
  form.slug = page.slug
  form.bannerUrl = page.bannerUrl || ''
  addBanner.value = Boolean(page.bannerUrl)
  loadLocaleFields(page, activeLocale.value)
  errorMessage.value = ''
}

watch([isEditing, editingPage], () => {
  if (isEditing.value) initEditMode()
  else initCreateMode()
}, { immediate: true })

watch(activeLocale, () => {
  if (!isEditing.value) return
  const page = editingPage.value
  if (page) loadLocaleFields(page, activeLocale.value)
})

async function submitForm() {
  try {
    saving.value = true
    errorMessage.value = ''

    const nextSlug = form.slug.trim()
    if (!nextSlug) {
      errorMessage.value = 'Slug обязателен'
      return
    }
    if (nextSlug.startsWith('_')) {
      errorMessage.value = 'Slug системных страниц запрещен'
      return
    }

    await $fetch('/api/admin/pages', {
      method: isEditing.value ? 'PUT' : 'POST',
      body: {
        slug: nextSlug,
        bannerUrl: addBanner.value ? form.bannerUrl.trim() : '',
        locale: activeLocale.value,
        title: form.title.trim(),
        badge: form.badge.trim(),
        description: form.description.trim(),
        ctaText: form.ctaText.trim(),
        content: form.content,
      },
    })

    await refresh()
    await navigateTo('/admin/pages')
  } catch (error: any) {
    errorMessage.value = error?.data?.statusMessage || error?.message || 'Ошибка сохранения'
  } finally {
    saving.value = false
  }
}

function backToList() {
  navigateTo('/admin/pages')
}
</script>

<template>
  <div class="ap">
    <div class="ap__head">
      <h2 class="ap__formTitle">
        {{ isEditing ? 'Редактирование страницы' : 'Новая страница' }}
      </h2>
      <button type="button" class="ap__btn ap__btn--ghost" @click="backToList">
        К списку
      </button>
    </div>

    <form class="ap__form" @submit.prevent="submitForm">
      <label class="ap__field">
        <span class="ap__label">Slug</span>
        <input
          v-model="form.slug"
          type="text"
          class="ap__input"
          :disabled="isEditing"
          required
        >
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
        <textarea v-model="form.content" class="ap__textarea" rows="12" placeholder="Текст страницы (поддерживается HTML)" />
      </label>

      <p v-if="errorMessage" class="ap__error">{{ errorMessage }}</p>

      <button
        type="submit"
        class="ap__btn ap__btn--primary ap__btn--full"
        :disabled="saving || !form.slug.trim()"
      >
        {{ saving ? 'Сохранение...' : `Сохранить (${activeLocale.toUpperCase()})` }}
      </button>
    </form>
  </div>
</template>

<style scoped>
.ap {
  max-width: 920px;
}

.ap__head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.ap__formTitle {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
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
.ap__btn--ghost { background: #fff; border: 1px solid #d0d0d0; color: #000; }
.ap__btn--full { width: 100%; padding: 10px; font-size: 14px; }

.ap__error {
  margin: 0;
  font-size: 13px;
  color: #dc2626;
}
</style>
