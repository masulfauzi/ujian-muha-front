export const mapelRoutes = [
  {
    path: '/admin/mapel',
    name: 'mapel.list',
    component: () => import('../views/MapelList.vue'),
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  {
    path: '/admin/mapel/create',
    name: 'mapel.create',
    component: () => import('../views/MapelCreate.vue'),
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  {
    path: '/admin/mapel/:id',
    name: 'mapel.detail',
    component: () => import('../views/MapelDetail.vue'),
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  {
    path: '/admin/mapel/:id/edit',
    name: 'mapel.edit',
    component: () => import('../views/MapelEdit.vue'),
    meta: { requiresAuth: true, requiresAdmin: true },
  },
]
