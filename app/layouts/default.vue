<template>
  <div class="app-shell">
    <AppHeader />
    <main class="app-main">
      <slot />
    </main>
  </div>
</template>

<style scoped>
.app-main {
  max-width: var(--container);
  margin: 0 auto;
}
</style>

