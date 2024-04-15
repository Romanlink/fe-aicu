import type { Router } from 'vue-router'
import { useAuthStoreWithout } from '@/store/modules/auth'
import { getStorage } from '@/utils/arco-storage'

export function setupPageGuard(router: Router) {
  router.beforeEach(async (to, from, next) => {
    // const authStore = useAuthStoreWithout()
    const AuthToken = getStorage('AuthToken')
    const requiresAuth = to.meta.requiresAuth
    if (!AuthToken) {
      if (!requiresAuth) {
        next()
      } else {
        next(`/login?redirect=${to.path}`)
      }
      // try {
      //   const data = await authStore.getSession()
      //   if (String(data.auth) === 'false' && authStore.token)
      //     authStore.removeToken()
      //   if (to.path === '/500')
      //     next({ name: 'Root' })
      //   else
      //     next()
      // }
      // catch (error) {
      //   if (to.path !== '/500')
      //     next({ name: '500' })
      //   else
      //     next()
      // }

    }
    else {
      next()
    }
  })
}
