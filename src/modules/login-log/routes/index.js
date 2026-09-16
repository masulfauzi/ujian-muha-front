import LoginLogList from '../views/LoginLogList.vue'

export const loginLogRoutes = [
  {
    path: '/admin/login-log',
    name: 'login-log.list',
    component: LoginLogList,
    meta: { requiresAuth: true, requiresAdmin: true },
  },
]
