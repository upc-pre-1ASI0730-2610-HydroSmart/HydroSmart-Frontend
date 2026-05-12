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
    type: apiModel.type ?? 'info',
    timestamp: apiModel.timestamp ?? '',
    isRead: Boolean(apiModel.isRead)
  })
}
