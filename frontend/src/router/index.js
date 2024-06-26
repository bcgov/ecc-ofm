import HttpStatus from 'http-status-codes'
import { createRouter, createWebHistory } from 'vue-router'

import { useAppStore } from '@/stores/app'
import { useAuthStore } from '@/stores/auth'
import { APPLICATION_ROUTES } from '@/utils/constants'
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
import HelpView from '@/views/HelpView.vue'
import SessionExpiredView from '@/views/SessionExpiredView.vue'
import UnauthorizedView from '@/views/UnauthorizedView.vue'
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
import FundingConfirmationView from '@/views/funding/FundingConfirmationView.vue'
import FundingOverviewView from '@/views/funding/FundingOverviewView.vue'
import FundingView from '@/views/funding/FundingView.vue'
import ReportingView from '@/views/reports/ReportingView.vue'
import SurveyView from '@/views/reports/SurveyView.vue'
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
      },
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: {
        requiresAuth: false,
      },
    },
    {
      path: '/internal',
      name: 'ministry-login',
      component: MinistryLoginView,
      meta: {
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
        requiresAuth: true,
      },
    },
    {
      path: '/messaging',
      name: 'messaging',
      component: MessagingView,
      meta: {
        requiresAuth: true,
        permission: PERMISSIONS.MANAGE_NOTIFICATIONS,
      },
    },
    {
      path: '/reporting/overview',
      name: 'reporting',
      component: ReportingView,
      meta: {
        requiresAuth: true,
        permission: PERMISSIONS.SEARCH_VIEW_REPORTS,
      },
    },
    {
      path: '/reporting/:surveyResponseGuid',
      name: 'survey-form',
      component: SurveyView,
      meta: {
        requiresAuth: true,
        permission: PERMISSIONS.SEARCH_VIEW_REPORTS,
      },
    },
    {
      path: '/funding/overview',
      name: 'funding-overview',
      component: FundingOverviewView,
      meta: {
        requiresAuth: true,
        permission: [PERMISSIONS.VIEW_FUNDING_AGREEMENT, PERMISSIONS.VIEW_FUNDING_AMOUNTS],
      },
    },
    {
      path: '/funding/:fundingGuid',
      name: 'funding',
      component: FundingView,
      meta: {
        requiresAuth: true,
        permission: PERMISSIONS.VIEW_FUNDING_AGREEMENT,
      },
    },
    {
      path: '/funding/confirmation',
      name: 'funding-confirmation',
      component: FundingConfirmationView,
      meta: {
        requiresAuth: true,
        permission: PERMISSIONS.VIEW_FUNDING_AGREEMENT,
      },
    },

    {
      path: '/documents',
      name: 'documents',
      component: DocumentsView,
      meta: {
        requiresAuth: true,
        hidden: true,
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
          name: APPLICATION_ROUTES.SELECT_FACILITY,
          component: SelectFacilityView,
          meta: {
            permission: PERMISSIONS.APPLY_FOR_FUNDING,
          },
        },
        {
          path: ':applicationGuid/facility-details',
          name: APPLICATION_ROUTES.FACILITY_DETAILS,
          component: FacilityDetailsView,
        },
        {
          path: ':applicationGuid/service-delivery',
          name: APPLICATION_ROUTES.SERVICE_DELIVERY,
          component: ServiceDeliveryView,
        },
        {
          path: ':applicationGuid/operating-costs',
          name: APPLICATION_ROUTES.OPERATING_COSTS,
          component: OperatingCostsView,
        },
        {
          path: ':applicationGuid/staffing',
          name: APPLICATION_ROUTES.STAFFING,
          component: StaffingView,
        },
        {
          path: ':applicationGuid/review',
          name: APPLICATION_ROUTES.REVIEW,
          component: ReviewApplicationView,
        },
        {
          path: ':applicationGuid/declare-submit',
          name: APPLICATION_ROUTES.SUBMIT,
          component: DeclareSubmitView,
        },
        {
          path: ':applicationGuid/confirmation',
          name: APPLICATION_ROUTES.CONFIRMATION,
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
          permission: PERMISSIONS.APPLY_FOR_FUNDING,
        },
      ],
    },
    {
      path: '/supplementary-confirmation',
      name: 'supplementary-confirmation',
      component: SupplementaryConfirmationView,
      meta: {
        requiresAuth: true,
        permission: PERMISSIONS.APPLY_FOR_FUNDING,
      },
    },
    {
      path: '/help',
      name: 'help',
      component: HelpView,
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
            permission: PERMISSIONS.MANAGE_USERS_VIEW,
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
      component: UnauthorizedView,
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
  const appStore = useAppStore()
  // Check for backend errors raised on startup
  if (appStore.backendError && to.name !== 'error') {
    return next('error')
  }

  // Check for routes which aren't available yet
  if (to.meta.hidden) {
    return next('home')
  }

  const authStore = useAuthStore()
  if (to.meta.requiresAuth) {
    authStore
      .getJwtToken()
      .then(() => {
        if (!authStore.isAuthenticated) {
          return next('/token-expired')
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
              if (to.meta.permission && !authStore.hasPermission(to.meta.permission)) {
                return next('unauthorized')
              }
              // Block access to Impersonate
              if (to.name === 'impersonate') {
                return next('unauthorized')
              }
            }
            next()
          })
          .catch((error) => {
            if ([HttpStatus.FORBIDDEN, HttpStatus.UNAUTHORIZED].includes(error.response?.status)) {
              return next('unauthorized')
            }
            next('error')
          })
      })
      .catch((_err) => {
        if (!authStore.userInfo) {
          return next('/login')
        }
        next('/token-expired')
      })
  } else {
    // Block access to Login/Internal/Logout when authenticated
    if ((to.name.endsWith('login') || to.name === 'logout') && authStore.isAuthenticated) {
      return next('home')
    }
    next()
  }
})

export default router
