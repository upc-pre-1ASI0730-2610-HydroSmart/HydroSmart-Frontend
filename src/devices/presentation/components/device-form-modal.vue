<template>
  <div class="modal-overlay">
    <div class="modal">
      <header class="modal-header">
        <h3 class="modal-title">{{ t('devices.addDevice') }}</h3>
        <button class="modal-close" type="button" @click="$emit('close')">×</button>
      </header>

      <form class="form" @submit.prevent="submitForm">
        <label class="field">
          <span>{{ t('devices.form.name') }}</span>
          <input v-model.trim="form.name" class="field-input" type="text" required />
        </label>

        <label class="field">
          <span>{{ t('devices.form.section') }}</span>
          <input v-model.trim="form.section" class="field-input" type="text" required />
        </label>


        <p v-if="saveError" class="status error">{{ saveError }}</p>

        <footer class="modal-actions">
          <button class="primary-button" type="submit" :disabled="isSaving">
            {{ isSaving ? t('devices.saving') : t('devices.save') }}
          </button>

          <button class="ghost-button" type="button" :disabled="isSaving" @click="$emit('close')">
            {{ t('devices.cancel') }}
          </button>
        </footer>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { useI18n } from 'vue-i18n'

defineProps({
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

const form = reactive({
  name: '',
  section: ''
})

const submitForm = () => {
  emit('save', {
    name: form.name,
    section: form.section,
    status: 'inactive',
    lastActive: '0 h',
    alerts: 0,
    consumption: 0
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

.modal {
  background: #ffffff;
  border-radius: 18px;
  box-shadow: 0 20px 45px rgba(15, 23, 42, 0.25);
  padding: 1.5rem;
  width: min(520px, 100%);
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
  border: 1.5px solid #3b82f6;
  border-radius: 999px;
  font-size: 0.95rem;
  padding: 0.65rem 0.9rem;
}

.modal-actions {
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
  margin-top: 1rem;
}

.primary-button,
.ghost-button {
  border-radius: 999px;
  cursor: pointer;
  font-size: 0.9rem;
  padding: 0.55rem 1.35rem;
}

.primary-button {
  background: #111827;
  border: none;
  color: #ffffff;
}

.ghost-button {
  background: #ffffff;
  border: 1px solid #6b7280;
}

.status.error {
  color: #b91c1c;
}
</style>