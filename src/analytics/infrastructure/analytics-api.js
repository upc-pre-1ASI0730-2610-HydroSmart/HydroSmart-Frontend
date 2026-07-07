const API_BASE_URL = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '') || 'http://localhost:5001'

const getAuthToken = () => localStorage.getItem('authToken')

const getHeaders = () => ({
  'Content-Type': 'application/json',
  ...(getAuthToken() && { Authorization: `Bearer ${getAuthToken()}` })
})

export async function fetchDashboard(userId) {
  const numericId = Number(userId)

  if (!numericId) {
    throw new Error('ID de usuario inválido')
  }

  const response = await fetch(`${API_BASE_URL}/api/v1/analytics/dashboard/${numericId}`, {
    method: 'GET',
    headers: getHeaders()
  })

  if (!response.ok) {
    throw new Error(`No se pudo obtener el dashboard de analytics (${response.status})`)
  }

  return response.json()
}