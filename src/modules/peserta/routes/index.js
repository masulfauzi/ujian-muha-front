export const pesertaRoutes = [
  {
    path: '/admin/peserta',
    name: 'peserta.list',
    component: () => import('../views/PesertaList.vue'),
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  {
    path: '/admin/peserta/create',
    name: 'peserta.create',
    component: () => import('../views/PesertaCreate.vue'),
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  {
    path: '/admin/peserta/import',
    name: 'peserta.import',
    component: () => import('../views/PesertaImport.vue'),
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  {
    path: '/admin/peserta/:id',
    name: 'peserta.detail',
    component: () => import('../views/PesertaDetail.vue'),
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  {
    path: '/admin/peserta/:id/edit',
    name: 'peserta.edit',
    component: () => import('../views/PesertaEdit.vue'),
    meta: { requiresAuth: true, requiresAdmin: true },
  },
]
