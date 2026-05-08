import { createRouter, createWebHistory } from 'vue-router'
import Layout from '../layout/index.vue'

const routes = [
  {
    path: '/',
    component: Layout,
    redirect: '/login',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('../views/dashboard/index.vue'),
        meta: { title: '可视化大屏', icon: 'DataLine' }
      },
      {
        path: 'children',
        name: 'Children',
        component: () => import('../views/children/index.vue'),
        meta: { title: '子女管理', icon: 'UserFilled' }
      },
      {
        path: 'caregivers',
        name: 'Caregivers',
        component: () => import('../views/caregivers/index.vue'),
        meta: { title: '护工管理', icon: 'First-aid-kit' }
      },
      {
        path: 'directors',
        name: 'Directors',
        component: () => import('../views/directors/index.vue'),
        meta: { title: '社区管理员管理', icon: 'Management' }
      },
      {
        path: 'products',
        name: 'Products',
        component: () => import('../views/products/index.vue'),
        meta: { title: '商品管理', icon: 'Goods' }
      },
      {
        path: 'serve',
        name: 'Serve',
        component: () => import('../views/serve/index.vue'),
        meta: { title: '服务管理', icon: 'Service' }
      },
      {
        path: 'activity',
        name: 'Activity',
        component: () => import('../views/activity/index.vue'),
        meta: { title: '活动管理', icon: 'Calendar' }
      }
    ]
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/login/index.vue'),
    meta: { hidden: true }
  },
  {
    path: '/:pathMatch(.*)*',
    component: () => import('../views/error/404.vue'),
    meta: { hidden: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router 