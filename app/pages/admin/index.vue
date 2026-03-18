<script setup lang="ts">
definePageMeta({
  layout: 'admin',
})

type PageItem = {
  slug: string
  title: string
  content: string
}

const { data: pages, refresh, pending } = useFetch<PageItem[]>('/api/admin/pages')

const form = reactive<PageItem>({
  slug: '',
  title: '',
  content: '',
})

const isEditing = ref(false)
const initialSlug = ref<string | null>(null)
const saving = ref(false)
const errorMessage = ref('')

function startCreate() {
  isEditing.value = false
  initialSlug.value = null
  form.slug = ''
  form.title = ''
  form.content = ''
  errorMessage.value = ''
}

function startEdit(page: PageItem) {
  isEditing.value = true
  initialSlug.value = page.slug
  form.slug = page.slug
  form.title = page.title
  form.content = page.content
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
      },
    })

    await refresh()
    if (!isEditing.value) {
      startCreate()
    }
  } catch (error: any) {
    errorMessage.value = error?.data?.statusMessage || 'Ошибка сохранения'
  } finally {
    saving.value = false
  }
}

async function remove(slug: string) {
  if (!confirm(`Удалить страницу "${slug}"?`)) {
    return
  }

  try {
    await $fetch('/api/admin/pages', {
      method: 'DELETE',
      body: { slug },
    })
    await refresh()
    if (isEditing.value && initialSlug.value === slug) {
      startCreate()
    }
  } catch {
    // ignore
  }
}
</script>

<template>
  <div class="admin">
    <header class="admin__header">
      <h1 class="admin__title">
        Управление страницами
      </h1>
    </header>

    <section class="admin__content">
      <div class="admin__columns">
        <div class="admin__column admin__column--list">
          <div class="admin__listHeader">
            <h2>Страницы</h2>
            <button
              type="button"
              class="admin__button admin__button--primary"
              @click="startCreate"
            >
              Новая страница
            </button>
          </div>

          <div v-if="pending" class="admin__hint">
            Загрузка...
          </div>

          <table
            v-if="pages && pages.length"
            class="admin__table"
          >
            <thead>
              <tr>
                <th>Slug</th>
                <th>Заголовок</th>
                <th />
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="page in pages"
                :key="page.slug"
              >
                <td>
                  <code>{{ page.slug }}</code>
                </td>
                <td>{{ page.title }}</td>
                <td class="admin__tableActions">
                  <button
                    type="button"
                    class="admin__button admin__button--ghost"
                    @click="startEdit(page)"
                  >
                    Редактировать
                  </button>
                  <button
                    type="button"
                    class="admin__button admin__button--danger"
                    @click="remove(page.slug)"
                  >
                    Удалить
                  </button>
                </td>
              </tr>
            </tbody>
          </table>

          <p v-else class="admin__hint">
            Страниц пока нет.
          </p>
        </div>

        <div class="admin__column admin__column--form">
          <h2 class="admin__subtitle">
            {{ isEditing ? 'Редактирование страницы' : 'Новая страница' }}
          </h2>

          <form
            class="admin__form"
            @submit.prevent="submitForm"
          >
            <label class="admin__field">
              <span class="admin__label">
                Slug
              </span>
              <input
                v-model="form.slug"
                type="text"
                class="admin__input"
                placeholder="пример: bonus-terms"
                required
              >
            </label>

            <label class="admin__field">
              <span class="admin__label">
                Заголовок
              </span>
              <input
                v-model="form.title"
                type="text"
                class="admin__input"
                required
              >
            </label>

            <label class="admin__field">
              <span class="admin__label">
                Контент
              </span>
              <textarea
                v-model="form.content"
                class="admin__textarea"
                rows="10"
                placeholder="Текст страницы (поддерживается простой HTML/разметка)"
              />
            </label>

            <p
              v-if="errorMessage"
              class="admin__error"
            >
              {{ errorMessage }}
            </p>

            <button
              type="submit"
              class="admin__button admin__button--primary"
              :disabled="saving"
            >
              {{ saving ? 'Сохранение...' : 'Сохранить' }}
            </button>
          </form>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.admin__header {
  margin-bottom: 16px;
}

.admin__title {
  margin: 0;
  font-size: 22px;
  font-weight: 700;
}

.admin__columns {
  display: grid;
  grid-template-columns: minmax(0, 1.2fr) minmax(0, 1.5fr);
  gap: 24px;
  align-items: flex-start;
}

.admin__listHeader {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.admin__table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

.admin__table th,
.admin__table td {
  padding: 8px 10px;
  border-bottom: 1px solid #e5e5e5;
  text-align: left;
}

.admin__tableActions {
  display: flex;
  gap: 6px;
  justify-content: flex-end;
}

.admin__subtitle {
  margin: 0 0 8px;
  font-size: 18px;
  font-weight: 600;
}

.admin__form {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.admin__field {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.admin__label {
  font-size: 13px;
  color: #666666;
}

.admin__input,
.admin__textarea {
  width: 100%;
  padding: 8px 10px;
  border-radius: 6px;
  border: 1px solid #d0d0d0;
  font-size: 14px;
  font-family: inherit;
  resize: vertical;
}

.admin__input:focus,
.admin__textarea:focus {
  outline: none;
  border-color: #1f6feb;
  box-shadow: 0 0 0 1px rgba(31, 111, 235, 0.15);
}

.admin__button {
  border: none;
  border-radius: 6px;
  padding: 6px 12px;
  font-size: 13px;
  cursor: pointer;
  background: #f3f4f6;
}

.admin__button--primary {
  background: #1f6feb;
  color: #ffffff;
}

.admin__button--ghost {
  background: #ffffff;
  border: 1px solid #d0d0d0;
}

.admin__button--danger {
  background: #dc2626;
  color: #ffffff;
}

.admin__error {
  margin: 0;
  font-size: 13px;
  color: #dc2626;
}

.admin__hint {
  margin: 8px 0 0;
  font-size: 13px;
  color: #666666;
}

@media (max-width: 899px) {
  .admin__columns {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>

