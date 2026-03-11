<script setup lang="ts">
import { useI18n } from '#imports'
import banner from "../assets/images/main/banner_img.webp"
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
        <span class="hero__btnArrow" aria-hidden="true">›</span>
      </a>
      <a href="#sign-in" class="hero__btn hero__btn--ghost">
        <span class="hero__btnLabel">
          {{ t('header.signIn') }}
        </span>
        <span class="hero__btnArrow" aria-hidden="true">›</span>
      </a>
      <a href="#promo-code" class="hero__btn hero__btn--outline">
        <span class="hero__btnLabel">
          {{ t('header.promoCode') }}
        </span>
        <span class="hero__btnArrow" aria-hidden="true">›</span>
      </a>
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

.hero__media {
  display: flex;
  justify-content: center;
}

.hero__image {
  max-width: 100%;
  height: auto;
  display: block;
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

