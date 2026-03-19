<script setup lang="ts">
import {Icon} from '@iconify/vue'
import banner from "../assets/images/main/banner_img.webp"
import bannerReg from "../assets/bonus/registration.webp"
import bannerPromo from "../assets/bonus/promocode.png"
import bannerLogin from "../assets/bonus/login.webp"

type LocaleContent = {
  title: string
  badge?: string
  description?: string
  ctaText?: string
  content: string
}
type DynamicPage = {
  slug: string
  bannerUrl?: string
  newsPlacement?: 'home' | 'promocode' | 'review'
  locales?: Record<string, LocaleContent>
}

const { locale } = useAppLocale()

const { data: allPages } = useFetch<DynamicPage[]>('/api/admin/pages')
const dynamicPages = computed(() =>
  (allPages.value || []).filter(p =>
    !p.slug.startsWith('_')
    && p.slug !== 'promo-code'
    && p.slug !== 'review'
    && (
      p.newsPlacement === 'home'
      || (!p.newsPlacement && !p.slug.startsWith('promo-news-'))
    ),
  ),
)

function getLocaleData(page: DynamicPage) {
  if (!page.locales) return null
  return page.locales[locale.value] || page.locales['en'] || Object.values(page.locales)[0] || null
}

function resolveBannerUrl(url?: string) {
  if (!url) return ''
  if (url === '__asset:promocode__') return bannerPromo
  return url
}

const { th } = useLocaleMessages()
</script>

<template>
  <section class="hero">
    <div class="hero__top">
      <div class="hero__content">
        <h1 class="hero__title">
          {{ th('hero.title') }}
        </h1>
        <p class="hero__subtitle">
          {{ th('hero.subtitle') }}
        </p>
      </div>
      <div class="hero__media">
        <img
            :src="banner"
            alt="MostBet"
            loading="lazy"
            class="hero__image"
        >
      </div>
    </div>
    <div class="hero__actions">
      <a href="#register" class="hero__btn hero__btn--primary">
        <span class="hero__btnLabel">
          {{ th('header.register') }}
        </span>
        <span class="hero__btnArrow" aria-hidden="true">
          <Icon icon="mdi:arrow-right" class="hero__btnIcon"/>
        </span>
      </a>
      <a href="#promo-code" class="hero__btn hero__btn--ghost">
        <span class="hero__btnLabel">
          {{ th('header.promoCode') }}
        </span>
        <span class="hero__btnArrow" aria-hidden="true">
          <Icon icon="mdi:ticket-percent" class="hero__btnIcon"/>
        </span>
      </a>
      <a href="#sign-in" class="hero__btn hero__btn--outline">
        <span class="hero__btnLabel">
          {{ th('header.signIn') }}
        </span>
        <span class="hero__btnArrow" aria-hidden="true">
          <Icon icon="mdi:login" class="hero__btnIcon"/>
        </span>
      </a>
    </div>
  </section>

  <section class="info">
    <article id="register" class="info-card">
      <div class="info-card__imageWrapper">
        <img
            :src="bannerReg"
            alt="MostBet Registration"
            loading="lazy"
            class="info-card__image"
        >
      </div>
      <div class="info-card__content">
        <h2 class="info-card__title">{{ th('home.info.registration.title') }}</h2>
        <p class="info-card__text">
          {{ th('home.info.registration.p1') }}
        </p>
        <p class="info-card__text">
          {{ th('home.info.registration.p2') }}
        </p>
        <p class="info-card__text">
          {{ th('home.info.registration.p3') }}
        </p>
        <a href="#register" class="info-card__button info-card__button--primary">
          Register
        </a>
      </div>
    </article>

    <article id="promo-code" class="info-card">
      <div class="info-card__imageWrapper">
        <img
            :src="bannerPromo"
            alt="MostBet Promo Code"
            loading="lazy"
            class="info-card__image"
        >
      </div>
      <div class="info-card__content">
        <h2 class="info-card__title">{{ th('home.info.promo.title') }}</h2>
        <p class="info-card__text">
          {{ th('home.info.promo.p1') }}
        </p>
        <p class="info-card__text">
          {{ th('home.info.promo.p2') }}
        </p>
        <p class="info-card__text">
          {{ th('home.info.promo.p3') }}
        </p>
        <a href="#promo-code" class="info-card__button info-card__button--primary">
          Promo Code
        </a>
      </div>
    </article>

    <article id="sign-in" class="info-card">
      <div class="info-card__imageWrapper">
        <img
            :src="bannerLogin"
            alt="MostBet Login"
            loading="lazy"
            class="info-card__image"
        >
      </div>
      <div class="info-card__content">
        <h2 class="info-card__title">{{ th('home.info.login.title') }}</h2>
        <p class="info-card__text">
          {{ th('home.info.login.p1') }}
        </p>
        <p class="info-card__text">
          {{ th('home.info.login.p2') }}
        </p>
        <p class="info-card__text">
          {{ th('home.info.login.p3') }}
        </p>
        <a href="#sign-in" class="info-card__button info-card__button--primary">
          Log In
        </a>
      </div>
    </article>
  </section>

  <section class="info-table">
    <h2 class="info-table__title">
      {{ th('home.infoTable.title') }}
    </h2>
    <h3 class="info-table__subtitle">
      {{ th('home.infoTable.subtitle') }}
    </h3>
    <div class="info-table__wrapper">
      <table class="info-table__table">
        <tbody>
        <tr>
          <th>{{ th('home.infoTable.website') }}</th>
          <td><a href="#" class="info-table__link">{{ th('home.infoTable.websiteValue') }}</a></td>
        </tr>
        <tr>
          <th>{{ th('home.infoTable.products') }}</th>
          <td>{{ th('home.infoTable.productsValue') }}</td>
        </tr>
        <tr>
          <th>{{ th('home.infoTable.promoCode') }}</th>
          <td><strong>{{ th('home.infoTable.promoCodeValue') }}</strong></td>
        </tr>
        <tr>
          <th>{{ th('home.infoTable.depositBonus') }}</th>
          <td>{{ th('home.infoTable.depositBonusValue') }}</td>
        </tr>
        <tr>
          <th>{{ th('home.infoTable.bonusValue') }}</th>
          <td>{{ th('home.infoTable.bonusValueValue') }}</td>
        </tr>
        <tr>
          <th>{{ th('home.infoTable.established') }}</th>
          <td>{{ th('home.infoTable.establishedValue') }}</td>
        </tr>
        <tr>
          <th>{{ th('home.infoTable.acceptedCrypto') }}</th>
          <td>{{ th('home.infoTable.acceptedCryptoValue') }}</td>
        </tr>
        <tr>
          <th>{{ th('home.infoTable.currencies') }}</th>
          <td>{{ th('home.infoTable.currenciesValue') }}</td>
        </tr>
        <tr>
          <th>{{ th('home.infoTable.websiteLanguages') }}</th>
          <td>{{ th('home.infoTable.websiteLanguagesValue') }}</td>
        </tr>
        <tr>
          <th>{{ th('home.infoTable.mobileApp') }}</th>
          <td>{{ th('home.infoTable.mobileAppValue') }}</td>
        </tr>
        <tr>
          <th>{{ th('home.infoTable.liveSupport') }}</th>
          <td>{{ th('home.infoTable.liveSupportValue') }}</td>
        </tr>
        <tr>
          <th>{{ th('home.infoTable.liveStreaming') }}</th>
          <td>{{ th('home.infoTable.liveStreamingValue') }}</td>
        </tr>
        <tr>
          <th>{{ th('home.infoTable.minimumDeposit') }}</th>
          <td>{{ th('home.infoTable.minimumDepositValue') }}</td>
        </tr>
        </tbody>
      </table>
    </div>
  </section>

  <section class="promo-info">
    <h2 class="promo-info__title">
      {{ th('home.promoInfo.title') }}
    </h2>
    <p class="promo-info__text">
      {{ th('home.promoInfo.p1') }}
    </p>
    <p class="promo-info__text">
      {{ th('home.promoInfo.p2') }}
    </p>

    <h3 class="promo-info__subtitle">
      {{ th('home.promoInfo.summaryTitle') }}
    </h3>
    <div class="promo-info__tableWrapper">
      <table class="promo-info__table">
        <thead>
        <tr>
          <th>{{ th('home.promoInfo.tableProduct') }}</th>
          <th>{{ th('home.promoInfo.tableProduct') }}</th>
          <th>{{ th('home.promoInfo.tablePromo') }}</th>
          <th>{{ th('home.promoInfo.tableOffer') }}</th>
        </tr>
        </thead>
        <tbody>
        <tr>
          <td>MostBet Sports</td>
          <td><strong>HUGE</strong></td>
          <td>{{ th('home.promoInfo.sportsRowOffer') }}</td>
        </tr>
        <tr>
          <td>MostBet Casino</td>
          <td><strong>HUGE</strong></td>
          <td>{{ th('home.promoInfo.casinoRowOffer') }}</td>
        </tr>
        </tbody>
      </table>
    </div>

    <p class="promo-info__text">
      {{ th('home.promoInfo.p3') }}
    </p>
    <p class="promo-info__text">
      {{ th('home.promoInfo.p4') }}
    </p>
    <p class="promo-info__text">
      {{ th('home.promoInfo.p5') }}
    </p>
    <p class="promo-info__text">
      {{ th('home.promoInfo.p6') }}
    </p>
    <p class="promo-info__text">
      {{ th('home.promoInfo.p7') }}
    </p>
    <p class="promo-info__text">
      {{ th('home.promoInfo.p8') }}
    </p>

    <p class="promo-info__text">
      {{ th('home.promoInfo.p9') }}
    </p>
    <ul class="promo-info__list">
      <li>{{ th('home.promoInfo.listQuick') }}</li>
      <li>{{ th('home.promoInfo.listPhone') }}</li>
      <li>{{ th('home.promoInfo.listEmail') }}</li>
      <li>{{ th('home.promoInfo.listSocial') }}</li>
    </ul>
  </section>

  <section class="official-info">
    <h2 class="official-info__title">
      {{ th('home.official.title') }}
    </h2>
    <p class="official-info__text">
      {{ th('home.official.p1') }}
    </p>
    <p class="official-info__text">
      {{ th('home.official.p2') }}
    </p>
    <p class="official-info__text">
      {{ th('home.official.p3') }}
    </p>
    <p class="official-info__text">
      {{ th('home.official.p4') }}
    </p>
    <p class="official-info__text">
      {{ th('home.official.p5') }}
    </p>
    <p class="official-info__text">
      {{ th('home.official.p6') }}
    </p>
    <p class="official-info__text">
      {{ th('home.official.p7') }}
    </p>

    <h3 class="official-info__subtitle">
      {{ th('home.official.paymentsTitle') }}
    </h3>
    <p class="official-info__text">
      {{ th('home.official.paymentsP1') }}
    </p>
    <p class="official-info__text">
      {{ th('home.official.paymentsP2') }}
    </p>
    <ul class="official-info__list">
      <li>{{ th('home.official.paymentsList.mastercard') }}</li>
      <li>{{ th('home.official.paymentsList.visa') }}</li>
      <li>{{ th('home.official.paymentsList.bitcoin') }}</li>
      <li>{{ th('home.official.paymentsList.ethereum') }}</li>
      <li>{{ th('home.official.paymentsList.litecoin') }}</li>
      <li>{{ th('home.official.paymentsList.ecopayz') }}</li>
      <li>{{ th('home.official.paymentsList.googlePay') }}</li>
      <li>{{ th('home.official.paymentsList.webmoney') }}</li>
      <li>{{ th('home.official.paymentsList.qiwi') }}</li>
    </ul>
  </section>

  <section class="promo-grid">
    <h2 class="promo-grid__title">
      {{ th('home.promos.allTitle') }}
    </h2>
    <div class="promo-grid__list">
      <NuxtLink
        v-for="page in dynamicPages"
        :key="page.slug"
        class="promo-card"
        :to="`/${page.slug}`"
      >
        <div class="promo-card__image">
          <img
            v-if="resolveBannerUrl(page.bannerUrl)"
            :src="resolveBannerUrl(page.bannerUrl)"
            :alt="getLocaleData(page)?.title || page.slug"
            loading="lazy"
          >
        </div>
        <div class="promo-card__body">
          <template v-if="getLocaleData(page)">
            <div v-if="getLocaleData(page)!.badge" class="promo-card__badge">{{ getLocaleData(page)!.badge }}</div>
            <h3 class="promo-card__title">{{ getLocaleData(page)!.title }}</h3>
            <p v-if="getLocaleData(page)!.description" class="promo-card__text">{{ getLocaleData(page)!.description }}</p>
            <span v-if="getLocaleData(page)!.ctaText" class="promo-card__cta">{{ getLocaleData(page)!.ctaText }}</span>
          </template>
        </div>
      </NuxtLink>
    </div>
  </section>

  <section class="faq">
    <h2 class="faq__title">
      {{ th('home.faq.title') }}
    </h2>
    <div class="faq__item">
      <h3 class="faq__question">
        {{ th('home.faq.q1.question') }}
      </h3>
      <p class="faq__answer">
        {{ th('home.faq.q1.answer') }}
      </p>
    </div>
    <div class="faq__item">
      <h3 class="faq__question">
        {{ th('home.faq.q2.question') }}
      </h3>
      <p class="faq__answer">
        {{ th('home.faq.q2.answer') }}
      </p>
    </div>
    <div class="faq__item">
      <h3 class="faq__question">
        {{ th('home.faq.q3.question') }}
      </h3>
      <p class="faq__answer">
        {{ th('home.faq.q3.answer') }}
      </p>
    </div>
    <div class="faq__item">
      <h3 class="faq__question">
        {{ th('home.faq.q4.question') }}
      </h3>
      <p class="faq__answer">
        {{ th('home.faq.q4.answer') }}
      </p>
    </div>
  </section>
</template>

<style scoped>
.hero {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.hero__top {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.hero__content {
  max-width: 540px;
}

.hero__title {
  margin: 0 0 12px;
  font-size: 32px;
  letter-spacing: -0.02em;
}

.hero__subtitle {
  margin: 0 0 20px;
  color: var(--muted);
}

.hero__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
  margin-top: -100px;
  max-width: 860px;
  margin-left: auto;
  margin-right: auto;
}

.hero__btn {
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px 12px 18px;
  border-radius: 16px;
  font-size: 14px;
  font-weight: 700;
  border: 1px solid var(--line);
  background: #fff;
  color: #0b1a2e;
  min-width: 220px;
  box-shadow: 0 18px 40px rgba(0, 0, 0, 0.35);
}

.hero__btn--primary {
  border-color: rgba(255, 106, 0, 0.55);
  background: linear-gradient(180deg, var(--accent2) 0%, var(--accent) 100%);
  color: #0b1a2e;
}

.hero__btn--ghost {
  background: #fff;
}

.hero__btn--outline {
  border-color: var(--line);
}

.hero__btnLabel {
  white-space: nowrap;
}

.hero__btnArrow {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(180deg, var(--accent2) 0%, var(--accent) 100%);
}

.hero__btnIcon {
  font-size: 22px;
}

.hero__media {
  display: flex;
  justify-content: center;
}

.hero__image {
  max-width: 100%;
  height: auto;
  display: block;
}

.info {
  display: flex;
  flex-direction: column;
  gap: 32px;
  margin-top: 48px;
}

.info-card {
  display: grid;
  grid-template-columns: minmax(0, 1.4fr) minmax(0, 1.6fr);
  gap: 24px;
}

.info-card__imageWrapper {
  border-radius: 16px;
  overflow: hidden;
}

.info-card__image {
  width: 100%;
  display: block;
}

.info-card__content {
  max-width: 520px;
}

.info-card__title {
  margin: 0 0 12px;
  font-size: 24px;
  font-weight: 700;
}

.info-card__text {
  margin: 0 0 10px;
  color: var(--muted);
}

.info-card__button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-top: 16px;
  padding: 10px 22px;
  border-radius: 999px;
  font-weight: 700;
  font-size: 14px;
  background: var(--accent);
  color: #fff;
}

.info-card__button--primary {
  background: #ff6a00;
}

.info-table {
  margin-top: 56px;
}

.info-table__title {
  margin: 0 0 8px;
  font-size: 24px;
  font-weight: 700;
}

.info-table__subtitle {
  margin: 0 0 16px;
  font-size: 18px;
  font-weight: 700;
}

.info-table__wrapper {
  overflow-x: auto;
}

.info-table__table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

.info-table__table th,
.info-table__table td {
  padding: 10px 12px;
  text-align: left;
}

.info-table__table th {
  width: 180px;
  font-weight: 600;
}

.info-table__link {
  color: var(--accent);
  text-decoration: underline;
}

.promo-info {
  margin-top: 56px;
  max-width: 860px;
}

.promo-info__title {
  margin: 0 0 12px;
  font-size: 24px;
  font-weight: 700;
}

.promo-info__subtitle {
  margin: 24px 0 12px;
  font-size: 18px;
  font-weight: 700;
}

.promo-info__text {
  margin: 0 0 12px;
  color: var(--muted);
  font-size: 14px;
}

.promo-info__tableWrapper {
  margin-top: 8px;
  overflow-x: auto;
}

.promo-info__table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

.promo-info__table th,
.promo-info__table td {
  padding: 10px 12px;
  text-align: left;
}

.promo-info__table thead th {
  background: #003366;
  color: #fff;
  font-weight: 600;
}

.promo-info__list {
  margin: 8px 0 0 18px;
  padding: 0;
  color: var(--muted);
  font-size: 14px;
}

.promo-info__list li + li {
  margin-top: 6px;
}

.official-info {
  margin-top: 56px;
  max-width: 860px;
}

.official-info__title {
  margin: 0 0 12px;
  font-size: 24px;
  font-weight: 700;
}

.official-info__subtitle {
  margin: 24px 0 12px;
  font-size: 18px;
  font-weight: 700;
}

.official-info__text {
  margin: 0 0 12px;
  color: var(--muted);
  font-size: 14px;
}

.official-info__list {
  margin: 4px 0 0 18px;
  padding: 0;
  color: var(--muted);
  font-size: 14px;
}

.official-info__list li + li {
  margin-top: 4px;
}

.promo-grid {
  margin-top: 56px;
}

.promo-grid__title {
  margin: 0 0 20px;
  font-size: 24px;
  font-weight: 700;
}

.promo-grid__list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 20px;
}

.promo-card {
  display: flex;
  flex-direction: column;
  border-radius: 14px;
  overflow: hidden;
  background: #fff;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.16);
  text-decoration: none;
  color: inherit;
}

.promo-card__image {
  height: 140px;
  background: #f0f4ff;
  overflow: hidden;
}

.promo-card__image img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.promo-card__body {
  padding: 14px 14px 16px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.promo-card__badge {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #ff6a00;
}

.promo-card__title {
  margin: 0;
  font-size: 15px;
  font-weight: 700;
  color: black;
}

.promo-card__text {
  margin: 0;
  font-size: 13px;
  color: black;
}

.promo-card__cta {
  margin-top: 8px;
  align-self: flex-start;
  padding: 6px 14px;
  border-radius: 999px;
  background: #ff6a00;
  color: #fff;
  font-size: 12px;
  font-weight: 700;
}

@media (max-width: 599px) {
  .promo-card__image {
    height: 120px;
  }
}

.faq {
  margin-top: 56px;
  max-width: 860px;
}

.faq__title {
  margin: 0 0 16px;
  font-size: 24px;
  font-weight: 700;
}

.faq__item + .faq__item {
  margin-top: 16px;
}

.faq__question {
  margin: 0 0 4px;
  font-size: 16px;
  font-weight: 700;
}

.faq__answer {
  margin: 0;
  font-size: 14px;
  color: var(--muted);
}

@media (max-width: 899px) {
  .info-card {
    grid-template-columns: minmax(0, 1fr);
  }
}

@media (min-width: 900px) {
  .hero__top {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }

  .hero__media {
    justify-content: flex-end;
  }
}
</style>

