const API_BASE_URL = import.meta.env.VITE_ANALYTICS_API_BASE_URL?.replace(/\/$/, '')

export async function fetchDashboard(userId) {
  const numericId = Number(userId)

  if (!numericId) {
    throw new Error('ID de usuario inválido')
  }

  if (!API_BASE_URL) {
    throw new Error('VITE_ANALYTICS_API_BASE_URL no configurada')
  }

  const response = await fetch(`${API_BASE_URL}/api/v1/analytics/dashboard/${numericId}`)

  if (!response.ok) {
    throw new Error('No se pudo obtener el dashboard de analytics')
  }

  return response.json()
}
