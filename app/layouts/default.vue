<script setup lang="ts">
import AppHeader from '~/components/AppHeader.vue'
import { useI18n } from '#imports'

const { t } = useI18n({ useScope: 'global' })
</script>

<template>
  <div class="app-shell">
    <AppHeader />
    <main class="app-main">
      <slot />
    </main>

    <footer class="footer">
      <div class="footer__top">
        <div class="footer__brand">
          <span class="footer__logo">
            MOSTBET
          </span>
          <p class="footer__text">
            Copyright © 2026 MostBet.
          </p>
        </div>
        <nav class="footer__nav" aria-label="Footer navigation">
          <a href="#register" class="footer__link">
            {{ t('header.register') }}
          </a>
          <a href="#promo-code" class="footer__link">
            {{ t('header.promoCode') }}
          </a>
          <a href="#app" class="footer__link">
            {{ t('header.app') }}
          </a>
          <a href="#review" class="footer__link">
            {{ t('header.review') }}
          </a>
          <a href="#payments" class="footer__link">
            {{ t('header.payments') }}
          </a>
          <a href="#sign-in" class="footer__link footer__link--accent">
            {{ t('header.signIn') }}
          </a>
        </nav>
      </div>
      <p class="footer__legal">
        {{ t('home.footer.legal') }}
      </p>
    </footer>
  </div>
</template>

<style scoped>
.app-main {
  max-width: var(--container);
  margin: 0 auto;
  padding: 0 20px 40px;
}

.footer {
  margin-top: 64px;
  margin-left: calc(50% - 50vw);
  margin-right: calc(50% - 50vw);
  padding: 32px 16px 40px;
  background: #050b19;
  color: #b8c1d1;
  font-size: 12px;
}

.footer__top {
  max-width: var(--container);
  margin: 0 auto 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.footer__brand {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.footer__logo {
  font-weight: 800;
  letter-spacing: 0.16em;
  font-size: 14px;
  color: #fff;
}

.footer__text {
  margin: 0;
}

.footer__nav {
  display: flex;
  flex-wrap: wrap;
  gap: 10px 16px;
  font-size: 13px;
}

.footer__link {
  color: #b8c1d1;
}

.footer__link--accent {
  font-weight: 700;
  color: #fff;
}

.footer__legal {
  max-width: var(--container);
  margin: 0 auto;
  line-height: 1.4;
}

@media (max-width: 599px) {
  .footer__top {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>


