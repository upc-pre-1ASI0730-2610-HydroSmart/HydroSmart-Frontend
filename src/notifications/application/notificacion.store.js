import { ref } from 'vue'

import {
  fetchNotificationsByUserId,
  fetchUnreadNotificationsByUserId,
  fetchUnreadNotificationCount,
  fetchNotificationById,
  createNotification,
  markNotificationAsRead,
  markNotificationAsUnread,
  deleteNotification
} from '../infrastructure/notifications-api.js'

import { toNotification } from '../infrastructure/notification.assembler.js'

const notifications = ref([])
const unreadNotifications = ref([])
const unreadCount = ref(0)
const currentNotification = ref(null)
const isLoading = ref(false)
const error = ref('')
const isUpdating = ref(false)

const getCurrentUserId = () => {
  try {
    const rawSession = localStorage.getItem('hydrosmart.session')

    if (rawSession) {
      const session = JSON.parse(rawSession)

      if (session?.id) {
        return Number(session.id)
      }
    }
  } catch {
    // ignore
  }

  return Number(import.meta.env.VITE_PROFILE_ID) || 1
}

export function useNotificationStore() {
  const loadNotificationsByUser = async (userId) => {
    const finalUserId = Number(userId) || getCurrentUserId()

    isLoading.value = true
    error.value = ''

    try {
      const data = await fetchNotificationsByUserId(finalUserId)
      notifications.value = Array.isArray(data) ? data.map(toNotification) : []
    } catch (err) {
      notifications.value = []
      error.value = err instanceof Error ? err.message : 'Error al cargar notificaciones'
    } finally {
      isLoading.value = false
    }
  }

  const loadNotifications = async () => {
    await loadNotificationsByUser(getCurrentUserId())
  }

  const loadUnreadNotifications = async (userId) => {
    const finalUserId = Number(userId) || getCurrentUserId()

    isLoading.value = true
    error.value = ''

    try {
      const data = await fetchUnreadNotificationsByUserId(finalUserId)
      unreadNotifications.value = Array.isArray(data) ? data.map(toNotification) : []
    } catch (err) {
      unreadNotifications.value = []
      error.value = err instanceof Error ? err.message : 'Error al cargar notificaciones no leídas'
    } finally {
      isLoading.value = false
    }
  }

  const loadUnreadCount = async (userId) => {
    const finalUserId = Number(userId) || getCurrentUserId()

    try {
      const count = await fetchUnreadNotificationCount(finalUserId)
      unreadCount.value = Number(count) || 0
    } catch (err) {
      unreadCount.value = 0
      error.value = err instanceof Error ? err.message : 'Error al obtener conteo de notificaciones'
    }
  }

  const loadNotification = async (id) => {
    isLoading.value = true
    error.value = ''

    try {
      const data = await fetchNotificationById(id)
      currentNotification.value = toNotification(data)
    } catch (err) {
      currentNotification.value = null
      error.value = err instanceof Error ? err.message : 'Error al cargar la notificación'
    } finally {
      isLoading.value = false
    }
  }

  const addNotification = async (notificationData) => {
    isUpdating.value = true
    error.value = ''

    try {
      const data = await createNotification(notificationData)
      const newNotification = toNotification(data)

      notifications.value.unshift(newNotification)

      if (!newNotification.isRead) {
        unreadNotifications.value.unshift(newNotification)
        unreadCount.value += 1
      }

      return newNotification
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error al crear la notificación'
      throw err
    } finally {
      isUpdating.value = false
    }
  }

  const markAsRead = async (id) => {
    isUpdating.value = true
    error.value = ''

    try {
      const data = await markNotificationAsRead(id)
      const updatedNotification = toNotification(data)

      const index = notifications.value.findIndex((n) => n.id === id)
      if (index !== -1) {
        notifications.value[index] = updatedNotification
      }

      const unreadIndex = unreadNotifications.value.findIndex((n) => n.id === id)
      if (unreadIndex !== -1) {
        unreadNotifications.value.splice(unreadIndex, 1)
      }

      if (currentNotification.value?.id === id) {
        currentNotification.value = updatedNotification
      }

      if (unreadCount.value > 0) {
        unreadCount.value -= 1
      }

      return updatedNotification
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error al marcar como leída'
      throw err
    } finally {
      isUpdating.value = false
    }
  }

  const markAsUnread = async (id) => {
    isUpdating.value = true
    error.value = ''

    try {
      const data = await markNotificationAsUnread(id)
      const updatedNotification = toNotification(data)

      const index = notifications.value.findIndex((n) => n.id === id)
      if (index !== -1) {
        notifications.value[index] = updatedNotification
      }

      if (!unreadNotifications.value.find((n) => n.id === id)) {
        unreadNotifications.value.unshift(updatedNotification)
      }

      if (currentNotification.value?.id === id) {
        currentNotification.value = updatedNotification
      }

      unreadCount.value += 1

      return updatedNotification
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error al marcar como no leída'
      throw err
    } finally {
      isUpdating.value = false
    }
  }

  const removeNotification = async (id) => {
    isUpdating.value = true
    error.value = ''

    try {
      await deleteNotification(id)

      const index = notifications.value.findIndex((n) => n.id === id)
      if (index !== -1) {
        notifications.value.splice(index, 1)
      }

      const unreadIndex = unreadNotifications.value.findIndex((n) => n.id === id)
      if (unreadIndex !== -1) {
        unreadNotifications.value.splice(unreadIndex, 1)

        if (unreadCount.value > 0) {
          unreadCount.value -= 1
        }
      }

      if (currentNotification.value?.id === id) {
        currentNotification.value = null
      }

      return true
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error al eliminar la notificación'
      throw err
    } finally {
      isUpdating.value = false
    }
  }

  const clearNotifications = () => {
    notifications.value = []
    unreadNotifications.value = []
    unreadCount.value = 0
    currentNotification.value = null
    error.value = ''
  }

  return {
    notifications,
    unreadNotifications,
    unreadCount,
    currentNotification,
    isLoading,
    error,
    isUpdating,
    loadNotifications,
    loadNotificationsByUser,
    loadUnreadNotifications,
    loadUnreadCount,
    loadNotification,
    addNotification,
    markAsRead,
    markAsUnread,
    removeNotification,
    clearNotifications
  }
}