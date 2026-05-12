<script setup>
import { computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useNotificationStore } from '../../application/notificacion.store.js'

const { t, locale } = useI18n()
const { notifications, isLoading, error, loadNotifications } = useNotificationStore()

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

const hasNotifications = computed(() => notifications.value.length > 0)

onMounted(() => {
  loadNotifications()
})
</script>

<template>
  <section class="notifications-view">
    <header class="notifications-view__header">
      <h2 class="notifications-view__title">{{ t('notifications.title') }}</h2>
      <button class="notifications-view__refresh" type="button" @click="loadNotifications">
        {{ t('notifications.refresh') }}
      </button>
    </header>

    <p v-if="isLoading" class="notifications-view__empty">
      {{ t('notifications.loading') }}
    </p>
    <p v-else-if="error" class="notifications-view__empty">
      {{ error }}
    </p>
    <p v-else-if="!hasNotifications" class="notifications-view__empty">
      {{ t('notifications.empty') }}
    </p>
    <div v-else class="notifications-view__list">
      <article
        v-for="item in notifications"
        :key="item.id"
        class="notifications-view__item"
        :class="`is-${item.type}`"
      >
        <div class="notifications-view__content">
          <h3 class="notifications-view__item-title">{{ t(item.title) }}</h3>
          <p class="notifications-view__item-message">{{ t(item.message) }}</p>
        </div>
        <div class="notifications-view__meta">
          <span class="notifications-view__status">
            {{ item.isRead ? t('notifications.read') : t('notifications.unread') }}
          </span>
          <span class="notifications-view__time">{{ formatTimestamp(item.timestamp) }}</span>
        </div>
      </article>
    </div>
  </section>
</template>

<style scoped>
.notifications-view {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1.75rem 2rem;
}

.notifications-view__header {
  align-items: center;
  display: flex;
  justify-content: space-between;
  gap: 1rem;
}

.notifications-view__title {
  font-size: 1.25rem;
  font-weight: 700;
  margin: 0;
}

.notifications-view__refresh {
  background: #0b1c3f;
  border: none;
  border-radius: 999px;
  color: #ffffff;
  cursor: pointer;
  font-weight: 600;
  padding: 0.5rem 1.25rem;
}

.notifications-view__empty {
  color: #475569;
  margin: 0;
}

.notifications-view__list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.notifications-view__item {
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  display: grid;
  gap: 0.5rem;
  padding: 1rem 1.25rem;
}

.notifications-view__item-title {
  font-weight: 700;
  margin: 0 0 0.25rem;
}

.notifications-view__item-message {
  color: #475569;
  margin: 0;
}

.notifications-view__meta {
  color: #64748b;
  display: flex;
  font-size: 0.85rem;
  justify-content: space-between;
}

.notifications-view__status {
  font-weight: 600;
}

.notifications-view__item.is-success {
  border-color: #bbf7d0;
  background: #f0fdf4;
}

.notifications-view__item.is-warning {
  border-color: #fde68a;
  background: #fffbeb;
}

.notifications-view__item.is-info {
  border-color: #bfdbfe;
  background: #eff6ff;
}

.notifications-view__item.is-error {
  border-color: #fecaca;
  background: #fef2f2;
}
</style>
