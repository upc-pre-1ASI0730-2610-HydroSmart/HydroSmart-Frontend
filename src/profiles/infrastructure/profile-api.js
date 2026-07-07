const API_BASE_URL = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '') || 'http://localhost:5001'

const buildUrl = (path) => {
  return `${API_BASE_URL}${path}`
}

const getAuthToken = () => {
  return localStorage.getItem('authToken')
}

const getHeaders = (isFormData = false) => {
  const headers = {
    ...(getAuthToken() && { Authorization: `Bearer ${getAuthToken()}` })
  }

  if (!isFormData) {
    headers['Content-Type'] = 'application/json'
  }

  return headers
}

export async function fetchProfileById(id) {
  const numericId = Number(id)

  if (!numericId) {
    throw new Error('ID de perfil inválido')
  }

  if (!API_BASE_URL) {
    throw new Error('API base URL no configurada')
  }

  try {
    const response = await fetch(buildUrl(`/api/v1/profiles/${numericId}`), {
      method: 'GET',
      headers: getHeaders()
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
  if (!API_BASE_URL) {
    throw new Error('API base URL no configurada')
  }

  try {
    const response = await fetch(buildUrl('/api/v1/profiles'), {
      method: 'GET',
      headers: getHeaders()
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
  if (!API_BASE_URL) {
    throw new Error('API base URL no configurada')
  }

  try {
    const response = await fetch(buildUrl('/api/v1/profiles'), {
      method: 'POST',
      headers: getHeaders(),
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

  if (!API_BASE_URL) {
    throw new Error('API base URL no configurada')
  }

  try {
    const response = await fetch(buildUrl(`/api/v1/profiles/${numericId}`), {
      method: 'PUT',
      headers: getHeaders(),
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
