export class Notification {
  constructor({ id, userId, title, message, type, timestamp, isRead }) {
    this.id = id
    this.userId = userId
    this.title = title
    this.message = message
    this.type = type
    this.timestamp = timestamp
    this.isRead = isRead
  }

  static empty() {
    return new Notification({
      id: null,
      userId: null,
      title: '',
      message: '',
      type: 'info',
      timestamp: '',
      isRead: false
    })
  }
}
