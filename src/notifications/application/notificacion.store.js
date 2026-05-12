import { ref } from 'vue'

import { fetchNotifications } from '../infrastructure/notifications-api.js'
import { toNotification } from '../infrastructure/notification.assembler.js'

const notifications = ref([])
const isLoading = ref(false)
const error = ref('')

export function useNotificationStore() {
  const loadNotifications = async () => {
    isLoading.value = true
    error.value = ''

    try {
      const data = await fetchNotifications()
      notifications.value = Array.isArray(data) ? data.map(toNotification) : []
    } catch (err) {
      notifications.value = []
      error.value = err instanceof Error ? err.message : 'Error al cargar notificaciones'
    } finally {
      isLoading.value = false
    }
  }

  return {
    notifications,
    isLoading,
    error,
    loadNotifications
  }
}

