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
import { APPLICATION_ROUTES } from '@/utils/constants'

export default {
  name: 'ApplicationNavBar',

  props: {
    loading: {
      type: Boolean,
      default: false,
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

    isSelectFacilityPage() {
      return this.$route.name === APPLICATION_ROUTES.SELECT_FACILITY
    },
  },

  created() {
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
  },

  methods: {
    isDisabled(item) {
      return (
        this.loading ||
        (this.isSelectFacilityPage && !this.isRouteNameEqual(item, APPLICATION_ROUTES.FACILITY_DETAILS)) ||
        (!this.isRouteNameEqual(item, APPLICATION_ROUTES.FACILITY_DETAILS) && !this.isFacilityDetailsComplete) ||
        (!this.isRouteNameEqual(item, APPLICATION_ROUTES.FACILITY_DETAILS) && !this.isRouteNameEqual(item, APPLICATION_ROUTES.ELIGIBILITY) && !this.isEligibilityComplete) ||
        (this.isRouteNameEqual(item, APPLICATION_ROUTES.SUBMIT) && !this.isApplicationComplete)
      )
    },

    isCurrent(item) {
      return this.isRouteNameEqual(item, this.$route.name) || (this.isSelectFacilityPage && this.isRouteNameEqual(item, APPLICATION_ROUTES.FACILITY_DETAILS))
    },

    isRouteNameEqual(item, routeName) {
      return item?.routeName === routeName
    },

    navigateToPage(item) {
      if (this.isDisabled(item)) return
      if (this.isSelectFacilityPage) {
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
      switch (item.routeName) {
        case APPLICATION_ROUTES.FACILITY_DETAILS:
          return this.isFacilityDetailsComplete ? 'mdi-check-circle' : 'mdi-circle'
        case APPLICATION_ROUTES.ELIGIBILITY:
          return this.isEligibilityComplete ? 'mdi-check-circle' : 'mdi-circle'
        case APPLICATION_ROUTES.SERVICE_DELIVERY:
          return this.isServiceDeliveryComplete ? 'mdi-check-circle' : 'mdi-circle'
        case APPLICATION_ROUTES.OPERATING_COSTS:
          return this.isOperatingCostsComplete ? 'mdi-check-circle' : 'mdi-circle'
        case APPLICATION_ROUTES.STAFFING:
          return this.isStaffingComplete ? 'mdi-check-circle' : 'mdi-circle'
        case APPLICATION_ROUTES.REVIEW:
          return this.isApplicationComplete ? 'mdi-check-circle' : 'mdi-circle'
        case APPLICATION_ROUTES.SUBMIT:
          return this.isDeclareSubmitComplete ? 'mdi-check-circle' : 'mdi-circle'
      }
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
