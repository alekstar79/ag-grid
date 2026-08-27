import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/example/1'
  },
  {
    path: '/example/1',
    name: 'Example1',
    component: () => import('@/views/Example1.vue'),
    meta: { title: 'Сотрудники' }
  },
  {
    path: '/example/2',
    name: 'Example2',
    component: () => import('@/views/Example2.vue'),
    meta: { title: 'Сортировка' }
  },
  {
    path: '/example/3',
    name: 'Example3',
    component: () => import('@/views/Example3.vue'),
    meta: { title: 'Фильтрация' }
  },
  {
    path: '/example/4',
    name: 'Example4',
    component: () => import('@/views/Example4.vue'),
    meta: { title: 'Render & Editor' }
  },
  {
    path: '/example/5',
    name: 'Example5',
    component: () => import('@/views/Example5.vue'),
    meta: { title: 'Selection' }
  },
  {
    path: '/example/6',
    name: 'Example6',
    component: () => import('@/views/Example6.vue'),
    meta: { title: 'Закреплённых строки' }
  },
  {
    path: '/example/7',
    name: 'Example7',
    component: () => import('@/views/Example7.vue'),
    meta: { title: 'Сохранение состояния' }
  },
  {
    path: '/example/8',
    name: 'Example8',
    component: () => import('@/views/Example8.vue'),
    meta: { title: 'Транзакции' }
  },
  {
    path: '/example/9',
    name: 'Example9',
    component: () => import('@/views/Example9.vue'),
    meta: { title: 'Infinite Row Model' }
  },
  {
    path: '/example/10',
    name: 'Example10',
    component: () => import('@/views/Example10.vue'),
    meta: { title: 'Кастомный фильтр' }
  },
  {
    path: '/example/11',
    name: 'Example11',
    component: () => import('@/views/Example11.vue'),
    meta: { title: 'Кастомный editor' }
  },
  {
    path: '/example/12',
    name: 'Example12',
    component: () => import('@/views/Example12.vue'),
    meta: { title: 'Pagination' }
  },
  {
    path: '/example/13',
    name: 'Example13',
    component: () => import('@/views/Example13.vue'),
    meta: { title: 'Keyboard Navigation' }
  },
  {
    path: '/example/14',
    name: 'Example14',
    component: () => import('@/views/Example14.vue'),
    meta: { title: 'Localisation' }
  },
  {
    path: '/example/15',
    name: 'Example15',
    component: () => import('@/views/Example15.vue'),
    meta: { title: 'Группировка и агрегация' }
  },
  {
    path: '/example/16',
    name: 'Example16',
    component: () => import('@/views/Example16.vue'),
    meta: { title: 'Мастер/Детали' }
  },
  {
    path: '/example/17',
    name: 'Example17',
    component: () => import('@/views/Example17.vue'),
    meta: { title: 'Выделение диапазона' }
  },
  {
    path: '/example/18',
    name: 'Example18',
    component: () => import('@/views/Example18.vue'),
    meta: { title: 'Сводная таблица' }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
