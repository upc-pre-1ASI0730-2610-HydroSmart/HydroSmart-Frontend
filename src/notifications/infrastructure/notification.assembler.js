import { Notification } from '../domain/model/notification.entity.js'

export function toNotification(apiModel) {
  if (!apiModel) {
    return Notification.empty()
  }

  return new Notification({
    id: Number(apiModel.id) || null,
    userId: Number(apiModel.userId) || null,
    title: apiModel.title ?? '',
    message: apiModel.message ?? '',
    type: apiModel.type?.toLowerCase() ?? 'info',
    timestamp: apiModel.createdAt ?? '',
    isRead: Boolean(apiModel.isRead)
  })
}

export function toApiModel(notification) {
  if (!notification) return null

  return {
    userId: notification.userId,
    title: notification.title ?? '',
    message: notification.message ?? '',
    type: notification.type?.toUpperCase() ?? 'INFO'
  }
}

