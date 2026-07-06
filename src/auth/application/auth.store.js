import { ref } from 'vue'
import { signIn, signUp, logout as apiLogout } from '../infrastructure/auth-api.js'

const isAuthenticated = ref(false)
const currentUser = ref('')
const authError = ref('')

export function useAuthStore() {
  const login = async ({ email, password }) => {
    try {
      authError.value = ''
      const response = await signIn({ email, password })
      
      if (response.token) {
        localStorage.setItem('authToken', response.token)
        isAuthenticated.value = true
        currentUser.value = response.email || email
        
        return {
          success: true,
          message: ''
        }
      }
      
      return {
        success: false,
        message: response.message || 'Error al iniciar sesión'
      }
    } catch (error) {
      authError.value = error.message
      isAuthenticated.value = false
      currentUser.value = ''
      
      return {
        success: false,
        message: error.message || 'Error al iniciar sesión'
      }
    }
  }

  const register = async ({ email, password, role = 'user' }) => {
    try {
      authError.value = ''
      const response = await signUp({ email, password, role })
      
      if (response.token) {
        localStorage.setItem('authToken', response.token)
        isAuthenticated.value = true
        currentUser.value = response.email || email
        
        return {
          success: true,
          message: 'Registro exitoso'
        }
      }
      
      return {
        success: false,
        message: response.message || 'Error al registrarse'
      }
    } catch (error) {
      authError.value = error.message
      
      return {
        success: false,
        message: error.message || 'Error al registrarse'
      }
    }
  }

  const logout = async () => {
    try {
      await apiLogout()
    } catch (error) {
      console.error('Error en logout:', error)
    } finally {
      isAuthenticated.value = false
      currentUser.value = ''
      localStorage.removeItem('authToken')
      authError.value = ''
    }
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

