<script setup lang="ts">
const route = useRoute()

const isHomeSectionActive = computed(
  () => route.path.startsWith('/admin/home') || route.path.startsWith('/admin/news') || route.path.startsWith('/admin/pages'),
)

function logout() {
  try {
    navigator.sendBeacon?.('/api/admin/logout')
  } catch {
    // ignore
  }

  try {
    fetch('/api/admin/logout', { method: 'GET', keepalive: true }).catch(() => {})
  } catch {
    // ignore
  }

  try {
    void navigateTo('/', { external: true })
  } catch {
    window.location.assign('/')
  }
}
</script>

<template>
  <div class="admin-layout">
    <aside class="admin-layout__sidebar">
      <nav class="admin-layout__nav">
        <div class="admin-layout__section">
          <NuxtLink
            to="/admin/home"
            class="admin-layout__link"
            :class="{ 'admin-layout__link--active': isHomeSectionActive }"
          >
          Главная
          </NuxtLink>
          <NuxtLink to="/admin/news" class="admin-layout__sublink">
            News
          </NuxtLink>
          <NuxtLink to="/admin/pages" class="admin-layout__sublink">
            Promo Code
          </NuxtLink>
        </div>

        <NuxtLink to="/admin/navbar" class="admin-layout__link">
          Navbar
        </NuxtLink>
        <NuxtLink to="/admin/footer" class="admin-layout__link">
          Footer
        </NuxtLink>
        <NuxtLink to="/admin/locales" class="admin-layout__link">
          Языки
        </NuxtLink>
      </nav>

      <button type="button" class="admin-layout__logout" @click="logout">
        Выйти
      </button>
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

.admin-layout__section {
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

.admin-layout__link--active {
  background: #1f3658;
}

.admin-layout__sublink {
  display: block;
  padding: 8px 10px 8px 26px;
  border-radius: 6px;
  color: #ffffff;
  text-decoration: none;
  font-size: 13px;
}

.admin-layout__sublink.router-link-active {
  background: #1f3658;
}

.admin-layout__content {
  flex: 1;
  padding: 24px;
}

.admin-layout__logout {
  margin-top: 16px;
  width: 100%;
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 8px;
  padding: 8px 10px;
  background: rgba(255, 255, 255, 0.06);
  cursor: pointer;
  font-size: 13px;
  text-align: left;
}

.admin-layout__logout:hover {
  background: rgba(255, 255, 255, 0.1);
}
</style>

