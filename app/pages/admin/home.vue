<script setup lang="ts">
import type { Ref } from 'vue'

definePageMeta({ layout: 'admin' })

type LocalesData = {
  locales: { code: string; name: string }[]
  messages: Record<string, Record<string, string>>
}

const { data: localesData, refresh } = useFetch<LocalesData>('/api/admin/locales')

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
    ],
  },
  {
    title: 'Info: Registration',
    fields: [
      { key: 'home.info.registration.title', label: 'Title', multiline: false },
      { key: 'home.info.registration.p1', label: 'P1', multiline: true },
      { key: 'home.info.registration.p2', label: 'P2', multiline: true },
      { key: 'home.info.registration.p3', label: 'P3', multiline: true },
    ],
  },
  {
    title: 'Info: Promo code',
    fields: [
      { key: 'home.info.promo.title', label: 'Title', multiline: false },
      { key: 'home.info.promo.p1', label: 'P1', multiline: true },
      { key: 'home.info.promo.p2', label: 'P2', multiline: true },
      { key: 'home.info.promo.p3', label: 'P3', multiline: true },
    ],
  },
  {
    title: 'Info: Login',
    fields: [
      { key: 'home.info.login.title', label: 'Title', multiline: false },
      { key: 'home.info.login.p1', label: 'P1', multiline: true },
      { key: 'home.info.login.p2', label: 'P2', multiline: true },
      { key: 'home.info.login.p3', label: 'P3', multiline: true },
    ],
  },
  {
    title: 'Info table',
    fields: [
      { key: 'home.infoTable.title', label: 'Title', multiline: false },
      { key: 'home.infoTable.subtitle', label: 'Subtitle', multiline: false },
      { key: 'home.infoTable.website', label: 'Website (label)', multiline: false },
      { key: 'home.infoTable.websiteValue', label: 'Website (value)', multiline: false },
      { key: 'home.infoTable.products', label: 'Products (label)', multiline: false },
      { key: 'home.infoTable.productsValue', label: 'Products (value)', multiline: false },
      { key: 'home.infoTable.promoCode', label: 'Promo code (label)', multiline: false },
      { key: 'home.infoTable.promoCodeValue', label: 'Promo code (value)', multiline: false },
      { key: 'home.infoTable.depositBonus', label: 'Deposit promocode (label)', multiline: false },
      { key: 'home.infoTable.depositBonusValue', label: 'Deposit promocode (value)', multiline: false },
      { key: 'home.infoTable.bonusValue', label: 'Bonus value (label)', multiline: false },
      { key: 'home.infoTable.bonusValueValue', label: 'Bonus value (value)', multiline: false },
      { key: 'home.infoTable.established', label: 'Established (label)', multiline: false },
      { key: 'home.infoTable.establishedValue', label: 'Established (value)', multiline: false },
      { key: 'home.infoTable.acceptedCrypto', label: 'Accepted crypto (label)', multiline: false },
      { key: 'home.infoTable.acceptedCryptoValue', label: 'Accepted crypto (value)', multiline: false },
      { key: 'home.infoTable.currencies', label: 'Currencies (label)', multiline: false },
      { key: 'home.infoTable.currenciesValue', label: 'Currencies (value)', multiline: false },
      { key: 'home.infoTable.websiteLanguages', label: 'Website languages (label)', multiline: false },
      { key: 'home.infoTable.websiteLanguagesValue', label: 'Website languages (value)', multiline: false },
      { key: 'home.infoTable.mobileApp', label: 'Mobile app (label)', multiline: false },
      { key: 'home.infoTable.mobileAppValue', label: 'Mobile app (value)', multiline: false },
      { key: 'home.infoTable.liveSupport', label: 'Live support (label)', multiline: false },
      { key: 'home.infoTable.liveSupportValue', label: 'Live support (value)', multiline: false },
      { key: 'home.infoTable.liveStreaming', label: 'Live streaming (label)', multiline: false },
      { key: 'home.infoTable.liveStreamingValue', label: 'Live streaming (value)', multiline: false },
      { key: 'home.infoTable.minimumDeposit', label: 'Minimum deposit (label)', multiline: false },
      { key: 'home.infoTable.minimumDepositValue', label: 'Minimum deposit (value)', multiline: false },
    ],
  },
  {
    title: 'Promo info',
    fields: [
      { key: 'home.promoInfo.title', label: 'Title', multiline: false },
      { key: 'home.promoInfo.p1', label: 'P1', multiline: true },
      { key: 'home.promoInfo.p2', label: 'P2', multiline: true },
      { key: 'home.promoInfo.summaryTitle', label: 'Summary title', multiline: false },
      { key: 'home.promoInfo.tableProduct', label: 'Table: Product', multiline: false },
      { key: 'home.promoInfo.tablePromo', label: 'Table: Promo code', multiline: false },
      { key: 'home.promoInfo.tableOffer', label: 'Table: Offer', multiline: false },
      { key: 'home.promoInfo.sportsRowOffer', label: 'Sports row offer', multiline: false },
      { key: 'home.promoInfo.casinoRowOffer', label: 'Casino row offer', multiline: false },
      { key: 'home.promoInfo.p3', label: 'P3', multiline: true },
      { key: 'home.promoInfo.p4', label: 'P4', multiline: true },
      { key: 'home.promoInfo.p5', label: 'P5', multiline: true },
      { key: 'home.promoInfo.p6', label: 'P6', multiline: true },
      { key: 'home.promoInfo.p7', label: 'P7', multiline: true },
      { key: 'home.promoInfo.p8', label: 'P8', multiline: true },
      { key: 'home.promoInfo.p9', label: 'P9', multiline: true },
      { key: 'home.promoInfo.listQuick', label: 'List: Quick', multiline: false },
      { key: 'home.promoInfo.listPhone', label: 'List: Phone', multiline: false },
      { key: 'home.promoInfo.listEmail', label: 'List: Email', multiline: false },
      { key: 'home.promoInfo.listSocial', label: 'List: Social', multiline: false },
    ],
  },
  {
    title: 'Official',
    fields: [
      { key: 'home.official.title', label: 'Title', multiline: false },
      { key: 'home.official.p1', label: 'P1', multiline: true },
      { key: 'home.official.p2', label: 'P2', multiline: true },
      { key: 'home.official.p3', label: 'P3', multiline: true },
      { key: 'home.official.p4', label: 'P4', multiline: true },
      { key: 'home.official.p5', label: 'P5', multiline: true },
      { key: 'home.official.p6', label: 'P6', multiline: true },
      { key: 'home.official.p7', label: 'P7', multiline: true },
      { key: 'home.official.paymentsTitle', label: 'Payments title', multiline: false },
      { key: 'home.official.paymentsP1', label: 'Payments P1', multiline: true },
      { key: 'home.official.paymentsP2', label: 'Payments P2', multiline: true },
      { key: 'home.official.paymentsList.mastercard', label: 'Payments: Mastercard', multiline: false },
      { key: 'home.official.paymentsList.visa', label: 'Payments: Visa', multiline: false },
      { key: 'home.official.paymentsList.bitcoin', label: 'Payments: Bitcoin', multiline: false },
      { key: 'home.official.paymentsList.ethereum', label: 'Payments: Ethereum', multiline: false },
      { key: 'home.official.paymentsList.litecoin', label: 'Payments: Litecoin', multiline: false },
      { key: 'home.official.paymentsList.ecopayz', label: 'Payments: ecoPayz', multiline: false },
      { key: 'home.official.paymentsList.googlePay', label: 'Payments: Google Pay', multiline: false },
      { key: 'home.official.paymentsList.webmoney', label: 'Payments: WebMoney', multiline: false },
      { key: 'home.official.paymentsList.qiwi', label: 'Payments: QIWI', multiline: false },
    ],
  },
  {
    title: 'Promos',
    fields: [
      { key: 'home.promos.allTitle', label: 'Section title', multiline: false },
      { key: 'home.promos.pragmatic.badge', label: 'Pragmatic: Badge', multiline: false },
      { key: 'home.promos.pragmatic.title', label: 'Pragmatic: Title', multiline: false },
      { key: 'home.promos.pragmatic.text', label: 'Pragmatic: Text', multiline: true },
      { key: 'home.promos.pragmatic.cta', label: 'Pragmatic: CTA', multiline: false },
      { key: 'home.promos.bigSlots.badge', label: 'Big slots: Badge', multiline: false },
      { key: 'home.promos.bigSlots.title', label: 'Big slots: Title', multiline: false },
      { key: 'home.promos.bigSlots.text', label: 'Big slots: Text', multiline: true },
      { key: 'home.promos.bigSlots.cta', label: 'Big slots: CTA', multiline: false },
      { key: 'home.promos.freeSpins.badge', label: 'Free spins: Badge', multiline: false },
      { key: 'home.promos.freeSpins.title', label: 'Free spins: Title', multiline: false },
      { key: 'home.promos.freeSpins.text', label: 'Free spins: Text', multiline: true },
      { key: 'home.promos.freeSpins.cta', label: 'Free spins: CTA', multiline: false },
      { key: 'home.promos.sportsBonus.badge', label: 'Sports promocode: Badge', multiline: false },
      { key: 'home.promos.sportsBonus.title', label: 'Sports promocode: Title', multiline: false },
      { key: 'home.promos.sportsBonus.text', label: 'Sports promocode: Text', multiline: true },
      { key: 'home.promos.sportsBonus.cta', label: 'Sports promocode: CTA', multiline: false },
      { key: 'home.promos.betRefund.badge', label: 'Bet refund: Badge', multiline: false },
      { key: 'home.promos.betRefund.title', label: 'Bet refund: Title', multiline: false },
      { key: 'home.promos.betRefund.text', label: 'Bet refund: Text', multiline: true },
      { key: 'home.promos.betRefund.cta', label: 'Bet refund: CTA', multiline: false },
      { key: 'home.promos.weeklyBonuses.badge', label: 'Weekly bonuses: Badge', multiline: false },
      { key: 'home.promos.weeklyBonuses.title', label: 'Weekly bonuses: Title', multiline: false },
      { key: 'home.promos.weeklyBonuses.text', label: 'Weekly bonuses: Text', multiline: true },
      { key: 'home.promos.weeklyBonuses.cta', label: 'Weekly bonuses: CTA', multiline: false },
      { key: 'home.promos.winFreeBets.badge', label: 'Win free bets: Badge', multiline: false },
      { key: 'home.promos.winFreeBets.title', label: 'Win free bets: Title', multiline: false },
      { key: 'home.promos.winFreeBets.text', label: 'Win free bets: Text', multiline: true },
      { key: 'home.promos.winFreeBets.cta', label: 'Win free bets: CTA', multiline: false },
      { key: 'home.promos.weeklyCasino.badge', label: 'Weekly casino: Badge', multiline: false },
      { key: 'home.promos.weeklyCasino.title', label: 'Weekly casino: Title', multiline: false },
      { key: 'home.promos.weeklyCasino.text', label: 'Weekly casino: Text', multiline: true },
      { key: 'home.promos.weeklyCasino.cta', label: 'Weekly casino: CTA', multiline: false },
    ],
  },
  {
    title: 'FAQ',
    fields: [
      { key: 'home.faq.title', label: 'Title', multiline: false },
      { key: 'home.faq.q1.question', label: 'Q1 question', multiline: false },
      { key: 'home.faq.q1.answer', label: 'Q1 answer', multiline: true },
      { key: 'home.faq.q2.question', label: 'Q2 question', multiline: false },
      { key: 'home.faq.q2.answer', label: 'Q2 answer', multiline: true },
      { key: 'home.faq.q3.question', label: 'Q3 question', multiline: false },
      { key: 'home.faq.q3.answer', label: 'Q3 answer', multiline: true },
      { key: 'home.faq.q4.question', label: 'Q4 question', multiline: false },
      { key: 'home.faq.q4.answer', label: 'Q4 answer', multiline: true },
    ],
  },
]

const form = reactive<Record<string, string>>({})
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

function loadForm() {
  const msgs = serverMessages.value
  for (const group of groups) {
    for (const field of group.fields) {
      form[field.key] = msgs[field.key] ?? ''
    }
  }
  errorMessage.value = ''
}

watch(serverMessages, loadForm, { immediate: true })

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

    await $fetch('/api/admin/locales', {
      method: 'PUT',
      body: { code: activeLocale.value, messages: updated },
    })

    await refresh()
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
</style>
