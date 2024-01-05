<template>
  <v-container fluid>
    <div v-for="item in navBarItems" :key="item.id">
      <v-row no-gutters>
        <v-col cols="2" :class="getNavIconClass(item)">
          <v-icon>{{ getNavIcon(item) }}</v-icon>
        </v-col>
        <v-col cols="10">
          <router-link :to="getRouterLink(item)" :class="getNavTextClass(item)">
            {{ item.name }}
          </router-link>
        </v-col>
      </v-row>
      <v-row v-if="item.id < Object.keys(navBarItems).length" no-gutters>
        <v-col cols="2">
          <div :class="!isSelectFacilityPage ? 'vertical-line-active' : 'vertical-line-disabled'"></div>
        </v-col>
        <v-col cols="10"></v-col>
      </v-row>
    </div>
  </v-container>
</template>

<script>
import { mapState } from 'pinia'
import { useApplicationsStore } from '@/stores/applications'

export default {
  name: 'ApplicationNavBar',
  props: {
    loading: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      navBarItems: {
        facilityDetails: {
          id: 1,
          routeName: 'facility-details',
          name: 'Facility details',
        },
        licences: {
          id: 2,
          routeName: 'licences',
          name: 'Licences',
        },
        operatingCosts: {
          id: 3,
          routeName: 'operating-costs',
          name: 'Operating costs',
        },
        staffing: {
          id: 4,
          routeName: 'staffing',
          name: 'Staffing',
        },
        submit: {
          id: 5,
          routeName: 'submit-application',
          name: 'Submit',
        },
      },
    }
  },
  computed: {
    ...mapState(useApplicationsStore, ['currentApplication']),

    isSelectFacilityPage() {
      return this.$route.name === 'select-facility'
    },
  },
  methods: {
    getRouterLink(item) {
      if (this.isSelectFacilityPage) {
        return { name: 'select-facility' }
      }
      return { name: item.routeName, params: { applicationGuid: this.$route.params.applicationGuid } }
    },

    getNavIconClass(item) {
      if (this.loading) {
        return 'disabled'
      }
      if (this.isSelectFacilityPage) {
        return item.routeName === 'facility-details' ? 'current-icon' : 'disabled'
      }
      return item.routeName === this.$route.name ? 'current-icon' : 'active'
    },

    getNavTextClass(item) {
      if (this.loading) {
        return 'disabled'
      }
      if (this.isSelectFacilityPage) {
        return item.routeName === 'facility-details' ? 'current-text' : 'disabled'
      }
      return item.routeName === this.$route.name ? 'current-text' : 'active'
    },

    getNavIcon(item) {
      if (this.isSelectFacilityPage) {
        return `mdi-numeric-${item.id}-circle`
      }
      switch (item.routeName) {
        case 'facility-details':
          return this.currentApplication?.isFacilityDetailsComplete ? 'mdi-check-circle' : `mdi-numeric-${item.id}-circle`
        case 'licences':
          return this.currentApplication?.isLicencesComplete ? 'mdi-check-circle' : `mdi-numeric-${item.id}-circle`
        case 'operating-costs':
          return this.currentApplication?.isOperatingCostsComplete ? 'mdi-check-circle' : `mdi-numeric-${item.id}-circle`
        case 'staffing':
          return this.currentApplication?.isStaffingComplete ? 'mdi-check-circle' : `mdi-numeric-${item.id}-circle`
        case 'submit-application':
          return this.currentApplication?.isSubmitApplicationComplete ? 'mdi-check-circle' : `mdi-numeric-${item.id}-circle`
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
}

.active:hover {
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
</style>
