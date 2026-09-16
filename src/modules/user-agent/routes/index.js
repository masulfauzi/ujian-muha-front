import UserAgentList from '../views/UserAgentList.vue'
import UserAgentCreate from '../views/UserAgentCreate.vue'
import UserAgentEdit from '../views/UserAgentEdit.vue'
import UserAgentDetail from '../views/UserAgentDetail.vue'

export const userAgentRoutes = [
  {
    path: '/admin/user-agent',
    name: 'user-agent.list',
    component: UserAgentList,
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  {
    path: '/admin/user-agent/create',
    name: 'user-agent.create',
    component: UserAgentCreate,
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  {
    path: '/admin/user-agent/:id',
    name: 'user-agent.detail',
    component: UserAgentDetail,
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  {
    path: '/admin/user-agent/:id/edit',
    name: 'user-agent.edit',
    component: UserAgentEdit,
    meta: { requiresAuth: true, requiresAdmin: true },
  },
]
