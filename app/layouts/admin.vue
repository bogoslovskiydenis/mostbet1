<template>
  <div class="admin-layout">
    <aside class="admin-layout__sidebar">
      <nav class="admin-layout__nav">
        <NuxtLink to="/admin" class="admin-layout__link">
          Панель
        </NuxtLink>
      </nav>
    </aside>

    <main class="admin-layout__content">
      <slot />
    </main>
  </div>
</template>

<style scoped>
.admin-layout {
  display: flex;
  min-height: 100vh;
}

.admin-layout__sidebar {
  width: 220px;
  padding: 16px;
  border-right: 1px solid #e5e5e5;
  background: #0b1a2e;
}

.admin-layout__nav {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.admin-layout__link {
  display: block;
  padding: 8px 10px;
  border-radius: 6px;
  color: #ffffff;
  text-decoration: none;
  font-size: 14px;
}

.admin-layout__link.router-link-active {
  background: #1f3658;
}

.admin-layout__content {
  flex: 1;
  padding: 24px;
}
</style>

