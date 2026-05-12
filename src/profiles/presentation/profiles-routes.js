import ProfileRouterView from './views/profile-router.vue'
import ProfileView from './views/profile-view.vue'

export const profileRoutes = [
  {
    path: '/profile',
    component: ProfileRouterView,
    children: [
      {
        path: '',
        name: 'profile',
        component: ProfileView
      }
    ]
  }
]
