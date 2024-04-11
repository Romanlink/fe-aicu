import type { App } from 'vue'
import type { RouteRecordRaw } from 'vue-router'
import { createRouter, createWebHashHistory } from 'vue-router'
import { setupPageGuard } from './permission'
import { ChatLayout } from '@/views/chat/layout'
import TIP_LAYOUT from '../layout/tip-layout.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login/index.vue'),
    meta: {
      requiresAuth: false,
    },
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('@/views/login/reg.vue'),
    meta: {
      requiresAuth: false,
    },
  },
  {
    path: '/forgetPassword',
    name: 'forgetPassword',
    component: () => import('@/views/login/forget-password.vue'),
    meta: {
      requiresAuth: false,
    },
  },
  {
    path: '/',
    name: 'Root',
    component: ChatLayout,
    redirect: '/chat',
    children: [
      {
        path: '/chat/:uuid?',
        name: 'Chat',
        component: () => import('@/views/chat/index.vue'),
      },
    ],
  },

  {
    path: '/tip',
    name: 'tip',
    component: TIP_LAYOUT,
    meta: {
      requiresAuth: true,
    },
    children: [
      {
        path: 'info',
        name: 'TipInfo',
        component: () => import('@/views/tip/info/index.vue'),
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: 'expired',
        name: 'TipExpired',
        component: () => import('@/views/tip/expired/index.vue'),
        meta: {
          requiresAuth: true,
        },
      },
    ],
  },

  {
    path: '/404',
    name: '404',
    component: () => import('@/views/exception/404/index.vue'),
  },

  {
    path: '/500',
    name: '500',
    component: () => import('@/views/exception/500/index.vue'),
  },

  {
    path: '/:pathMatch(.*)*',
    name: 'notFound',
    redirect: '/404',
  },
]

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior: () => ({ left: 0, top: 0 }),
})

setupPageGuard(router)

export async function setupRouter(app: App) {
  app.use(router)
  await router.isReady()
}
