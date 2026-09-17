export const bankSoalRoutes = [
  {
    path: '/admin/bank-soal',
    name: 'bankSoal.list',
    component: () => import('../views/BankSoalList.vue'),
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  {
    path: '/admin/bank-soal/create',
    name: 'bankSoal.create',
    component: () => import('../views/SoalCreate.vue'),
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  {
    path: '/admin/bank-soal/:id',
    name: 'bankSoal.detail',
    component: () => import('../views/SoalDetail.vue'),
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  {
    path: '/admin/bank-soal/:id/edit',
    name: 'bankSoal.edit',
    component: () => import('../views/SoalEdit.vue'),
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  {
    path: '/admin/bank-soal/:id/soal',
    name: 'bankSoal.soalInput',
    component: () => import('../views/SoalInput.vue'),
    meta: { requiresAuth: true, requiresAdmin: true, title: 'Input Soal' },
  },
]
