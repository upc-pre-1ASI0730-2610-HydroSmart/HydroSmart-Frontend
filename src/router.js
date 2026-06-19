import { createRouter, createWebHashHistory } from 'vue-router'

import AnalyticsDashboardView from './analytics/presentation/views/analytics-dashboard-view.vue'
import SettingsView from './shared/presentation/settings-view.vue'
import HelpCenterView from './shared/presentation/help-center-view.vue'
import HelpContactView from './shared/presentation/help-contact-view.vue'
import HelpTutorialsView from './shared/presentation/help-tutorials-view.vue'
import NotFoundView from './shared/presentation/page-not-found-view.vue'
import { deviceRoutes } from './devices/presentation/devices-routes.js'
import { profileRoutes } from './profiles/presentation/profiles-routes.js'
import { notificationRoutes } from './notifications/presentation/notifications-routes.vue'
import { reportsRoutes } from './reports/presentation/reports-routes.js'
import { authRoutes } from './auth/presentation/auth-routes.js'
import { useAuthStore } from './auth/application/auth.store.js'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', redirect: '/login' },
    ...authRoutes,
    { path: '/dashboard', name: 'dashboard', component: AnalyticsDashboardView },
    { path: '/settings', name: 'settings', component: SettingsView },
    { path: '/help', name: 'help-center', component: HelpCenterView },
    { path: '/help/contact', name: 'help-contact', component: HelpContactView },
    { path: '/help/tutorials', name: 'help-tutorials', component: HelpTutorialsView },
    ...deviceRoutes,
    ...profileRoutes,
    ...notificationRoutes,
    ...reportsRoutes,
    { path: '/:pathMatch(.*)*', name: 'not-found', component: NotFoundView }
  ]
})

router.beforeEach((to) => {
  const { isAuthenticated } = useAuthStore()
  const isPublicRoute = to.matched.some((record) => record.meta?.public)

  if (!isAuthenticated.value && !isPublicRoute) {
    return {
      path: '/login',
      query: {
        redirect: to.fullPath
      }
    }
  }

  if (isAuthenticated.value && (to.name === 'login' || to.name === 'forgot-password')) {
    return '/dashboard'
  }

  return true
})

export default router
