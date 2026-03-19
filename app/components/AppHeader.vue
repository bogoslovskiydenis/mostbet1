<script setup lang="ts">
import { computed, ref } from 'vue'

type NavItem = { key: string; href: string }
type LocaleCode = string

type NavbarLink = { label: string; href: string }
type NavbarLocaleSettings = {
  brandText?: string
  logoUrl?: string
  links?: NavbarLink[]
  signInLabel?: string
  signInHref?: string
}

type PageItem = {
  slug: string
  title: string
  content: string
}

const nav: NavItem[] = [
  { key: 'header.register', href: '#register' },
  { key: 'header.promoCode', href: '#promo-code' },
  { key: 'header.app', href: '#app' },
  { key: 'header.review', href: '#review' },
  { key: 'header.payments', href: '#payments' },
]

const { locale, setLocale } = useAppLocale()
const { th } = useLocaleMessages()

const { data: serverLocales } = useFetch<{ code: string; name: string }[]>('/api/locales')

const isOpen = ref(false)
const toggle = () => (isOpen.value = !isOpen.value)
const close = () => (isOpen.value = false)

const isLangOpen = ref(false)
const toggleLang = () => (isLangOpen.value = !isLangOpen.value)
const closeLang = () => (isLangOpen.value = false)
const selectLang = async (code: LocaleCode) => {
  await setLocale(code)
  isLangOpen.value = false
}

const { data: navbarPage } = useFetch<PageItem | null>('/api/admin/pages', {
  query: { slug: '_sys_navbar' },
})

const navbarSettings = computed<Partial<Record<LocaleCode, NavbarLocaleSettings>>>(() => {
  const raw = navbarPage.value?.content || ''
  if (!raw) {
    return {}
  }
  try {
    return JSON.parse(raw) as Partial<Record<LocaleCode, NavbarLocaleSettings>>
  } catch {
    return {}
  }
})

const currentNavbar = computed<NavbarLocaleSettings>(() => navbarSettings.value[locale.value] || {})
const brandText = computed(() => currentNavbar.value.brandText || 'MOSTBET')
const logoUrl = computed(() => currentNavbar.value.logoUrl || '')

const navLinks = computed(() => {
  const custom = currentNavbar.value.links || []
  if (custom.length) {
    return custom
  }
  return nav.map((x) => ({ label: th(x.key), href: x.href }))
})

const signInLabel = computed(() => currentNavbar.value.signInLabel || th('header.signIn'))
const signInHref = computed(() => {
  const raw = currentNavbar.value.signInHref || '#sign-in'
  if (!raw.startsWith('#') && !raw.startsWith('/') && !raw.startsWith('http')) {
    return `https://${raw}`
  }
  return raw
})
const signInExternal = computed(() => signInHref.value.startsWith('http'))

const burgerLabel = computed(() => (isOpen.value ? 'Close menu' : 'Open menu'))
const currentLangLabel = computed(() => {
  const found = serverLocales.value?.find(x => x.code === locale.value)
  return (found?.code || locale.value || 'en').toUpperCase()
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
        <img
          v-if="logoUrl"
          class="header__brandLogo"
          :src="logoUrl"
          :alt="brandText"
        >
        <span v-else class="header__brandText">{{ brandText }}</span>
      </NuxtLink>

      <nav class="header__nav" aria-label="Primary">
        <a v-for="item in navLinks" :key="item.href + item.label" class="header__link" :href="item.href">
          {{ item.label }}
        </a>
      </nav>

      <div class="header__right">
        <button class="header__lang" type="button" aria-label="Language" @click="toggleLang">
          <span class="header__langText">{{ currentLangLabel }}</span>
        </button>
        <a
          class="header__signin"
          :href="signInHref"
          :target="signInExternal ? '_blank' : undefined"
          :rel="signInExternal ? 'noopener noreferrer' : undefined"
        >{{ signInLabel }}</a>

        <div v-if="isLangOpen" class="langDropdown">
          <div class="langDropdown__header">
            <span class="langDropdown__title">
              {{ th('header.selectLanguage') }}
            </span>
            <button class="langDropdown__close" type="button" aria-label="Close" @click="closeLang">
              ✕
            </button>
          </div>
          <div class="langDropdown__list">
            <button
              v-for="item in (serverLocales || [])"
              :key="item.code"
              type="button"
              class="langDropdown__item"
              :class="{ 'langDropdown__item--active': item.code === locale }"
              @click="selectLang(item.code)"
            >
              <span class="langDropdown__label">{{ item.name || item.code }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-show="isOpen" class="header__mobile">
      <nav class="header__mobileNav" aria-label="Mobile primary">
        <a
          v-for="item in navLinks"
          :key="item.href + item.label"
          class="header__mobileLink"
          :href="item.href"
          @click="close"
        >
          {{ item.label }}
        </a>
        <a
          class="header__mobileLink header__mobileLink--accent"
          :href="signInHref"
          :target="signInExternal ? '_blank' : undefined"
          :rel="signInExternal ? 'noopener noreferrer' : undefined"
          @click="close"
        >
          {{ signInLabel }}
        </a>
      </nav>
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
}

.header__brandText {
  font-weight: 800;
  letter-spacing: 0.06em;
  font-size: 14px;
}

.header__brandLogo {
  height: 22px;
  width: auto;
  display: block;
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
  position: relative;
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

.langDropdown {
  position: absolute;
  right: 0;
  top: calc(100% + 8px);
  width: 260px;
  padding: 10px 10px 8px;
  border-radius: 14px;
  background: #fff;
  box-shadow: 0 18px 40px rgba(0, 0, 0, 0.45);
  color: #0b1a2e;
  z-index: 60;
}

.langDropdown__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding-bottom: 6px;
  border-bottom: 1px solid rgba(9, 22, 43, 0.08);
}

.langDropdown__title {
  font-size: 13px;
  font-weight: 700;
}

.langDropdown__close {
  border: none;
  background: transparent;
  width: 24px;
  height: 24px;
  border-radius: 999px;
  cursor: pointer;
}

.langDropdown__list {
  margin-top: 6px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.langDropdown__item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 8px;
  border-radius: 10px;
  border: 1px solid transparent;
  background: transparent;
  cursor: pointer;
  font-size: 13px;
  width: 100%;
}

.langDropdown__item--active {
  background: rgba(16, 116, 255, 0.06);
  border-color: rgba(16, 116, 255, 0.45);
}

.langDropdown__flag {
  font-size: 16px;
}

.langDropdown__label {
  white-space: nowrap;
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

