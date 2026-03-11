<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'

type NavItem = { label: string; href: string }
type LangItem = { code: string; label: string }

const nav: NavItem[] = [
  { label: 'Register', href: '#register' },
  { label: 'Promo Code', href: '#promo-code' },
  { label: 'App', href: '#app' },
  { label: 'Review', href: '#review' },
  { label: 'Payments', href: '#payments' },
]

const languages: LangItem[] = [
  { code: 'en', label: 'English' },
  { code: 'ru', label: 'Русский' },
  { code: 'de', label: 'Deutsch' },
  { code: 'es', label: 'Español' },
  { code: 'fr', label: 'Français' },
]

const { locale } = useI18n()

const isOpen = ref(false)
const toggle = () => (isOpen.value = !isOpen.value)
const close = () => (isOpen.value = false)

const isLangOpen = ref(false)
const openLang = () => (isLangOpen.value = true)
const closeLang = () => (isLangOpen.value = false)
const selectLang = (code: string) => {
  locale.value = code
  isLangOpen.value = false
}

const burgerLabel = computed(() => (isOpen.value ? 'Close menu' : 'Open menu'))
const currentLangLabel = computed(() => {
  const found = languages.find((x) => x.code === locale.value)
  return found?.code.toUpperCase() ?? 'EN'
})
</script>

<template>
  <header class="header">
    <div class="header__inner">
      <button class="header__burger" type="button" :aria-label="burgerLabel" @click="toggle">
        <span class="header__burgerIcon" aria-hidden="true" />
      </button>

      <NuxtLink to="/" class="header__brand" aria-label="MostBet home">
        <span class="header__brandText">MOSTBET</span>
      </NuxtLink>

      <nav class="header__nav" aria-label="Primary">
        <a v-for="item in nav" :key="item.label" class="header__link" :href="item.href">
          {{ item.label }}
        </a>
      </nav>

      <div class="header__right">
        <button class="header__lang" type="button" aria-label="Language" @click="openLang">
          <span class="header__langText">{{ currentLangLabel }}</span>
        </button>
        <a class="header__signin" href="#sign-in">Sign in</a>
      </div>
    </div>

    <div v-if="isOpen" class="header__mobile">
      <nav class="header__mobileNav" aria-label="Mobile primary">
        <a
          v-for="item in nav"
          :key="item.label"
          class="header__mobileLink"
          :href="item.href"
          @click="close"
        >
          {{ item.label }}
        </a>
        <a class="header__mobileLink header__mobileLink--accent" href="#sign-in" @click="close">
          Sign in
        </a>
      </nav>
    </div>
    <div v-if="isLangOpen" class="langModal">
      <div class="langModal__backdrop" @click="closeLang" />
      <div class="langModal__panel" role="dialog" aria-modal="true">
        <div class="langModal__header">
          <span class="langModal__title">Select your language</span>
          <button class="langModal__close" type="button" aria-label="Close" @click="closeLang">
            ✕
          </button>
        </div>
        <div class="langModal__grid">
          <button
            v-for="item in languages"
            :key="item.code"
            type="button"
            class="langModal__item"
            :class="{ 'langModal__item--active': item.code === locale }"
            @click="selectLang(item.code)"
          >
            <span class="langModal__dot" />
            <span class="langModal__label">{{ item.label }}</span>
          </button>
        </div>
      </div>
    </div>
  </header>
</template>

