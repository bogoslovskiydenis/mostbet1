<script setup lang="ts">
definePageMeta({ layout: 'admin' })

type LocaleEntry = { code: string; name: string }
type LocalesData = { locales: LocaleEntry[]; messages: Record<string, Record<string, string>> }

const { data, refresh } = useFetch<LocalesData>('/api/admin/locales')

const locales = computed(() => data.value?.locales || [])

const newCode = ref('')
const newName = ref('')
const saving = ref(false)
const error = ref('')

async function addLocale() {
  if (!newCode.value.trim() || !newName.value.trim()) return
  try {
    saving.value = true
    error.value = ''
    await $fetch('/api/admin/locales', {
      method: 'POST',
      body: { code: newCode.value.trim(), name: newName.value.trim() },
    })
    newCode.value = ''
    newName.value = ''
    await refresh()
  }
  catch (e: any) {
    error.value = e?.data?.statusMessage || 'Ошибка'
  }
  finally {
    saving.value = false
  }
}

async function removeLocale(code: string) {
  if (!confirm(`Удалить язык "${code}"? Все переводы будут потеряны.`)) return
  try {
    await $fetch(`/api/admin/locales?code=${code}`, { method: 'DELETE' })
    await refresh()
  }
  catch (e: any) {
    error.value = e?.data?.statusMessage || 'Ошибка'
  }
}
</script>

<template>
  <div>
    <h1 class="ap__title">
      Языки
    </h1>

    <div class="ap__list">
      <div v-for="l in locales" :key="l.code" class="ap__row">
        <span class="ap__code">{{ l.code }}</span>
        <span class="ap__name">{{ l.name }}</span>
        <button
          v-if="l.code !== 'en' && l.code !== 'ru'"
          class="ap__del"
          type="button"
          @click="removeLocale(l.code)"
        >
          Удалить
        </button>
      </div>
    </div>

    <form class="ap__form" @submit.prevent="addLocale">
      <h2 class="ap__subtitle">
        Добавить язык
      </h2>
      <div class="ap__row">
        <input
          v-model="newCode"
          class="ap__input"
          placeholder="Код (напр. de)"
          maxlength="10"
          required
        >
        <input
          v-model="newName"
          class="ap__input"
          placeholder="Название (напр. Deutsch)"
          required
        >
        <button class="ap__btn" type="submit" :disabled="saving">
          Добавить
        </button>
      </div>
      <p v-if="error" class="ap__error">
        {{ error }}
      </p>
    </form>
  </div>
</template>

<style scoped>
.ap__title {
  margin: 0 0 16px;
  font-size: 22px;
  font-weight: 700;
}

.ap__subtitle {
  margin: 0 0 10px;
  font-size: 16px;
  font-weight: 600;
}

.ap__list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 24px;
  max-width: 480px;
}

.ap__row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.ap__code {
  width: 48px;
  font-size: 13px;
  font-weight: 600;
  font-family: ui-monospace, monospace;
  color: #555;
}

.ap__name {
  flex: 1;
  font-size: 14px;
}

.ap__input {
  padding: 7px 10px;
  border: 1px solid #d0d0d0;
  border-radius: 6px;
  font-size: 14px;
  font-family: inherit;
  width: 160px;
}

.ap__btn {
  padding: 7px 14px;
  border: none;
  border-radius: 6px;
  background: #1f6feb;
  color: #fff;
  font-size: 13px;
  cursor: pointer;
}

.ap__del {
  padding: 4px 10px;
  border: 1px solid #dc2626;
  border-radius: 6px;
  background: transparent;
  color: #dc2626;
  font-size: 12px;
  cursor: pointer;
}

.ap__del:hover {
  background: #fef2f2;
}

.ap__form {
  max-width: 480px;
}

.ap__error {
  margin: 6px 0 0;
  font-size: 13px;
  color: #dc2626;
}
</style>
