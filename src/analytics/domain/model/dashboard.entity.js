export class DashboardSummary {
  constructor({
    monthlyConsumptionLiters,
    monthlyGoalLiters,
    estimatedSavingsPercentage,
    todayConsumptionLiters,
    estimatedBill,
    dailyConsumption,
    categoryBreakdown,
    monthlyComparison
  }) {
    this.monthlyConsumptionLiters = monthlyConsumptionLiters
    this.monthlyGoalLiters = monthlyGoalLiters
    this.estimatedSavingsPercentage = estimatedSavingsPercentage
    this.todayConsumptionLiters = todayConsumptionLiters
    this.estimatedBill = estimatedBill
    this.dailyConsumption = dailyConsumption
    this.categoryBreakdown = categoryBreakdown
    this.monthlyComparison = monthlyComparison
  }

  static empty() {
    return new DashboardSummary({
      monthlyConsumptionLiters: 0,
      monthlyGoalLiters: 0,
      estimatedSavingsPercentage: 0,
      todayConsumptionLiters: 0,
      estimatedBill: 0,
      dailyConsumption: [],
      categoryBreakdown: [],
      monthlyComparison: []
    })
  }
}
