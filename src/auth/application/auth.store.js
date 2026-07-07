import { ref } from 'vue'

const STORAGE_KEYS = {
  users: 'hydrosmart.mockUsers',
  session: 'hydrosmart.mockSession'
}

const DEFAULT_USER = {
  id: 'mock-admin-1',
  email: 'admin123@gmail.com',
  password: 'admin123',
  role: 'admin',
  name: 'Administrador HydroSmart'
}

const isAuthenticated = ref(false)
const currentUser = ref('')
const authError = ref('')

const getStorage = () => {
  if (typeof window === 'undefined') {
    return null
  }

  return window.localStorage
}

const createDisplayName = (email) => {
  const localPart = String(email || '')
    .split('@')[0]
    .replace(/[._-]+/g, ' ')
    .trim()

  if (!localPart) {
    return 'Usuario HydroSmart'
  }

  return localPart
    .split(' ')
    .map((part) => part ? part.charAt(0).toUpperCase() + part.slice(1) : '')
    .join(' ')
}

const createMockToken = (email) => {
  return `mock-${String(email || '').toLowerCase()}-${Date.now()}`
}

const readJson = (storage, key, fallback) => {
  if (!storage) {
    return fallback
  }

  const raw = storage.getItem(key)
  if (!raw) {
    return fallback
  }

  try {
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : fallback
  } catch (error) {
    return fallback
  }
}

const writeJson = (storage, key, value) => {
  if (!storage) {
    return
  }

  storage.setItem(key, JSON.stringify(value))
}

const ensureSeedUsers = (users) => {
  const normalized = Array.isArray(users) ? users : []
  const hasDefaultUser = normalized.some((user) => String(user.email || '').toLowerCase() === DEFAULT_USER.email)

  if (!hasDefaultUser) {
    normalized.unshift({ ...DEFAULT_USER })
  }

  return normalized
}

const loadUsers = () => {
  const storage = getStorage()
  const users = ensureSeedUsers(readJson(storage, STORAGE_KEYS.users, []))
  writeJson(storage, STORAGE_KEYS.users, users)
  return users
}

const saveUsers = (users) => {
  const storage = getStorage()
  writeJson(storage, STORAGE_KEYS.users, ensureSeedUsers(users))
}

const loadSession = () => {
  const storage = getStorage()
  return readJson(storage, STORAGE_KEYS.session, null)
}

const saveSession = (session) => {
  const storage = getStorage()
  writeJson(storage, STORAGE_KEYS.session, session)
}

const clearSession = () => {
  const storage = getStorage()
  if (!storage) {
    return
  }

  storage.removeItem(STORAGE_KEYS.session)
}

const setAuthenticatedUser = (user) => {
  const session = {
    token: createMockToken(user.email),
    id: user.id,
    email: user.email,
    role: user.role,
    name: user.name,
    loginAt: new Date().toISOString()
  }

  isAuthenticated.value = true
  currentUser.value = user.name || user.email
  saveSession(session)

  return session
}

const restoreSession = () => {
  const session = loadSession()

  if (!session || !session.email) {
    return
  }

  isAuthenticated.value = true
  currentUser.value = session.name || session.email
}

restoreSession()

export function useAuthStore() {
  const login = async ({ email, password }) => {
    authError.value = ''

    const normalizedEmail = String(email || '').trim().toLowerCase()
    const normalizedPassword = String(password || '').trim()
    const users = loadUsers()
    const matchedUser = users.find((user) => {
      return String(user.email || '').toLowerCase() === normalizedEmail && String(user.password || '') === normalizedPassword
    })

    if (!matchedUser) {
      isAuthenticated.value = false
      currentUser.value = ''
      authError.value = 'Usuario o contrasena incorrectos.'

      return {
        success: false,
        message: authError.value
      }
    }

    setAuthenticatedUser(matchedUser)

    return {
      success: true,
      message: '',
      user: {
        email: matchedUser.email,
        role: matchedUser.role,
        name: matchedUser.name
      }
    }
  }

  const register = async ({ email, password, role = 'user' }) => {
    authError.value = ''

    const normalizedEmail = String(email || '').trim().toLowerCase()
    const normalizedPassword = String(password || '').trim()

    if (!normalizedEmail) {
      authError.value = 'El correo electrónico es obligatorio.'
      return {
        success: false,
        message: authError.value
      }
    }

    if (normalizedPassword.length < 6) {
      authError.value = 'La contraseña debe tener al menos 6 caracteres.'
      return {
        success: false,
        message: authError.value
      }
    }

    const users = loadUsers()
    const alreadyExists = users.some((user) => String(user.email || '').toLowerCase() === normalizedEmail)

    if (alreadyExists) {
      authError.value = 'Ya existe una cuenta con ese correo.'
      return {
        success: false,
        message: authError.value
      }
    }

    const newUser = {
      id: `mock-${Date.now()}`,
      email: normalizedEmail,
      password: normalizedPassword,
      role,
      name: createDisplayName(normalizedEmail)
    }

    users.unshift(newUser)
    saveUsers(users)
    setAuthenticatedUser(newUser)

    return {
      success: true,
      message: 'Registro exitoso',
      user: {
        email: newUser.email,
        role: newUser.role,
        name: newUser.name
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
