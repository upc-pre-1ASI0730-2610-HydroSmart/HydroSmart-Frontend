<template>
  <section class="devices-page">
    <div class="devices-header">
      <h1 class="page-title">{{ t('devices.title') }}</h1>

      <div class="header-actions">
        <button class="outline-button primary" type="button" @click="openPreferences">
          + {{ t('devices.preferences') }}
        </button>

        <button class="outline-button" type="button" @click="openAddDevice">
          + {{ t('devices.addDevice') }}
        </button>
      </div>
    </div>

    <div v-if="isLoading" class="status">
      {{ t('devices.loading') }}
    </div>

    <div v-else-if="error" class="status error">
      {{ error }}
    </div>

    <div v-else class="devices-list">
      <article v-for="device in devices" :key="device.id" class="device-card">
        <div class="device-section">
          <p class="device-label">{{ device.name }}</p>
          <span>{{ t('devices.section') }}: {{ device.section }}</span>
        </div>

        <div class="divider"></div>

        <div class="device-section">
          <p class="device-label">{{ t('devices.realTimeStatus') }}</p>
          <span>{{ device.isActive ? t('devices.active') : t('devices.inactive') }}</span>
        </div>

        <div class="divider"></div>

        <div class="device-section">
          <p class="device-label">{{ t('devices.lastActive') }}</p>
          <span>{{ device.lastActive }}</span>
        </div>

        <div class="divider"></div>

        <div class="device-section">
          <p class="device-label">{{ t('devices.alertsHistory') }}</p>
          <span>
            {{
              device.alerts > 0
                  ? t('devices.viewAlerts', { count: device.alerts })
                  : t('devices.noAlerts')
            }}
          </span>
        </div>

        <div class="divider"></div>

        <div class="device-section">
          <p class="device-label">{{ t('devices.energyConsumption') }}</p>
          <span>{{ t('devices.litersPerWeek', { count: device.consumption }) }}</span>
        </div>

        <button class="settings-button" type="button" :aria-label="t('devices.settings')" @click="openSettings(device)">
          <svg class="settings-icon" viewBox="0 0 24 24" aria-hidden="true">
            <path
                d="M19.43 12.98c.04-.32.07-.65.07-.98s-.02-.66-.07-.98l2.11-1.65a.5.5 0 0 0 .12-.64l-2-3.46a.5.5 0 0 0-.6-.22l-2.49 1a7.2 7.2 0 0 0-1.69-.98L14.5 2.42A.5.5 0 0 0 14 2h-4a.5.5 0 0 0-.5.42L9.12 5.07c-.61.24-1.18.56-1.69.98l-2.49-1a.5.5 0 0 0-.6.22l-2 3.46a.5.5 0 0 0 .12.64l2.11 1.65c-.04.32-.07.65-.07.98s.02.66.07.98l-2.11 1.65a.5.5 0 0 0-.12.64l2 3.46a.5.5 0 0 0 .6.22l2.49-1c.51.4 1.08.74 1.69.98l.38 2.65A.5.5 0 0 0 10 22h4a.5.5 0 0 0 .5-.42l.38-2.65c.61-.24 1.18-.56 1.69-.98l2.49 1a.5.5 0 0 0 .6-.22l2-3.46a.5.5 0 0 0-.12-.64l-2.11-1.65ZM12 15.5A3.5 3.5 0 1 1 12 8a3.5 3.5 0 0 1 0 7.5Z"
                fill="currentColor"
            />
          </svg>
        </button>
      </article>
    </div>

    <DevicePreferencesModal v-if="isPreferencesOpen" @close="closePreferences" />

    <DeviceFormModal
        v-if="isAddDeviceOpen"
        :is-saving="isSaving"
        :save-error="saveError"
        @close="closeAddDevice"
        @save="handleAddDevice"
    />

    <DeviceSettingsModal
        v-if="isSettingsOpen"
        :device="selectedDevice"
        :is-saving="isSaving"
        :save-error="saveError"
        @close="closeSettings"
        @save="handleUpdateDevice"
    />
  </section>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'

import { useDeviceStore } from '../../application/device.store.js'
import DeviceFormModal from '../components/device-form-modal.vue'
import DeviceSettingsModal from '../components/device-settings-modal.vue'
import DevicePreferencesModal from '../components/device-preferences-modal.vue'

const { t } = useI18n()

const {
  devices,
  isLoading,
  error,
  isSaving,
  saveError,
  loadDevices,
  addDevice,
  updateDevice
} = useDeviceStore()

const isPreferencesOpen = ref(false)
const isAddDeviceOpen = ref(false)
const isSettingsOpen = ref(false)
const selectedDevice = ref(null)

const openPreferences = () => {
  isPreferencesOpen.value = true
}

const closePreferences = () => {
  isPreferencesOpen.value = false
}

const openAddDevice = () => {
  isAddDeviceOpen.value = true
}

const closeAddDevice = () => {
  isAddDeviceOpen.value = false
}

const openSettings = (device) => {
  selectedDevice.value = device
  isSettingsOpen.value = true
}

const closeSettings = () => {
  selectedDevice.value = null
  isSettingsOpen.value = false
}

const handleAddDevice = async (payload) => {
  await addDevice(payload)
  closeAddDevice()
}

const handleUpdateDevice = async ({ id, updates }) => {
  await updateDevice(id, updates)
  closeSettings()
}

onMounted(() => {
  loadDevices()
})
</script>

<style scoped>
.devices-page {
  padding: 2rem 2.5rem 3rem;
}

.devices-header {
  align-items: center;
  display: flex;
  justify-content: space-between;
  margin-bottom: 2rem;
}

.page-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0;
}

.header-actions {
  display: flex;
  gap: 1rem;
}

.outline-button {
  background: #ffffff;
  border: 1.5px solid #111827;
  border-radius: 999px;
  cursor: pointer;
  font-size: 1rem;
  padding: 0.75rem 1.2rem;
}

.outline-button.primary {
  background: #0f7bc2;
  border-color: #0f7bc2;
  color: #ffffff;
}

.devices-list {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.device-card {
  align-items: center;
  border: 1.5px solid #3b82f6;
  border-radius: 20px;
  display: grid;
  gap: 1rem;
  grid-template-columns:
    1.1fr auto
    1fr auto
    1fr auto
    1fr auto
    1fr auto;
  padding: 1.4rem 1.2rem;
}

.device-section {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.device-label {
  color: #111827;
  font-size: 1.05rem;
  font-weight: 500;
  margin: 0;
}

.device-section span {
  color: #6b7280;
  font-size: 0.9rem;
}

.divider {
  background: #d1d5db;
  height: 55px;
  width: 1px;
}

.settings-button {
  align-items: center;
  background: none;
  border: none;
  color: #0f172a;
  cursor: pointer;
  display: flex;
  justify-content: center;
  padding: 0.35rem;
}

.settings-icon {
  height: 22px;
  width: 22px;
}

.status {
  color: #475569;
}

.error {
  color: #b91c1c;
}

@media (max-width: 1200px) {
  .device-card {
    grid-template-columns: 1fr;
  }

  .divider {
    display: none;
  }

  .settings-button {
    justify-content: flex-start;
    width: fit-content;
  }
}
</style>