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

const REVIEW_SLUG = 'review'
const defaultConfig = `{
  "heroTitle": "Review",
  "heroDescription": "Detailed review of the official MostBet website.",
  "sectionTitle": "Top Betting Sites",
  "showCryptoLabel": "Show crypto",
  "showCryptoDefault": false,
  "columns": {
    "playerRating": "Player Rating",
    "ourScore": "Our Score",
    "secure": "Secure",
    "trusted": "Trusted",
    "verified": "Verified"
  },
  "cards": [
    {
      "rank": 1,
      "name": "MOSTBET",
      "offer": "$ 300",
      "score": "9.9",
      "scoreVotes": 60,
      "visitLabel": "Visit Mostbet",
      "promo": "HUGE",
      "subtitle": "Deposit $200. Get $300 with promocode HUGE",
      "extra": "Mostbet Promo Code",
      "terms": "Mostbet: Use promo code HUGE. Deposit up to $200. Get a 150% bonus up to $300 & 250 Free Spins. 18+ only. T&Cs apply.",
      "getBonusLabel": "Get Bonus",
      "findOutLabel": "Find out more",
      "offerLink": "#",
      "findOutLink": "#",
      "visitLink": "#"
    },
    {
      "rank": 2,
      "name": "GGPOKER",
      "offer": "$ 600",
      "score": "9.8",
      "scoreVotes": 0,
      "visitLabel": "Visit GGPoker",
      "promo": "NEWBONUS",
      "subtitle": "$600 sign up bonus",
      "extra": "Bonus Code",
      "terms": "GGPoker: Use the promo code NEWBONUS. 18+ only. Gamble responsibly.",
      "getBonusLabel": "Get Bonus",
      "findOutLabel": "Find out more",
      "offerLink": "#",
      "findOutLink": "#",
      "visitLink": "#"
    },
    {
      "rank": 3,
      "name": "BC.GAME",
      "offer": "$ 20000",
      "score": "9.6",
      "scoreVotes": 0,
      "visitLabel": "Visit BC.Game Sport",
      "promo": "NEWBONUS",
      "subtitle": "$20,000 use code NEWBONUS",
      "extra": "Promo code",
      "terms": "Bc.Game Sport: Join with promo code NEWBONUS and get up to $20,000 as a bonus. Over 18s. T&Cs apply.",
      "getBonusLabel": "Get Bonus",
      "findOutLabel": "Find out more",
      "offerLink": "#",
      "findOutLink": "#",
      "visitLink": "#"
    },
    {
      "rank": 4,
      "name": "RAZED",
      "offer": "$ 300",
      "score": "9.6",
      "scoreVotes": 0,
      "visitLabel": "Visit Razed",
      "promo": "MAXBET",
      "subtitle": "$300 Cash Match use referral code MAXBET",
      "extra": "Referral Code",
      "terms": "Razed: Open an account with referral code MAXBET and get a $300 welcome bonus. Deposit $500. 18+ only.",
      "getBonusLabel": "Get Bonus",
      "findOutLabel": "Find out more",
      "offerLink": "#",
      "findOutLink": "#",
      "visitLink": "#"
    }
  ]
}`

const { data: pages, refresh } = useFetch<PageItem[]>('/api/admin/pages')
const { data: localesData } = useFetch<{ locales: LocaleEntry[] }>('/api/admin/locales')

const availableLocales = computed(() => localesData.value?.locales || [{ code: 'en', name: 'English' }])
const activeLocale = ref('en')
const saving = ref(false)
const errorMessage = ref('')
const addBanner = ref(false)

const form = reactive({
  bannerUrl: '',
  title: '',
  description: '',
  content: '',
})

const reviewPage = computed(() =>
  (pages.value || []).find(p => p.slug === REVIEW_SLUG) || null,
)

function loadLocaleFields() {
  const page = reviewPage.value
  const lc = page?.locales?.[activeLocale.value]
    || page?.locales?.en
    || (page?.locales ? Object.values(page.locales)[0] : null)

  form.bannerUrl = page?.bannerUrl || ''
  addBanner.value = Boolean(page?.bannerUrl)
  form.title = lc?.title || 'Review'
  form.description = lc?.description || 'Detailed review of the official MostBet website.'
  form.content = lc?.content || defaultConfig
  errorMessage.value = ''
}

watch([reviewPage, activeLocale], loadLocaleFields, { immediate: true })

async function save() {
  try {
    saving.value = true
    errorMessage.value = ''

    await $fetch('/api/admin/pages', {
      method: 'PUT',
      body: {
        slug: REVIEW_SLUG,
        bannerUrl: addBanner.value ? form.bannerUrl.trim() : '',
        locale: activeLocale.value,
        title: form.title.trim() || 'Review',
        description: form.description.trim(),
        ctaText: '',
        badge: '',
        content: form.content,
      },
    })

    await refresh()
  } catch (error: any) {
    errorMessage.value = error?.data?.statusMessage || error?.message || 'Ошибка сохранения'
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <div class="ap">
    <h1 class="ap__title">Review page</h1>

    <form class="ap__form" @submit.prevent="save">
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

      <label class="ap__checkboxRow">
        <input v-model="addBanner" type="checkbox" class="ap__checkbox">
        <span class="ap__label">Добавить баннер</span>
      </label>

      <label v-if="addBanner" class="ap__field">
        <span class="ap__label">URL баннера (опционально)</span>
        <input v-model="form.bannerUrl" type="text" class="ap__input" placeholder="https://... или /img/banner.jpg">
      </label>

      <label class="ap__field">
        <span class="ap__label">Заголовок (используется как fallback)</span>
        <input v-model="form.title" type="text" class="ap__input" required>
      </label>

      <label class="ap__field">
        <span class="ap__label">Описание (используется как fallback)</span>
        <input v-model="form.description" type="text" class="ap__input">
      </label>

      <label class="ap__field">
        <span class="ap__label">JSON конфиг review (карточки, подписи, ссылки)</span>
        <textarea v-model="form.content" class="ap__textarea" rows="22" />
      </label>

      <p v-if="errorMessage" class="ap__error">{{ errorMessage }}</p>

      <button type="submit" class="ap__btn ap__btn--primary ap__btn--full" :disabled="saving">
        {{ saving ? 'Сохранение...' : `Сохранить (${activeLocale.toUpperCase()})` }}
      </button>
    </form>
  </div>
</template>

<style scoped>
.ap {
  max-width: 900px;
}

.ap__title {
  margin: 0 0 12px;
  font-size: 20px;
  font-weight: 700;
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
}

.ap__checkbox {
  width: 16px;
  height: 16px;
}

.ap__label {
  font-size: 13px;
  color: #666;
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
.ap__btn--full { width: 100%; padding: 10px; font-size: 14px; }

.ap__error {
  margin: 0;
  font-size: 13px;
  color: #dc2626;
}
</style>
