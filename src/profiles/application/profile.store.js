import { ref } from 'vue'

import { fetchProfileById, updateProfileById, createProfile, fetchAllProfiles } from '../infrastructure/profile-api.js'
import { toProfile, toApiModel } from '../infrastructure/profile.assembler.js'

const profile = ref(null)
const profiles = ref([])
const isLoading = ref(false)
const error = ref('')
const lastLoadedId = ref(null)
const isSaving = ref(false)
const saveError = ref('')

export function useProfileStore() {
  const loadProfile = async (id) => {
    if (!id || (lastLoadedId.value === id && profile.value)) {
      return
    }

    isLoading.value = true
    error.value = ''

    try {
      const apiModel = await fetchProfileById(id)
      profile.value = toProfile(apiModel)
      lastLoadedId.value = id
    } catch (err) {
      profile.value = null
      error.value = err instanceof Error ? err.message : 'Error al cargar el perfil'
    } finally {
      isLoading.value = false
    }
  }

  const loadAllProfiles = async () => {
    isLoading.value = true
    error.value = ''

    try {
      const apiModels = await fetchAllProfiles()
      profiles.value = Array.isArray(apiModels) ? apiModels.map(toProfile) : []
    } catch (err) {
      profiles.value = []
      error.value = err instanceof Error ? err.message : 'Error al cargar los perfiles'
    } finally {
      isLoading.value = false
    }
  }

  const saveProfile = async (id, updates) => {
    if (!id || !profile.value) {
      return
    }

    isSaving.value = true
    saveError.value = ''

    try {
      const mergedProfile = {
        ...profile.value,
        ...updates,
        profilePhotoUrl: updates.profilePhotoUrl ?? profile.value.profilePhotoUrl
      }

      const payload = toApiModel(mergedProfile)

      const apiModel = await updateProfileById(id, payload)

      profile.value = toProfile(apiModel)
      lastLoadedId.value = id

      return profile.value
    } catch (err) {
      saveError.value = err instanceof Error ? err.message : 'Error al guardar el perfil'
      throw err
    } finally {
      isSaving.value = false
    }
  }

  const addProfile = async (profileData) => {
    isSaving.value = true
    saveError.value = ''

    try {
      const apiModel = await createProfile(profileData)
      const newProfile = toProfile(apiModel)
      profiles.value.push(newProfile)
      return newProfile
    } catch (err) {
      saveError.value = err instanceof Error ? err.message : 'Error al crear el perfil'
      throw err
    } finally {
      isSaving.value = false
    }
  }

  const clearProfile = () => {
    profile.value = null
    lastLoadedId.value = null
    error.value = ''
  }

  return {
    profile,
    profiles,
    isLoading,
    error,
    isSaving,
    saveError,
    loadProfile,
    loadAllProfiles,
    saveProfile,
    addProfile,
    clearProfile
  }
}


