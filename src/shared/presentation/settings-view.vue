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

        <!-- Reportes personalizados (dentro de la misma tarjeta) -->
        <div class="settings-divider" />
        <div class="reports-section">
          <h3 class="reports-title">{{ t('settings.reports.title') }}</h3>
          <div class="report-row">
            <div class="report-label">{{ t('settings.reports.frequency') }}</div>
            <div class="pills">
              <button :class="['pill', { active: reportFrequency === 'daily' }]" @click="setFrequency('daily')">{{ t('settings.reports.daily') }}</button>
              <button :class="['pill', { active: reportFrequency === 'weekly' }]" @click="setFrequency('weekly')">{{ t('settings.reports.weekly') }}</button>
              <button :class="['pill', { active: reportFrequency === 'monthly' }]" @click="setFrequency('monthly')">{{ t('settings.reports.monthly') }}</button>
            </div>
          </div>
          <div class="report-row">
            <div class="report-label">{{ t('settings.reports.format') }}</div>
            <div class="pills">
              <button :class="['pill', { active: reportFormat === 'PDF' }]" @click="setFormat('PDF')">PDF</button>
              <button :class="['pill', { active: reportFormat === 'CSV' }]" @click="setFormat('CSV')">CSV</button>
            </div>
           </div>
         </div>
       </div>
       <!-- Seguridad y Privacidad -->
       <div class="settings-card">
         <div class="settings-card-header">
           <span>{{ t('settings.security.title') }}</span>
         </div>
         <div class="security-list">
           <div class="security-row">
             <div class="security-label">{{ t('settings.security.changePassword') }}</div>
                <button class="security-edit-badge" type="button" @click="openPasswordModal">{{ t('settings.security.changePasswordBtn') }}</button>
           </div>
           <div class="security-row">
              <div class="security-label">{{ t('settings.security.twoFactor') }}</div>
                <button class="security-edit-badge" type="button" @click="openTwoFactorModal">{{ t('settings.security.twoFactorBtn') }}</button>
           </div>
         </div>
       </div>
       <!-- Ayuda y Soporte -->
       <div class="settings-card">
         <div class="settings-card-header">
           <span>{{ t('settings.help.title') }}</span>
         </div>
         <div class="help-list">
            <router-link class="help-link" to="/help">{{ t('settings.help.center') }}</router-link>
            <router-link class="help-link" to="/help/contact">{{ t('settings.help.contact') }}</router-link>
            <router-link class="help-link" to="/help/tutorials">{{ t('settings.help.tutorials') }}</router-link>
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
    <!-- Modal para cambiar contraseña -->
    <div v-if="showPasswordModal" class="password-modal-overlay" @click.self="closePasswordModal">
      <div class="password-modal" @click.stop>
        <div class="password-modal-header">
          <div>
            <p class="password-modal-kicker">{{ t('settings.security.title') }}</p>
            <h2>{{ t('settings.security.passwordModalTitle') }}</h2>
          </div>
          <button type="button" class="password-modal-close" @click="closePasswordModal">×</button>
        </div>

        <p class="password-modal-description">
          {{ t('settings.security.passwordModalDescription') }}
        </p>

        <form class="password-form" @submit.prevent="savePasswordChange">
          <label class="password-field">
            <span>{{ t('settings.security.currentPassword') }}</span>
            <input v-model="currentPassword" type="password" :placeholder="t('settings.security.currentPasswordPlaceholder')" />
          </label>

          <label class="password-field">
            <span>{{ t('settings.security.newPassword') }}</span>
            <input v-model="newPassword" type="password" :placeholder="t('settings.security.newPasswordPlaceholder')" />
          </label>

          <label class="password-field">
            <span>{{ t('settings.security.confirmPassword') }}</span>
            <input v-model="confirmPassword" type="password" :placeholder="t('settings.security.confirmPasswordPlaceholder')" />
          </label>

          <p v-if="passwordError" class="password-error">{{ passwordError }}</p>

          <div class="password-modal-actions">
            <button type="button" class="password-secondary-btn" @click="closePasswordModal">
              {{ t('settings.cancel') }}
            </button>
            <button type="submit" class="password-primary-btn">
              {{ t('settings.security.savePasswordBtn') }}
            </button>
          </div>
        </form>
      </div>
    </div>
    <!-- Modal para Autenticación en Dos Factores -->
    <div v-if="showTwoFactorModal" class="password-modal-overlay" @click.self="closeTwoFactorModal">
      <div class="password-modal" @click.stop>
        <div class="password-modal-header">
          <div>
            <p class="password-modal-kicker">{{ t('settings.security.title') }}</p>
            <h2>{{ t('settings.security.twoFactorModalTitle') }}</h2>
          </div>
          <button type="button" class="password-modal-close" @click="closeTwoFactorModal">×</button>
        </div>

        <p class="password-modal-description">
          {{ t('settings.security.twoFactorModalDescription') }}
        </p>

        <form class="password-form" @submit.prevent="saveTwoFactorSettings">
          <div class="twofactor-field">
            <span>{{ t('settings.security.twoFactorChoose') }}</span>
            <div class="twofactor-options">
              <label class="twofactor-item">
                <input type="radio" value="authenticator" v-model="twoFactorMethod" />
                <div class="twofactor-label">
                  <strong>{{ t('settings.security.twoFactorAuthenticator') }}</strong>
                  <div class="twofactor-sub">{{ t('settings.security.twoFactorAuthenticatorDesc') }}</div>
                </div>
              </label>
              <label class="twofactor-item">
                <input type="radio" value="sms" v-model="twoFactorMethod" />
                <div class="twofactor-label">
                  <strong>{{ t('settings.security.twoFactorSMS') }}</strong>
                  <div class="twofactor-sub">{{ t('settings.security.twoFactorSMSDesc') }}</div>
                </div>
              </label>
            </div>
          </div>

          <div v-if="twoFactorMethod === 'sms'" class="password-field">
            <span>{{ t('settings.security.phoneNumber') }}</span>
            <input v-model="twoFactorPhone" type="tel" :placeholder="t('settings.security.phonePlaceholder')" />
          </div>

          <p v-if="twoFactorError" class="password-error">{{ twoFactorError }}</p>

          <div class="password-modal-actions">
            <button type="button" class="password-secondary-btn" @click="closeTwoFactorModal">{{ t('settings.cancel') }}</button>
            <button type="submit" class="password-primary-btn">{{ t('settings.security.enableTwoFactorBtn') }}</button>
          </div>
        </form>
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
  horario: '05:00 AM - 22:00 PM',
  reportFrequency: 'monthly',
  reportFormat: 'PDF'
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
const showPasswordModal = ref(false)
const showTwoFactorModal = ref(false)
const editBtn = ref(null)
const popoverEl = ref(null)
const currentPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const passwordError = ref('')
const twoFactorMethod = ref('authenticator')
const twoFactorPhone = ref('')
const twoFactorError = ref('')

// Selectores de tiempo (estilo alarma)
const hours = Array.from({ length: 12 }).map((_, i) => String(i + 1).padStart(2, '0'))
const minutes = Array.from({ length: 12 }).map((_, i) => String(i * 5).padStart(2, '0')) // 00,05,...55

const startHour = ref('05')
const startMin = ref('00')
const startAmpm = ref('AM')
const endHour = ref('10')
const endMin = ref('00')
const endAmpm = ref('PM')
// Reportes personalizados
const reportFrequency = ref(initialState.reportFrequency)
const reportFormat = ref(initialState.reportFormat)

// Función para guardar en localStorage
function saveToLocalStorage() {
  const state = {
    autoClose: autoClose.value,
    blockAll: blockAll.value,
    block20: block20.value,
    reduceIntensity: reduceIntensity.value,
    alertasConsumo: alertasConsumo.value,
    resumen: resumen.value,
    horario: horario.value,
    reportFrequency: reportFrequency.value,
    reportFormat: reportFormat.value
  }
  localStorage.setItem('hydrosmart-settings', JSON.stringify(state))
}

// Función para cargar del localStorage
function loadFromLocalStorage() {
  const saved = localStorage.getItem('hydrosmart-settings')
  if (saved) {
    try {
      const state = JSON.parse(saved)
      autoClose.value = state.autoClose || initialState.autoClose
      blockAll.value = state.blockAll !== undefined ? state.blockAll : initialState.blockAll
      block20.value = state.block20 || initialState.block20
      reduceIntensity.value = state.reduceIntensity !== undefined ? state.reduceIntensity : initialState.reduceIntensity
      alertasConsumo.value = state.alertasConsumo !== undefined ? state.alertasConsumo : initialState.alertasConsumo
      resumen.value = state.resumen !== undefined ? state.resumen : initialState.resumen
      horario.value = state.horario || initialState.horario
      reportFrequency.value = state.reportFrequency || initialState.reportFrequency
      reportFormat.value = state.reportFormat || initialState.reportFormat
      // Actualizar initialState para cancelar funcione correctamente
      initialState.autoClose = autoClose.value
      initialState.blockAll = blockAll.value
      initialState.block20 = block20.value
      initialState.reduceIntensity = reduceIntensity.value
      initialState.alertasConsumo = alertasConsumo.value
      initialState.resumen = resumen.value
      initialState.horario = horario.value
      initialState.reportFrequency = reportFrequency.value
      initialState.reportFormat = reportFormat.value
    } catch (e) {
      console.error('Error loading settings:', e)
    }
  }
}

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
   // Actualiza el estado inicial
   initialState.autoClose = autoClose.value
   initialState.blockAll = blockAll.value
   initialState.block20 = block20.value
   initialState.reduceIntensity = reduceIntensity.value
   initialState.alertasConsumo = alertasConsumo.value
   initialState.resumen = resumen.value
   initialState.horario = horario.value
   initialState.reportFrequency = reportFrequency.value
   initialState.reportFormat = reportFormat.value
   // Guardar en localStorage
   saveToLocalStorage()
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
  reportFrequency.value = initialState.reportFrequency
  reportFormat.value = initialState.reportFormat
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

function setFrequency(f) {
  reportFrequency.value = f
}

function setFormat(f) {
  reportFormat.value = f
}

function openPasswordModal() {
  passwordError.value = ''
  currentPassword.value = ''
  newPassword.value = ''
  confirmPassword.value = ''
  showPasswordModal.value = true
}

function closePasswordModal() {
  showPasswordModal.value = false
  passwordError.value = ''
  currentPassword.value = ''
  newPassword.value = ''
  confirmPassword.value = ''
}

function savePasswordChange() {
  if (!currentPassword.value || !newPassword.value || !confirmPassword.value) {
    passwordError.value = t('settings.security.passwordRequired')
    return
  }

  if (newPassword.value.length < 6) {
    passwordError.value = t('settings.security.passwordMinLength')
    return
  }

  if (newPassword.value !== confirmPassword.value) {
    passwordError.value = t('settings.security.passwordMismatch')
    return
  }

  passwordError.value = ''
  closePasswordModal()
  showToast.value = true
  setTimeout(() => {
    showToast.value = false
  }, 2200)
}

function openTwoFactorModal() {
  twoFactorError.value = ''
  twoFactorMethod.value = 'authenticator'
  twoFactorPhone.value = ''
  showTwoFactorModal.value = true
}

function closeTwoFactorModal() {
  showTwoFactorModal.value = false
  twoFactorError.value = ''
}

function saveTwoFactorSettings() {
  // Validaciones básicas
  if (twoFactorMethod.value === 'sms') {
    if (!twoFactorPhone.value || !/\d{6,}/.test(twoFactorPhone.value.replace(/\s|\-|\+/g, ''))) {
      twoFactorError.value = t('settings.security.twoFactorPhoneError')
      return
    }
  }

  // Simular habilitación
  twoFactorError.value = ''
  showTwoFactorModal.value = false
  showToast.value = true
  setTimeout(() => { showToast.value = false }, 2200)
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

onMounted(() => {
  loadFromLocalStorage()
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
.help-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.help-link {
  color: #0a6eb8;
  text-decoration: underline;
  font-size: 0.98rem;
}
.security-list {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}
.security-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.6rem;
}
.security-label {
  font-size: 0.98rem;
  color: #223;
}
.security-edit-badge {
  background: #111;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 0.24rem 0.7rem;
  font-size: 0.78rem;
  cursor: pointer;
  font-weight: 500;
}
.security-edit-badge:hover {
  opacity: 0.92;
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
.settings-divider {
  height: 1px;
  background: #e6f0fb;
  margin: 0.9rem 0;
}
.reports-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 0.2rem;
  width: 100%;
}
.reports-title {
  font-size: 1.05rem;
  margin: 0 0 0.6rem 0;
  font-weight: 600;
  width: 100%;
  text-align: center;
}
.report-row {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.45rem;
  margin-bottom: 0.5rem;
  width: 100%;
  text-align: center;
}
.report-label {
  color: #233;
  font-size: 0.95rem;
}
.pills {
  display: flex;
  gap: 0.45rem;
  justify-content: center;
  flex-wrap: wrap;
}
.pill {
  padding: 0.28rem 0.7rem;
  border-radius: 999px;
  border: 1px solid #cbdff0;
  background: #fff;
  color: #0a2c47;
  font-size: 0.9rem;
  cursor: pointer;
  white-space: nowrap;
}
.pill.active {
  background: #0a2c47;
  color: #fff;
  border-color: #0a2c47;
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
.password-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(10, 18, 31, 0.58);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2100;
  padding: 1rem;
}
.password-modal {
  width: min(100%, 560px);
  background: linear-gradient(180deg, #f9fbfd 0%, #ffffff 100%);
  border: 1.5px solid #b6c6d6;
  border-radius: 22px;
  box-shadow: 0 18px 40px rgba(4,24,44,0.28);
  padding: 1.5rem 1.6rem 1.4rem;
  color: #0f172a;
}
.password-modal-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
}
.password-modal-kicker {
  margin: 0 0 0.25rem;
  color: #0a6eb8;
  font-weight: 600;
  font-size: 0.92rem;
}
.password-modal h2 {
  margin: 0;
  font-size: 1.65rem;
  line-height: 1.15;
  color: #0a2c47;
}
.password-modal-close {
  border: none;
  background: transparent;
  color: #0a2c47;
  font-size: 2rem;
  line-height: 1;
  cursor: pointer;
  padding: 0;
}
.password-modal-description {
  margin: 0.85rem 0 1.2rem;
  color: #475569;
  font-size: 0.98rem;
  line-height: 1.45;
}
.twofactor-field span {
  display: block;
  margin-bottom: 0.45rem;
  font-weight: 600;
  color: #0f172a;
}
.twofactor-options {
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
  margin-top: 0.35rem;
}
.twofactor-item {
  display: flex;
  gap: 0.9rem;
  align-items: flex-start;
}
.twofactor-item input[type="radio"] {
  margin-top: 6px;
  width: 18px;
  height: 18px;
}
.twofactor-label {
  display: flex;
  flex-direction: column;
}
.twofactor-label strong {
  font-size: 1rem;
  color: #0a2c47;
}
.twofactor-sub {
  color: #475569;
  font-size: 0.92rem;
  margin-top: 0.18rem;
}
.password-form {
  display: flex;
  flex-direction: column;
  gap: 0.95rem;
}
.password-field {
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
  font-size: 0.95rem;
  font-weight: 600;
  color: #0f172a;
}
.password-field input {
  width: 100%;
  border: 1.5px solid #b6c6d6;
  border-radius: 14px;
  background: #fff;
  padding: 0.95rem 1rem;
  font-size: 0.98rem;
  color: #0f172a;
  outline: none;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}
.password-field input::placeholder {
  color: #94a3b8;
}
.password-field input:focus {
  border-color: #0a6eb8;
  box-shadow: 0 0 0 3px rgba(10, 110, 184, 0.12);
}
.password-error {
  margin: 0;
  color: #b91c1c;
  font-size: 0.92rem;
}
.password-modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.85rem;
  margin-top: 0.6rem;
}
.password-secondary-btn {
  background: #fff;
  color: #0a2c47;
  border: 1.5px solid #0a2c47;
  border-radius: 16px;
  padding: 0.75rem 1.6rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
}
.password-primary-btn {
  background: #0a2c47;
  color: #fff;
  border: none;
  border-radius: 16px;
  padding: 0.75rem 1.6rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
}
.password-secondary-btn:hover,
.password-primary-btn:hover {
  transform: translateY(-1px);
}
.password-secondary-btn:active,
.password-primary-btn:active {
  transform: translateY(0);
}
.settings-modal-actions {
   margin-top: 1.5rem;
   display: flex;
   justify-content: center;
   gap: 1.5rem;
 }

@media (max-width: 640px) {
  .password-modal {
    padding: 1.2rem;
    border-radius: 18px;
  }

  .password-modal h2 {
    font-size: 1.35rem;
  }

  .password-modal-actions {
    flex-direction: column-reverse;
  }

  .password-secondary-btn,
  .password-primary-btn {
    width: 100%;
  }
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
