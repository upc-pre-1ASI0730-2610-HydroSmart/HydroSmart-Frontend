const API_BASE_URL = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '') || 'http://localhost:5001'

const buildUrl = (path) => {
  return `${API_BASE_URL}${path}`
}

const getAuthToken = () => {
  return localStorage.getItem('authToken')
}

const getHeaders = (isFormData = false) => {
  const headers = {
    ...(getAuthToken() && { Authorization: `Bearer ${getAuthToken()}` })
  }

  if (!isFormData) {
    headers['Content-Type'] = 'application/json'
  }

  return headers
}

export async function fetchNotificationsByUserId(userId) {
  const numericId = Number(userId)

  if (!numericId) {
    throw new Error('ID de usuario inválido')
  }

  if (!API_BASE_URL) {
    throw new Error('API base URL no configurada')
  }

  try {
    const response = await fetch(buildUrl(`/api/notifications/user/${numericId}`), {
      method: 'GET',
      headers: getHeaders()
    })

    if (!response.ok) {
      throw new Error('Error al obtener las notificaciones')
    }

    return response.json()
  } catch (error) {
    throw error
  }
}

export async function fetchUnreadNotificationsByUserId(userId) {
  const numericId = Number(userId)

  if (!numericId) {
    throw new Error('ID de usuario inválido')
  }

  if (!API_BASE_URL) {
    throw new Error('API base URL no configurada')
  }

  try {
    const response = await fetch(buildUrl(`/api/notifications/user/${numericId}/unread`), {
      method: 'GET',
      headers: getHeaders()
    })

    if (!response.ok) {
      throw new Error('Error al obtener las notificaciones no leídas')
    }

    return response.json()
  } catch (error) {
    throw error
  }
}

export async function fetchUnreadNotificationCount(userId) {
  const numericId = Number(userId)

  if (!numericId) {
    throw new Error('ID de usuario inválido')
  }

  if (!API_BASE_URL) {
    throw new Error('API base URL no configurada')
  }

  try {
    const response = await fetch(buildUrl(`/api/notifications/user/${numericId}/unread-count`), {
      method: 'GET',
      headers: getHeaders()
    })

    if (!response.ok) {
      throw new Error('Error al obtener el conteo de notificaciones')
    }

    return response.json()
  } catch (error) {
    throw error
  }
}

export async function fetchNotificationById(id) {
  const numericId = Number(id)

  if (!numericId) {
    throw new Error('ID de notificación inválido')
  }

  if (!API_BASE_URL) {
    throw new Error('API base URL no configurada')
  }

  try {
    const response = await fetch(buildUrl(`/api/notifications/${numericId}`), {
      method: 'GET',
      headers: getHeaders()
    })

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Notificación no encontrada')
      }
      throw new Error('Error al obtener la notificación')
    }

    return response.json()
  } catch (error) {
    throw error
  }
}

export async function createNotification(notificationData) {
  if (!API_BASE_URL) {
    throw new Error('API base URL no configurada')
  }

  try {
    const response = await fetch(buildUrl('/api/notifications'), {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(notificationData)
    })

    if (!response.ok) {
      if (response.status === 400) {
        throw new Error('Los datos de la notificación no son válidos')
      }
      throw new Error('Error al crear la notificación')
    }

    return response.json()
  } catch (error) {
    throw error
  }
}

export async function markNotificationAsRead(id) {
  const numericId = Number(id)

  if (!numericId) {
    throw new Error('ID de notificación inválido')
  }

  if (!API_BASE_URL) {
    throw new Error('API base URL no configurada')
  }

  try {
    const response = await fetch(buildUrl(`/api/notifications/${numericId}/mark-as-read`), {
      method: 'PUT',
      headers: getHeaders()
    })

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Notificación no encontrada')
      }
      throw new Error('Error al marcar la notificación como leída')
    }

    return response.json()
  } catch (error) {
    throw error
  }
}

export async function markNotificationAsUnread(id) {
  const numericId = Number(id)

  if (!numericId) {
    throw new Error('ID de notificación inválido')
  }

  if (!API_BASE_URL) {
    throw new Error('API base URL no configurada')
  }

  try {
    const response = await fetch(buildUrl(`/api/notifications/${numericId}/mark-as-unread`), {
      method: 'PUT',
      headers: getHeaders()
    })

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Notificación no encontrada')
      }
      throw new Error('Error al marcar la notificación como no leída')
    }

    return response.json()
  } catch (error) {
    throw error
  }
}

export async function deleteNotification(id) {
  const numericId = Number(id)

  if (!numericId) {
    throw new Error('ID de notificación inválido')
  }

  if (!API_BASE_URL) {
    throw new Error('API base URL no configurada')
  }

  try {
    const response = await fetch(buildUrl(`/api/notifications/${numericId}`), {
      method: 'DELETE',
      headers: getHeaders()
    })

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Notificación no encontrada')
      }
      throw new Error('Error al eliminar la notificación')
    }

    return true
  } catch (error) {
    throw error
  }
}
