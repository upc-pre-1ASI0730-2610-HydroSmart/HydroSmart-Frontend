const API_BASE_URL = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '') || ''

const buildUrl = (path) => {
  return `${API_BASE_URL}${path}`
}

export async function signIn({ email, password }) {
  if (!API_BASE_URL) {
    throw new Error('API base URL no configurada')
  }

  const payload = { email, password }
  console.log('SignIn request:', { url: buildUrl('/api/v1/authentication/sign-in'), payload })

  try {
    const response = await fetch(buildUrl('/api/v1/authentication/sign-in'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })

    console.log('SignIn response status:', response.status)
    const data = await response.json()
    console.log('SignIn response data:', data)

    if (!response.ok) {
      throw new Error(data.message || 'Error al iniciar sesión')
    }

    return data
  } catch (error) {
    console.error('SignIn error:', error)
    throw error
  }
}

export async function signUp({ email, password, role = 'user' }) {
  if (!API_BASE_URL) {
    throw new Error('API base URL no configurada')
  }

  const payload = { email, password, role }
  console.log('SignUp request:', { url: buildUrl('/api/v1/authentication/sign-up'), payload })

  try {
    const response = await fetch(buildUrl('/api/v1/authentication/sign-up'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })

    console.log('SignUp response status:', response.status)
    const text = await response.text()
    console.log('SignUp response text:', text)
    
    let data
    try {
      data = JSON.parse(text)
    } catch (e) {
      data = { message: text || 'Error del servidor' }
    }

    if (!response.ok) {
      throw new Error(data.message || `Error ${response.status}: ${data.error || 'Error al registrarse'}`)
    }

    return data
  } catch (error) {
    console.error('SignUp error:', error)
    throw error
  }
}

export async function logout() {
  const token = localStorage.getItem('authToken')
  if (!token || !API_BASE_URL) {
    return true
  }

  try {
    const response = await fetch(buildUrl('/api/v1/authentication/logout'), {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })

    return response.ok
  } catch (error) {
    console.error('Error al cerrar sesión:', error)
    return true
  }
}
