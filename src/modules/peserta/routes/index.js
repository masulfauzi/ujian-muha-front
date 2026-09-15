import PesertaList from '../views/PesertaList.vue'
import PesertaCreate from '../views/PesertaCreate.vue'
import PesertaImport from '../views/PesertaImport.vue'
import PesertaEdit from '../views/PesertaEdit.vue'
import PesertaDetail from '../views/PesertaDetail.vue'

export const pesertaRoutes = [
  {
    path: '/admin/peserta',
    name: 'peserta.list',
    component: PesertaList,
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  {
    path: '/admin/peserta/create',
    name: 'peserta.create',
    component: PesertaCreate,
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  {
    path: '/admin/peserta/import',
    name: 'peserta.import',
    component: PesertaImport,
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  {
    path: '/admin/peserta/:id',
    name: 'peserta.detail',
    component: PesertaDetail,
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  {
    path: '/admin/peserta/:id/edit',
    name: 'peserta.edit',
    component: PesertaEdit,
    meta: { requiresAuth: true, requiresAdmin: true },
  },
]
