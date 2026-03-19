<script setup lang="ts">
import type { Ref } from 'vue'

definePageMeta({ layout: 'admin' })

type LocalesData = {
  locales: { code: string; name: string }[]
  messages: Record<string, Record<string, string>>
}
type PageItem = {
  slug: string
  title?: string
  content?: string
}
type ExtraFaqItem = {
  question: string
  answer: string
}

const { data: localesData, refresh } = useFetch<LocalesData>('/api/admin/locales')
const { data: faqPage, refresh: refreshFaq } = useFetch<PageItem | null>('/api/admin/pages', {
  query: { slug: '_sys_home_faq' },
})
const { data: htmlPage, refresh: refreshHtml } = useFetch<PageItem | null>('/api/admin/pages', {
  query: { slug: '_sys_home_html' },
})

const activeLocale = ref('en')

const availableLocales = computed(() => localesData.value?.locales || [])

const serverMessages = computed<Record<string, string>>(
  () => localesData.value?.messages[activeLocale.value] || {},
)

const groups = [
  {
    title: 'Hero',
    fields: [
      { key: 'hero.title', label: 'Title', multiline: false },
      { key: 'hero.subtitle', label: 'Subtitle', multiline: true },
      { key: 'home.media.heroImage', label: 'Hero image URL', multiline: false },
      { key: 'home.media.heroLink', label: 'Hero image link', multiline: false },
    ],
  },
  {
    title: 'Info: Registration',
    fields: [
      { key: 'home.info.registration.title', label: 'Title', multiline: false },
      { key: 'home.info.registration.p1', label: 'P1', multiline: true },
      { key: 'home.info.registration.p2', label: 'P2', multiline: true },
      { key: 'home.info.registration.p3', label: 'P3', multiline: true },
      { key: 'home.media.registrationImage', label: 'Registration image URL', multiline: false },
      { key: 'home.media.registrationLink', label: 'Registration image link', multiline: false },
    ],
  },
  {
    title: 'Info: Promo code',
    fields: [
      { key: 'home.info.promo.title', label: 'Title', multiline: false },
      { key: 'home.info.promo.p1', label: 'P1', multiline: true },
      { key: 'home.info.promo.p2', label: 'P2', multiline: true },
      { key: 'home.info.promo.p3', label: 'P3', multiline: true },
      { key: 'home.media.promoImage', label: 'Promo image URL', multiline: false },
      { key: 'home.media.promoLink', label: 'Promo image link', multiline: false },
    ],
  },
  {
    title: 'Info: Login',
    fields: [
      { key: 'home.info.login.title', label: 'Title', multiline: false },
      { key: 'home.info.login.p1', label: 'P1', multiline: true },
      { key: 'home.info.login.p2', label: 'P2', multiline: true },
      { key: 'home.info.login.p3', label: 'P3', multiline: true },
      { key: 'home.media.loginImage', label: 'Login image URL', multiline: false },
      { key: 'home.media.loginLink', label: 'Login image link', multiline: false },
    ],
  },
]

const faqFields = [
  { key: 'home.faq.title', label: 'Title', multiline: false },
]

const form = reactive<Record<string, string>>({})
const extraFaq = ref<ExtraFaqItem[]>([])
const htmlContent = ref('')
const saving = ref(false)
const errorMessage = ref('')

const showAddLocale = ref(false)
const newCode = ref('')
const newName = ref('')
const addingLocale = ref(false)
const addLocaleError = ref('')

async function addLocale() {
  if (!newCode.value.trim() || !newName.value.trim()) return
  try {
    addingLocale.value = true
    addLocaleError.value = ''
    await $fetch('/api/admin/locales', {
      method: 'POST',
      body: { code: newCode.value.trim(), name: newName.value.trim() },
    })
    const code = newCode.value.trim()
    newCode.value = ''
    newName.value = ''
    showAddLocale.value = false
    await refresh()
    activeLocale.value = code
  }
  catch (e: any) {
    addLocaleError.value = e?.data?.statusMessage || 'Ошибка'
  }
  finally {
    addingLocale.value = false
  }
}

const standaloneFields = ['home.promos.allTitle']

function loadForm() {
  const msgs = serverMessages.value
  for (const group of groups) {
    for (const field of group.fields) {
      form[field.key] = msgs[field.key] ?? ''
    }
  }
  for (const field of faqFields) {
    form[field.key] = msgs[field.key] ?? ''
  }
  for (const key of standaloneFields) {
    form[key] = msgs[key] ?? ''
  }
  errorMessage.value = ''
}

watch(serverMessages, loadForm, { immediate: true })

function loadExtraFaq() {
  const raw = faqPage.value?.content || ''
  let stored: ExtraFaqItem[] = []
  if (raw) {
    try {
      const parsed = JSON.parse(raw) as Record<string, ExtraFaqItem[]>
      const list = parsed[activeLocale.value] || parsed.en || []
      stored = Array.isArray(list)
        ? list.map(item => ({ question: item?.question || '', answer: item?.answer || '' }))
        : []
    } catch {
      stored = []
    }
  }
  if (stored.length) {
    extraFaq.value = stored
    return
  }
  const msgs = serverMessages.value
  const migrated: ExtraFaqItem[] = []
  for (let i = 1; i <= 4; i++) {
    const q = msgs[`home.faq.q${i}.question`]
    const a = msgs[`home.faq.q${i}.answer`]
    if (q || a) migrated.push({ question: q || '', answer: a || '' })
  }
  extraFaq.value = migrated
}

watch([activeLocale, () => faqPage.value?.content, serverMessages], loadExtraFaq, { immediate: true })

function loadHtmlContent() {
  const raw = htmlPage.value?.content || ''
  if (!raw) { htmlContent.value = ''; return }
  try {
    const parsed = JSON.parse(raw) as Record<string, string>
    htmlContent.value = parsed[activeLocale.value] ?? parsed.en ?? ''
  } catch {
    htmlContent.value = ''
  }
}

watch([activeLocale, () => htmlPage.value?.content], loadHtmlContent, { immediate: true })

function addExtraFaq() {
  extraFaq.value.push({ question: '', answer: '' })
}

function removeExtraFaq(index: number) {
  extraFaq.value.splice(index, 1)
}

async function save() {
  try {
    saving.value = true
    errorMessage.value = ''

    const updated: Record<string, string> = {}
    for (const group of groups) {
      for (const field of group.fields) {
        updated[field.key] = form[field.key] ?? ''
      }
    }
    for (const field of faqFields) {
      updated[field.key] = form[field.key] ?? ''
    }
    for (const key of standaloneFields) {
      updated[key] = form[key] ?? ''
    }

    await $fetch('/api/admin/locales', {
      method: 'PUT',
      body: { code: activeLocale.value, messages: updated },
    })

    let nextFaqByLocale: Record<string, ExtraFaqItem[]> = {}
    try {
      nextFaqByLocale = JSON.parse(faqPage.value?.content || '{}') as Record<string, ExtraFaqItem[]>
    } catch {
      nextFaqByLocale = {}
    }
    nextFaqByLocale[activeLocale.value] = extraFaq.value
      .map(item => ({
        question: item.question.trim(),
        answer: item.answer.trim(),
      }))
      .filter(item => item.question && item.answer)

    await $fetch('/api/admin/pages', {
      method: 'PUT',
      body: {
        slug: '_sys_home_faq',
        title: 'Home FAQ',
        content: JSON.stringify(nextFaqByLocale, null, 2),
      },
    })

    let nextHtmlByLocale: Record<string, string> = {}
    try {
      nextHtmlByLocale = JSON.parse(htmlPage.value?.content || '{}') as Record<string, string>
    } catch {
      nextHtmlByLocale = {}
    }
    nextHtmlByLocale[activeLocale.value] = htmlContent.value

    await $fetch('/api/admin/pages', {
      method: 'PUT',
      body: {
        slug: '_sys_home_html',
        title: 'Home HTML Content',
        content: JSON.stringify(nextHtmlByLocale, null, 2),
      },
    })

    await refresh()
    await refreshFaq()
    await refreshHtml()
  }
  catch (error: any) {
    errorMessage.value = error?.data?.statusMessage || 'Ошибка сохранения'
  }
  finally {
    saving.value = false
  }
}
</script>

<template>
  <div>
    <h1 class="admin-page__title">
      Главная
    </h1>

    <form class="admin-page__form" @submit.prevent="save">
      <div class="admin-page__field">
        <span class="admin-page__label">Локаль</span>
        <div class="admin-page__localeRow">
          <select v-model="activeLocale" class="admin-page__input">
            <option v-for="l in availableLocales" :key="l.code" :value="l.code">
              {{ l.name }}
            </option>
          </select>
          <button type="button" class="admin-page__addLocaleBtn" @click="showAddLocale = !showAddLocale">
            + Язык
          </button>
        </div>
        <div v-if="showAddLocale" class="admin-page__addLocaleForm">
          <input
            v-model="newCode"
            class="admin-page__input admin-page__input--sm"
            placeholder="Код (напр. de)"
            maxlength="10"
          >
          <input
            v-model="newName"
            class="admin-page__input admin-page__input--sm"
            placeholder="Название (напр. Deutsch)"
          >
          <button
            type="button"
            class="admin-page__addLocaleBtn"
            :disabled="addingLocale"
            @click="addLocale"
          >
            {{ addingLocale ? '...' : 'Добавить' }}
          </button>
          <p v-if="addLocaleError" class="admin-page__error">
            {{ addLocaleError }}
          </p>
        </div>
      </div>

      <div v-for="group in groups" :key="group.title" class="admin-page__group">
        <h2 class="admin-page__groupTitle">
          {{ group.title }}
        </h2>
        <div class="admin-page__groupBody">
          <label
            v-for="field in group.fields"
            :key="field.key"
            class="admin-page__field"
          >
            <span class="admin-page__label">
              {{ field.label }}
              <span class="admin-page__key">{{ field.key }}</span>
            </span>

            <textarea
              v-if="field.multiline"
              v-model="form[field.key]"
              class="admin-page__textarea"
              rows="3"
            />
            <input
              v-else
              v-model="form[field.key]"
              class="admin-page__input"
              type="text"
            >
          </label>
        </div>
      </div>

      <div class="admin-page__group">
        <h2 class="admin-page__groupTitle">Info table + Promo info + Official (HTML)</h2>
        <div class="admin-page__groupBody">
          <label class="admin-page__field">
            <span class="admin-page__label">HTML-контент (Info table, Promo info, Official)</span>
            <textarea
              v-model="htmlContent"
              class="admin-page__textarea admin-page__textarea--html"
              rows="20"
              spellcheck="false"
            />
          </label>
        </div>
      </div>

      <div class="admin-page__group">
        <h2 class="admin-page__groupTitle">Promos section</h2>
        <div class="admin-page__groupBody">
          <label class="admin-page__field">
            <span class="admin-page__label">
              Section title
              <span class="admin-page__key">home.promos.allTitle</span>
            </span>
            <input v-model="form['home.promos.allTitle']" class="admin-page__input" type="text">
          </label>
        </div>
      </div>

      <div class="admin-page__group">
        <h2 class="admin-page__groupTitle">FAQ</h2>
        <div class="admin-page__groupBody">
          <label class="admin-page__field">
            <span class="admin-page__label">
              Title
              <span class="admin-page__key">home.faq.title</span>
            </span>
            <input v-model="form['home.faq.title']" class="admin-page__input" type="text">
          </label>
          <div v-for="(item, idx) in extraFaq" :key="idx" class="admin-page__faqCard">
            <label class="admin-page__field">
              <span class="admin-page__label">Вопрос</span>
              <input v-model="item.question" class="admin-page__input" type="text">
            </label>
            <label class="admin-page__field">
              <span class="admin-page__label">Ответ</span>
              <textarea v-model="item.answer" class="admin-page__textarea" rows="3" />
            </label>
            <button type="button" class="admin-page__addLocaleBtn" @click="removeExtraFaq(idx)">
              Удалить
            </button>
          </div>
          <button type="button" class="admin-page__addLocaleBtn" @click="addExtraFaq">
            + Добавить FAQ
          </button>
        </div>
      </div>

      <p v-if="errorMessage" class="admin-page__error">
        {{ errorMessage }}
      </p>

      <button class="admin-page__button" type="submit" :disabled="saving">
        {{ saving ? 'Сохранение...' : 'Сохранить' }}
      </button>
    </form>
  </div>
</template>

<style scoped>
.admin-page__title {
  margin: 0 0 12px;
  font-size: 22px;
  font-weight: 700;
}

.admin-page__form {
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-width: 640px;
}

.admin-page__field {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.admin-page__label {
  font-size: 13px;
  color: #666666;
}

.admin-page__input,
.admin-page__textarea {
  width: 100%;
  padding: 8px 10px;
  border-radius: 6px;
  border: 1px solid #d0d0d0;
  font-size: 14px;
  font-family: inherit;
  resize: vertical;
}

.admin-page__input:focus,
.admin-page__textarea:focus {
  outline: none;
  border-color: #1f6feb;
  box-shadow: 0 0 0 1px rgba(31, 111, 235, 0.15);
}

.admin-page__button {
  align-self: flex-start;
  border: none;
  border-radius: 6px;
  padding: 8px 14px;
  font-size: 13px;
  cursor: pointer;
  background: #1f6feb;
  color: #ffffff;
}

.admin-page__group {
  border: 1px solid #e5e5e5;
  border-radius: 10px;
  padding: 12px;
  background: #ffffff;
}

.admin-page__groupTitle {
  margin: 0 0 10px;
  font-size: 16px;
  font-weight: 700;
  color: #111111;
}

.admin-page__groupHead {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 10px;
}

.admin-page__groupBody {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.admin-page__key {
  margin-left: 8px;
  font-size: 11px;
  color: #999999;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
}

.admin-page__error {
  margin: 0;
  font-size: 13px;
  color: #dc2626;
}

.admin-page__hint {
  font-size: 12px;
  color: #666666;
}

.admin-page__localeRow {
  display: flex;
  gap: 8px;
  align-items: center;
}

.admin-page__localeRow .admin-page__input {
  flex: 1;
}

.admin-page__addLocaleBtn {
  color: black;
  flex-shrink: 0;
  border: 1px solid #d0d0d0;
  border-radius: 6px;
  padding: 8px 12px;
  background: #ffffff;
  font-size: 13px;
  cursor: pointer;
  white-space: nowrap;
}

.admin-page__addLocaleBtn:hover {
  background: #f3f4f6;
}

.admin-page__faqCard {
  border: 1px solid #e5e5e5;
  border-radius: 8px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.admin-page__addLocaleForm {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;
  align-items: center;
}

.admin-page__input--sm {
  width: 140px;
  flex: unset;
}

.admin-page__textarea--html {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
  font-size: 12px;
  min-height: 300px;
}
</style>
