<template>
  <div class="modal-overlay">
    <div class="modal">
      <header class="modal-header">
        <h3 class="modal-title">{{ t('devices.settings') }}</h3>

        <div class="modal-header-actions">
          <button class="link-button" type="button" :disabled="isSaving" @click="toggleEdit">
            {{ isEditing ? t('devices.save') : t('devices.edit') }}
          </button>

          <button class="modal-close" type="button" @click="$emit('close')">×</button>
        </div>
      </header>

      <form class="form" @submit.prevent>
        <label class="field">
          <span>{{ t('devices.form.name') }}</span>
          <input
              v-model.trim="form.name"
              class="field-input"
              type="text"
              :disabled="!isEditing"
          />
        </label>

        <label class="field">
          <span>{{ t('devices.form.section') }}</span>
          <input
              v-model.trim="form.section"
              class="field-input"
              type="text"
              :disabled="!isEditing"
          />
        </label>

        <label class="field">
          <span>{{ t('devices.form.status') }}</span>
          <input
              class="field-input"
              type="text"
              :value="device.isActive ? t('devices.active') : t('devices.inactive')"
              disabled
          />
        </label>

        <label class="field">
          <span>{{ t('devices.form.lastActive') }}</span>
          <input
              class="field-input"
              type="text"
              :value="device.lastActive"
              disabled
          />
        </label>

        <label class="field">
          <span>{{ t('devices.form.alerts') }}</span>
          <input
              class="field-input"
              type="number"
              :value="device.alerts"
              disabled
          />
        </label>

        <label class="field">
          <span>{{ t('devices.form.consumption') }}</span>
          <input
              class="field-input"
              type="text"
              :value="t('devices.litersPerWeek', { count: device.consumption })"
              disabled
          />
        </label>
      </form>
      <p v-if="saveError" class="status error">{{ saveError }}</p>
      <p v-else-if="saveSuccess" class="status success">{{ t('devices.saved') }}</p>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

const props = defineProps({
  device: {
    type: Object,
    required: true
  },
  isSaving: {
    type: Boolean,
    default: false
  },
  saveError: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['close', 'save'])
const { t } = useI18n()

const isEditing = ref(false)
const saveSuccess = ref(false)

const form = reactive({
  name: '',
  section: '',
  status: 'active',
  lastActive: '',
  alerts: 0,
  consumption: 0
})

const syncForm = () => {
  form.name = props.device?.name || ''
  form.section = props.device?.section || ''
  form.status = props.device?.status || 'inactive'
  form.lastActive = props.device?.lastActive || ''
  form.alerts = props.device?.alerts || 0
  form.consumption = props.device?.consumption || 0
}

const toggleEdit = async () => {
  if (!isEditing.value) {
    isEditing.value = true
    saveSuccess.value = false
    return
  }

  emit('save', {
    id: props.device.id,
    updates: {
      name: form.name,
      section: form.section
    }
  })

  isEditing.value = false
  saveSuccess.value = true
}

watch(
    () => props.device,
    () => {
      syncForm()
    },
    { immediate: true }
)
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

.modal {
  background: #ffffff;
  border: 1.5px solid #3b82f6;
  border-radius: 18px;
  box-shadow: 0 20px 45px rgba(15, 23, 42, 0.25);
  padding: 1.5rem;
  width: min(560px, 100%);
}

.modal-header {
  align-items: center;
  display: flex;
  justify-content: space-between;
  margin-bottom: 1.25rem;
}

.modal-title {
  font-size: 1.1rem;
  margin: 0;
}

.modal-header-actions {
  align-items: center;
  display: flex;
  gap: 1rem;
}

.link-button {
  background: none;
  border: none;
  color: #1d4ed8;
  cursor: pointer;
  font-weight: 600;
}

.modal-close {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.5rem;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.field span {
  color: #374151;
  font-size: 0.9rem;
}

.field-input {
  background: #ffffff;
  border: 1.5px solid #3b82f6;
  border-radius: 999px;
  font-size: 0.95rem;
  padding: 0.65rem 0.9rem;
}

.field-input:disabled {
  opacity: 0.7;
}

.status.error {
  color: #b91c1c;
}

.status.success {
  color: #15803d;
}
</style>