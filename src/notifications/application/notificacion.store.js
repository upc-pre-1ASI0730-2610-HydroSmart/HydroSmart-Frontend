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
import { toNotification, toApiModel } from '../infrastructure/notification.assembler.js'

const notifications = ref([])
const unreadNotifications = ref([])
const unreadCount = ref(0)
const currentNotification = ref(null)
const isLoading = ref(false)
const error = ref('')
const isUpdating = ref(false)

export function useNotificationStore() {
  const loadNotificationsByUser = async (userId) => {
    isLoading.value = true
    error.value = ''

    try {
      const data = await fetchNotificationsByUserId(userId)
      notifications.value = Array.isArray(data) ? data.map(toNotification) : []
    } catch (err) {
      notifications.value = []
      error.value = err instanceof Error ? err.message : 'Error al cargar notificaciones'
    } finally {
      isLoading.value = false
    }
  }

  const loadUnreadNotifications = async (userId) => {
    isLoading.value = true
    error.value = ''

    try {
      const data = await fetchUnreadNotificationsByUserId(userId)
      unreadNotifications.value = Array.isArray(data) ? data.map(toNotification) : []
    } catch (err) {
      unreadNotifications.value = []
      error.value = err instanceof Error ? err.message : 'Error al cargar notificaciones no leídas'
    } finally {
      isLoading.value = false
    }
  }

  const loadUnreadCount = async (userId) => {
    try {
      const count = await fetchUnreadNotificationCount(userId)
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

      // Actualizar en el array de notificaciones
      const index = notifications.value.findIndex(n => n.id === id)
      if (index !== -1) {
        notifications.value[index] = updatedNotification
      }

      // Actualizar en el array de no leídas
      const unreadIndex = unreadNotifications.value.findIndex(n => n.id === id)
      if (unreadIndex !== -1) {
        unreadNotifications.value.splice(unreadIndex, 1)
      }

      // Actualizar notificación actual
      if (currentNotification.value?.id === id) {
        currentNotification.value = updatedNotification
      }

      // Actualizar conteo
      if (unreadCount.value > 0) {
        unreadCount.value--
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

      // Actualizar en el array de notificaciones
      const index = notifications.value.findIndex(n => n.id === id)
      if (index !== -1) {
        notifications.value[index] = updatedNotification
      }

      // Agregar a no leídas si no está
      if (!unreadNotifications.value.find(n => n.id === id)) {
        unreadNotifications.value.unshift(updatedNotification)
      }

      // Actualizar notificación actual
      if (currentNotification.value?.id === id) {
        currentNotification.value = updatedNotification
      }

      // Actualizar conteo
      unreadCount.value++

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

      // Eliminar del array de notificaciones
      const index = notifications.value.findIndex(n => n.id === id)
      if (index !== -1) {
        notifications.value.splice(index, 1)
      }

      // Eliminar del array de no leídas
      const unreadIndex = unreadNotifications.value.findIndex(n => n.id === id)
      if (unreadIndex !== -1) {
        unreadNotifications.value.splice(unreadIndex, 1)
        unreadCount.value--
      }

      // Limpiar notificación actual si es la que se eliminó
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

