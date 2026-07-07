import { buildApiUrl, getJsonHeaders } from '@/shared/infrastructure/api-config.js'

const readJsonOrText = async (response) => {
  const text = await response.text()

  if (!text) return null

  try {
    return JSON.parse(text)
  } catch {
    return {
      message: text
    }
  }
}

export async function fetchProfileById(id) {
  const numericId = Number(id)

  if (!numericId) {
    throw new Error('ID de perfil inválido')
  }

  const response = await fetch(buildApiUrl(`/api/v1/profiles/${numericId}`), {
    method: 'GET',
    headers: getJsonHeaders()
  })

  const data = await readJsonOrText(response)

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Perfil no encontrado')
    }

    throw new Error(data?.message || data?.error || `Error al obtener el perfil (${response.status})`)
  }

  return data
}

export async function fetchProfileByUserId(userId) {
  const numericUserId = Number(userId)

  if (!numericUserId) {
    throw new Error('ID de usuario inválido')
  }

  const response = await fetch(buildApiUrl(`/api/v1/users/${numericUserId}/profiles`), {
    method: 'GET',
    headers: getJsonHeaders()
  })

  const data = await readJsonOrText(response)

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Perfil no encontrado')
    }

    throw new Error(data?.message || data?.error || `Error al obtener el perfil (${response.status})`)
  }

  return data
}

export async function createProfile(profileData) {
  const response = await fetch(buildApiUrl('/api/v1/profiles'), {
    method: 'POST',
    headers: getJsonHeaders(),
    body: JSON.stringify(profileData)
  })

  const data = await readJsonOrText(response)

  if (!response.ok) {
    throw new Error(data?.message || data?.error || `Error al crear el perfil (${response.status})`)
  }

  return data
}

export async function updateProfileById(id, profileData) {
  const numericId = Number(id)

  if (!numericId) {
    throw new Error('ID de perfil inválido')
  }

  const response = await fetch(buildApiUrl(`/api/v1/profiles/${numericId}`), {
    method: 'PUT',
    headers: getJsonHeaders(),
    body: JSON.stringify(profileData)
  })

  const data = await readJsonOrText(response)

  if (!response.ok) {
    throw new Error(data?.message || data?.error || `Error al actualizar el perfil (${response.status})`)
  }

  return data
}