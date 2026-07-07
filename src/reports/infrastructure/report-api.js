const API_BASE_URL = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '') || 'http://localhost:5001'

const buildUrl = (path) => `${API_BASE_URL}${path}`

const getAuthToken = () => localStorage.getItem('authToken')

const getHeaders = () => ({
  'Content-Type': 'application/json',
  ...(getAuthToken() && { Authorization: `Bearer ${getAuthToken()}` })
})

const readJson = async (response) => {
  const text = await response.text()

  if (!text) return null

  try {
    return JSON.parse(text)
  } catch {
    throw new Error('El backend no devolvió JSON. Revisa la URL de API.')
  }
}

export const reportApi = {
  async getReports() {
    const response = await fetch(buildUrl('/reports'), {
      headers: getHeaders()
    })

    if (!response.ok) {
      throw new Error(`Error al obtener reportes (${response.status})`)
    }

    return readJson(response)
  },

  async getReportById(id) {
    const response = await fetch(buildUrl(`/reports/${id}`), {
      headers: getHeaders()
    })

    if (!response.ok) {
      throw new Error(`Error al obtener reporte (${response.status})`)
    }

    return readJson(response)
  },

  async createReport(reportData) {
    const response = await fetch(buildUrl('/reports'), {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(reportData)
    })

    if (!response.ok) {
      throw new Error(`Error al crear reporte (${response.status})`)
    }

    return readJson(response)
  },

  async updateReport(id, reportData) {
    const response = await fetch(buildUrl(`/reports/${id}`), {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(reportData)
    })

    if (!response.ok) {
      throw new Error(`Error al actualizar reporte (${response.status})`)
    }

    return readJson(response)
  },

  async deleteReport(id) {
    const response = await fetch(buildUrl(`/reports/${id}`), {
      method: 'DELETE',
      headers: getHeaders()
    })

    if (!response.ok && response.status !== 204) {
      throw new Error(`Error al eliminar reporte (${response.status})`)
    }

    return true
  }
}