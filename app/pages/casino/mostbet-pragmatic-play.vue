<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { useI18n } from '#imports'
import pragmaticBanner from '~/assets/images/main/Pragmatic-Play-Drops-and-Wins-2026.jpg'

const { t } = useI18n({ useScope: 'global' })

const bulletKeys = [
  'pragmatic.bullets.0',
  'pragmatic.bullets.1',
  'pragmatic.bullets.2',
  'pragmatic.bullets.3',
]

const eventStepKeys = [
  'pragmatic.event.steps.0',
  'pragmatic.event.steps.1',
  'pragmatic.event.steps.2',
  'pragmatic.event.steps.3',
  'pragmatic.event.steps.4',
]

const dailyRewardKeys = [
  'pragmatic.dailyRewards.0',
  'pragmatic.dailyRewards.1',
  'pragmatic.dailyRewards.2',
  'pragmatic.dailyRewards.3',
  'pragmatic.dailyRewards.4',
  'pragmatic.dailyRewards.5',
]

const slotKeys = [
  'pragmatic.slots.list.0',
  'pragmatic.slots.list.1',
  'pragmatic.slots.list.2',
  'pragmatic.slots.list.3',
  'pragmatic.slots.list.4',
  'pragmatic.slots.list.5',
  'pragmatic.slots.list.6',
  'pragmatic.slots.list.7',
  'pragmatic.slots.list.8',
  'pragmatic.slots.list.9',
]

const termKeys = [
  'pragmatic.terms.list.0',
  'pragmatic.terms.list.1',
  'pragmatic.terms.list.2',
  'pragmatic.terms.list.3',
  'pragmatic.terms.list.4',
  'pragmatic.terms.list.5',
  'pragmatic.terms.list.6',
  'pragmatic.terms.list.7',
  'pragmatic.terms.list.8',
  'pragmatic.terms.list.9',
]
</script>

<template>
  <main class="pragmatic">
    <header class="pragmatic__header">
      <nav class="pragmatic__breadcrumbs">
        <NuxtLink to="/" class="pragmatic__crumb pragmatic__crumb--home">
          <Icon icon="mdi:home-outline" class="pragmatic__homeIcon" />
          <span>{{ t('pragmatic.breadcrumbs.home') }}</span>
        </NuxtLink>
        <span class="pragmatic__crumb pragmatic__crumb--sep">
          /
        </span>
        <span class="pragmatic__crumb">
          {{ t('pragmatic.breadcrumbs.casino') }}
        </span>
        <span class="pragmatic__crumb pragmatic__crumb--sep">
          /
        </span>
        <span class="pragmatic__crumb pragmatic__crumb--current">
          {{ t('pragmatic.breadcrumbs.current') }}
        </span>
      </nav>

      <h1 class="pragmatic__title">
        {{ t('pragmatic.title') }}
      </h1>

      <div class="pragmatic__meta">
        <span class="pragmatic__author">
          {{ t('pragmatic.author') }}
        </span>
        <span class="pragmatic__dot" />
        <span class="pragmatic__date">
          {{ t('pragmatic.date') }}
        </span>
        <button class="pragmatic__share" type="button">
          <Icon icon="mdi:share-variant" class="pragmatic__shareIcon" />
        </button>
      </div>
    </header>

    <section class="pragmatic__intro">
      <ul class="pragmatic__bullets">
        <li
          v-for="key in bulletKeys"
          :key="key"
        >
          {{ t(key) }}
        </li>
      </ul>
    </section>

    <section class="pragmatic__hero">
      <div class="pragmatic__heroImage">
        <img
          :src="pragmaticBanner"
          :alt="t('pragmatic.heroAlt')"
          loading="lazy"
        >
      </div>
    </section>

    <section class="pragmatic__content">
      <h2 class="pragmatic__sectionTitle">
        {{ t('pragmatic.event.title') }}
      </h2>
      <p class="pragmatic__text">
        {{ t('pragmatic.event.p1') }}
      </p>
      <p class="pragmatic__text">
        {{ t('pragmatic.event.p2') }}
      </p>
      <ol class="pragmatic__list pragmatic__list--numbered">
        <li
          v-for="key in eventStepKeys"
          :key="key"
        >
          {{ t(key) }}
        </li>
      </ol>

      <h2 class="pragmatic__sectionTitle">
        {{ t('pragmatic.prizes.title') }}
      </h2>
      <p class="pragmatic__text">
        {{ t('pragmatic.prizes.p1') }}
      </p>

      <h3 class="pragmatic__subTitle">
        {{ t('pragmatic.prizes.weeklyTitle') }}
      </h3>
      <p class="pragmatic__text">
        {{ t('pragmatic.prizes.weeklyText') }}
      </p>

      <div class="pragmatic__tableWrapper">
        <table class="pragmatic__table">
          <thead>
            <tr>
              <th>{{ t('pragmatic.prizes.tableHeaderWinners') }}</th>
              <th>{{ t('pragmatic.prizes.tableHeaderReward') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td>x100,000</td>
            </tr>
            <tr>
              <td>3</td>
              <td>x10,000</td>
            </tr>
            <tr>
              <td>6</td>
              <td>x5,000</td>
            </tr>
            <tr>
              <td>10</td>
              <td>x1,000</td>
            </tr>
            <tr>
              <td>30</td>
              <td>x500</td>
            </tr>
            <tr>
              <td>50</td>
              <td>x100</td>
            </tr>
            <tr>
              <td>300</td>
              <td>x50</td>
            </tr>
            <tr>
              <td>7,500</td>
              <td>x10</td>
            </tr>
            <tr>
              <td>69,000</td>
              <td>x5</td>
            </tr>
            <tr>
              <td>5,000</td>
              <td>20 free spins</td>
            </tr>
            <tr>
              <td>15,000</td>
              <td>10 free spins</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p class="pragmatic__text">
        {{ t('pragmatic.prizes.p1') }}
      </p>

      <h3 class="pragmatic__subTitle">
        {{ t('pragmatic.prizes.dailyTitle') }}
      </h3>
      <p class="pragmatic__text">
        {{ t('pragmatic.prizes.dailyP1') }}
      </p>
      <p class="pragmatic__text">
        {{ t('pragmatic.prizes.dailyP2') }}
      </p>
      <p class="pragmatic__text">
        {{ t('pragmatic.prizes.dailyP3') }}
      </p>
      <ul class="pragmatic__list">
        <li
          v-for="key in dailyRewardKeys"
          :key="key"
        >
          {{ t(key) }}
        </li>
      </ul>

      <h2 class="pragmatic__sectionTitle">
        {{ t('pragmatic.slots.title') }}
      </h2>
      <p class="pragmatic__text">
        {{ t('pragmatic.slots.p1') }}
      </p>
      <ul class="pragmatic__list">
        <li
          v-for="key in slotKeys"
          :key="key"
        >
          {{ t(key) }}
        </li>
      </ul>

      <h2 class="pragmatic__sectionTitle">
        {{ t('pragmatic.terms.title') }}
      </h2>
      <p class="pragmatic__text">
        {{ t('pragmatic.terms.p1') }}
      </p>
      <ul class="pragmatic__list">
        <li
          v-for="key in termKeys"
          :key="key"
        >
          {{ t(key) }}
        </li>
      </ul>
    </section>
  </main>
</template>

<style scoped>
.pragmatic {
  max-width: 960px;
  margin: 0 auto;
  padding: 32px 16px 80px;
}

.pragmatic__header {
  margin-bottom: 20px;
}

.pragmatic__breadcrumbs {
  margin-bottom: 10px;
  font-size: 12px;
  color: var(--muted);
  display: flex;
  align-items: center;
  gap: 4px;
}

.pragmatic__crumb {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.pragmatic__crumb--home {
  color: #fff;
  padding: 4px 10px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.08);
  text-decoration: none;
}

.pragmatic__homeIcon {
  font-size: 14px;
}

.pragmatic__crumb--current {
  color: #0b1a2e;
  font-weight: 600;
}

.pragmatic__title {
  margin: 0 0 12px;
  font-size: 26px;
  font-weight: 700;
}

.pragmatic__meta {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: var(--muted);
}

.pragmatic__dot {
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background: var(--muted);
}

.pragmatic__share {
  margin-left: auto;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 0;
  border: none;
  background: transparent;
  cursor: pointer;
}

.pragmatic__shareIcon {
  font-size: 18px;
}

.pragmatic__intro {
  margin-top: 16px;
}

.pragmatic__bullets {
  margin: 0 0 20px 18px;
  padding: 0;
  font-size: 14px;
  color: var(--muted);
}

.pragmatic__bullets li + li {
  margin-top: 6px;
}

.pragmatic__hero {
  margin-bottom: 24px;
}

.pragmatic__heroImage {
  width: 100%;
  border-radius: 16px;
  overflow: hidden;
}

.pragmatic__heroImage img {
  display: block;
  width: 100%;
  height: auto;
}

.pragmatic__sectionTitle {
  margin: 0 0 10px;
  font-size: 20px;
  font-weight: 700;
}

.pragmatic__text {
  margin: 0 0 12px;
  font-size: 14px;
  color: var(--muted);
}

.pragmatic__subTitle {
  margin: 18px 0 8px;
  font-size: 16px;
  font-weight: 700;
}

.pragmatic__list {
  margin: 0 0 14px 18px;
  padding: 0;
  font-size: 14px;
  color: var(--muted);
}

.pragmatic__list li + li {
  margin-top: 4px;
}

.pragmatic__list--numbered {
  list-style: decimal;
}

.pragmatic__tableWrapper {
  margin: 16px 0;
  overflow-x: auto;
}

.pragmatic__table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

.pragmatic__table th,
.pragmatic__table td {
  padding: 10px 12px;
  text-align: left;
}

.pragmatic__table thead th {
  background: #003366;
  color: #fff;
}

@media (max-width: 599px) {
  .pragmatic {
    padding-top: 20px;
  }

  .pragmatic__title {
    font-size: 22px;
  }
}
</style>

