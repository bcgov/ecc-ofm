import { createRouter, createWebHistory } from 'vue-router'

import BackendSessionExpired from '@/components/BackendSessionExpired.vue'
import ErrorPage from '@/components/ErrorPage.vue'
import Home from '@/components/Home.vue'
import Login from '@/components/Login.vue'
import Logout from '@/components/Logout.vue'
import SessionExpired from '@/components/SessionExpired.vue'
import UnAuthorized from '@/components/UnAuthorized.vue'
import UnAuthorizedPage from '@/components/UnAuthorizedPage.vue'
import { PAGE_TITLES } from '@/utils/constants'

import { useAppStore } from '../stores/app'
import { useAuthStore } from '../stores/auth'

const router = createRouter({
  history: createWebHistory(),
  base: import.meta.env.BASE_URL,
  routes: [
    {
      path: '/login',
      name: 'login',
      component: Login,
      meta: {
        requiresAuth: false,
        pageTitle: PAGE_TITLES.LOGIN
      }
    },
    {
      path: '/logout',
      name: 'logout',
      component: Logout,
      meta: {
        requiresAuth: false
      }
    },
    {
      path: '/session-expired',
      name: 'session-expired',
      component: SessionExpired,
      meta: {
        requiresAuth: false
      }
    },
    {
      path: '/unauthorized',
      name: 'unauthorized',
      component: UnAuthorized,
      meta: {
        requiresAuth: false
      }
    },
    {
      path: '/unauthorized-page',
      name: 'unauthorized-page',
      component: UnAuthorizedPage,
      meta: {
        requiresAuth: false
      }
    },
    {
      path: '/error',
      name: 'error',
      component: ErrorPage,
      meta: {
        requiresAuth: false
      }
    },
    {
      path: '/:catchAll(.*)',
      name: 'notfound',
      redirect: '/',
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/token-expired',
      name: 'backend-session-expired',
      component: BackendSessionExpired
    },
    {
      path: '/',
      name: 'home',
      component: Home,
      meta: {
        pageTitle: PAGE_TITLES.DASHBOARD,
        requiresAuth: true
      }
    },
    //TODO: the following is a temp route which doesn't resolve to a component, its only purpose
    // to provide example content to the navbar in the 1st draft of frontend and is expacted to
    // eventually be removed...
    {
      path: '/intake',
      name: 'intake',
      //component: Intake,
      meta: {
        pageTitle: PAGE_TITLES.INTAKE,
        requiresAuth: true,
        role: 'CCP_ROLE'
      }
    },
    //TODO: the following is a temp route which doesn't resolve to a component, its only purpose
    // to provide example content to the navbar in the 1st draft of frontend and is expacted to
    // eventually be removed...
    {
      path: '/contractManagement',
      name: 'contractManagement',
      //component: ContractManagement,
      meta: {
        pageTitle: PAGE_TITLES.CONTRACT_MANAGEMENT,
        requiresAuth: true,
        role: 'OPS_ROLE'
      }
    },
    //TODO: the following is a temp route which doesn't resolve to a component, its only purpose
    // to provide example content to the navbar in the 1st draft of frontend and is expacted to
    // be removed...
    {
      path: '/payments',
      name: 'payments',
      //component: Payments,
      meta: {
        pageTitle: PAGE_TITLES.PAYMENTS,
        requiresAuth: true,
        role: 'PCM_ROLE'
      }
    },
    //TODO: the following is a temp route which doesn't resolve to a component, its only purpose
    // to provide example content to the navbar in the 1st draft of frontend and is expacted to
    // be removed...
    {
      path: '/reporting',
      name: 'reporting',
      //component: Reporting,
      meta: {
        pageTitle: PAGE_TITLES.REPORTING,
        requiresAuth: true,
        role: 'OPS_ROLE'
      }
    },
    //TODO: the following is a temp route which doesn't resolve to a component, its only purpose
    // to provide example content to the navbar in the 1st draft of frontend and is expacted to
    // be removed...
    {
      path: '/accountMaintenance',
      name: 'accountMaintenance',
      //component: AccountMaintenance,
      meta: {
        pageTitle: PAGE_TITLES.ACCOUNT_MAINTENANCE,
        requiresAuth: true,
        role: 'PCM_ROLE'
      }
    },
    //TODO: the following is a temp route which doesn't resolve to a component, its only purpose
    // to provide example content to the navbar in the 1st draft of frontend and is expacted to
    // be removed...
    {
      path: '/maintRequetExceptionSream',
      name: 'maintRequetExceptionStream',
      //component: MaintenanceRequestExceptionStream,
      meta: {
        pageTitle: PAGE_TITLES.MAINTENANCE_REQUEST_EXCEPTION_STREAM,
        requiresAuth: true,
        role: 'PCM_ROLE'
      }
    }
  ]
})

router.beforeEach((to, _from, next) => {
  // this section is to set page title in vue store
  const appStore = useAppStore()
  if (to && to.meta.pageTitle) {
    appStore.setPageTitle(to.meta.pageTitle)
  } else {
    appStore.setPageTitle('')
  }

  const aStore = useAuthStore()
  // this section is to handle the backend session expiry, where frontend vue session is still valid.
  if (to.meta.requiresAuth && aStore.isAuthenticated) {
    validateAndExecute('/token-expired', to)
  } else if (to.meta.requiresAuth) {
    validateAndExecute('login', to)
  } else {
    next()
  }

  function validateAndExecute(nextRouteInError, to) {
    const aStore = useAuthStore()
    aStore
      .getJwtToken()
      .then(() => {
        if (!aStore.isAuthenticated) {
          next(nextRouteInError)
          return
        }
        if (!to.meta.role) {
          next()
          return
        }
        aStore
          .getUserInfo()
          .then(() => {
            if (!aStore.isAuthorizedUser) {
              next('unauthorized')
              return
            }
            const hasRole =
              Object.prototype.hasOwnProperty.call(aStore, to.meta.role) && aStore[to.meta.role]
            if (!hasRole) {
              next('unauthorized-page')
              return
            }
            next()
          })
          .catch((e) => {
            console.log('Unable to get user info: ' + e)
            next('error')
          })
      })
      .catch(() => {
        console.log('Unable to get token')
        next(nextRouteInError)
      })
  }
})

export default router
