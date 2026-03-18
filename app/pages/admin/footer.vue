<script setup lang="ts">
definePageMeta({
  layout: 'admin',
})

const slug = '_sys_footer'

type FooterSettings = {
  brandText?: string
  copyrightText?: string
  legalText?: string
}

type PageItem = {
  slug: string
  title: string
  content: string
}

const { data, refresh } = useFetch<PageItem | null>('/api/admin/pages', {
  query: { slug },
})

const form = reactive<Required<FooterSettings>>({
  brandText: '',
  copyrightText: '',
  legalText: '',
})

const saving = ref(false)
const errorMessage = ref('')

watchEffect(() => {
  if (!data.value) {
    return
  }

  try {
    const parsed = JSON.parse(data.value.content || '{}') as FooterSettings
    form.brandText = parsed.brandText || ''
    form.copyrightText = parsed.copyrightText || ''
    form.legalText = parsed.legalText || ''
  } catch {
    form.brandText = ''
    form.copyrightText = ''
    form.legalText = ''
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
        title: 'Footer',
        content: JSON.stringify(
          {
            brandText: form.brandText.trim(),
            copyrightText: form.copyrightText.trim(),
            legalText: form.legalText,
          },
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
  <div>
    <h1 class="admin-page__title">
      Footer
    </h1>

    <form class="admin-page__form" @submit.prevent="save">
      <label class="admin-page__field">
        <span class="admin-page__label">Текст бренда</span>
        <input v-model="form.brandText" class="admin-page__input" type="text" placeholder="MOSTBET" />
      </label>

      <label class="admin-page__field">
        <span class="admin-page__label">Copyright</span>
        <input
          v-model="form.copyrightText"
          class="admin-page__input"
          type="text"
          placeholder="Copyright © 2026 MostBet."
        />
      </label>

      <label class="admin-page__field">
        <span class="admin-page__label">Legal текст (низ футера)</span>
        <textarea v-model="form.legalText" class="admin-page__textarea" rows="6" />
      </label>

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

.admin-page__error {
  margin: 0;
  font-size: 13px;
  color: #dc2626;
}
</style>

