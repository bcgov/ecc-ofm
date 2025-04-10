<template>
  <v-container fluid class="sticky-top">
    <div v-for="item in navBarItems" :key="item.id">
      <v-row no-gutters @click="navigateToPage(item)">
        <v-icon :class="getNavIconClass(item)" class="mr-3">{{ getNavIcon(item) }}</v-icon>
        <span :class="getNavTextClass(item)">{{ item.title }}</span>
      </v-row>
      <v-row v-if="item.id < Object.keys(navBarItems).length" no-gutters>
        <v-col cols="2">
          <div :class="getVerticalLineClass(item)"></div>
        </v-col>
        <v-col cols="10"></v-col>
      </v-row>
    </div>
  </v-container>
</template>

<script>
import { mapState } from 'pinia'
import { useApplicationsStore } from '@/stores/applications'
import {
  APPLICATION_ROUTES,
  RENEWAL_ROUTES,
  FACILITY_DETAILS_PAGES,
  SELECT_FACILITY_PAGES,
  SERVICE_DELIVERY_PAGES,
  OPERATING_COSTS_PAGES,
  STAFFING_PAGES,
  REVIEW_PAGES,
  SUBMIT_PAGES,
  CONFIRMATION_PAGES,
} from '@/utils/constants'

export default {
  name: 'ApplicationNavBar',

  props: {
    loading: {
      type: Boolean,
      default: false,
    },
    isSelectFacilityPage: {
      type: Boolean,
      required: true,
    },
    isFacilityDetailsPage: {
      type: Boolean,
      required: true,
    },
  },

  computed: {
    ...mapState(useApplicationsStore, [
      'currentApplication',
      'isFacilityDetailsComplete',
      'isEligibilityComplete',
      'isServiceDeliveryComplete',
      'isOperatingCostsComplete',
      'isStaffingComplete',
      'isDeclareSubmitComplete',
      'isApplicationComplete',
    ]),
    isRenewal() {
      return !!this.$route.meta.isRenewal
    },
  },

  created() {
    if (this.isRenewal) {
      this.navBarItems = {
        facilityDetails: {
          id: 1,
          title: 'Facility Details',
          routeName: RENEWAL_ROUTES.FACILITY_DETAILS,
        },
        serviceDelivery: {
          id: 2,
          title: 'Service Delivery',
          routeName: RENEWAL_ROUTES.SERVICE_DELIVERY,
        },
        operatingCosts: {
          id: 3,
          title: 'Operating Costs',
          routeName: RENEWAL_ROUTES.OPERATING_COSTS,
        },
        staffing: {
          id: 4,
          title: 'Staffing',
          routeName: RENEWAL_ROUTES.STAFFING,
        },
        review: {
          id: 5,
          title: 'Review',
          routeName: RENEWAL_ROUTES.REVIEW,
        },
        submit: {
          id: 6,
          title: 'Declare & Submit',
          routeName: RENEWAL_ROUTES.SUBMIT,
        },
      }
    } else {
      this.navBarItems = {
        facilityDetails: {
          id: 1,
          title: 'Facility Details',
          routeName: APPLICATION_ROUTES.FACILITY_DETAILS,
        },
        eligibility: {
          id: 2,
          title: 'Eligibility',
          routeName: APPLICATION_ROUTES.ELIGIBILITY,
        },
        serviceDelivery: {
          id: 3,
          title: 'Service Delivery',
          routeName: APPLICATION_ROUTES.SERVICE_DELIVERY,
        },
        operatingCosts: {
          id: 4,
          title: 'Operating Costs',
          routeName: APPLICATION_ROUTES.OPERATING_COSTS,
        },
        staffing: {
          id: 5,
          title: 'Staffing',
          routeName: APPLICATION_ROUTES.STAFFING,
        },
        review: {
          id: 6,
          title: 'Review',
          routeName: APPLICATION_ROUTES.REVIEW,
        },
        submit: {
          id: 7,
          title: 'Declare & Submit',
          routeName: APPLICATION_ROUTES.SUBMIT,
        },
      }
    }
  },

  methods: {
    isDisabled(item) {
      return (
        this.loading ||
        (this.isSelectFacilityPage && !FACILITY_DETAILS_PAGES.includes(item?.routeName)) ||
        (!FACILITY_DETAILS_PAGES.includes(item?.routeName) && !this.isFacilityDetailsComplete) ||
        (!FACILITY_DETAILS_PAGES.includes(item?.routeName) && !this.isRenewal && !this.isRouteNameEqual(item, APPLICATION_ROUTES.ELIGIBILITY) && !this.isEligibilityComplete) ||
        (SUBMIT_PAGES.includes(item?.routeName) && !this.isApplicationComplete)
      )
    },

    isCurrent(item) {
      //I think mine is better but I don't quite get why it was the other way
      return this.isRouteNameEqual(item, this.$route.name) || this.isSelectFacilityPage
      //return this.isRouteNameEqual(item, this.$route.name) || (this.isSelectFacilityPage && this.isRouteNameEqual(item, APPLICATION_ROUTES.FACILITY_DETAILS))
    },

    isRouteNameEqual(item, routeName) {
      return item?.routeName === routeName
    },

    navigateToPage(item) {
      if (this.isDisabled(item)) return
      if (this.isSelectFacilityPage && this.isRenewal) {
        this.$router.push({ name: RENEWAL_ROUTES.SELECT_FACILITY })
      } else if (this.isSelectFacilityPage) {
        this.$router.push({ name: APPLICATION_ROUTES.SELECT_FACILITY })
      } else {
        this.$router.push({ name: item.routeName, params: { applicationGuid: this.$route.params.applicationGuid } })
      }
    },

    getNavIconClass(item) {
      if (this.isDisabled(item)) {
        return 'disabled'
      }
      return this.isCurrent(item) ? 'current-icon' : 'active'
    },

    getNavTextClass(item) {
      if (this.isDisabled(item)) {
        return 'disabled'
      }
      return this.isCurrent(item) ? 'current-text' : 'active active-text'
    },

    getVerticalLineClass(item) {
      if (
        this.isSelectFacilityPage ||
        !this.isFacilityDetailsComplete ||
        (!this.isRouteNameEqual(item, APPLICATION_ROUTES.FACILITY_DETAILS) && !this.isEligibilityComplete) ||
        (this.isRouteNameEqual(item, APPLICATION_ROUTES.REVIEW) && !this.isApplicationComplete)
      ) {
        return 'vertical-line-disabled'
      }
      return 'vertical-line-active'
    },

    getNavIcon(item) {
      if (this.isSelectFacilityPage) {
        return 'mdi-circle'
      }
      const isComplete =
        (FACILITY_DETAILS_PAGES.includes(item?.routeName) && this.isFacilityDetailsComplete) ||
        (this.isRouteNameEqual(item, APPLICATION_ROUTES.ELIGIBILITY) && this.isEligibilityComplete) ||
        (SERVICE_DELIVERY_PAGES.includes(item?.routeName) && this.isServiceDeliveryComplete) ||
        (OPERATING_COSTS_PAGES.includes(item?.routeName) && this.isOperatingCostsComplete) ||
        (STAFFING_PAGES.includes(item?.routeName) && this.isStaffingComplete) ||
        (REVIEW_PAGES.includes(item?.routeName) && this.isApplicationComplete) ||
        (CONFIRMATION_PAGES.includes(item?.routeName) && this.isDeclareSubmitComplete)
      return isComplete ? 'mdi-check-circle' : 'mdi-circle'
    },
  },
}
</script>

<style scoped>
.vertical-line-active {
  margin: 0px 0px 0px 10px;
  border-left: 3px solid #003366;
  height: 50px;
}

.vertical-line-disabled {
  margin: 0px 0px 0px 10px;
  border-left: 3px solid rgba(0, 0, 0, 0.15);
  height: 50px;
}

.active {
  color: #003366;
  text-decoration: none;
  cursor: pointer;
}

.active-text:hover {
  text-decoration: underline;
}

.disabled {
  color: rgba(0, 0, 0, 0.3);
  text-decoration: none;
  pointer-events: none;
}

.current-icon {
  color: #fcba19;
}

.current-text {
  color: #003366;
  font-weight: 700;
}

.sticky-top {
  position: sticky;
  top: 100px;
  z-index: 2;
}
</style>
