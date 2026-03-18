export const useLocaleMessages = () => {
  const { locale } = useAppLocale()

  const { data } = useFetch<Record<string, string>>(
    () => `/api/locales/${locale.value}`,
    { watch: [locale] },
  )

  const th = (key: string): string => data.value?.[key] ?? key

  return { th }
}
