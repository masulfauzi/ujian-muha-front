// import RegisterView from '../views/Register.vue'

export const authRoutes = [
    {
        path: '/login',
        name: 'auth.login',
        component: () => import('../views/Login.vue'),
    },
    // {
    //     path: '/register',
    //     name: 'auth.register',
    //     component: RegisterView,
    // },
]
