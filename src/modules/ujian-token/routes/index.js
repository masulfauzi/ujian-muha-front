export const ujianTokenRoutes = [
  {
    path: '/admin/ujian-token',
    name: 'ujianToken.current',
    component: () => import('../views/UjianTokenCurrent.vue'),
    meta: { requiresAuth: true, requiresAdmin: true },
  },
]
