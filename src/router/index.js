import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/profissionais'
    },
    {
      path: '/profissionais',
      name: 'profissionais',
      component: () => import('../views/Profissionais.vue')
    },
    {
      path: '/times',
      name: 'times',
      component: () => import('../views/Times.vue')
    },
    {
      path: '/projetos',
      name: 'projetos',
      component: () => import('../views/Projetos.vue')
    }
  ]
})

export default router
