import db from '../../../server/db.json'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '') || ''

const buildUrl = (path) => {
  if (!API_BASE_URL) {
    throw new Error('API base URL no configurada')
  }

  return `${API_BASE_URL}${path}`
}

export async function fetchNotifications() {
  if (API_BASE_URL) {
    try {
      const response = await fetch(buildUrl('/notifications'))

      if (response.ok) {
        return response.json()
      }
    } catch {
    }
  }

  return Array.isArray(db?.notifications) ? db.notifications : []
}

