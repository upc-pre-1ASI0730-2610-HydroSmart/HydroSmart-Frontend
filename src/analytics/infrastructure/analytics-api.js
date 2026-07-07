import { buildApiUrl } from '@/shared/infrastructure/api-config.js'

export async function fetchDashboard(userId) {
  const numericId = Number(userId)

  if (!numericId) {
    throw new Error('ID de usuario inválido')
  }

  const response = await fetch(buildApiUrl(`/api/v1/analytics/dashboard/${numericId}`, 'VITE_ANALYTICS_API_BASE_URL'))

  if (!response.ok) {
    throw new Error('No se pudo obtener el dashboard de analytics')
  }

  return response.json()
}
