<script setup lang="ts">
definePageMeta({
  layout: 'admin',
})

const slug = '_sys_seo'

type SeoSettings = {
  metaTitle?: string
  metaDescription?: string
  metaKeywords?: string
  metaRobots?: string
  canonicalBaseUrl?: string
  canonicalUrl?: string
  faviconUrl?: string
  ogTitle?: string
  ogDescription?: string
  ogImage?: string
}

type PageItem = {
  slug: string
  title: string
  content: string
}

const { data, refresh } = useFetch<PageItem | null>('/api/admin/pages', {
  query: { slug },
})

const form = reactive<Required<SeoSettings>>({
  metaTitle: '',
  metaDescription: '',
  metaKeywords: '',
  metaRobots: '',
  canonicalBaseUrl: '',
  canonicalUrl: '',
  faviconUrl: '',
  ogTitle: '',
  ogDescription: '',
  ogImage: '',
})

const saving = ref(false)
const errorMessage = ref('')

watchEffect(() => {
  if (!data.value) return
  try {
    const parsed = JSON.parse(data.value.content || '{}') as SeoSettings
    form.metaTitle = parsed.metaTitle || ''
    form.metaDescription = parsed.metaDescription || ''
    form.metaKeywords = parsed.metaKeywords || ''
    form.metaRobots = parsed.metaRobots || ''
    form.canonicalBaseUrl = parsed.canonicalBaseUrl || ''
    form.canonicalUrl = parsed.canonicalUrl || ''
    form.faviconUrl = parsed.faviconUrl || ''
    form.ogTitle = parsed.ogTitle || ''
    form.ogDescription = parsed.ogDescription || ''
    form.ogImage = parsed.ogImage || ''
  } catch {
    form.metaTitle = ''
    form.metaDescription = ''
    form.metaKeywords = ''
    form.metaRobots = ''
    form.canonicalBaseUrl = ''
    form.canonicalUrl = ''
    form.faviconUrl = ''
    form.ogTitle = ''
    form.ogDescription = ''
    form.ogImage = ''
  }
})

async function save() {
  try {
    saving.value = true
    errorMessage.value = ''
    await $fetch('/api/admin/pages', {
      method: 'PUT',
      body: {
        slug,
        title: 'SEO',
        content: JSON.stringify({
          metaTitle: form.metaTitle.trim(),
          metaDescription: form.metaDescription.trim(),
          metaKeywords: form.metaKeywords.trim(),
          metaRobots: form.metaRobots.trim(),
          canonicalBaseUrl: form.canonicalBaseUrl.trim(),
          canonicalUrl: form.canonicalUrl.trim(),
          faviconUrl: form.faviconUrl.trim(),
          ogTitle: form.ogTitle.trim(),
          ogDescription: form.ogDescription.trim(),
          ogImage: form.ogImage.trim(),
        }, null, 2),
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
      <h1 class="admin-page__title">SEO</h1>

      <form class="admin-page__form" @submit.prevent="save">
        <label class="admin-page__field">
          <span class="admin-page__label">Meta title</span>
          <input v-model="form.metaTitle" class="admin-page__input" type="text" placeholder="MostBet - ..." />
        </label>

        <label class="admin-page__field">
          <span class="admin-page__label">Meta description</span>
          <textarea v-model="form.metaDescription" class="admin-page__textarea" rows="3" />
        </label>

        <label class="admin-page__field">
          <span class="admin-page__label">Meta keywords</span>
          <input v-model="form.metaKeywords" class="admin-page__input" type="text" placeholder="mostbet, promo code" />
        </label>

        <label class="admin-page__field">
          <span class="admin-page__label">Meta robots</span>
          <input v-model="form.metaRobots" class="admin-page__input" type="text" placeholder="index,follow" />
        </label>

        <label class="admin-page__field">
          <span class="admin-page__label">Canonical base URL</span>
          <input v-model="form.canonicalBaseUrl" class="admin-page__input" type="text" placeholder="https://example.com" />
          <span class="admin-page__hint">Если заполнено, canonical будет автоматически собираться как base + path.</span>
        </label>

        <label class="admin-page__field">
          <span class="admin-page__label">Canonical URL (override)</span>
          <input v-model="form.canonicalUrl" class="admin-page__input" type="text" placeholder="https://example.com/promo-code" />
          <span class="admin-page__hint">Если заполнено, перекрывает Canonical base URL.</span>
        </label>

        <label class="admin-page__field">
          <span class="admin-page__label">Favicon URL</span>
          <input v-model="form.faviconUrl" class="admin-page__input" type="text" placeholder="/favicon.ico или https://..." />
        </label>

        <label class="admin-page__field">
          <span class="admin-page__label">OG title</span>
          <input v-model="form.ogTitle" class="admin-page__input" type="text" />
        </label>

        <label class="admin-page__field">
          <span class="admin-page__label">OG description</span>
          <textarea v-model="form.ogDescription" class="admin-page__textarea" rows="3" />
        </label>

        <label class="admin-page__field">
          <span class="admin-page__label">OG image URL</span>
          <input v-model="form.ogImage" class="admin-page__input" type="text" placeholder="https://.../og.jpg" />
        </label>

        <p v-if="errorMessage" class="admin-page__error">{{ errorMessage }}</p>

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
  max-width: 700px;
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

.admin-page__hint {
  font-size: 12px;
  color: #666666;
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
