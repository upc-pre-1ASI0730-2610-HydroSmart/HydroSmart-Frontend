import { ref } from 'vue'

import { DashboardSummary } from '../domain/model/dashboard.entity.js'
import { fetchDashboard } from '../infrastructure/analytics-api.js'
import { toDashboardSummary } from '../infrastructure/analytics.assembler.js'

const dashboard = ref(DashboardSummary.empty())
const isLoading = ref(false)
const error = ref('')

export function useAnalyticsStore() {
  const loadDashboard = async (userId) => {
    if (!userId) {
      return
    }

    isLoading.value = true
    error.value = ''

    try {
      const apiModel = await fetchDashboard(userId)
      dashboard.value = toDashboardSummary(apiModel)
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error al cargar el dashboard'
    } finally {
      isLoading.value = false
    }
  }

  return {
    dashboard,
    isLoading,
    error,
    loadDashboard
  }
}
