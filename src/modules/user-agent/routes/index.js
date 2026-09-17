export const userAgentRoutes = [
  {
    path: '/admin/user-agent',
    name: 'user-agent.list',
    component: () => import('../views/UserAgentList.vue'),
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  {
    path: '/admin/user-agent/create',
    name: 'user-agent.create',
    component: () => import('../views/UserAgentCreate.vue'),
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  {
    path: '/admin/user-agent/:id',
    name: 'user-agent.detail',
    component: () => import('../views/UserAgentDetail.vue'),
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  {
    path: '/admin/user-agent/:id/edit',
    name: 'user-agent.edit',
    component: () => import('../views/UserAgentEdit.vue'),
    meta: { requiresAuth: true, requiresAdmin: true },
  },
]
