import { ref } from 'vue'

import { logout as logoutRequest, signIn, signUp } from '../infrastructure/auth-api.js'

const SESSION_KEY = 'hydrosmart.session'

const isAuthenticated = ref(false)
const currentUser = ref('')
const currentUserId = ref(null)
const authError = ref('')

const readSession = () => {
  const rawSession = localStorage.getItem(SESSION_KEY)

  if (!rawSession) {
    return null
  }

  try {
    return JSON.parse(rawSession)
  } catch {
    return null
  }
}

const saveSession = (session) => {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session))
  localStorage.setItem('authToken', session.token)
  localStorage.setItem('token', session.token)
}

const clearSession = () => {
  localStorage.removeItem(SESSION_KEY)
  localStorage.removeItem('authToken')
  localStorage.removeItem('token')
}

const applySession = (data, fallbackEmail = '') => {
  const token = data?.token || data?.accessToken || data?.access_token

  if (!token) {
    throw new Error('El backend no devolvio un token de autenticacion')
  }

  const session = {
    id: data?.id ?? null,
    email: data?.email ?? fallbackEmail,
    role: data?.role ?? 'user',
    token
  }

  saveSession(session)
  isAuthenticated.value = true
  currentUser.value = session.email
  currentUserId.value = session.id

  return session
}

const restoreSession = () => {
  const session = readSession()

  if (!session?.token) {
    clearSession()
    return
  }

  isAuthenticated.value = true
  currentUser.value = session.email || ''
  currentUserId.value = session.id ?? null
  localStorage.setItem('authToken', session.token)
  localStorage.setItem('token', session.token)
}

restoreSession()

export function useAuthStore() {
  const login = async ({ email, password }) => {
    authError.value = ''

    try {
      const data = await signIn({ email, password })
      const session = applySession(data, email)

      return {
        success: true,
        message: '',
        user: session
      }
    } catch (error) {
      clearSession()
      isAuthenticated.value = false
      currentUser.value = ''
      currentUserId.value = null
      authError.value = error instanceof Error ? error.message : 'Usuario o contrasena incorrectos.'

      return {
        success: false,
        message: authError.value
      }
    }
  }

  const register = async ({ email, password, role = 'user' }) => {
    authError.value = ''

    try {
      await signUp({ email, password, role })
      const data = await signIn({ email, password })
      const session = applySession(data, email)

      return {
        success: true,
        message: '',
        user: session
      }
    } catch (error) {
      clearSession()
      isAuthenticated.value = false
      currentUser.value = ''
      currentUserId.value = null
      authError.value = error instanceof Error ? error.message : 'Error al crear la cuenta.'

      return {
        success: false,
        message: authError.value
      }
    }
  }

  const logout = async () => {
    await logoutRequest()
    clearSession()
    isAuthenticated.value = false
    currentUser.value = ''
    currentUserId.value = null
    authError.value = ''
  }

  return {
    isAuthenticated,
    currentUser,
    currentUserId,
    authError,
    login,
    register,
    logout
  }
}
