import { createRouter, createWebHistory } from 'vue-router'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/registro',
      name: 'Registro',
      component: () => import('../views/RegisterView.vue'),
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/bienvenida',
      name: 'bienvenida',
      component: () => import('@/views/Bienvenida.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/registrar-carro', // NUEVA RUTA
      name: 'registrar-carro',
      component: () => import('@/views/RegistrarVehiculo.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/realizar-reserva',
      name: 'realizar-reserva',
      component: () => import('@/views/RealizarReserva.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/mis-reservas',
      name: 'MisReservas',
      component: () => import('@/views/MisReservas.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/bienvenida-empleado',
      name: 'BienvenidaEmpleado',
      component: () => import('@/views/BienvenidaEmpleado.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/reservas-clientes',
      name: 'ReservasClientes',
      component: () => import('@/views/ReservasClientes.vue'),
      meta: { requiresAuth: true, soloEmpleado: true },
    },
    {
  path: '/ingreso-sin-reserva',
  name: 'IngresoSinReserva',
  component: () => import('@/views/SistemaEstacionamiento.vue'),
  meta: { requiresAuth: true, soloEmpleado: true },
},
  ],
})

router.beforeEach((to, from, next) => {
  const tipo = localStorage.getItem('tipo_usuario')
  const isAuthenticated = !!tipo

  if (to.meta.requiresAuth && !isAuthenticated) {
    return next({ name: 'login' })
  }

  // Solo empleados pueden acceder a la ruta de reservas de clientes
  if (to.meta.soloEmpleado && tipo !== 'empleado') {
    return next({ name: 'bienvenida' })
  }

  if (to.name === 'BienvenidaEmpleado' && tipo !== 'empleado') {
    return next({ name: 'bienvenida' })
  }
  if (to.name === 'bienvenida' && tipo === 'empleado') {
    return next({ name: 'BienvenidaEmpleado' })
  }

  next()
})

export default router
