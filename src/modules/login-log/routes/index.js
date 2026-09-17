export const loginLogRoutes = [
  {
    path: '/admin/login-log',
    name: 'login-log.list',
    component: () => import('../views/LoginLogList.vue'),
    meta: { requiresAuth: true, requiresAdmin: true },
  },
]
