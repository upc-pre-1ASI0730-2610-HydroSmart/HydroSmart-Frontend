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
          <button ref="editBtn" class="settings-edit-btn" @click="editarHorario">{{ t('settings.notifications.edit') }}</button>

          <!-- Popover pequeño estilo burbuja -->
          <div v-if="showHorarioModal" ref="popoverEl" class="settings-popover" @click.stop>
            <div class="time-pickers-compact">
              <div class="time-picker-compact">
                <label>{{ t('settings.notifications.start') }}</label>
                <div class="picker-row-compact">
                  <select v-model="startHour" class="hour">
                    <option v-for="h in hours" :key="h" :value="h">{{ h }}</option>
                  </select>
                  <select v-model="startMin" class="min">
                    <option v-for="m in minutes" :key="m" :value="m">{{ m }}</option>
                  </select>
                  <select v-model="startAmpm" class="ampm">
                    <option value="AM">AM</option>
                    <option value="PM">PM</option>
                  </select>
                </div>
              </div>
              <div class="time-picker-compact">
                <label>{{ t('settings.notifications.end') }}</label>
                <div class="picker-row-compact">
                  <select v-model="endHour" class="hour">
                    <option v-for="h in hours" :key="h" :value="h">{{ h }}</option>
                  </select>
                  <select v-model="endMin" class="min">
                    <option v-for="m in minutes" :key="m" :value="m">{{ m }}</option>
                  </select>
                  <select v-model="endAmpm" class="ampm">
                    <option value="AM">AM</option>
                    <option value="PM">PM</option>
                  </select>
                </div>
              </div>
            </div>
            <div class="popover-actions">
              <button @click="guardarHorario" class="settings-save">{{ t('settings.save') }}</button>
              <button @click="showHorarioModal = false" class="settings-cancel">{{ t('settings.cancel') }}</button>
            </div>
          </div>
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
    <!-- antes había un drawer; ahora usamos un popover compacto dentro de .settings-horario -->
  </section>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
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

// UI state
const showToast = ref(false)
const showModal = ref(false)
const showHorarioModal = ref(false)
const editBtn = ref(null)
const popoverEl = ref(null)

// Selectores de tiempo (estilo alarma)
const hours = Array.from({ length: 12 }).map((_, i) => String(i + 1).padStart(2, '0'))
const minutes = Array.from({ length: 12 }).map((_, i) => String(i * 5).padStart(2, '0')) // 00,05,...55

const startHour = ref('05')
const startMin = ref('00')
const startAmpm = ref('AM')
const endHour = ref('10')
const endMin = ref('00')
const endAmpm = ref('PM')

function pad2(n) {
  return String(n).padStart(2, '0')
}

function parseTimeString(str) {
  // intenta extraer HH:MM y AM/PM
  if (!str) return { hour: '12', min: '00', ampm: 'AM' }
  const parts = str.split('-').map(s => s.trim())
  // We'll return first part by caller
  const t = parts[0] || str
  const m = t.match(/(\d{1,2}):(\d{2})\s*([AaPp][Mm])?/) // e.g. 05:00 AM or 22:00
  if (!m) return { hour: '12', min: '00', ampm: 'AM' }
  let h = parseInt(m[1], 10)
  const min = pad2(m[2])
  let ampm = (m[3] || '').toUpperCase()
  if (!ampm) {
    // si no viene AM/PM, inferir: si h>=12 -> PM
    ampm = h >= 12 ? 'PM' : 'AM'
  }
  // convertir a 12h
  const hour12 = ((h + 11) % 12) + 1
  return { hour: pad2(hour12), min, ampm }
}

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
  // Parsear horario actual en los selectores
  const parts = horario.value.split('-').map(p => p.trim())
  const s = parseTimeString(parts[0])
  const e = parseTimeString(parts[1] || parts[0])
  startHour.value = s.hour
  startMin.value = s.min
  startAmpm.value = s.ampm
  endHour.value = e.hour
  endMin.value = e.min
  endAmpm.value = e.ampm
  showHorarioModal.value = true
}

function guardarHorario() {
  horario.value = `${startHour.value}:${startMin.value} ${startAmpm.value} - ${endHour.value}:${endMin.value} ${endAmpm.value}`
  showHorarioModal.value = false
}

function onDocClick(e) {
  if (!showHorarioModal.value) return
  const pop = popoverEl.value
  const btn = editBtn.value
  if (pop && (pop.contains(e.target))) return
  if (btn && (btn.contains(e.target))) return
  showHorarioModal.value = false
}

onMounted(() => {
  document.addEventListener('click', onDocClick)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', onDocClick)
})
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
  position: relative; /* para posicionar el popover */
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

/* Popover compacto (burbuja) junto al botón Editar */
.settings-popover {
  position: absolute;
  top: calc(100% + 8px); /* justo debajo del botón */
  right: 0;
  width: 220px; /* más compacta */
  background: #fff;
  border-radius: 10px;
  border: 1px solid #e9f0f7;
  box-shadow: 0 6px 18px rgba(4,24,44,0.12);
  padding: 0.5rem;
  z-index: 2200;
  font-size: 0.92rem;
}
.time-pickers-compact {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}
.time-picker-compact label {
  font-size: 0.75rem;
  color: #122;
  margin-bottom: 0.18rem;
}
.picker-row-compact {
  display: flex;
  gap: 0.35rem;
  align-items: center;
}
.picker-row-compact select {
  padding: 0.28rem 0.4rem;
  border: 1px solid #dbe7f2;
  border-radius: 6px;
  font-size: 0.88rem;
}
.picker-row-compact select.hour,
.picker-row-compact select.min {
  min-width: 44px;
  max-width: 52px;
}
.picker-row-compact select.ampm {
  min-width: 46px;
}
.popover-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.4rem;
  margin-top: 0.45rem;
}

/* Estilos específicos para botones dentro del popover (más compactos) */
.settings-popover .settings-save,
.settings-popover .settings-cancel {
  padding: 0.28rem 0.6rem;
  font-size: 0.82rem;
  border-radius: 8px;
  line-height: 1;
}
.settings-popover .settings-save {
  background: #0a2c47;
  color: #fff;
  border: none;
}
.settings-popover .settings-cancel {
  background: #fff;
  color: #0a2c47;
  border: 1px solid #0a2c47;
}
.popover-actions { flex-wrap: wrap; }
</style>
