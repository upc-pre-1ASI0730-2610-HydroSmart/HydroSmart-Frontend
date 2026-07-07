import db from '../../../server/db.json'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '') || ''

const buildUrl = (path) => {
    if (!API_BASE_URL) {
        throw new Error('API base URL no configurada')
    }

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

export async function fetchDevices() {
    if (API_BASE_URL) {
        try {
            const response = await fetch(buildUrl('/api/v1/devices'), {
              method: 'GET',
              headers: getHeaders()
            })

            if (response.ok) {
                return response.json()
            }
        } catch {
        }
    }

    return Array.isArray(db?.devices) ? db.devices : []
}