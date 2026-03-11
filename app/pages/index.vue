<script setup lang="ts">
import {useI18n} from '#imports'
import {Icon} from '@iconify/vue'
import banner from "../assets/images/main/banner_img.webp"
import bannerReg from "../assets/images/main/registration.webp"
import bannerPromo from "../assets/images/main/promocode.png"
import bannerLogin from "../assets/images/main/login.webp"
import pragmaticBanner from "../assets/images/main/Pragmatic-Play-Drops-and-Wins-2026.jpg"

const promos = [
  {
    id: 'pragmatic-prize-pool',
    badgeKey: 'home.promos.pragmatic.badge',
    titleKey: 'home.promos.pragmatic.title',
    textKey: 'home.promos.pragmatic.text',
    ctaKey: 'home.promos.pragmatic.cta',
    href: '/casino/mostbet-pragmatic-play'
  },
  {
    id: 'big-slots-prize',
    badgeKey: 'home.promos.bigSlots.badge',
    titleKey: 'home.promos.bigSlots.title',
    textKey: 'home.promos.bigSlots.text',
    ctaKey: 'home.promos.bigSlots.cta',
    href: '#'
  },
  {
    id: 'free-spins-competition',
    badgeKey: 'home.promos.freeSpins.badge',
    titleKey: 'home.promos.freeSpins.title',
    textKey: 'home.promos.freeSpins.text',
    ctaKey: 'home.promos.freeSpins.cta',
    href: '#'
  },
  {
    id: 'sports-bonus',
    badgeKey: 'home.promos.sportsBonus.badge',
    titleKey: 'home.promos.sportsBonus.title',
    textKey: 'home.promos.sportsBonus.text',
    ctaKey: 'home.promos.sportsBonus.cta',
    href: '#'
  },
  {
    id: 'bet-refund',
    badgeKey: 'home.promos.betRefund.badge',
    titleKey: 'home.promos.betRefund.title',
    textKey: 'home.promos.betRefund.text',
    ctaKey: 'home.promos.betRefund.cta',
    href: '#'
  },
  {
    id: 'weekly-bonuses',
    badgeKey: 'home.promos.weeklyBonuses.badge',
    titleKey: 'home.promos.weeklyBonuses.title',
    textKey: 'home.promos.weeklyBonuses.text',
    ctaKey: 'home.promos.weeklyBonuses.cta',
    href: '#'
  },
  {
    id: 'win-free-bets',
    badgeKey: 'home.promos.winFreeBets.badge',
    titleKey: 'home.promos.winFreeBets.title',
    textKey: 'home.promos.winFreeBets.text',
    ctaKey: 'home.promos.winFreeBets.cta',
    href: '#'
  },
  {
    id: 'weekly-casino-reward',
    badgeKey: 'home.promos.weeklyCasino.badge',
    titleKey: 'home.promos.weeklyCasino.title',
    textKey: 'home.promos.weeklyCasino.text',
    ctaKey: 'home.promos.weeklyCasino.cta',
    href: '#'
  }
]

const {t} = useI18n({useScope: 'global'})
</script>

<template>
  <section class="hero">
    <div class="hero__top">
      <div class="hero__content">
        <h1 class="hero__title">
          {{ t('hero.title') }}
        </h1>
        <p class="hero__subtitle">
          {{ t('hero.subtitle') }}
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
          {{ t('header.register') }}
        </span>
        <span class="hero__btnArrow" aria-hidden="true">
          <Icon icon="mdi:arrow-right" class="hero__btnIcon"/>
        </span>
      </a>
      <a href="#promo-code" class="hero__btn hero__btn--ghost">
        <span class="hero__btnLabel">
          {{ t('header.promoCode') }}
        </span>
        <span class="hero__btnArrow" aria-hidden="true">
          <Icon icon="mdi:ticket-percent" class="hero__btnIcon"/>
        </span>
      </a>
      <a href="#sign-in" class="hero__btn hero__btn--outline">
        <span class="hero__btnLabel">
          {{ t('header.signIn') }}
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
        <h2 class="info-card__title">{{ t('home.info.registration.title') }}</h2>
        <p class="info-card__text">
          {{ t('home.info.registration.p1') }}
        </p>
        <p class="info-card__text">
          {{ t('home.info.registration.p2') }}
        </p>
        <p class="info-card__text">
          {{ t('home.info.registration.p3') }}
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
        <h2 class="info-card__title">{{ t('home.info.promo.title') }}</h2>
        <p class="info-card__text">
          {{ t('home.info.promo.p1') }}
        </p>
        <p class="info-card__text">
          {{ t('home.info.promo.p2') }}
        </p>
        <p class="info-card__text">
          {{ t('home.info.promo.p3') }}
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
        <h2 class="info-card__title">{{ t('home.info.login.title') }}</h2>
        <p class="info-card__text">
          {{ t('home.info.login.p1') }}
        </p>
        <p class="info-card__text">
          {{ t('home.info.login.p2') }}
        </p>
        <p class="info-card__text">
          {{ t('home.info.login.p3') }}
        </p>
        <a href="#sign-in" class="info-card__button info-card__button--primary">
          Log In
        </a>
      </div>
    </article>
  </section>

  <section class="info-table">
    <h2 class="info-table__title">
      {{ t('home.infoTable.title') }}
    </h2>
    <h3 class="info-table__subtitle">
      {{ t('home.infoTable.subtitle') }}
    </h3>
    <div class="info-table__wrapper">
      <table class="info-table__table">
        <tbody>
        <tr>
          <th>{{ t('home.infoTable.website') }}</th>
          <td><a href="#" class="info-table__link">{{ t('home.infoTable.websiteValue') }}</a></td>
        </tr>
        <tr>
          <th>{{ t('home.infoTable.products') }}</th>
          <td>{{ t('home.infoTable.productsValue') }}</td>
        </tr>
        <tr>
          <th>{{ t('home.infoTable.promoCode') }}</th>
          <td><strong>{{ t('home.infoTable.promoCodeValue') }}</strong></td>
        </tr>
        <tr>
          <th>{{ t('home.infoTable.depositBonus') }}</th>
          <td>{{ t('home.infoTable.depositBonusValue') }}</td>
        </tr>
        <tr>
          <th>{{ t('home.infoTable.bonusValue') }}</th>
          <td>{{ t('home.infoTable.bonusValueValue') }}</td>
        </tr>
        <tr>
          <th>{{ t('home.infoTable.established') }}</th>
          <td>{{ t('home.infoTable.establishedValue') }}</td>
        </tr>
        <tr>
          <th>{{ t('home.infoTable.acceptedCrypto') }}</th>
          <td>{{ t('home.infoTable.acceptedCryptoValue') }}</td>
        </tr>
        <tr>
          <th>{{ t('home.infoTable.currencies') }}</th>
          <td>{{ t('home.infoTable.currenciesValue') }}</td>
        </tr>
        <tr>
          <th>{{ t('home.infoTable.websiteLanguages') }}</th>
          <td>{{ t('home.infoTable.websiteLanguagesValue') }}</td>
        </tr>
        <tr>
          <th>{{ t('home.infoTable.mobileApp') }}</th>
          <td>{{ t('home.infoTable.mobileAppValue') }}</td>
        </tr>
        <tr>
          <th>{{ t('home.infoTable.liveSupport') }}</th>
          <td>{{ t('home.infoTable.liveSupportValue') }}</td>
        </tr>
        <tr>
          <th>{{ t('home.infoTable.liveStreaming') }}</th>
          <td>{{ t('home.infoTable.liveStreamingValue') }}</td>
        </tr>
        <tr>
          <th>{{ t('home.infoTable.minimumDeposit') }}</th>
          <td>{{ t('home.infoTable.minimumDepositValue') }}</td>
        </tr>
        </tbody>
      </table>
    </div>
  </section>

  <section class="promo-info">
    <h2 class="promo-info__title">
      {{ t('home.promoInfo.title') }}
    </h2>
    <p class="promo-info__text">
      {{ t('home.promoInfo.p1') }}
    </p>
    <p class="promo-info__text">
      {{ t('home.promoInfo.p2') }}
    </p>

    <h3 class="promo-info__subtitle">
      {{ t('home.promoInfo.summaryTitle') }}
    </h3>
    <div class="promo-info__tableWrapper">
      <table class="promo-info__table">
        <thead>
        <tr>
          <th>{{ t('home.promoInfo.tableProduct') }}</th>
          <th>{{ t('home.promoInfo.tablePromo') }}</th>
          <th>{{ t('home.promoInfo.tableOffer') }}</th>
        </tr>
        </thead>
        <tbody>
        <tr>
          <td>MostBet Sports</td>
          <td><strong>HUGE</strong></td>
          <td>{{ t('home.promoInfo.sportsRowOffer') }}</td>
        </tr>
        <tr>
          <td>MostBet Casino</td>
          <td><strong>HUGE</strong></td>
          <td>{{ t('home.promoInfo.casinoRowOffer') }}</td>
        </tr>
        </tbody>
      </table>
    </div>

    <p class="promo-info__text">
      {{ t('home.promoInfo.p3') }}
    </p>
    <p class="promo-info__text">
      {{ t('home.promoInfo.p4') }}
    </p>
    <p class="promo-info__text">
      {{ t('home.promoInfo.p5') }}
    </p>
    <p class="promo-info__text">
      {{ t('home.promoInfo.p6') }}
    </p>
    <p class="promo-info__text">
      {{ t('home.promoInfo.p7') }}
    </p>
    <p class="promo-info__text">
      {{ t('home.promoInfo.p8') }}
    </p>

    <p class="promo-info__text">
      {{ t('home.promoInfo.p9') }}
    </p>
    <ul class="promo-info__list">
      <li>{{ t('home.promoInfo.listQuick') }}</li>
      <li>{{ t('home.promoInfo.listPhone') }}</li>
      <li>{{ t('home.promoInfo.listEmail') }}</li>
      <li>{{ t('home.promoInfo.listSocial') }}</li>
    </ul>
  </section>

  <section class="official-info">
    <h2 class="official-info__title">
      {{ t('home.official.title') }}
    </h2>
    <p class="official-info__text">
      {{ t('home.official.p1') }}
    </p>
    <p class="official-info__text">
      {{ t('home.official.p2') }}
    </p>
    <p class="official-info__text">
      {{ t('home.official.p3') }}
    </p>
    <p class="official-info__text">
      {{ t('home.official.p4') }}
    </p>
    <p class="official-info__text">
      {{ t('home.official.p5') }}
    </p>
    <p class="official-info__text">
      {{ t('home.official.p6') }}
    </p>
    <p class="official-info__text">
      {{ t('home.official.p7') }}
    </p>

    <h3 class="official-info__subtitle">
      {{ t('home.official.paymentsTitle') }}
    </h3>
    <p class="official-info__text">
      {{ t('home.official.paymentsP1') }}
    </p>
    <p class="official-info__text">
      {{ t('home.official.paymentsP2') }}
    </p>
    <ul class="official-info__list">
      <li>{{ t('home.official.paymentsList.mastercard') }}</li>
      <li>{{ t('home.official.paymentsList.visa') }}</li>
      <li>{{ t('home.official.paymentsList.bitcoin') }}</li>
      <li>{{ t('home.official.paymentsList.ethereum') }}</li>
      <li>{{ t('home.official.paymentsList.litecoin') }}</li>
      <li>{{ t('home.official.paymentsList.ecopayz') }}</li>
      <li>{{ t('home.official.paymentsList.googlePay') }}</li>
      <li>{{ t('home.official.paymentsList.webmoney') }}</li>
      <li>{{ t('home.official.paymentsList.qiwi') }}</li>
    </ul>
  </section>

  <section class="promo-grid">
    <h2 class="promo-grid__title">
      {{ t('home.promos.allTitle') }}
    </h2>
    <div class="promo-grid__list">
      <a
        v-for="promo in promos"
        :key="promo.id"
        class="promo-card"
        :href="promo.href"
      >
        <div class="promo-card__image">
          <img
              v-if="promo.id === 'pragmatic-prize-pool'"
              :src="pragmaticBanner"
              alt="MostBet Pragmatic Play Drops &amp; Wins"
              loading="lazy"
          >
        </div>
        <div class="promo-card__body">
          <div class="promo-card__badge">
            {{ t(promo.badgeKey) }}
          </div>
          <h3 class="promo-card__title">
            {{ t(promo.titleKey) }}
          </h3>
          <p class="promo-card__text">
            {{ t(promo.textKey) }}
          </p>
          <span class="promo-card__cta">
            {{ t(promo.ctaKey) }}
          </span>
        </div>
      </a>
    </div>
  </section>

  <section class="faq">
    <h2 class="faq__title">
      {{ t('home.faq.title') }}
    </h2>
    <div class="faq__item">
      <h3 class="faq__question">
        {{ t('home.faq.q1.question') }}
      </h3>
      <p class="faq__answer">
        {{ t('home.faq.q1.answer') }}
      </p>
    </div>
    <div class="faq__item">
      <h3 class="faq__question">
        {{ t('home.faq.q2.question') }}
      </h3>
      <p class="faq__answer">
        {{ t('home.faq.q2.answer') }}
      </p>
    </div>
    <div class="faq__item">
      <h3 class="faq__question">
        {{ t('home.faq.q3.question') }}
      </h3>
      <p class="faq__answer">
        {{ t('home.faq.q3.answer') }}
      </p>
    </div>
    <div class="faq__item">
      <h3 class="faq__question">
        {{ t('home.faq.q4.question') }}
      </h3>
      <p class="faq__answer">
        {{ t('home.faq.q4.answer') }}
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

