import { PAGE_TITLES, ROLES } from '@/utils/constants'
import { createRouter, createWebHistory } from 'vue-router'

import ApplicationsView from '@/views/ApplicationsView.vue'
import BackendSessionExpiredView from '@/views/BackendSessionExpiredView.vue'
import DocumentsView from '@/views/DocumentsView.vue'
import ErrorView from '@/views/ErrorView.vue'
import FundingView from '@/views/FundingView.vue'
import HomeView from '@/views/HomeView.vue'
import ImpersonateView from '@/views/ImpersonateView.vue'
import LoginView from '@/views/LoginView.vue'
import LogoutView from '@/views/LogoutView.vue'
import MessagingView from '@/views/MessagingView.vue'
import MinistryLoginView from '@/views/MinistryLoginView.vue'
import ReportingView from '@/views/ReportingView.vue'
import ResourcesView from '@/views/ResourcesView.vue'
import SessionExpiredView from '@/views/SessionExpiredView.vue'
import SettingsView from '@/views/SettingsView.vue'
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
      path: '/internal',
      name: 'ministry login',
      component: MinistryLoginView,
      meta: {
        pageTitle: PAGE_TITLES.LOGIN,
        requiresAuth: false,
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
      path: '/impersonate',
      name: 'impersonate',
      component: ImpersonateView,
      meta: {
        pageTitle: 'Impersonate a BCeID User',
        requiresAuth: true,
      },
    },
    {
      path: '/messaging',
      name: 'messaging',
      component: MessagingView,
      meta: {
        pageTitle: 'Messaging',
        requiresAuth: true,
      },
    },
    {
      path: '/reporting',
      name: 'reporting',
      component: ReportingView,
      meta: {
        pageTitle: 'Reporting',
        requiresAuth: true,
      },
    },
    {
      path: '/funding',
      name: 'funding',
      component: FundingView,
      meta: {
        pageTitle: 'Funding',
        requiresAuth: true,
      },
    },
    {
      path: '/documents',
      name: 'documents',
      component: DocumentsView,
      meta: {
        pageTitle: 'Documents',
        requiresAuth: true,
      },
    },
    {
      path: '/applications',
      name: 'applications',
      component: ApplicationsView,
      meta: {
        pageTitle: 'Applications',
        requiresAuth: true,
      },
    },
    {
      path: '/resources',
      name: 'resources',
      component: ResourcesView,
      meta: {
        pageTitle: 'Resources',
        requiresAuth: true,
      },
    },
    {
      path: '/settings',
      name: 'settings',
      component: SettingsView,
      meta: {
        pageTitle: 'Settings',
        requiresAuth: true,
        role: ROLES.ACCOUNT_MANAGEMENT,
        showFacility: false,
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

  // TODO (weskubo-cgi)
  // 1. Don't allow access to Logout page if not logged in
  // 2. Don't allow access to Login if Logged in
  // 3. Don't allow access to Internal if logged in

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
            if (!authStore.isMinistryUser) {
              // Validate Provider roles
              if (!authStore.hasRoles) {
                return next('unauthorized')
              }
              // Validate Provider facilities
              if (!authStore.hasFacilities) {
                return next('unauthorized')
              }
              // Validate specific role
              if (to.meta.role && !authStore.hasRole(to.meta.role)) {
                return next('unauthorized')
              }
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
          return
        }
        next('/token-expired')
      })
  } else {
    next()
  }
})

export default router
