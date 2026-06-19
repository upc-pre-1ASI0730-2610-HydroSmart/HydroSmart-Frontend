import { DashboardSummary } from '../domain/model/dashboard.entity.js'

const CATEGORY_MAP = {
  Shower: 'showers',
  Toilet: 'toilets',
  Filter: 'filters',
  Sink: 'faucets',
  Other: 'others'
}

export function toDashboardSummary(apiModel) {
  if (!apiModel) {
    return DashboardSummary.empty()
  }

  return new DashboardSummary({
    monthlyConsumptionLiters: apiModel.monthlyConsumptionLiters ?? 0,
    monthlyGoalLiters: apiModel.monthlyGoalLiters ?? 0,
    estimatedSavingsPercentage: apiModel.estimatedSavingsPercentage ?? 0,
    todayConsumptionLiters: apiModel.todayConsumptionLiters ?? 0,
    estimatedBill: apiModel.estimatedBill ?? 0,
    dailyConsumption: Array.isArray(apiModel.dailyConsumption)
      ? apiModel.dailyConsumption.map(({ timeBlock, liters }) => ({ timeBlock, liters }))
      : [],
    categoryBreakdown: Array.isArray(apiModel.categoryBreakdown)
      ? apiModel.categoryBreakdown.map(({ category, liters }) => ({
          categoryKey: CATEGORY_MAP[category] ?? 'others',
          liters
        }))
      : [],
    monthlyComparison: Array.isArray(apiModel.monthlyComparison)
      ? apiModel.monthlyComparison.map(({ month, liters }) => ({ month, liters }))
      : []
  })
}
