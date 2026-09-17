export const jadwalPesertaRoutes = [
  {
    path: '/schedule',
    name: 'peserta.jadwal',
    component: () => import('../views/JadwalUjianHariIni.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/ujian/:id',
    name: 'peserta.ujian.detail',
    component: () => import('../views/DetailUjian.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/ujian/:id/pengerjaan',
    name: 'peserta.ujian.pengerjaan',
    component: () => import('../views/PengerjaanUjian.vue'),
    meta: { requiresAuth: true },
  },
]
