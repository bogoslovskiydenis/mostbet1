<script setup lang="ts">
import { useI18n } from '#imports'

const { t } = useI18n({ useScope: 'global' })
</script>

<template>
  <section>
    <h1 style="margin: 0 0 12px; font-size: 34px; letter-spacing: -0.02em">
      {{ t('hero.title') }}
    </h1>
    <p style="margin: 0; color: rgba(255, 255, 255, 0.75); max-width: 640px">
      {{ t('hero.subtitle') }}
    </p>
  </section>
</template>

