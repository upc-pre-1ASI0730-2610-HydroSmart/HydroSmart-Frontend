<template>
  <section class="profile-page">
    <h1 class="page-title">{{ t('views.profileTitle') }}</h1>

    <div class="profile-content">
      <div class="profile-card">
        <div class="card-header">
          <h2 class="card-title">{{ t('profile.personalInfo') }}</h2>
          <button class="link-button" type="button" :disabled="isSaving" @click="toggleEditInfo">
            {{ isEditingInfo ? t('profile.save') : t('profile.edit') }}
          </button>
        </div>

        <div v-if="isLoading" class="status">{{ t('profile.loading') }}</div>
        <div v-else-if="error" class="status error">{{ error }}</div>
        <div v-else>
          <form class="card-fields" @submit.prevent>
            <div class="field">
              <input class="field-input" type="text" :value="profile?.firstName" disabled />
            </div>
            <div class="field">
              <input class="field-input" type="text" :value="profile?.lastName" disabled />
            </div>
            <div class="field">
              <input class="field-input" type="email" :value="profile?.email" disabled />
            </div>
            <div class="field">
              <label class="field-label" for="address">{{ t('profile.address') }}</label>
              <input
                id="address"
                v-model.trim="form.address"
                class="field-input"
                type="text"
                :disabled="!isEditingInfo"
                :placeholder="t('profile.addressPlaceholder')"
              />
            </div>
            <div class="field">
              <label class="field-label" for="phone">{{ t('profile.phoneNumber') }}</label>
              <input
                id="phone"
                v-model.trim="form.phoneNumber"
                class="field-input"
                type="text"
                :disabled="!isEditingInfo"
                :placeholder="t('profile.phonePlaceholder')"
              />
            </div>
          </form>

          <div v-if="saveError" class="status error">{{ saveError }}</div>
          <div v-else-if="saveSuccess" class="status success">{{ t('profile.saved') }}</div>
        </div>
      </div>

      <div class="photo-card">
        <img
          class="photo"
          :src="profile?.profilePhotoUrl"
          :alt="profile?.fullName || t('app.avatarAlt')"
        />
        <button class="link-button" type="button" :disabled="isSaving" @click="openPhotoModal">
          {{ t('profile.editPhoto') }}
        </button>
      </div>
    </div>

    <div v-if="isPhotoModalOpen" class="modal-overlay" role="presentation">
      <div class="modal">
        <header class="modal-header">
          <h3 class="modal-title">{{ t('profile.photoModalTitle') }}</h3>
          <button class="modal-close" type="button" @click="closePhotoModal">×</button>
        </header>
        <div class="modal-body">
          <label class="field-label" for="photoUrl">{{ t('profile.photoUrl') }}</label>
          <input
            id="photoUrl"
            v-model.trim="photoForm.profilePhotoUrl"
            class="field-input"
            type="url"
            :placeholder="t('profile.photoPlaceholder')"
          />
        </div>
        <footer class="modal-actions">
          <button class="primary-button" type="button" :disabled="isSaving" @click="savePhoto">
            {{ isSaving ? t('profile.saving') : t('profile.save') }}
          </button>
          <button class="ghost-button" type="button" :disabled="isSaving" @click="closePhotoModal">
            {{ t('profile.cancel') }}
          </button>
        </footer>
      </div>
    </div>
  </section>
</template>

<script setup>
import { onMounted, reactive, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

import { useProfileStore } from '../../application/profile.store.js'

const { t } = useI18n()
const { profile, isLoading, error, isSaving, saveError, loadProfile, saveProfile } = useProfileStore()

const profileId = Number(import.meta.env.VITE_PROFILE_ID) || 1
const form = reactive({
  address: '',
  phoneNumber: ''
})
const photoForm = reactive({
  profilePhotoUrl: ''
})
const saveSuccess = ref(false)
const isEditingInfo = ref(false)
const isPhotoModalOpen = ref(false)

const syncForm = () => {
  form.address = profile.value?.address || ''
  form.phoneNumber = profile.value?.phoneNumber || ''
  photoForm.profilePhotoUrl = profile.value?.profilePhotoUrl || ''
}

const toggleEditInfo = async () => {
  if (!isEditingInfo.value) {
    isEditingInfo.value = true
    saveSuccess.value = false
    return
  }

  if (!profile.value?.id) {
    return
  }

  saveSuccess.value = false

  await saveProfile(profile.value.id, {
    address: form.address,
    phoneNumber: form.phoneNumber
  })

  isEditingInfo.value = false
  saveSuccess.value = true
}

const openPhotoModal = () => {
  photoForm.profilePhotoUrl = profile.value?.profilePhotoUrl || ''
  isPhotoModalOpen.value = true
  saveSuccess.value = false
}

const closePhotoModal = () => {
  isPhotoModalOpen.value = false
}

const savePhoto = async () => {
  if (!profile.value?.id) {
    return
  }

  saveSuccess.value = false

  await saveProfile(profile.value.id, {
    profilePhotoUrl: photoForm.profilePhotoUrl
  })

  isPhotoModalOpen.value = false
  saveSuccess.value = true
}

watch(
  () => profile.value,
  () => {
    syncForm()
  },
  { immediate: true }
)

onMounted(() => {
  loadProfile(profileId)
})
</script>

<style scoped>
.profile-page {
  padding: 2rem 2.5rem 3rem;
}

.page-title {
  font-size: 2rem;
  font-weight: 600;
  margin: 0 0 2rem;
}

.profile-content {
  display: grid;
  grid-template-columns: minmax(280px, 1.1fr) minmax(220px, 0.7fr);
  gap: 2.5rem;
  align-items: start;
}

.profile-card {
  border: 1.5px solid #3b82f6;
  border-radius: 18px;
  padding: 1.5rem 1.75rem 2rem;
  background: #fff;
  min-height: 350px;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.card-title {
  font-size: 1.05rem;
  font-weight: 500;
  margin: 0;
}

.link-button {
  background: none;
  border: none;
  color: #1d4ed8;
  cursor: pointer;
  font-weight: 600;
  padding: 0;
}

.link-button:disabled {
  color: #94a3b8;
  cursor: not-allowed;
}

.status {
  font-size: 0.95rem;
  color: #4b5563;
}

.status.error {
  color: #b91c1c;
}

.status.success {
  color: #15803d;
}

.card-fields {
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.field-label {
  font-size: 0.9rem;
  color: #374151;
}

.field-input {
  width: 100%;
  padding: 0.65rem 0.9rem;
  border: 1.5px solid #3b82f6;
  border-radius: 999px;
  font-size: 0.95rem;
  background: #fff;
  color: #111827;
}

.field-input:disabled {
  opacity: 0.7;
}

.primary-button,
.ghost-button {
  padding: 0.55rem 1.35rem;
  border-radius: 999px;
  font-size: 0.9rem;
  cursor: pointer;
}

.primary-button {
  border: none;
  background: #111827;
  color: #fff;
}

.primary-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.ghost-button {
  border: 1px solid #6b7280;
  background: #fff;
  color: #111827;
}

.photo-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
}

.photo {
  width: 100%;
  max-width: 320px;
  aspect-ratio: 3 / 4;
  object-fit: cover;
  border-radius: 14px;
  background: #e5e7eb;
}

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
  z-index: 20;
}

.modal {
  width: min(420px, 100%);
  background: #fff;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 20px 45px rgba(15, 23, 42, 0.25);
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1rem;
}

.modal-title {
  font-size: 1.05rem;
  margin: 0;
}

.modal-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #0f172a;
}

.modal-body {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.modal-actions {
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
  margin-top: 1.25rem;
}

@media (max-width: 960px) {
  .profile-content {
    grid-template-columns: 1fr;
  }

  .photo {
    max-width: 260px;
  }
}
</style>
