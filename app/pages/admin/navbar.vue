<script setup lang="ts">
definePageMeta({
  layout: 'admin',
})

const slug = '_sys_navbar'

type LocaleCode = string

type NavbarLink = {
  label: string
  href: string
}

type NavbarLocaleSettings = {
  brandText?: string
  logoUrl?: string
  links?: NavbarLink[]
  signInLabel?: string
  signInHref?: string
}

type NavbarSettingsByLocale = Partial<Record<LocaleCode, NavbarLocaleSettings>>

type PageItem = {
  slug: string
  title: string
  content: string
}

const { data, refresh } = useFetch<PageItem | null>('/api/admin/pages', {
  query: { slug },
})

const { data: locales } = useFetch<{ code: string; name: string }[]>('/api/locales')
const activeLocale = ref<LocaleCode>('en')

const form = reactive<Required<NavbarLocaleSettings>>({
  brandText: '',
  logoUrl: '',
  links: [],
  signInLabel: '',
  signInHref: '',
})

const saving = ref(false)
const errorMessage = ref('')

const parsedSettings = computed<NavbarSettingsByLocale>(() => {
  const raw = data.value?.content || ''
  if (!raw) {
    return {}
  }
  try {
    return JSON.parse(raw) as NavbarSettingsByLocale
  } catch {
    return {}
  }
})

function loadForm() {
  const current = parsedSettings.value[activeLocale.value] || {}
  form.brandText = current.brandText || ''
  form.logoUrl = current.logoUrl || ''
  form.signInLabel = current.signInLabel || ''
  form.signInHref = current.signInHref || ''
  form.links = (current.links || []).map((x) => ({ label: x.label || '', href: x.href || '' }))
  errorMessage.value = ''
}

watchEffect(() => {
  const first = locales.value?.[0]?.code
  if (first && activeLocale.value === 'en') {
    activeLocale.value = first
  }
})

watch([() => data.value?.content, activeLocale, () => locales.value?.length], loadForm, { immediate: true })

function addLink() {
  form.links.push({ label: '', href: '' })
}

function removeLink(index: number) {
  form.links.splice(index, 1)
}

async function save() {
  try {
    saving.value = true
    errorMessage.value = ''

    const nextAll: NavbarSettingsByLocale = { ...parsedSettings.value }
    nextAll[activeLocale.value] = {
      brandText: form.brandText.trim(),
      logoUrl: form.logoUrl.trim(),
      signInLabel: form.signInLabel.trim(),
      signInHref: form.signInHref.trim(),
      links: form.links
        .map((x) => ({ label: x.label.trim(), href: x.href.trim() }))
        .filter((x) => x.label && x.href),
    }

    await $fetch('/api/admin/pages', {
      method: 'PUT',
      body: {
        slug,
        title: 'Navbar',
        content: JSON.stringify(
          nextAll,
          null,
          2,
        ),
      },
    })

    await refresh()
  } catch (error: any) {
    errorMessage.value = error?.data?.statusMessage || 'Ошибка сохранения'
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <ClientOnly>
  <div>
    <h1 class="admin-page__title">
      Navbar
    </h1>

    <form class="admin-page__form" @submit.prevent="save">
      <label class="admin-page__field">
        <span class="admin-page__label">Локаль</span>
        <select v-model="activeLocale" class="admin-page__input">
          <option v-for="l in (locales || [])" :key="l.code" :value="l.code">
            {{ l.name || l.code }}
          </option>
        </select>
      </label>

      <label class="admin-page__field">
        <span class="admin-page__label">Текст бренда</span>
        <input v-model="form.brandText" class="admin-page__input" type="text" placeholder="MOSTBET" />
      </label>

      <label class="admin-page__field">
        <span class="admin-page__label">URL логотипа</span>
        <input
          v-model="form.logoUrl"
          class="admin-page__input"
          type="text"
          placeholder="/logo.svg или https://..."
        />
        <span class="admin-page__hint">
          Если заполнено, будет показана картинка. Если пусто — текст.
        </span>
      </label>

      <div class="admin-page__field">
        <div class="admin-page__row">
          <span class="admin-page__label">Меню (ссылки)</span>
          <button type="button" class="admin-page__smallBtn" @click="addLink">
            + Добавить
          </button>
        </div>

        <div v-if="!form.links.length" class="admin-page__hint">
          Если список пустой — используются стандартные пункты из i18n.
        </div>

        <div v-for="(link, idx) in form.links" :key="idx" class="admin-page__linkRow">
          <input v-model="link.label" class="admin-page__input" type="text" placeholder="Текст" />
          <input v-model="link.href" class="admin-page__input" type="text" placeholder="#register или /page" />
          <button type="button" class="admin-page__smallBtn admin-page__smallBtn--danger" @click="removeLink(idx)">
            Удалить
          </button>
        </div>
      </div>

      <label class="admin-page__field">
        <span class="admin-page__label">Кнопка “Войти” (текст)</span>
        <input v-model="form.signInLabel" class="admin-page__input" type="text" placeholder="(если пусто — из i18n)" />
      </label>

      <label class="admin-page__field">
        <span class="admin-page__label">Кнопка “Войти” (ссылка)</span>
        <input v-model="form.signInHref" class="admin-page__input" type="text" placeholder="#sign-in" />
      </label>

      <p v-if="errorMessage" class="admin-page__error">
        {{ errorMessage }}
      </p>

      <button class="admin-page__button" type="submit" :disabled="saving">
        {{ saving ? 'Сохранение...' : 'Сохранить' }}
      </button>
    </form>
  </div>
  </ClientOnly>
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

.admin-page__input {
  width: 100%;
  padding: 8px 10px;
  border-radius: 6px;
  border: 1px solid #d0d0d0;
  font-size: 14px;
  font-family: inherit;
}

.admin-page__input:focus {
  outline: none;
  border-color: #1f6feb;
  box-shadow: 0 0 0 1px rgba(31, 111, 235, 0.15);
}

.admin-page__hint {
  font-size: 12px;
  color: #666666;
}

.admin-page__row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.admin-page__smallBtn {
  border: 1px solid #d0d0d0;
  border-radius: 6px;
  padding: 6px 10px;
  background: #ffffff;
  cursor: pointer;
  font-size: 12px;
  color: #111111;
}

.admin-page__smallBtn--danger {
  border-color: rgba(220, 38, 38, 0.4);
  color: #dc2626;
}

.admin-page__linkRow {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr) auto;
  gap: 8px;
  margin-top: 8px;
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

.admin-page__error {
  margin: 0;
  font-size: 13px;
  color: #dc2626;
}
</style>

