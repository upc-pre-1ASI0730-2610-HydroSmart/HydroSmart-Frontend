import db from '../../../server/db.json'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '') || ''

const buildUrl = (path) => {
  if (!API_BASE_URL) {
    throw new Error('API base URL no configurada')
  }

  return `${API_BASE_URL}${path}`
}

export async function fetchProfileById(id) {
  const numericId = Number(id)

  if (!numericId) {
    throw new Error('ID de perfil invalido')
  }

  if (API_BASE_URL) {
    try {
      const response = await fetch(buildUrl(`/users/${numericId}`))

      if (response.ok) {
        return response.json()
      }
    } catch {
      // Si la API simulada no responde, cae al db.json local.
    }
  }

  const users = Array.isArray(db?.users) ? db.users : []
  const user = users.find((item) => Number(item.id) === numericId)

  if (!user) {
    throw new Error('Perfil no encontrado')
  }

  return user
}

export async function updateProfileById(id, updates) {
  const numericId = Number(id)

  if (!numericId) {
    throw new Error('ID de perfil invalido')
  }

  if (!API_BASE_URL) {
    throw new Error('API base URL no configurada')
  }

  try {
    const response = await fetch(buildUrl(`/users/${numericId}`), {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updates)
    })

    if (!response.ok) {
      throw new Error('No se pudo guardar el perfil')
    }

    return response.json()
  } catch (error) {
    throw new Error('No se pudo guardar el perfil. Verifica el json-server.')
  }
}
