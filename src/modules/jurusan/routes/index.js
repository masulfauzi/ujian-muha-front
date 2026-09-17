export const jurusanRoutes = [
  {
    path: '/admin/jurusan',
    name: 'jurusan.list',
    component: () => import('../views/JurusanList.vue'),
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  {
    path: '/admin/jurusan/create',
    name: 'jurusan.create',
    component: () => import('../views/JurusanCreate.vue'),
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  {
    path: '/admin/jurusan/:id',
    name: 'jurusan.detail',
    component: () => import('../views/JurusanDetail.vue'),
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  {
    path: '/admin/jurusan/:id/edit',
    name: 'jurusan.edit',
    component: () => import('../views/JurusanEdit.vue'),
    meta: { requiresAuth: true, requiresAdmin: true },
  },
]
