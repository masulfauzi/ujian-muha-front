export const kelasRoutes = [
  {
    path: '/admin/kelas',
    name: 'kelas.list',
    component: () => import('../views/KelasList.vue'),
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  {
    path: '/admin/kelas/create',
    name: 'kelas.create',
    component: () => import('../views/KelasCreate.vue'),
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  {
    path: '/admin/kelas/:id',
    name: 'kelas.detail',
    component: () => import('../views/KelasDetail.vue'),
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  {
    path: '/admin/kelas/:id/edit',
    name: 'kelas.edit',
    component: () => import('../views/KelasEdit.vue'),
    meta: { requiresAuth: true, requiresAdmin: true },
  },
]
