import { buildApiUrl } from '@/shared/infrastructure/api-config.js'

const extractTokenFromResponse = (data) => {
  if (!data) return null
  return (
    data.token ||
    data.accessToken ||
    data.access_token ||
    data.jwtToken ||
    data.jwt ||
    (data.data && (data.data.token || data.data.accessToken || data.data.access_token)) ||
    null
  )
}

const saveTokenToLocal = (token) => {
  try {
    if (!token) return
    localStorage.setItem('authToken', token)
    // also keep simple 'token' key for compatibility
    localStorage.setItem('token', token)
  } catch (e) {
    // ignore
  }
}

const parseResponseBody = async (response) => {
  const text = await response.text()

  if (!text) {
    return {}
  }

  try {
    return JSON.parse(text)
  } catch {
    if (text.includes('System.Exception') || text.includes('Invalid email or password')) {
      return { message: 'Correo o contrasena incorrectos.' }
    }

    if (text.includes('<!DOCTYPE html') || text.includes('DeveloperExceptionPage')) {
      return { message: 'Error del servidor. Reinicia el backend y vuelve a intentar.' }
    }

    return { message: text }
  }
}

export async function signIn({ email, password }) {
  const payload = { email, password }

  try {
    const response = await fetch(buildApiUrl('/api/v1/authentication/sign-in'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })

    const data = await parseResponseBody(response)

    if (!response.ok) {
      throw new Error(data.message || 'Error al iniciar sesión')
    }

    const token = extractTokenFromResponse(data)
    if (token) {
      saveTokenToLocal(token)
    }

    return data
  } catch (error) {
    console.error('SignIn error:', error)
    throw error
  }
}

export async function signUp({ email, password, role = 'user' }) {
  const payload = { email, password, role }

  try {
    const response = await fetch(buildApiUrl('/api/v1/authentication/sign-up'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })

    const data = await parseResponseBody(response)

    if (!response.ok) {
      throw new Error(data.message || `Error ${response.status}: ${data.error || 'Error al registrarse'}`)
    }

    const token = extractTokenFromResponse(data)
    if (token) {
      saveTokenToLocal(token)
    }

    return data
  } catch (error) {
    console.error('SignUp error:', error)
    throw error
  }
}

export async function logout() {
  const token = localStorage.getItem('authToken')
  if (!token) {
    return true
  }

  try {
    const response = await fetch(buildApiUrl('/api/v1/authentication/logout'), {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })

    // clear local token on logout
    try { localStorage.removeItem('authToken'); localStorage.removeItem('token') } catch (e) {}

    return response.ok
  } catch (error) {
    console.error('Error al cerrar sesión:', error)
    return true
  }
}
