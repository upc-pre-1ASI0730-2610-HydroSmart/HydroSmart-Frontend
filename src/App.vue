<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { RouterLink, RouterView, useRoute, useRouter } from 'vue-router'
import { useProfileStore } from './profiles/application/profile.store.js'
import { useNotificationStore } from './notifications/application/notificacion.store.js'
import { useAuthStore } from './auth/application/auth.store.js'

const { t, locale } = useI18n()
const now = ref(new Date())
const userName = computed(() => t('app.userName'))
const route = useRoute()
const router = useRouter()
const { isAuthenticated, currentUser, logout } = useAuthStore()

const { profile, loadProfile } = useProfileStore()
const profileId = Number(import.meta.env.VITE_PROFILE_ID) || 1

const displayName = computed(() => profile.value?.fullName || currentUser.value || userName.value)
const displayPhoto = computed(() => profile.value?.profilePhotoUrl || '')
const isAuthLayout = computed(() => route.matched.some((record) => record.meta?.layout === 'auth'))

const isNotificationsOpen = ref(false)
const {
  notifications,
  unreadCount,
  isLoading: isNotificationsLoading,
  error: notificationsError,
  loadNotifications,
  loadUnreadCount
} = useNotificationStore()
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

const formatTimestamp = (value) => {
  if (!value) {
    return ''
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return ''
  }

  return new Intl.DateTimeFormat(locale.value, {
    hour: '2-digit',
    minute: '2-digit',
    day: '2-digit',
    month: 'short'
  }).format(date)
}

const openNotifications = async () => {
  if (!isNotificationsOpen.value) {
    await loadNotifications()
  }

  isNotificationsOpen.value = true
}

const closeNotifications = () => {
  isNotificationsOpen.value = false
}

const toggleNotifications = async () => {
  if (isNotificationsOpen.value) {
    closeNotifications()
  } else {
    await openNotifications()
  }
}

const onOverlayClick = (event) => {
  if (event.target === event.currentTarget) {
    closeNotifications()
  }
}

const onLogout = async () => {
  logout()
  closeNotifications()
  await router.push('/login')
}

onMounted(() => {
  timerId = window.setInterval(() => {
    now.value = new Date()
  }, 1000)

  if (isAuthenticated.value) {
    loadProfile(profileId)
    loadUnreadCount()
  }
})

onUnmounted(() => {
  window.clearInterval(timerId)
})
</script>

<template>
  <div v-if="!isAuthLayout" class="app-shell">
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

      <button class="nav-logout" type="button" @click="onLogout">
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
          <div class="notifications">
            <button
                class="icon-button"
                type="button"
                :aria-label="t('app.notifications')"
                :aria-expanded="isNotificationsOpen"
                @click="toggleNotifications"
            >
              <svg class="icon-bell" viewBox="0 0 24 24" aria-hidden="true">
                <path
                    d="M12 22a2.5 2.5 0 0 0 2.45-2h-4.9A2.5 2.5 0 0 0 12 22Zm6-6V11a6 6 0 1 0-12 0v5l-2 2v1h16v-1l-2-2Z"
                    fill="currentColor"
                />
              </svg>

              <span v-if="unreadCount > 0" class="notifications-badge">
    {{ unreadCount }}
  </span>
            </button>
            <div v-if="isNotificationsOpen" class="notifications-overlay" @click="onOverlayClick">
              <div class="notifications-panel" role="dialog" aria-live="polite">
                <div class="notifications-panel__header">
                  <h3 class="notifications-panel__title">{{ t('notifications.title') }}</h3>
                  <button class="icon-button" type="button" :aria-label="t('notifications.close')" @click="closeNotifications">
                    <span aria-hidden="true">✕</span>
                  </button>
                </div>
                <div class="notifications-panel__body">
                  <p v-if="isNotificationsLoading" class="notifications-panel__empty">
                    {{ t('notifications.loading') }}
                  </p>
                  <p v-else-if="notificationsError" class="notifications-panel__empty">
                    {{ notificationsError }}
                  </p>
                  <p v-else-if="!notifications.length" class="notifications-panel__empty">
                    {{ t('notifications.empty') }}
                  </p>
                  <div v-else class="notifications-list">
                    <article v-for="item in notifications" :key="item.id" class="notifications-item" :class="`is-${item.type}`">
                      <div class="notifications-item__main">
                        <p class="notifications-item__title">{{ t(item.title) }}</p>
                        <p class="notifications-item__message">{{ t(item.message) }}</p>
                      </div>
                      <div class="notifications-item__meta">
                        <span class="notifications-item__status">
                          {{ item.isRead ? t('notifications.read') : t('notifications.unread') }}
                        </span>
                        <span class="notifications-item__time">{{ formatTimestamp(item.timestamp) }}</span>
                      </div>
                    </article>
                  </div>
                </div>
              </div>
            </div>
          </div>
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
  <RouterView v-else />
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
  position: relative;
}

.notifications {
  position: relative;
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
  color: #0f172a;
  display: block;
  height: 20px;
  width: 20px;
}

.notifications-overlay {
  align-items: center;
  background: rgba(15, 23, 42, 0.2);
  display: flex;
  inset: 0;
  justify-content: center;
  padding: 24px;
  position: fixed;
  z-index: 50;
}

.notifications-panel {
  background: #ffffff;
  border-radius: 18px;
  box-shadow: 0 18px 50px rgba(15, 23, 42, 0.2);
  margin: 0;
  max-height: calc(100vh - 120px);
  overflow: hidden;
  width: min(520px, calc(100vw - 48px));
}

.notifications-panel__header {
  align-items: center;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  padding: 1rem 1.25rem;
}

.notifications-panel__title {
  font-size: 1rem;
  font-weight: 700;
  margin: 0;
}

.notifications-panel__body {
  max-height: 55vh;
  overflow-y: auto;
  padding: 1rem 1.25rem 1.25rem;
}

.notifications-panel__empty {
  color: #475569;
  margin: 0;
}

.notifications-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.notifications-item {
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  display: grid;
  gap: 0.4rem;
  padding: 0.85rem 1rem;
}

.notifications-item__title {
  font-weight: 700;
  margin: 0 0 0.2rem;
}

.notifications-item__message {
  color: #475569;
  margin: 0;
}

.notifications-item__meta {
  color: #64748b;
  display: flex;
  font-size: 0.85rem;
  justify-content: space-between;
}

.notifications-item__status {
  font-weight: 600;
}

.notifications-item.is-success {
  border-color: #bbf7d0;
  background: #f0fdf4;
}

.notifications-item.is-warning {
  border-color: #fde68a;
  background: #fffbeb;
}

.notifications-item.is-info {
  border-color: #bfdbfe;
  background: #eff6ff;
}

.notifications-item.is-error {
  border-color: #fecaca;
  background: #fef2f2;
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
.notifications .icon-button {
  position: relative;
}

.notifications-badge {
  align-items: center;
  background: #ef4444;
  border-radius: 999px;
  color: #ffffff;
  display: flex;
  font-size: 0.65rem;
  font-weight: 700;
  height: 1rem;
  justify-content: center;
  min-width: 1rem;
  padding: 0 0.25rem;
  position: absolute;
  right: -0.25rem;
  top: -0.25rem;
}
</style>

