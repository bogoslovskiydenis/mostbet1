const COOKIE_KEY = 'locale'

export const useAppLocale = () => {
  const cookie = useCookie(COOKIE_KEY, { maxAge: 365 * 24 * 3600 })
  const locale = useState<string>('app-locale', () => cookie.value || 'en')

  const setLocale = (code: string) => {
    locale.value = code
    cookie.value = code
  }

  return { locale: computed(() => locale.value), setLocale }
}
