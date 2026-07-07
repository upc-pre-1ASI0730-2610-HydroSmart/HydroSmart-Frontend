<template>
  <section class="dashboard">
    <!-- Metrics Cards -->
    <div class="metrics-grid">
      <div class="metric-card metric-card--red">
        <div class="metric-card__icon">💧</div>
        <div class="metric-card__content">
          <p class="metric-card__label">{{ t('dashboard.waterConsumption') }}</p>
          <p class="metric-card__value">{{ dashboard.monthlyConsumptionLiters }} {{ t('app.unit.liters') }}</p>
          <p class="metric-card__subtitle">{{ t('dashboard.monthlySavingGoal') }}</p>
        </div>
      </div>

      <div class="metric-card metric-card--green">
        <div class="metric-card__icon">🎯</div>
        <div class="metric-card__content">
          <p class="metric-card__label">{{ t('dashboard.estimatedSavings') }}</p>
          <p class="metric-card__value">{{ dashboard.estimatedSavingsPercentage }}%</p>
          <p class="metric-card__subtitle">{{ t('app.consumption') }}</p>
        </div>
      </div>

      <div class="metric-card metric-card--yellow">
        <div class="metric-card__icon">⚙️</div>
        <div class="metric-card__content">
          <p class="metric-card__label">{{ t('dashboard.activeDevices') }}</p>
          <p class="metric-card__value">5 {{ t('app.devices') }}</p>
          <p class="metric-card__subtitle">&nbsp;</p>
        </div>
      </div>

      <div class="metric-card metric-card--blue">
        <div class="metric-card__icon">📄</div>
        <div class="metric-card__content">
          <p class="metric-card__label">{{ t('dashboard.estimatedBill') }}</p>
          <p class="metric-card__value">S/. {{ dashboard.estimatedBill.toFixed(2) }}</p>
          <p class="metric-card__subtitle">&nbsp;</p>
        </div>
      </div>

      <div class="metric-card metric-card--purple">
        <div class="metric-card__icon">📊</div>
        <div class="metric-card__content">
          <p class="metric-card__label">{{ t('dashboard.todayConsumption') }}</p>
          <p class="metric-card__value">{{ dashboard.todayConsumptionLiters }} {{ t('app.unit.liters') }}</p>
          <p class="metric-card__subtitle">&nbsp;</p>
        </div>
      </div>
    </div>

    <!-- Charts Row 1 -->
    <div class="charts-grid charts-grid--main">
      <div class="chart-container chart-container--primary">
        <h3 class="chart-title">{{ t('dashboard.dailyWaterConsumption') }}</h3>
        <div class="chart-wrapper">
          <canvas id="dailyConsumptionChart"></canvas>
        </div>
      </div>

      <div class="secondary-section">
        <div class="chart-container chart-container--secondary">
          <h3 class="chart-title">{{ t('dashboard.consumptionByCategory') }}</h3>
          <div class="chart-wrapper chart-wrapper--compact">
            <canvas id="categoryConsumptionChart"></canvas>
          </div>
        </div>

        <div class="chart-container chart-container--secondary">
          <h3 class="chart-title">{{ t('dashboard.monthlyConsumption') }}</h3>
          <p class="chart-subtitle">{{ t('dashboard.comparison') }}</p>
          <div class="chart-wrapper chart-wrapper--compact">
            <canvas id="monthlyConsumptionChart"></canvas>
          </div>
        </div>
      </div>
    </div>

    <!-- Alerts and Devices Row -->
    <div class="bottom-section">
      <!-- Alerts Section -->
      <div class="alerts-container">
        <h3 class="alerts-title">{{ t('dashboard.alerts') }}</h3>
        <div class="alerts-list">
          <div class="alert-item alert-item--warning">
            <span class="alert-icon">⚠️</span>
            <div class="alert-content">
              <p class="alert-heading">{{ t('dashboard.highConsumptionDetected') }}</p>
              <p class="alert-message">{{ t('dashboard.highConsumptionMessage') }}</p>
            </div>
          </div>
          <div class="alert-item alert-item--warning">
            <span class="alert-icon">⚠️</span>
            <div class="alert-content">
              <p class="alert-heading">{{ t('dashboard.reminderTitle') }}</p>
              <p class="alert-message">{{ t('dashboard.reminderMessage') }}</p>
            </div>
          </div>
          <div class="alert-item alert-item--warning">
            <span class="alert-icon">⚠️</span>
            <div class="alert-content">
              <p class="alert-heading">Posible fuga detectada</p>
              <p class="alert-message">Se ha detectado un patrón de consumo anormal en el Inodoro 2. Verifica si hay fugas de agua.</p>
            </div>
          </div>
        </div>
      </div>

      <!-- My Devices Section -->
      <div class="devices-container">
        <h3 class="devices-title">{{ t('dashboard.myDevices') }}</h3>
        <div class="devices-list">
          <div v-for="device in myDevices" :key="device.id" class="device-item" :class="{ 'is-active': device.active }">
            <span class="device-icon">{{ device.icon }}</span>
            <div class="device-info">
              <p class="device-name">{{ device.name }}</p>
              <p class="device-status" :class="{ 'is-active': device.active, 'is-inactive': !device.active }">
                {{ device.active ? t('devices.active') : t('devices.inactive') }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import { onMounted } from 'vue'
import Chart from 'chart.js/auto'
import { useAnalyticsStore } from '../../application/analytics.store.js'
import { useAuthStore } from '@/auth/application/auth.store.js'

const { t } = useI18n()
const { dashboard, loadDashboard } = useAnalyticsStore()
const { currentUserId } = useAuthStore()
const dashboardUserId = Number(currentUserId.value || import.meta.env.VITE_PROFILE_ID) || 1

let dailyChart = null
let categoryChart = null
let monthlyChart = null

const myDevices = [
  {
    id: 1,
    icon: '🚽',
    name: 'Inodoro 2',
    active: true
  },
  {
    id: 2,
    icon: '🚿',
    name: t('dashboard.devices.shower3'),
    active: false
  },
  {
    id: 3,
    icon: '🚰',
    name: t('dashboard.devices.kitchenFaucet1'),
    active: false
  }
]

const initializeDailyConsumptionChart = () => {
  const ctx = document.getElementById('dailyConsumptionChart')
  if (!ctx) return

  if (dailyChart) {
    dailyChart.destroy()
  }

  const daily = dashboard.value.dailyConsumption

  dailyChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: daily.map((d) => d.timeBlock),
      datasets: [
        {
          label: 'Litros',
          data: daily.map((d) => d.liters),
          borderColor: '#3b82f6',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          borderWidth: 2,
          fill: true,
          tension: 0.4,
          pointBackgroundColor: '#3b82f6',
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          pointRadius: 3.5,
          pointHoverRadius: 5
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        },
        filler: {
          propagate: true
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 20,
            callback: function(value) {
              return value + ' L'
            },
            font: {
              size: 11
            }
          },
          grid: {
            color: 'rgba(0, 0, 0, 0.05)'
          }
        },
        x: {
          ticks: {
            font: {
              size: 10
            }
          },
          grid: {
            display: false
          }
        }
      }
    }
  })
}

const initializeCategoryConsumptionChart = () => {
  const ctx = document.getElementById('categoryConsumptionChart')
  if (!ctx) return

  if (categoryChart) {
    categoryChart.destroy()
  }

  const breakdown = dashboard.value.categoryBreakdown

  categoryChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: breakdown.map((c) => t('dashboard.categories.' + c.categoryKey)),
      datasets: [
        {
          data: breakdown.map((c) => c.liters),
          backgroundColor: ['#60a5fa', '#1e40af', '#5b91c9', '#a0c4dd', '#1e3a8a'],
          borderColor: '#fff',
          borderWidth: 2
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            padding: 12,
            font: {
              size: 10
            },
            boxWidth: 12
          }
        }
      }
    }
  })
}

const initializeMonthlyConsumptionChart = () => {
  const ctx = document.getElementById('monthlyConsumptionChart')
  if (!ctx) return

  if (monthlyChart) {
    monthlyChart.destroy()
  }

  const monthly = dashboard.value.monthlyComparison

  monthlyChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: monthly.map((m) => m.month),
      datasets: [
        {
          label: 'Consumo (Litros)',
          data: monthly.map((m) => m.liters),
          backgroundColor: ['#60a5fa', '#3b82f6', '#5b91c9', '#a0c4dd'],
          borderRadius: 6,
          borderSkipped: false
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: function(value) {
              return value + ' L'
            },
            font: {
              size: 10
            }
          },
          grid: {
            color: 'rgba(0, 0, 0, 0.05)'
          }
        },
        x: {
          ticks: {
            font: {
              size: 10
            }
          },
          grid: {
            display: false
          }
        }
      }
    }
  })
}

onMounted(async () => {
  await loadDashboard(dashboardUserId)
  initializeDailyConsumptionChart()
  initializeCategoryConsumptionChart()
  initializeMonthlyConsumptionChart()
})
</script>

<style scoped>
.dashboard {
  padding: 2rem;
  background: #f8fafc;
  min-height: 100%;
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1.25rem;
  margin-bottom: 1.75rem;
}

.metric-card {
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  border: 1px solid #e2e8f0;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s, box-shadow 0.2s;
}

.metric-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.metric-card--red {
  border-left: 4px solid #ef4444;
}

.metric-card--green {
  border-left: 4px solid #22c55e;
}

.metric-card--yellow {
  border-left: 4px solid #eab308;
}

.metric-card--blue {
  border-left: 4px solid #3b82f6;
}

.metric-card--purple {
  border-left: 4px solid #a855f7;
}

.metric-card__icon {
  font-size: 2rem;
  min-width: 2.5rem;
  text-align: center;
}

.metric-card__content {
  flex: 1;
}

.metric-card__label {
  font-size: 0.875rem;
  color: #64748b;
  margin: 0 0 0.25rem;
  font-weight: 500;
}

.metric-card__value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 0.25rem;
}

.metric-card__subtitle {
  font-size: 0.75rem;
  color: #94a3b8;
  margin: 0;
}

.charts-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;
  margin-bottom: 2rem;
}

.charts-grid--main {
  grid-template-columns: 2fr 1fr;
  gap: 1.5rem;
}

.secondary-section {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.chart-container {
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.chart-container--primary {
  grid-column: 1;
}

.chart-container--secondary {
  padding: 1.25rem;
}

.chart-wrapper {
  position: relative;
  height: 300px;
}

.chart-wrapper--compact {
  height: 220px;
}

.chart-title {
  font-size: 1rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 1rem;
}

.chart-subtitle {
  font-size: 0.875rem;
  color: #64748b;
  margin: -0.75rem 0 1rem;
}

.alerts-container {
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  min-height: auto;
}

.alerts-title {
  font-size: 0.95rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 1rem;
}

.alerts-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.alert-item {
  border: 1px solid #fde68a;
  border-radius: 10px;
  padding: 0.85rem;
  background: #fffbeb;
  display: flex;
  align-items: flex-start;
  gap: 0.6rem;
}

.alert-item--warning {
  border-color: #fde68a;
  background: #fffbeb;
}

.alert-icon {
  font-size: 1rem;
  min-width: 1.25rem;
  text-align: center;
  margin-top: 0.1rem;
  flex-shrink: 0;
}

.alert-content {
  flex: 1;
}

.alert-heading {
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 0.2rem;
  font-size: 0.8rem;
  line-height: 1.2;
}

.alert-message {
  font-size: 0.75rem;
  color: #64748b;
  margin: 0;
  line-height: 1.3;
}

.devices-container {
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.devices-title {
  font-size: 0.95rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 1rem;
}

.devices-list {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.device-item {
  padding: 0.8rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 0.6rem;
  background: #f8fafc;
  transition: background 0.2s, border-color 0.2s;
}

.device-item.is-active {
  background: #f0fdf4;
  border-color: #bbf7d0;
}

.device-item:hover {
  border-color: #cbd5f5;
}

.device-icon {
  font-size: 1.25rem;
  min-width: 1.5rem;
  text-align: center;
  flex-shrink: 0;
}

.device-info {
  flex: 1;
  min-width: 0;
}

.device-name {
  font-weight: 600;
  color: #0f172a;
  margin: 0 0 0.2rem;
  font-size: 0.8rem;
}

.device-status {
  font-size: 0.7rem;
  color: #94a3b8;
  margin: 0;
}

.device-status.is-active {
  color: #22c55e;
  font-weight: 600;
}

.device-status.is-inactive {
  color: #94a3b8;
}

.bottom-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-top: 1.5rem;
}

@media (max-width: 1024px) {
  .charts-grid--main {
    grid-template-columns: 1.5fr 1fr;
  }

  .metrics-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .chart-title {
    font-size: 0.9rem;
  }

  .chart-wrapper {
    height: 250px;
  }

  .chart-wrapper--compact {
    height: 180px;
  }
}

@media (max-width: 768px) {
  .charts-grid--main {
    grid-template-columns: 1fr;
  }

  .secondary-section {
    flex-direction: row;
  }

  .chart-container--secondary {
    flex: 1;
  }

  .chart-wrapper {
    height: 220px;
  }

  .chart-wrapper--compact {
    height: 160px;
  }

  .bottom-section {
    grid-template-columns: 1fr;
  }

  .metrics-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }

  .metric-card {
    padding: 1rem;
    gap: 0.75rem;
  }

  .metric-card__value {
    font-size: 1.25rem;
  }

  .metric-card__icon {
    font-size: 1.75rem;
    min-width: 2rem;
  }
}

@media (max-width: 640px) {
  .dashboard {
    padding: 1rem;
  }

  .metrics-grid {
    grid-template-columns: 1fr;
    gap: 0.75rem;
    margin-bottom: 1.5rem;
  }

  .metric-card {
    padding: 0.85rem;
    gap: 0.6rem;
  }

  .metric-card__label {
    font-size: 0.8rem;
  }

  .metric-card__value {
    font-size: 1.1rem;
  }

  .metric-card__icon {
    font-size: 1.5rem;
    min-width: 1.75rem;
  }

  .charts-grid--main {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .secondary-section {
    flex-direction: column;
  }

  .chart-title {
    font-size: 0.85rem;
    margin-bottom: 0.75rem;
  }

  .chart-subtitle {
    font-size: 0.75rem;
    margin: -0.5rem 0 0.75rem;
  }

  .chart-wrapper {
    height: 180px;
  }

  .chart-wrapper--compact {
    height: 140px;
  }

  .bottom-section {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .alerts-container,
  .devices-container {
    padding: 1rem;
  }

  .alerts-title,
  .devices-title {
    font-size: 0.9rem;
    margin-bottom: 0.75rem;
  }

  .alert-item {
    padding: 0.7rem;
    gap: 0.5rem;
  }

  .alert-heading {
    font-size: 0.75rem;
  }

  .alert-message {
    font-size: 0.7rem;
  }

  .device-item {
    padding: 0.7rem;
    gap: 0.5rem;
  }

  .device-name {
    font-size: 0.75rem;
  }

  .device-status {
    font-size: 0.65rem;
  }
}
</style>
