import { createRouter, createWebHistory } from 'vue-router'

import AnalyticsDashboardView from './analytics/presentation/views/analytics-dashboard-view.vue'
import DevicesView from './devices/presentation/views/devices-view.vue'
import ReportsView from './reports/presentation/views/reports-view.vue'
import SettingsView from './shared/presentation/settings-view.vue'
import NotFoundView from './shared/presentation/page-not-found-view.vue'
import { profileRoutes } from './profiles/presentation/profiles-routes.js'
import { notificationRoutes } from './notifications/presentation/notifications-routes.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/dashboard' },
    { path: '/dashboard', name: 'dashboard', component: AnalyticsDashboardView },
    { path: '/devices', name: 'devices', component: DevicesView },
    { path: '/reports', name: 'reports', component: ReportsView },
    { path: '/settings', name: 'settings', component: SettingsView },
    ...profileRoutes,
    ...notificationRoutes,
    { path: '/:pathMatch(.*)*', name: 'not-found', component: NotFoundView }
  ]
})

export default router
