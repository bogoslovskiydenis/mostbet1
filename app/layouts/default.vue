<script setup lang="ts">
import AppHeader from '~/components/AppHeader.vue'

const { th } = useLocaleMessages()
const route = useRoute()

type FooterSettings = {
  brandText?: string
  copyrightText?: string
  legalText?: string
}
type NavbarLink = {
  label: string
  href: string
}
type NavbarLocaleSettings = {
  links?: NavbarLink[]
  signInLabel?: string
  signInHref?: string
}

type PageItem = {
  slug: string
  title: string
  content: string
}

type SeoSettings = {
  metaTitle?: string
  metaDescription?: string
  metaKeywords?: string
  metaRobots?: string
  canonicalBaseUrl?: string
  canonicalUrl?: string
  faviconUrl?: string
  ogTitle?: string
  ogDescription?: string
  ogImage?: string
}

const { data: footerPage } = useFetch<PageItem | null>('/api/admin/pages', {
  query: { slug: '_sys_footer' },
})
const { data: navbarPage } = useFetch<PageItem | null>('/api/admin/pages', {
  query: { slug: '_sys_navbar' },
})
const { data: seoPage } = useFetch<PageItem | null>('/api/admin/pages', {
  query: { slug: '_sys_seo' },
})

const footerSettings = computed<FooterSettings>(() => {
  const raw = footerPage.value?.content || ''
  if (!raw) {
    return {}
  }
  try {
    return JSON.parse(raw) as FooterSettings
  } catch {
    return {}
  }
})

const footerBrandText = computed(() => footerSettings.value.brandText || 'MOSTBET')
const footerCopyright = computed(() => footerSettings.value.copyrightText || 'Copyright © 2026 MostBet.')
const footerLegal = computed(() => footerSettings.value.legalText || th('home.footer.legal'))
const { locale } = useAppLocale()

const navbarSettings = computed<Partial<Record<string, NavbarLocaleSettings>>>(() => {
  const raw = navbarPage.value?.content || ''
  if (!raw) return {}
  try {
    return JSON.parse(raw) as Partial<Record<string, NavbarLocaleSettings>>
  } catch {
    return {}
  }
})

const footerNavLinks = computed<NavbarLink[]>(() => {
  const current = navbarSettings.value[locale.value] || {}
  if (current.links?.length) return current.links
  return [
    { label: th('header.register'), href: '#register' },
    { label: th('header.promoCode'), href: '#promo-code' },
    { label: th('header.app'), href: '#app' },
    { label: th('header.review'), href: '#review' },
    { label: th('header.payments'), href: '#payments' },
  ]
})
const footerSignInLabel = computed(() => {
  const current = navbarSettings.value[locale.value] || {}
  return current.signInLabel || th('header.signIn')
})
const footerSignInHref = computed(() => {
  const current = navbarSettings.value[locale.value] || {}
  const raw = current.signInHref || '#sign-in'
  if (!raw.startsWith('#') && !raw.startsWith('/') && !raw.startsWith('http')) {
    return `https://${raw}`
  }
  return raw
})

const seoSettings = computed<SeoSettings>(() => {
  const raw = seoPage.value?.content || ''
  if (!raw) return {}
  try {
    return JSON.parse(raw) as SeoSettings
  } catch {
    return {}
  }
})

const canonicalHref = computed(() => {
  const canonicalUrl = seoSettings.value.canonicalUrl?.trim()
  if (canonicalUrl) return canonicalUrl
  const base = seoSettings.value.canonicalBaseUrl?.trim()
  if (!base) return ''
  const normalizedBase = base.replace(/\/+$/, '')
  const path = route.path === '/' ? '' : route.path
  return `${normalizedBase}${path}`
})

useHead(() => {
  const settings = seoSettings.value
  const metaTitle = settings.metaTitle?.trim() || undefined
  const metaDescription = settings.metaDescription?.trim() || undefined
  const metaKeywords = settings.metaKeywords?.trim() || undefined
  const metaRobots = settings.metaRobots?.trim() || undefined
  const ogTitle = settings.ogTitle?.trim() || metaTitle
  const ogDescription = settings.ogDescription?.trim() || metaDescription
  const ogImage = settings.ogImage?.trim() || undefined
  const faviconUrl = settings.faviconUrl?.trim() || undefined

  return {
    ...(metaTitle ? { title: metaTitle } : {}),
    meta: [
      ...(metaDescription ? [{ name: 'description', content: metaDescription }] : []),
      ...(metaKeywords ? [{ name: 'keywords', content: metaKeywords }] : []),
      ...(metaRobots ? [{ name: 'robots', content: metaRobots }] : []),
      ...(ogTitle ? [{ property: 'og:title', content: ogTitle }] : []),
      ...(ogDescription ? [{ property: 'og:description', content: ogDescription }] : []),
      ...(ogImage ? [{ property: 'og:image', content: ogImage }] : []),
    ],
    link: [
      ...(canonicalHref.value ? [{ rel: 'canonical', href: canonicalHref.value }] : []),
      ...(faviconUrl ? [{ rel: 'icon', href: faviconUrl }] : []),
    ],
  }
})
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
            {{ footerBrandText }}
          </span>
          <p class="footer__text">
            {{ footerCopyright }}
          </p>
        </div>
        <nav class="footer__nav" aria-label="Footer navigation">
          <a
            v-for="item in footerNavLinks"
            :key="item.href + item.label"
            :href="item.href"
            class="footer__link"
          >
            {{ item.label }}
          </a>
          <a
            :href="footerSignInHref"
            class="footer__link footer__link--accent"
            :target="footerSignInHref.startsWith('http') ? '_blank' : undefined"
            :rel="footerSignInHref.startsWith('http') ? 'noopener noreferrer' : undefined"
          >
            {{ footerSignInLabel }}
          </a>
        </nav>
      </div>
      <p class="footer__legal">
        {{ footerLegal }}
      </p>
    </footer>
  </div>
</template>

<style scoped>
.app-shell {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-main {
  flex: 1;
  max-width: var(--container);
  width: 100%;
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


