import type { Router } from 'vue-router'
import { useAuthStoreWithout } from '@/store/modules/auth'
import { getStorage } from '@/utils/arco-storage'
import { ss } from '@/utils/storage'

export function setupPageGuard(router: Router) {
  router.beforeEach(async (to, from, next) => {
    const AuthToken = getStorage('AuthToken')
    const requiresAuth = to.meta.requiresAuth
    if (!AuthToken) {
      if (!requiresAuth) {
        next()
      } else {
        next(`/login?redirect=${to.path}`)
      }
    }
    else {
      const userStorage = ss.get('userStorage')
      const { userInfo } = userStorage

      if (!userInfo.orgId && to.path !== '/tip/add-company') {
        // 未关联企业
        next(`/tip/add-company`)
      } else if (userInfo.status != 1 && userInfo.trial == 0 && to.path !== '/tip/expired') {
        // 已过试用期
        next('/tip/expired')
      } else {
        next()
      }
    }
  })
}
