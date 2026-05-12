import DevicesRouterView from './views/devices-router.vue'
import DevicesView from './views/devices-view.vue'

export const deviceRoutes = [
    {
        path: '/devices',
        component: DevicesRouterView,
        children: [
            {
                path: '',
                name: 'devices',
                component: DevicesView
            }
        ]
    }
]