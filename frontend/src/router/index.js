import { createRouter, createWebHistory } from 'vue-router'

import { useAuthStore } from '@/stores/auth'
import { ROLES } from '@/utils/constants'
import BackendSessionExpiredView from '@/views/BackendSessionExpiredView.vue'
import DocumentsView from '@/views/DocumentsView.vue'
import EmptyRouterView from '@/views/EmptyRouterView.vue'
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
import UnAuthorizedPageView from '@/views/UnAuthorizedPageView.vue'
import UnAuthorizedView from '@/views/UnAuthorizedView.vue'
import AccountMgmtView from '@/views/account-mgmt/AccountMgmtView.vue'
import ManageFacilityView from '@/views/account-mgmt/ManageFacilityView.vue'
import ManageOrganizationView from '@/views/account-mgmt/ManageOrganizationView.vue'
import ManageUsersView from '@/views/account-mgmt/ManageUsersView.vue'
import ApplicationView from '@/views/applications/ApplicationView.vue'
import ApplicationsHistoryView from '@/views/applications/ApplicationsHistoryView.vue'
import FacilityDetailsView from '@/views/applications/FacilityDetailsView.vue'
import OperatingCostsView from '@/views/applications/OperatingCostsView.vue'
import SelectFacilityView from '@/views/applications/SelectFacilityView.vue'
import ServiceDeliveryView from '@/views/applications/ServiceDeliveryView.vue'
import StaffingView from '@/views/applications/StaffingView.vue'
import SubmitApplicationView from '@/views/applications/SubmitApplicationView.vue'

const router = createRouter({
  history: createWebHistory(),
  base: import.meta.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: {
        requiresAuth: true,
        showHeroImage: true,
      },
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: {
        requiresAuth: false,
        showHeroImage: true,
      },
    },
    {
      path: '/internal',
      name: 'ministry login',
      component: MinistryLoginView,
      meta: {
        requiresAuth: false,
        showHeroImage: true,
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
        requiresAuth: true,
      },
    },
    {
      path: '/messaging',
      name: 'messaging',
      component: MessagingView,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/reporting',
      name: 'reporting',
      component: ReportingView,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/funding',
      name: 'funding',
      component: FundingView,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/documents',
      name: 'documents',
      component: DocumentsView,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/applications/applications-history',
      name: 'applications-history',
      component: ApplicationsHistoryView,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/applications',
      name: 'applications',
      component: ApplicationView,
      redirect: '/applications/select-facility',
      children: [
        {
          path: 'select-facility',
          name: 'select-facility',
          component: SelectFacilityView,
        },
        {
          path: ':applicationGuid/facility-details',
          name: 'facility-details',
          component: FacilityDetailsView,
        },
        {
          path: ':applicationGuid/service-delivery',
          name: 'service-delivery',
          component: ServiceDeliveryView,
        },
        {
          path: ':applicationGuid/operating-costs',
          name: 'operating-costs',
          component: OperatingCostsView,
        },
        {
          path: ':applicationGuid/staffing',
          name: 'staffing',
          component: StaffingView,
        },
        {
          path: ':applicationGuid/submit',
          name: 'submit-application',
          component: SubmitApplicationView,
        },
      ],
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/resources',
      name: 'resources',
      component: ResourcesView,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/manage-users',
      name: 'manage-users',
      component: ManageUsersView,
      meta: {
        requiresAuth: true,
        role: ROLES.ACCOUNT_MANAGEMENT,
        showFacility: false,
      },
      children: [],
    },
    {
      path: '/account-mgmt',
      component: EmptyRouterView,
      meta: {
        requiresAuth: true,
        role: ROLES.ACCOUNT_MANAGEMENT,
        showFacility: false,
      },
      children: [
        {
          path: '',
          name: 'account-mgmt',
          component: AccountMgmtView,
        },
        {
          path: 'manage-organization',
          name: 'manage-organization',
          component: ManageOrganizationView,
        },
        {
          path: 'manage-facility/:facilityId',
          name: 'manage-facility',
          component: ManageFacilityView,
        },
      ],
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
  ],
})

router.beforeEach((to, _from, next) => {
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
              if (!authStore.userInfo?.role) {
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
