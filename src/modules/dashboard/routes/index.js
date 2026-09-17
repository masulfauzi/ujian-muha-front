export const dashboardRoutes = [
    {
        path: '/dashboard',
        name: 'dashboard.home',
        component: () => import('../views/DashboardHome.vue'),
    },
    {
        path: '/dashboard/reports',
        name: 'dashboard.reports',
        component: () => import('../views/DashboardReports.vue'),
    },
    {
        path: '/admin/dashboard',
        name: 'admin.dashboard',
        component: () => import('../views/DashboardAdmin.vue'),
        meta: { requiresAuth: true, requiresAdmin: true },
    },
]
