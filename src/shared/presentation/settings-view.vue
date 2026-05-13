<template>
  <section class="settings-container">
    <h1 class="settings-title">{{ t('settings.title') }}</h1>
    <div class="settings-grid">
      <!-- Modo de ahorro automático -->
      <div class="settings-card">
        <div class="settings-card-header">
          <span>{{ t('settings.autoMode.title') }}</span>
          <button class="settings-add-btn">+</button>
        </div>
        <div class="settings-switch-group">
          <label class="settings-switch">
            <input type="checkbox" v-model="autoClose" />
            <span class="slider"></span>
            {{ t('settings.autoMode.closeValves') }}
          </label>
          <label class="settings-switch">
            <input type="checkbox" v-model="blockAll" />
            <span class="slider"></span>
            {{ t('settings.autoMode.blockAll') }}
          </label>
          <label class="settings-switch">
            <input type="checkbox" v-model="block20" />
            <span class="slider"></span>
            {{ t('settings.autoMode.block20') }}
          </label>
          <label class="settings-switch">
            <input type="checkbox" v-model="reduceIntensity" />
            <span class="slider"></span>
            {{ t('settings.autoMode.reduceIntensity') }}
          </label>
        </div>
      </div>
      <!-- Notificaciones y alertas -->
      <div class="settings-card">
        <div class="settings-card-header">
          <span>{{ t('settings.notifications.title') }}</span>
        </div>
        <div class="settings-switch-group">
          <label class="settings-switch">
            <input type="checkbox" v-model="alertasConsumo" />
            <span class="slider"></span>
            {{ t('settings.notifications.highConsumption') }}
          </label>
          <label class="settings-switch">
            <input type="checkbox" v-model="resumen" />
            <span class="slider"></span>
            {{ t('settings.notifications.summary') }}
          </label>
        </div>
        <div class="settings-horario">
          <span>{{ t('settings.notifications.schedule') }}: {{ horario }}</span>
          <button class="settings-edit-btn" @click="editarHorario">{{ t('settings.notifications.edit') }}</button>
        </div>
      </div>
    </div>
    <div class="settings-actions">
      <button class="settings-save" @click="onSave">{{ t('settings.save') }}</button>
      <button class="settings-cancel" @click="onCancel">{{ t('settings.cancel') }}</button>
    </div>
    <!-- Toast -->
    <div v-if="showToast" class="settings-toast">
      {{ t('settings.saved') }}
    </div>
    <!-- Modal de confirmación -->
    <div v-if="showModal" class="settings-modal-overlay">
      <div class="settings-modal">
        <p>{{ t('settings.cancelConfirm') }}</p>
        <div class="settings-modal-actions">
          <button @click="confirmCancel" class="settings-save">{{ t('settings.cancel') }}</button>
          <button @click="showModal = false" class="settings-cancel">{{ t('settings.no') }}</button>
        </div>
      </div>
    </div>
    <!-- Modal para editar horario -->
    <div v-if="showHorarioModal" class="settings-modal-overlay">
      <div class="settings-modal">
        <p>{{ t('settings.notifications.scheduleEdit') }}</p>
        <input v-model="horarioTemp" class="settings-input" />
        <div class="settings-modal-actions">
          <button @click="guardarHorario" class="settings-save">{{ t('settings.save') }}</button>
          <button @click="showHorarioModal = false" class="settings-cancel">{{ t('settings.cancel') }}</button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

// Estado inicial
const initialState = {
  autoClose: false,
  blockAll: true,
  block20: false,
  reduceIntensity: true,
  alertasConsumo: true,
  resumen: true,
  horario: '05:00 AM - 22:00 PM'
}
const autoClose = ref(initialState.autoClose)
const blockAll = ref(initialState.blockAll)
const block20 = ref(initialState.block20)
const reduceIntensity = ref(initialState.reduceIntensity)
const alertasConsumo = ref(initialState.alertasConsumo)
const resumen = ref(initialState.resumen)
const horario = ref(initialState.horario)

const showToast = ref(false)
const showModal = ref(false)
const showHorarioModal = ref(false)
const horarioTemp = ref(horario.value)

function onSave() {
  showToast.value = true
  setTimeout(() => {
    showToast.value = false
  }, 2200)
  // Aquí podrías guardar los datos en backend si lo tuvieras
  // Actualiza el estado inicial
  initialState.autoClose = autoClose.value
  initialState.blockAll = blockAll.value
  initialState.block20 = block20.value
  initialState.reduceIntensity = reduceIntensity.value
  initialState.alertasConsumo = alertasConsumo.value
  initialState.resumen = resumen.value
  initialState.horario = horario.value
}

function onCancel() {
  showModal.value = true
}

function confirmCancel() {
  autoClose.value = initialState.autoClose
  blockAll.value = initialState.blockAll
  block20.value = initialState.block20
  reduceIntensity.value = initialState.reduceIntensity
  alertasConsumo.value = initialState.alertasConsumo
  resumen.value = initialState.resumen
  horario.value = initialState.horario
  showModal.value = false
}

function editarHorario() {
  horarioTemp.value = horario.value
  showHorarioModal.value = true
}

function guardarHorario() {
  horario.value = horarioTemp.value
  showHorarioModal.value = false
}
</script>

<style scoped>
.settings-container {
  padding: 2rem;
}
.settings-title {
  font-size: 2.2rem;
  font-weight: 700;
  margin-bottom: 2rem;
}
.settings-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
  gap: 2rem;
}
.settings-card {
  background: #fff;
  border: 1.5px solid #b6c6d6;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.03);
  margin-bottom: 1rem;
}
.settings-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1.3rem;
  font-weight: 600;
  margin-bottom: 1rem;
}
.settings-add-btn {
  background: #0a2c47;
  color: #fff;
  border: none;
  border-radius: 50%;
  width: 28px;
  height: 28px;
  font-size: 1.2rem;
  cursor: pointer;
}
.settings-switch-group {
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
}
.settings-switch {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  font-size: 1rem;
  font-weight: 400;
}
.settings-switch input[type="checkbox"] {
  accent-color: #0a2c47;
  width: 20px;
  height: 20px;
}
.settings-horario {
  margin-top: 1rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 1rem;
}
.settings-edit-btn {
  background: #111;
  color: #fff;
  border: none;
  border-radius: 16px;
  padding: 0.2rem 1.2rem;
  font-size: 1rem;
  cursor: pointer;
}
.settings-actions {
  margin-top: 2rem;
  display: flex;
  gap: 1rem;
}
.settings-save {
  background: #0a2c47;
  color: #fff;
  border: none;
  border-radius: 16px;
  padding: 0.6rem 2.2rem;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
}
.settings-cancel {
  background: #fff;
  color: #0a2c47;
  border: 1.5px solid #0a2c47;
  border-radius: 16px;
  padding: 0.6rem 2.2rem;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
}
.settings-toast {
  position: fixed;
  top: 2rem;
  right: 2rem;
  background: #0a2c47;
  color: #fff;
  padding: 1rem 2rem;
  border-radius: 12px;
  font-size: 1.1rem;
  z-index: 1000;
  box-shadow: 0 2px 8px rgba(0,0,0,0.12);
  animation: fadeInOut 2.2s;
}
@keyframes fadeInOut {
  0% { opacity: 0; transform: translateY(-20px); }
  10% { opacity: 1; transform: translateY(0); }
  90% { opacity: 1; transform: translateY(0); }
  100% { opacity: 0; transform: translateY(-20px); }
}
.settings-modal-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.18);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}
.settings-modal {
  background: #fff;
  border-radius: 12px;
  padding: 2rem 2.5rem;
  box-shadow: 0 2px 16px rgba(0,0,0,0.13);
  min-width: 320px;
  text-align: center;
}
.settings-modal-actions {
  margin-top: 1.5rem;
  display: flex;
  justify-content: center;
  gap: 1.5rem;
}
.settings-input {
  margin-top: 1rem;
  margin-bottom: 1rem;
  padding: 0.5rem 1rem;
  border: 1.5px solid #b6c6d6;
  border-radius: 8px;
  font-size: 1rem;
  width: 80%;
}
</style>
