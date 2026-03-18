<script setup lang="ts">
definePageMeta({
  layout: 'admin',
})

type PageItem = {
  slug: string
  title: string
  content: string
  bannerUrl?: string
  badge?: string
  description?: string
  ctaText?: string
}

const { data: pages, refresh, pending } = useFetch<PageItem[]>('/api/admin/pages')

const promoPages = computed(() =>
  (pages.value || []).filter(p => !p.slug.startsWith('_'))
)

const form = reactive<PageItem>({
  slug: '',
  title: '',
  content: '',
  bannerUrl: '',
  badge: '',
  description: '',
  ctaText: '',
})

const isEditing = ref(false)
const initialSlug = ref<string | null>(null)
const saving = ref(false)
const errorMessage = ref('')
const addBanner = ref(false)

function startCreate() {
  isEditing.value = false
  initialSlug.value = null
  form.slug = ''
  form.title = ''
  form.content = ''
  form.bannerUrl = ''
  form.badge = ''
  form.description = ''
  form.ctaText = ''
  addBanner.value = false
  errorMessage.value = ''
}

function startEdit(page: PageItem) {
  isEditing.value = true
  initialSlug.value = page.slug
  form.slug = page.slug
  form.title = page.title
  form.content = page.content
  form.bannerUrl = page.bannerUrl || ''
  form.badge = page.badge || ''
  form.description = page.description || ''
  form.ctaText = page.ctaText || ''
  addBanner.value = !!page.bannerUrl
  errorMessage.value = ''
}

async function submitForm() {
  try {
    saving.value = true
    errorMessage.value = ''
    const method = isEditing.value ? 'PUT' : 'POST'
    await $fetch('/api/admin/pages', {
      method,
      body: {
        slug: form.slug.trim(),
        title: form.title.trim(),
        content: form.content,
        bannerUrl: addBanner.value ? form.bannerUrl?.trim() : '',
        badge: form.badge?.trim(),
        description: form.description?.trim(),
        ctaText: form.ctaText?.trim(),
      },
    })
    await refresh()
    if (!isEditing.value) startCreate()
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
</script>

<template>
  <div class="ap">
    <div class="ap__columns">
      <div class="ap__col ap__col--list">
        <div class="ap__listHead">
          <h2 class="ap__listTitle">
            All you need to know about Mostbet
          </h2>
          <button type="button" class="ap__btn ap__btn--primary" @click="startCreate">
            Создать страницу
          </button>
        </div>

        <div v-if="pending" class="ap__hint">Загрузка...</div>

        <table v-if="promoPages.length" class="ap__table">
          <thead>
            <tr>
              <th>Slug</th>
              <th>Заголовок</th>
              <th />
            </tr>
          </thead>
          <tbody>
            <tr v-for="page in promoPages" :key="page.slug">
              <td><code>{{ page.slug }}</code></td>
              <td>{{ page.title }}</td>
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

        <p v-else-if="!pending" class="ap__hint">Страниц пока нет.</p>
      </div>

      <div class="ap__col ap__col--form">
        <h2 class="ap__formTitle">
          {{ isEditing ? 'Редактирование страницы' : 'Новая страница' }}
        </h2>

        <form class="ap__form" @submit.prevent="submitForm">
          <label class="ap__field">
            <span class="ap__label">Slug</span>
            <input
              v-model="form.slug"
              type="text"
              class="ap__input"
              placeholder="пример: bonus-terms"
              required
            >
          </label>

          <label class="ap__field">
            <span class="ap__label">Заголовок</span>
            <input v-model="form.title" type="text" class="ap__input" required>
          </label>

          <label class="ap__checkboxRow">
            <input v-model="addBanner" type="checkbox" class="ap__checkbox">
            <span class="ap__label">Добавить баннер</span>
          </label>

          <label v-if="addBanner" class="ap__field">
            <span class="ap__label">URL баннера</span>
            <input
              v-model="form.bannerUrl"
              type="text"
              class="ap__input"
              placeholder="https://... или /img/banner.jpg"
            >
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
            <textarea
              v-model="form.content"
              class="ap__textarea"
              rows="10"
              placeholder="Текст страницы (поддерживается HTML)"
            />
          </label>

          <p v-if="errorMessage" class="ap__error">{{ errorMessage }}</p>

          <button type="submit" class="ap__btn ap__btn--primary ap__btn--full" :disabled="saving">
            {{ saving ? 'Сохранение...' : 'Сохранить' }}
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
.ap__btn--ghost { background: #fff; color: black }
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
  .ap__columns {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
