<script setup lang="ts">
import { computed, ref } from 'vue'

type NavItem = { key: string; href: string }
type LocaleCode = 'en' | 'ru' | 'de' | 'es' | 'fr'
type LangItem = { code: LocaleCode; label: string }

const nav: NavItem[] = [
  { key: 'header.register', href: '#register' },
  { key: 'header.promoCode', href: '#promo-code' },
  { key: 'header.app', href: '#app' },
  { key: 'header.review', href: '#review' },
  { key: 'header.payments', href: '#payments' },
]

const languages: LangItem[] = [
  { code: 'en', label: 'English' },
  { code: 'ru', label: 'Русский' },
  { code: 'de', label: 'Deutsch' },
  { code: 'es', label: 'Español' },
  { code: 'fr', label: 'Français' },
]

const { locale, t, setLocale } = useI18n({ useScope: 'global' })

const isOpen = ref(false)
const toggle = () => (isOpen.value = !isOpen.value)
const close = () => (isOpen.value = false)

const isLangOpen = ref(false)
const openLang = () => (isLangOpen.value = true)
const closeLang = () => (isLangOpen.value = false)
const selectLang = async (code: LocaleCode) => {
  await setLocale(code)
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
      <button
        class="header__burger"
        :class="{ 'header__burger--open': isOpen }"
        type="button"
        :aria-label="burgerLabel"
        @click="toggle"
      >
        <span class="header__burgerIcon" aria-hidden="true">
          <span class="header__burgerLine" />
          <span class="header__burgerLine" />
          <span class="header__burgerLine" />
        </span>
      </button>

      <NuxtLink to="/" class="header__brand" aria-label="MostBet home">
        <span class="header__brandText">MOSTBET</span>
      </NuxtLink>

      <nav class="header__nav" aria-label="Primary">
        <a v-for="item in nav" :key="item.key" class="header__link" :href="item.href">
          {{ t(item.key) }}
        </a>
      </nav>

      <div class="header__right">
        <button class="header__lang" type="button" aria-label="Language" @click="openLang">
          <span class="header__langText">{{ currentLangLabel }}</span>
        </button>
        <a class="header__signin" href="#sign-in">{{ t('header.signIn') }}</a>
      </div>
    </div>

    <div v-show="isOpen" class="header__mobile">
      <nav class="header__mobileNav" aria-label="Mobile primary">
        <a
          v-for="item in nav"
          :key="item.key"
          class="header__mobileLink"
          :href="item.href"
          @click="close"
        >
          {{ t(item.key) }}
        </a>
        <a class="header__mobileLink header__mobileLink--accent" href="#sign-in" @click="close">
          {{ t('header.signIn') }}
        </a>
      </nav>
    </div>
    <div v-if="isLangOpen" class="langModal">
      <div class="langModal__panel" role="dialog" aria-modal="true">
        <div class="langModal__header">
          <span class="langModal__title">{{ t('header.selectLanguage') }}</span>
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

<style scoped>
.header {
  position: sticky;
  top: 0;
  z-index: 50;
  backdrop-filter: saturate(120%) blur(8px);
  background: linear-gradient(180deg, rgba(7, 31, 68, 0.92) 0%, rgba(7, 31, 68, 0.76) 100%);
  border-bottom: 1px solid var(--line);
}

.header__inner {
  max-width: var(--container);
  margin: 0 auto;
  padding: 12px 16px;
  display: flex;
  align-items: center;
  gap: 16px;
}

.header__burger {
  width: 40px;
  height: 40px;
  border: 1px solid var(--line);
  border-radius: 10px;
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.header__burgerIcon {
  width: 18px;
  height: 14px;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.header__burgerLine {
  display: block;
  width: 100%;
  height: 2px;
  background: var(--text);
  border-radius: 2px;
  transform-origin: center;
  transition: transform 0.25s ease, opacity 0.25s ease;
}

.header__burger--open .header__burgerLine:nth-child(1) {
  transform: translateY(6px) rotate(45deg);
}

.header__burger--open .header__burgerLine:nth-child(2) {
  opacity: 0;
  transform: scaleX(0);
}

.header__burger--open .header__burgerLine:nth-child(3) {
  transform: translateY(-6px) rotate(-45deg);
}

.header__brand {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 140px;
}

.header__brandText {
  font-weight: 800;
  letter-spacing: 0.06em;
  font-size: 14px;
}

.header__nav {
  display: none;
  align-items: center;
  gap: 18px;
  flex: 1;
}

.header__link {
  padding: 10px 8px;
  color: var(--muted);
  font-size: 14px;
  font-weight: 600;
  border-radius: 10px;
}

.header__link:hover {
  color: var(--text);
  background: rgba(255, 255, 255, 0.06);
}

.header__right {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 10px;
}

.header__lang {
  height: 40px;
  padding: 0 10px;
  border-radius: 10px;
  border: 1px solid var(--line);
  background: transparent;
  cursor: pointer;
}

.header__langText {
  font-weight: 700;
  font-size: 12px;
  letter-spacing: 0.06em;
}

.header__signin {
  height: 40px;
  display: inline-flex;
  align-items: center;
  padding: 0 14px;
  border-radius: 10px;
  border: 1px solid rgba(255, 106, 0, 0.55);
  background: linear-gradient(180deg, var(--accent2) 0%, var(--accent) 100%);
  font-weight: 800;
  font-size: 13px;
  color: #0b1a2e;
}

.header__mobile {
  border-top: 1px solid var(--line);
  padding: 10px 16px 14px;
  overflow: hidden;
  transition: opacity 0.22s ease, transform 0.22s ease;
}

.header__mobile[style*='display: none'] {
  pointer-events: none;
}

.header__burger:not(.header__burger--open) ~ .header__mobile {
  opacity: 0;
  transform: translateY(-6px);
}

.header__mobileNav {
  max-width: var(--container);
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.header__mobileLink {
  padding: 12px 12px;
  border: 1px solid var(--line);
  border-radius: 12px;
  color: var(--muted);
  font-weight: 700;
}

.header__mobileLink--accent {
  border-color: rgba(255, 106, 0, 0.55);
  color: var(--text);
}

.header__mobileLink:hover {
  color: var(--text);
}

.langModal {
  position: fixed;
  inset: 0;
  z-index: 80;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 80px 16px 24px;
}

.langModal__panel {
  position: relative;
  max-width: 820px;
  width: 100%;
  max-height: 520px;
  background: #fff;
  border-radius: 20px;
  padding: 18px 20px 20px;
  box-shadow: 0 24px 80px rgba(0, 0, 0, 0.5);
  color: #0b1a2e;
  overflow: hidden;
}

.langModal__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding-bottom: 10px;
  border-bottom: 1px solid rgba(9, 22, 43, 0.08);
}

.langModal__title {
  font-size: 16px;
  font-weight: 700;
}

.langModal__close {
  border: none;
  background: transparent;
  width: 32px;
  height: 32px;
  border-radius: 999px;
  cursor: pointer;
}

.langModal__grid {
  margin-top: 10px;
  padding-right: 6px;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 4px 16px;
  max-height: 430px;
  overflow: auto;
}

.langModal__item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 10px;
  border-radius: 999px;
  border: 1px solid transparent;
  background: transparent;
  cursor: pointer;
  font-size: 13px;
}

.langModal__item--active {
  background: rgba(16, 116, 255, 0.08);
  border-color: rgba(16, 116, 255, 0.5);
}

.langModal__dot {
  width: 8px;
  height: 8px;
  border-radius: 999px;
  background: #1074ff;
}

.langModal__item--active .langModal__dot {
  box-shadow: 0 0 0 4px rgba(16, 116, 255, 0.18);
}

.langModal__label {
  white-space: nowrap;
}

@media (max-width: 640px) {
  .langModal {
    align-items: flex-end;
    padding: 0 0 12px;
  }

  .langModal__panel {
    max-width: 100%;
    border-radius: 16px 16px 0 0;
  }

  .langModal__grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}


@media (min-width: 1024px) {
  .header__burger {
    display: none;
  }

  .header__nav {
    display: flex;
  }

  .header__brandText {
    font-size: 15px;
  }

  .header__mobile {
    display: none;
  }
}
</style>

