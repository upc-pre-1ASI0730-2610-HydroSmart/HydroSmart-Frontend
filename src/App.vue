<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { RouterLink, RouterView } from 'vue-router'
import { useProfileStore } from './profiles/application/profile.store.js'

const { t, locale } = useI18n()
const now = ref(new Date())
const userName = computed(() => t('app.userName'))

const { profile, loadProfile } = useProfileStore()
const profileId = Number(import.meta.env.VITE_PROFILE_ID) || 1

const displayName = computed(() => profile.value?.fullName || userName.value)
const displayPhoto = computed(() => profile.value?.profilePhotoUrl || '')

let timerId
const formattedDate = computed(() => {
  return new Intl.DateTimeFormat(locale.value, {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  }).format(now.value)
})

const formattedTime = computed(() => {
  return new Intl.DateTimeFormat(locale.value, {
    hour: '2-digit',
    minute: '2-digit'
  }).format(now.value)
})

const toggleLocale = () => {
  locale.value = locale.value === 'es' ? 'en' : 'es'
}

const isEs = computed(() => locale.value === 'es')

onMounted(() => {
  timerId = window.setInterval(() => {
    now.value = new Date()
  }, 1000)

  loadProfile(profileId)
})

onUnmounted(() => {
  window.clearInterval(timerId)
})
</script>

<template>
  <div class="app-shell">
    <aside class="sidebar">
      <img class="sidebar__logo" src="/logo-hydrosmart.png" :alt="t('app.logoAlt')" />

      <nav class="sidebar__nav">
        <RouterLink class="nav-link" active-class="is-active" to="/dashboard">
          {{ t('app.dashboard') }}
        </RouterLink>
        <RouterLink class="nav-link" active-class="is-active" to="/profile">
          {{ t('app.profile') }}
        </RouterLink>
        <RouterLink class="nav-link" active-class="is-active" to="/devices">
          {{ t('app.devices') }}
        </RouterLink>
        <RouterLink class="nav-link" active-class="is-active" to="/reports">
          {{ t('app.reports') }}
        </RouterLink>
        <RouterLink class="nav-link" active-class="is-active" to="/settings">
          {{ t('app.settings') }}
        </RouterLink>
      </nav>

      <button class="nav-logout" type="button">
        {{ t('app.logout') }}
        <span class="nav-logout__icon" aria-hidden="true">⇦</span>
      </button>
    </aside>

    <main class="content">
      <header class="topbar">
        <div class="topbar__datetime">
          <span class="topbar__date">{{ formattedDate }}</span>
          <span class="topbar__time">{{ formattedTime }}</span>
        </div>

        <div class="topbar__actions">
          <span class="topbar__greeting">{{ t('app.greeting') }}, <strong>{{ displayName }}</strong></span>
          <button class="icon-button" type="button" :aria-label="t('app.notifications')">
            <svg class="icon-bell" viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M12 22a2.5 2.5 0 0 0 2.45-2h-4.9A2.5 2.5 0 0 0 12 22Zm6-6V11a6 6 0 1 0-12 0v5l-2 2v1h16v-1l-2-2Z"
                fill="currentColor"
              />
            </svg>
          </button>
          <img
            v-if="displayPhoto"
            class="avatar avatar--photo"
            :src="displayPhoto"
            :alt="displayName"
          />
          <div v-else class="avatar" role="img" :aria-label="t('app.avatarAlt')"></div>
          <button class="lang-toggle" type="button" @click="toggleLocale">
            <span :class="['lang-toggle__option', { 'is-active': isEs }]">{{ t('app.languageSwitchToEs') }}</span>
            <span class="lang-toggle__separator">|</span>
            <span :class="['lang-toggle__option', { 'is-active': !isEs }]">{{ t('app.languageSwitchToEn') }}</span>
          </button>
        </div>
      </header>

      <section class="content__body">
        <RouterView />
      </section>
    </main>
  </div>
</template>

<style scoped>
.app-shell {
  background-color: #ffffff;
  color: #0f172a;
  display: flex;
  min-height: 100vh;
}

.sidebar {
  border-right: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
  padding: 2.5rem 1.25rem 2rem;
  width: 230px;
}

.sidebar__logo {
  display: block;
  height: 88px;
  margin-bottom: 0.5rem;
  object-fit: contain;
  width: auto;
}

.sidebar__nav {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-top: 1rem;
}

.nav-link {
  border-radius: 999px;
  color: #0f172a;
  font-size: 1rem;
  font-weight: 600;
  padding: 0.65rem 1rem;
  text-decoration: none;
  width: 100%;
}

.nav-link.is-active {
  background-color: #0b1c3f;
  color: #ffffff;
}

.nav-logout {
  align-items: center;
  background: none;
  border: none;
  color: #0f172a;
  cursor: pointer;
  display: inline-flex;
  font-size: 1rem;
  font-weight: 600;
  gap: 0.5rem;
  margin-top: auto;
  padding: 0.65rem 1rem;
  text-align: left;
}

.nav-logout__icon {
  font-size: 1.1rem;
}

.content {
  flex: 1;
}

.topbar {
  align-items: center;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  padding: 1.25rem 2rem;
}

.topbar__datetime {
  align-items: center;
  color: #1e293b;
  display: flex;
  gap: 0.5rem;
  text-transform: capitalize;
}

.topbar__date {
  font-weight: 600;
}

.topbar__time {
  font-size: 0.95rem;
}

.topbar__actions {
  align-items: center;
  display: flex;
  gap: 0.75rem;
}

.topbar__greeting {
  font-weight: 600;
}

.icon-button {
  background: none;
  border: none;
  color: #0f172a;
  cursor: pointer;
  display: grid;
  height: 36px;
  place-items: center;
  width: 36px;
}

.icon-bell {
  height: 20px;
  width: 20px;
}

.avatar {
  background-color: #cbd5f5;
  border-radius: 50%;
  height: 36px;
  width: 36px;
}

.avatar--photo {
  object-fit: cover;
  border: 1px solid #d1d5db;
  background: #e5e7eb;
}

.lang-toggle {
  background: none;
  border: none;
  color: #1e40af;
  cursor: pointer;
  display: inline-flex;
  font-size: 0.95rem;
  font-weight: 600;
  gap: 0.4rem;
  padding: 0;
}

.lang-toggle__option {
  color: inherit;
  position: relative;
  transition: color 0.2s ease, transform 0.2s ease;
}

.lang-toggle__option::after {
  background-color: currentColor;
  bottom: -2px;
  content: '';
  height: 2px;
  left: 0;
  position: absolute;
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.25s ease;
  width: 100%;
}

.lang-toggle__option.is-active {
  text-decoration: none;
  transform: translateY(-1px);
}

.lang-toggle__option.is-active::after {
  transform: scaleX(1);
}

.lang-toggle__option:hover {
  transform: translateY(-1px) scale(1.03);
}

.lang-toggle__option:hover::after {
  transform: scaleX(1);
}

.content__body {
  min-height: calc(100vh - 88px);
}
</style>

