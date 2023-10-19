import { createRouter, createWebHistory } from 'vue-router'

import BackendSessionExpiredView from '@/views/BackendSessionExpiredView.vue'
import ErrorView from '@/views/ErrorView.vue'
import HomeView from '@/views/HomeView.vue'
import LoginView from '@/views/LoginView.vue'
import LogoutView from '@/views/LogoutView.vue'
import { PAGE_TITLES } from '@/utils/constants'
import SessionExpiredView from '@/views/SessionExpiredView.vue'
import UnAuthorizedPageView from '@/views/UnAuthorizedPageView.vue'
import UnAuthorizedView from '@/views/UnAuthorizedView.vue'
import { useAppStore } from '@/stores/app'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(),
  base: import.meta.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: {
        pageTitle: PAGE_TITLES.DASHBOARD,
        requiresAuth: true,
      },
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: {
        requiresAuth: false,
        pageTitle: PAGE_TITLES.LOGIN,
      },
    },
    {
      path: '/logout',
      name: 'logout',
      component: LogoutView,
      meta: {
        requiresAuth: false,
      },
    },
    {
      path: '/session-expired',
      name: 'session-expired',
      component: SessionExpiredView,
      meta: {
        requiresAuth: false,
      },
    },
    {
      path: '/unauthorized',
      name: 'unauthorized',
      component: UnAuthorizedView,
      meta: {
        requiresAuth: false,
      },
    },
    {
      path: '/unauthorized-page',
      name: 'unauthorized-page',
      component: UnAuthorizedPageView,
      meta: {
        requiresAuth: false,
      },
    },
    {
      path: '/error',
      name: 'error',
      component: ErrorView,
      meta: {
        requiresAuth: false,
      },
    },
    {
      path: '/:catchAll(.*)',
      name: 'notfound',
      redirect: '/',
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/token-expired',
      name: 'backend-session-expired',
      component: BackendSessionExpiredView,
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
        role: 'CCP_ROLE',
      },
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
        role: 'OPS_ROLE',
      },
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
        role: 'PCM_ROLE',
      },
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
        role: 'OPS_ROLE',
      },
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
        role: 'PCM_ROLE',
      },
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
        role: 'PCM_ROLE',
      },
    },
  ],
})

router.beforeEach((to, _from, next) => {
  // this section is to set page title in vue store
  const appStore = useAppStore()
  if (to && to.meta.pageTitle) {
    appStore.setPageTitle(to.meta.pageTitle)
  } else {
    appStore.setPageTitle('')
  }

  const authStore = useAuthStore()
  if (to.meta.requiresAuth) {
    authStore
      .getJwtToken()
      .then(() => {
        if (!authStore.isAuthenticated) {
          next('/token-expired')
          return
        }
        authStore
          .getUserInfo()
          .then(() => {
            if (!authStore.userHasRoles) {
              next('unauthorized')
              return
            }
            next()
          })
          .catch((error) => {
            if (error.response?.status == '401') {
              next('unauthorized')
              return
            }
            next('error')
          })
      })
      .catch((err) => {
        if (!authStore.userInfo) {
          next('/login')
        }
        next('/token-expired')
      })
  } else {
    next()
  }
})

export default router
