import { createRouter, createWebHistory } from 'vue-router'

import { useAuthStore } from '@/stores/auth'
import { ROLES } from '@/utils/constants'
import { PERMISSIONS } from '@/utils/constants/permissions.js'
import BackendSessionExpiredView from '@/views/BackendSessionExpiredView.vue'
import DocumentsView from '@/views/DocumentsView.vue'
import ErrorView from '@/views/ErrorView.vue'
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
import AccountMgmtHomeView from '@/views/account-mgmt/AccountMgmtHomeView.vue'
import AccountMgmtView from '@/views/account-mgmt/AccountMgmtView.vue'
import ManageFacilityView from '@/views/account-mgmt/ManageFacilityView.vue'
import ManageOrganizationView from '@/views/account-mgmt/ManageOrganizationView.vue'
import ManageUsersView from '@/views/account-mgmt/ManageUsersView.vue'
import ApplicationConfirmationView from '@/views/applications/ApplicationConfirmationView.vue'
import ApplicationView from '@/views/applications/ApplicationView.vue'
import ApplicationsHistoryView from '@/views/applications/ApplicationsHistoryView.vue'
import DeclareSubmitView from '@/views/applications/DeclareSubmitView.vue'
import FacilityDetailsView from '@/views/applications/FacilityDetailsView.vue'
import OperatingCostsView from '@/views/applications/OperatingCostsView.vue'
import ReviewApplicationView from '@/views/applications/ReviewApplicationView.vue'
import SelectFacilityView from '@/views/applications/SelectFacilityView.vue'
import ServiceDeliveryView from '@/views/applications/ServiceDeliveryView.vue'
import StaffingView from '@/views/applications/StaffingView.vue'
import FundingOverviewView from '@/views/funding/FundingOverviewView.vue'
import FundingView from '@/views/funding/FundingView.vue'
import SupplementaryAllowanceView from '@/views/supp-allowances/SupplementaryAllowanceView.vue'
import SupplementaryConfirmationView from '@/views/supp-allowances/SupplementaryConfirmation.vue'
import SupplementaryFormView from '@/views/supp-allowances/SupplementaryFormView.vue'
import SupplementarySubmitView from '@/views/supp-allowances/SupplementarySubmitView.vue'

const router = createRouter({
  history: createWebHistory(),
  base: import.meta.env.BASE_URL,
  scrollBehavior: function (to, from, savedPosition) {
    if (to.hash) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve({
            el: to.hash,
            behavior: 'smooth',
          })
        }, 700)
      })
    } else {
      return { x: 0, y: 0 }
    }
  },
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
        permission: 'Cat Lover',
      },
    },
    {
      path: '/funding/overview',
      name: 'funding-overview',
      component: FundingOverviewView,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/funding/:fundingGuid',
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
        permission: PERMISSIONS.VIEW_APPLICATIONS,
      },
    },
    {
      path: '/applications',
      name: 'applications',
      component: ApplicationView,
      redirect: '/applications/select-facility',
      meta: {
        requiresAuth: true,
        permission: PERMISSIONS.VIEW_APPLICATIONS,
      },
      children: [
        {
          path: 'select-facility',
          name: 'select-facility',
          component: SelectFacilityView,
          meta: {
            permission: PERMISSIONS.APPLY_FOR_FUNDING,
          },
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
          path: ':applicationGuid/review',
          name: 'review-application',
          component: ReviewApplicationView,
        },
        {
          path: ':applicationGuid/declare-submit',
          name: 'declare-submit',
          component: DeclareSubmitView,
          meta: {
            permission: PERMISSIONS.APPLY_FOR_FUNDING,
          },
        },
        {
          path: ':applicationGuid/confirmation',
          name: 'application-confirmation',
          component: ApplicationConfirmationView,
          meta: {
            permission: PERMISSIONS.APPLY_FOR_FUNDING,
          },
        },
      ],
    },
    {
      path: '/supp-allowances',
      name: 'supp-allowances',
      component: SupplementaryAllowanceView,
      redirect: { name: 'supp-allowances-form' },
      meta: {
        requiresAuth: true,
        permission: PERMISSIONS.VIEW_APPLICATIONS,
      },
      children: [
        {
          path: ':applicationGuid?',
          name: 'supp-allowances-form',
          component: SupplementaryFormView,
        },
        {
          path: ':applicationGuid/declare-submit',
          name: 'supp-allowances-submit',
          component: SupplementarySubmitView,
        },
      ],
    },
    {
      path: '/supplementary-confirmation',
      name: 'supplementary-confirmation',
      component: SupplementaryConfirmationView,
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
      path: '/account-mgmt',
      component: AccountMgmtHomeView,
      meta: {
        requiresAuth: true,
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
        {
          path: 'manage-users',
          name: 'manage-users',
          component: ManageUsersView,
          meta: {
            role: ROLES.ACCOUNT_MANAGEMENT,
          },
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
              // Validate specific permission
              if (to.meta.permission) {
                console.log(`Has ${to.meta.permission}: ${authStore.hasPermission(to.meta.permission)}`)
              }
              if (to.meta.permission && !authStore.hasPermission(to.meta.permission)) {
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
