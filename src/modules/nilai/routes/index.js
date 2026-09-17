export const nilaiRoutes = [
  {
    path: '/admin/nilai',
    name: 'nilai.list',
    component: () => import('../views/NilaiList.vue'),
    meta: { requiresAuth: true, requiresAdmin: true },
  },
]
