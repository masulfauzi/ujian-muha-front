export const monitoringRoutes = [
  {
    path: '/admin/monitoring',
    name: 'monitoring.list',
    component: () => import('../views/MonitoringList.vue'),
    meta: { requiresAuth: true, requiresAdmin: true },
  },
]
