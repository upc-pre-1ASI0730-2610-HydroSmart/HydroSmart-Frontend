import { ref } from 'vue'
import { signIn, signUp } from '../infrastructure/auth-api.js'

const STORAGE_KEY = 'hydrosmart.session'

const isAuthenticated = ref(false)
const currentUser = ref('')
const authError = ref('')

const getStorage = () => {
  if (typeof window === 'undefined') return null
  return window.localStorage
}

const saveSession = (session) => {
  const storage = getStorage()
  if (!storage) return

  storage.setItem(STORAGE_KEY, JSON.stringify(session))

  if (session.token) {
    storage.setItem('authToken', session.token)
    storage.setItem('token', session.token)
  }
}

const loadSession = () => {
  const storage = getStorage()
  if (!storage) return null

  const raw = storage.getItem(STORAGE_KEY)
  if (!raw) return null

  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}

const clearSession = () => {
  const storage = getStorage()
  if (!storage) return

  storage.removeItem(STORAGE_KEY)
  storage.removeItem('authToken')
  storage.removeItem('token')
  storage.removeItem('hydrosmart.mockUsers')
  storage.removeItem('hydrosmart.mockSession')
}

const createDisplayName = (email) => {
  const localPart = String(email || '')
      .split('@')[0]
      .replace(/[._-]+/g, ' ')
      .trim()

  if (!localPart) return 'Usuario HydroSmart'

  return localPart
      .split(' ')
      .map((part) => part ? part.charAt(0).toUpperCase() + part.slice(1) : '')
      .join(' ')
}

const applySession = (data) => {
  const session = {
    id: data.id,
    email: data.email,
    role: data.role,
    token: data.token,
    name: createDisplayName(data.email),
    loginAt: new Date().toISOString()
  }

  isAuthenticated.value = true
  currentUser.value = session.name

  saveSession(session)

  return session
}

const restoreSession = () => {
  const session = loadSession()

  if (!session || !session.token) {
    clearSession()
    return
  }

  isAuthenticated.value = true
  currentUser.value = session.name || session.email
}

restoreSession()

export function useAuthStore() {
  const login = async ({ email, password }) => {
    authError.value = ''

    try {
      const data = await signIn({
        email: String(email || '').trim(),
        password: String(password || '').trim()
      })

      const session = applySession(data)

      return {
        success: true,
        message: '',
        user: session
      }
    } catch (error) {
      isAuthenticated.value = false
      currentUser.value = ''
      clearSession()

      authError.value = error.message || 'Usuario o contraseña incorrectos.'

      return {
        success: false,
        message: authError.value
      }
    }
  }

  const register = async ({ email, password, role = 'User' }) => {
    authError.value = ''

    try {
      const cleanEmail = String(email || '').trim()
      const cleanPassword = String(password || '').trim()

      await signUp({
        email: cleanEmail,
        password: cleanPassword,
        role
      })

      const data = await signIn({
        email: cleanEmail,
        password: cleanPassword
      })

      const session = applySession(data)

      return {
        success: true,
        message: 'Registro exitoso',
        user: session
      }
    } catch (error) {
      authError.value = error.message || 'Error al crear la cuenta'

      return {
        success: false,
        message: authError.value
      }
    }
  }

  const logout = async () => {
    isAuthenticated.value = false
    currentUser.value = ''
    authError.value = ''
    clearSession()
  }

  return {
    isAuthenticated,
    currentUser,
    authError,
    login,
    register,
    logout
  }
}