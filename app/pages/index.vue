<script setup lang="ts">
import { useI18n } from '#imports'
import { Icon } from '@iconify/vue'
import banner from "../assets/images/main/banner_img.webp"
import bannerReg from "../assets/images/main/registration.webp"
import bannerPromo from "../assets/images/main/promocode.webp"
import bannerLogin from "../assets/images/main/login.webp"



const { t } = useI18n({ useScope: 'global' })
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
          <Icon icon="mdi:arrow-right" class="hero__btnIcon" />
        </span>
      </a>
      <a href="#promo-code" class="hero__btn hero__btn--ghost">
        <span class="hero__btnLabel">
          {{ t('header.promoCode') }}
        </span>
        <span class="hero__btnArrow" aria-hidden="true">
          <Icon icon="mdi:ticket-percent" class="hero__btnIcon" />
        </span>
      </a>
      <a href="#sign-in" class="hero__btn hero__btn--outline">
        <span class="hero__btnLabel">
          {{ t('header.signIn') }}
        </span>
        <span class="hero__btnArrow" aria-hidden="true">
          <Icon icon="mdi:login" class="hero__btnIcon" />
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
        <h2 class="info-card__title">MostBet Registration</h2>
        <p class="info-card__text">
          Access the MostBet register screen to quickly open a new account and claim a welcome bonus.
        </p>
        <p class="info-card__text">
          As soon as you register you can start betting at the sportsbook, where live betting on over 30 different sports is available, as well as free live streaming for active members.
        </p>
        <p class="info-card__text">
          Play at the MostBet Casino where you will find thousands of games to choose from.
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
        <h2 class="info-card__title">MostBet Promo Code</h2>
        <p class="info-card__text">
          Use the MostBet promo code HUGE when registering to get the biggest available welcome bonus.
        </p>
        <p class="info-card__text">
          A 150% deposit bonus can be claimed if you are registering with MostBet for the first time, with bonus offers available at the sportsbook and casino.
        </p>
        <p class="info-card__text">
          Use the promo code HUGE when completing the registration form to get your bonus.
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
        <h2 class="info-card__title">MostBet Login</h2>
        <p class="info-card__text">
          MostBet is available all over the world. Thousands of players are active at the sportsbook and casino every day.
        </p>
        <p class="info-card__text">
          You can access MostBet login on your computer or mobile device, or download the official mobile app.
        </p>
        <p class="info-card__text">
          Log in for instant access to the casino and sportsbook.
        </p>
        <a href="#sign-in" class="info-card__button info-card__button--primary">
          Log In
        </a>
      </div>
    </article>
  </section>

  <section class="info-table">
    <h2 class="info-table__title">
      Register at MostBet – Use HUGE for a 150% Bonus + Free Spins
    </h2>
    <h3 class="info-table__subtitle">
      MostBet Information
    </h3>
    <div class="info-table__wrapper">
      <table class="info-table__table">
        <tbody>
          <tr>
            <th>Website</th>
            <td><a href="#" class="info-table__link">MostBet.com</a></td>
          </tr>
          <tr>
            <th>Products</th>
            <td>Sports Betting, Casino, Live Casino, Aviator, Poker, Games</td>
          </tr>
          <tr>
            <th>Promo Code</th>
            <td><strong>HUGE</strong></td>
          </tr>
          <tr>
            <th>Deposit Bonus</th>
            <td>150% (must deposit within 15 minutes of registration otherwise 125%)</td>
          </tr>
          <tr>
            <th>Bonus Value</th>
            <td>Up to $300 plus up to 250 free spins</td>
          </tr>
          <tr>
            <th>Established</th>
            <td>2009</td>
          </tr>
          <tr>
            <th>Accepted Crypto</th>
            <td>Bitcoin, Dogecoin, Ethereum, Litecoin and others</td>
          </tr>
          <tr>
            <th>Currencies</th>
            <td>US Dollar, Canadian Dollar, Euros and many others</td>
          </tr>
          <tr>
            <th>Website Languages</th>
            <td>Over 25 including English, Spanish, Portuguese, Russian, Ukrainian, French, German and Italian</td>
          </tr>
          <tr>
            <th>Mobile App</th>
            <td>Yes – Downloads on Android and iOS available</td>
          </tr>
          <tr>
            <th>Live Support</th>
            <td>Yes</td>
          </tr>
          <tr>
            <th>Live Streaming</th>
            <td>Yes</td>
          </tr>
          <tr>
            <th>Minimum Deposit</th>
            <td>$1 or currency equivalent ($15 to claim welcome bonus)</td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>

  <section class="promo-info">
    <h2 class="promo-info__title">
      MostBet Promo Code Information
    </h2>
    <p class="promo-info__text">
      New players can use the MostBet promo code HUGE when registering.
    </p>
    <p class="promo-info__text">
      The code allows new players to get a 150% deposit bonus when making a deposit. Up to $300 in bonus money can be claimed by using this code when completing the registration form.
    </p>

    <h3 class="promo-info__subtitle">
      MostBet Code Summary
    </h3>
    <div class="promo-info__tableWrapper">
      <table class="promo-info__table">
        <thead>
          <tr>
            <th>Product</th>
            <th>Promo Code</th>
            <th>Bonus Offer</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>MostBet Sports</td>
            <td><strong>HUGE</strong></td>
            <td>$300</td>
          </tr>
          <tr>
            <td>MostBet Casino</td>
            <td><strong>HUGE</strong></td>
            <td>$300 plus 250 free spins</td>
          </tr>
        </tbody>
      </table>
    </div>

    <p class="promo-info__text">
      By using the promo code HUGE when registering a new account you will get the biggest available welcome bonus.
    </p>
    <p class="promo-info__text">
      Up to $300 or currency equivalent is available as a bonus. You can also claim free spins.
    </p>
    <p class="promo-info__text">
      Register and you can claim one of the biggest new customer bonus offers available at any online betting site.
    </p>
    <p class="promo-info__text">
      Claiming the MostBet bonus is quick and easy.
    </p>
    <p class="promo-info__text">
      Use the links on this page to visit the official MostBet website and click the ‘Sign Up’ button. Fill in the short registration form that appears on your screen.
      This form takes less than a minute to complete. On the form you will be asked if you have a promo code. Type in the HUGE code here.
    </p>
    <p class="promo-info__text">
      You can then get the bonus and start placing your bets!
    </p>

    <p class="promo-info__text">
      There are several ways to start betting, including:
    </p>
    <ul class="promo-info__list">
      <li><strong>Quick registration:</strong> Click the ‘Sign Up’ button to quickly open an account.</li>
      <li><strong>Register via mobile phone:</strong> Enter your mobile number when registering.</li>
      <li><strong>Register via email:</strong> Provide an email address when registering.</li>
      <li><strong>Register via social media:</strong> You can link your Google, Telegram, Twitter/X or Facebook account to your MostBet account.</li>
    </ul>
  </section>

  <section class="official-info">
    <h2 class="official-info__title">
      MostBet Official Website
    </h2>
    <p class="official-info__text">
      MostBet is available worldwide, offering online sports betting, live streaming, casino games and lots more to players in many different countries.
    </p>
    <p class="official-info__text">
      MostBet is licensed and accepts players from Canada and Latin America, as well as Africa, Asia, many European countries and elsewhere.
    </p>
    <p class="official-info__text">
      As soon as you complete the MostBet registration process, you will be able to bet on over 30 different sports. As an active player, you can also enjoy free live streaming sport on many sports.
    </p>
    <p class="official-info__text">
      The MostBet casino is home to thousands of different games.
    </p>
    <p class="official-info__text">
      As MostBet is a crypto-friendly betting site, you can deposit and bet using Bitcoin and other crypto coins, in addition to numerous other payment methods.
    </p>
    <p class="official-info__text">
      The sportsbook and casino are both available on PC and mobile and in multiple languages, while a dedicated mobile app is also available to players.
    </p>
    <p class="official-info__text">
      The MostBet promo code is HUGE. New players should use this code when opening an account to claim the biggest bonus offer. Up to $300 bonus is available!
    </p>

    <h3 class="official-info__subtitle">
      MostBet Payment Methods
    </h3>
    <p class="official-info__text">
      You can fund your account in lots of different ways. You can deposit with crypto, credit cards, debit cards and many other payment methods.
    </p>
    <p class="official-info__text">
      Popular deposit options with MostBet players are:
    </p>
    <ul class="official-info__list">
      <li>Mastercard</li>
      <li>Visa</li>
      <li>Bitcoin</li>
      <li>Ethereum</li>
      <li>Litecoin</li>
      <li>ecoPayz</li>
      <li>Google Pay</li>
      <li>WebMoney</li>
      <li>QIWI</li>
    </ul>
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
  align-items: center;
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

