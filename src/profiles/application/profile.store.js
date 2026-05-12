import { ref } from 'vue'

import { fetchProfileById, updateProfileById } from '../infrastructure/profile-api.js'
import { toProfile } from '../infrastructure/profile.assembler.js'

const profile = ref(null)
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

  const saveProfile = async (id, updates) => {
    if (!id) {
      return
    }

    isSaving.value = true
    saveError.value = ''

    try {
      const apiModel = await updateProfileById(id, updates)
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

  return {
    profile,
    isLoading,
    error,
    isSaving,
    saveError,
    loadProfile,
    saveProfile
  }
}
