import { ref } from 'vue'

const ALLOWED_USER = 'Yeira'
const ALLOWED_PASSWORD = 'admin123'

const isAuthenticated = ref(false)
const currentUser = ref('')

export function useAuthStore() {
  const login = ({ username, password }) => {
    const normalizedUsername = String(username || '').trim()
    const normalizedPassword = String(password || '').trim()

    const isValidCredentials = normalizedUsername === ALLOWED_USER && normalizedPassword === ALLOWED_PASSWORD

    if (!isValidCredentials) {
      isAuthenticated.value = false
      currentUser.value = ''
      return {
        success: false,
        message: 'Usuario o contrasena incorrectos.'
      }
    }

    isAuthenticated.value = true
    currentUser.value = ALLOWED_USER

    return {
      success: true,
      message: ''
    }
  }

  const logout = () => {
    isAuthenticated.value = false
    currentUser.value = ''
  }

  return {
    isAuthenticated,
    currentUser,
    login,
    logout
  }
}

