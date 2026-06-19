import LoginView from './views/login-view.vue'
import ForgotPasswordView from './views/forgot-password-view.vue'

export const authRoutes = [
  {
    path: '/login',
    name: 'login',
    component: LoginView,
    meta: {
      public: true,
      layout: 'auth'
    }
  },
  {
    path: '/forgot-password',
    name: 'forgot-password',
    component: ForgotPasswordView,
    meta: {
      public: true,
      layout: 'auth'
    }
  }
]

