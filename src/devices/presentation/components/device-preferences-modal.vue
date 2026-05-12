<template>
  <div class="modal-overlay">
    <div class="preferences-modal">
      <header class="modal-header">
        <h3 class="modal-title">{{ t('devices.preferencesTitle') }}</h3>
        <button class="modal-close" type="button" @click="$emit('close')">×</button>
      </header>

      <div class="preferences-grid">
        <label v-for="item in preferences" :key="item.key" class="preference-item">
          <input v-model="item.checked" type="checkbox" />
          <span>{{ t(item.label) }}</span>
        </label>
      </div>

      <footer class="modal-actions">
        <button class="ghost-button" type="button" @click="resetPreferences">
          {{ t('devices.resetPreferences') }}
        </button>

        <button class="primary-button" type="button" @click="$emit('close')">
          {{ t('devices.savePreferences') }}
        </button>
      </footer>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { useI18n } from 'vue-i18n'

defineEmits(['close'])

const { t } = useI18n()

const preferences = reactive([
  { key: 'waterMonitoring', label: 'devices.preferencesItems.waterMonitoring', checked: true },
  { key: 'highConsumptionAlerts', label: 'devices.preferencesItems.highConsumptionAlerts', checked: true },
  { key: 'includePowerTime', label: 'devices.preferencesItems.includePowerTime', checked: true },
  { key: 'monitorResources', label: 'devices.preferencesItems.monitorResources', checked: true },
  { key: 'monitorAllPipes', label: 'devices.preferencesItems.monitorAllPipes', checked: true },
  { key: 'autoBlockKeys', label: 'devices.preferencesItems.autoBlockKeys', checked: false },
  { key: 'advancedReports', label: 'devices.preferencesItems.advancedReports', checked: true },
  { key: 'hydraulicPower', label: 'devices.preferencesItems.hydraulicPower', checked: true },
  { key: 'dailyEmailReports', label: 'devices.preferencesItems.dailyEmailReports', checked: false },
  { key: 'weeklyProgress', label: 'devices.preferencesItems.weeklyProgress', checked: true },
  { key: 'savingAutomations', label: 'devices.preferencesItems.savingAutomations', checked: true },
  { key: 'leakAlerts', label: 'devices.preferencesItems.leakAlerts', checked: true }
])

const resetPreferences = () => {
  preferences.forEach((item) => {
    item.checked = false
  })
}
</script>

<style scoped>
.modal-overlay {
  align-items: center;
  background: rgba(15, 23, 42, 0.45);
  display: flex;
  inset: 0;
  justify-content: center;
  padding: 1.5rem;
  position: fixed;
  z-index: 30;
}

.preferences-modal {
  background: #ffffff;
  border: 1.5px solid #111827;
  border-radius: 18px;
  box-shadow: 0 20px 45px rgba(15, 23, 42, 0.25);
  padding: 1.5rem;
  width: min(900px, 100%);
}

.modal-header {
  align-items: center;
  display: flex;
  justify-content: space-between;
  margin-bottom: 2rem;
}

.modal-title {
  font-size: 1.25rem;
  margin: 0;
}

.modal-close {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.5rem;
}

.preferences-grid {
  display: grid;
  gap: 2rem 3rem;
  grid-template-columns: repeat(3, 1fr);
}

.preference-item {
  align-items: center;
  display: flex;
  gap: 1rem;
  font-size: 0.9rem;
}

.preference-item input {
  height: 16px;
  width: 16px;
}

.modal-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 3rem;
}

.primary-button,
.ghost-button {
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.85rem;
  padding: 0.55rem 1rem;
}

.primary-button {
  background: #ffffff;
  border: 1px solid #111827;
}

.ghost-button {
  background: #ffffff;
  border: 1px solid #6b7280;
}

@media (max-width: 900px) {
  .preferences-grid {
    grid-template-columns: 1fr;
  }
}
</style>