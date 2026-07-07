import { buildApiUrl, getJsonHeaders } from '@/shared/infrastructure/api-config.js'

export async function fetchProfileById(id) {
  const numericId = Number(id)

  if (!numericId) {
    throw new Error('ID de perfil inválido')
  }

  try {
    const response = await fetch(buildApiUrl(`/api/v1/profiles/${numericId}`), {
      method: 'GET',
      headers: getJsonHeaders()
    })

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Perfil no encontrado')
      }
      throw new Error('Error al obtener el perfil')
    }

    return response.json()
  } catch (error) {
    throw error
  }
}

export async function fetchAllProfiles() {
  try {
    const response = await fetch(buildApiUrl('/api/v1/profiles'), {
      method: 'GET',
      headers: getJsonHeaders()
    })

    if (!response.ok) {
      throw new Error('Error al obtener los perfiles')
    }

    return response.json()
  } catch (error) {
    throw error
  }
}

export async function createProfile(profileData) {
  try {
    const response = await fetch(buildApiUrl('/api/v1/profiles'), {
      method: 'POST',
      headers: getJsonHeaders(),
      body: JSON.stringify(profileData)
    })

    if (!response.ok) {
      if (response.status === 400) {
        throw new Error('Los datos del perfil no son válidos')
      }
      throw new Error('Error al crear el perfil')
    }

    return response.json()
  } catch (error) {
    throw error
  }
}

export async function updateProfileById(id, updates) {
  const numericId = Number(id)

  if (!numericId) {
    throw new Error('ID de perfil inválido')
  }

  try {
    const response = await fetch(buildApiUrl(`/api/v1/profiles/${numericId}`), {
      method: 'PUT',
      headers: getJsonHeaders(),
      body: JSON.stringify(updates)
    })

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Perfil no encontrado')
      }
      if (response.status === 400) {
        throw new Error('Los datos del perfil no son válidos')
      }
      throw new Error('Error al guardar el perfil')
    }

    return response.json()
  } catch (error) {
    throw error
  }
}
