export const jadwalRoutes = [
  {
    path: '/admin/jadwal',
    name: 'jadwal.list',
    component: () => import('../views/JadwalList.vue'),
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  {
    path: '/admin/jadwal/create',
    name: 'jadwal.create',
    component: () => import('../views/JadwalCreate.vue'),
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  {
    path: '/admin/jadwal/:id',
    name: 'jadwal.detail',
    component: () => import('../views/JadwalDetail.vue'),
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  {
    path: '/admin/jadwal/:id/edit',
    name: 'jadwal.edit',
    component: () => import('../views/JadwalEdit.vue'),
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  {
    path: '/admin/jadwal/:id/section',
    name: 'jadwal.section',
    component: () => import('../views/JadwalSection.vue'),
    meta: { requiresAuth: true, requiresAdmin: true },
  },
]
