<template>
  <v-form ref="form">
    <v-row v-if="!loading" no-gutters class="mb-2">
      <strong>Your $10 a Day Funding application is almost ready to submit. Please check and review all your inputs. You will not be able to change these details after submission.</strong>
      <v-col cols="12" align="right">
        <AppButton v-if="isEmpty(panel)" id="expand-button" :primary="false" size="large" width="200px" @click="togglePanel">
          <v-icon>mdi-arrow-expand-vertical</v-icon>
          Expand All
        </AppButton>
        <AppButton v-else id="collapse-button" :primary="false" size="large" width="200px" @click="togglePanel">
          <v-icon>mdi-arrow-collapse-vertical</v-icon>
          Collapse All
        </AppButton>
      </v-col>
    </v-row>
    <div>
      <v-skeleton-loader :loading="loading" type="table-tbody">
        <v-expansion-panels v-model="panel" multiple>
          <v-expansion-panel v-for="page in PAGES" :key="page.id" :value="page.id">
            <v-expansion-panel-title>
              <div v-if="isPageComplete(page)">
                <span class="header-label">{{ page.title }}</span>
                <v-icon class="check-icon pb-1">mdi-check-circle</v-icon>
              </div>
              <div v-else>
                <span class="header-label">{{ page.title }}</span>
                <span v-if="!readonly">
                  <v-icon class="alert-icon pb-1 mr-2">mdi-alert-circle</v-icon>
                  <span class="error-message">Your form is missing required information.</span>
                </span>
              </div>
            </v-expansion-panel-title>
            <v-expansion-panel-text>
              <FacilityDetailsSummary v-if="FACILITY_DETAILS_PAGES.includes(page.id)" :readonly="readonly" :contacts="contacts" />
              <EligibilitySummary v-if="page.id === APPLICATION_ROUTES.ELIGIBILITY" />
              <ServiceDeliverySummary v-if="SERVICE_DELIVERY_PAGES.includes(page.id)" :readonly="readonly" :licences="currentApplication?.licences" />
              <OperatingCostsSummary v-if="OPERATING_COSTS_PAGES.includes(page.id)" :readonly="readonly" :documents="currentApplication?.uploadedDocuments" />
              <StaffingSummary v-if="STAFFING_PAGES.includes(page.id)" :readonly="readonly" />
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-skeleton-loader>
    </div>
  </v-form>
</template>

<script>
import AppButton from '@/components/ui/AppButton.vue'
import { useApplicationsStore } from '@/stores/applications'
import { mapState, mapWritableState, mapActions } from 'pinia'
import FacilityDetailsSummary from '@/components/applications/review/FacilityDetailsSummary.vue'
import EligibilitySummary from '@/components/applications/review/EligibilitySummary.vue'
import ServiceDeliverySummary from '@/components/applications/review/ServiceDeliverySummary.vue'
import OperatingCostsSummary from '@/components/applications/review/OperatingCostsSummary.vue'
import StaffingSummary from '@/components/applications/review/StaffingSummary.vue'
import alertMixin from '@/mixins/alertMixin'
import { APPLICATION_ROUTES, RENEWAL_ROUTES, FACILITY_DETAILS_PAGES, SERVICE_DELIVERY_PAGES, OPERATING_COSTS_PAGES, STAFFING_PAGES } from '@/utils/constants'
import { isEmpty } from 'lodash'

export default {
  name: 'ReviewApplicationView',
  components: { AppButton, FacilityDetailsSummary, EligibilitySummary, ServiceDeliverySummary, OperatingCostsSummary, StaffingSummary },
  mixins: [alertMixin],

  async beforeRouteLeave(_to, _from, next) {
    this.validation = !this.readonly
    next(!this.loading)
  },

  props: {
    readonly: {
      type: Boolean,
      default: false,
    },
    back: {
      type: Boolean,
      default: false,
    },
    next: {
      type: Boolean,
      default: false,
    },
    contacts: {
      type: Array,
      default: () => [],
    },
  },

  emits: ['process'],

  data() {
    return {
      panel: [],
      loading: false,
    }
  },

  computed: {
    ...mapState(useApplicationsStore, ['currentApplication', 'isFacilityDetailsComplete', 'isEligibilityComplete', 'isServiceDeliveryComplete', 'isOperatingCostsComplete', 'isStaffingComplete']),
    ...mapWritableState(useApplicationsStore, ['validation']),
    isRenewal() {
      return !!this.$route.meta.isRenewal
    },
    allPageIDs() {
      return this.PAGES?.map((page) => page.id)
    },
  },

  watch: {
    back: {
      handler() {
        if (this.isRenewal) {
          this.$router.push({ name: RENEWAL_ROUTES.STAFFING, params: { applicationGuid: this.$route.params.applicationGuid } })
        } else {
          this.$router.push({ name: APPLICATION_ROUTES.STAFFING, params: { applicationGuid: this.$route.params.applicationGuid } })
        }
      },
    },
    next: {
      handler() {
        if (this.isRenewal) {
          this.$router.push({ name: RENEWAL_ROUTES.SUBMIT, params: { applicationGuid: this.$route.params.applicationGuid } })
        } else {
          this.$router.push({ name: APPLICATION_ROUTES.SUBMIT, params: { applicationGuid: this.$route.params.applicationGuid } })
        }
      },
    },
  },

  async created() {
    console.log(this.readonly)
    this.APPLICATION_ROUTES = APPLICATION_ROUTES
    this.FACILITY_DETAILS_PAGES = FACILITY_DETAILS_PAGES
    this.SERVICE_DELIVERY_PAGES = SERVICE_DELIVERY_PAGES
    this.OPERATING_COSTS_PAGES = OPERATING_COSTS_PAGES
    this.STAFFING_PAGES = STAFFING_PAGES
    if (this.isRenewal) {
      this.PAGES = [
        {
          title: 'Facility',
          id: RENEWAL_ROUTES.FACILITY_DETAILS,
        },

        {
          title: 'Service Delivery Details',
          id: RENEWAL_ROUTES.SERVICE_DELIVERY,
        },
        {
          title: 'Operating Costs',
          id: RENEWAL_ROUTES.OPERATING_COSTS,
        },
        {
          title: 'Staffing',
          id: RENEWAL_ROUTES.STAFFING,
        },
      ]
    } else {
      this.PAGES = [
        {
          title: 'Facility',
          id: APPLICATION_ROUTES.FACILITY_DETAILS,
        },
        {
          title: 'Eligibility',
          id: APPLICATION_ROUTES.ELIGIBILITY,
        },
        {
          title: 'Service Delivery Details',
          id: APPLICATION_ROUTES.SERVICE_DELIVERY,
        },
        {
          title: 'Operating Costs',
          id: APPLICATION_ROUTES.OPERATING_COSTS,
        },
        {
          title: 'Staffing',
          id: APPLICATION_ROUTES.STAFFING,
        },
      ]
    }

    await this.loadData()
    this.panel = this.allPageIDs
  },

  methods: {
    ...mapActions(useApplicationsStore, ['getApplication']),
    isEmpty,
    async loadData() {
      if (this.readonly) return
      try {
        this.$emit('process', true)
        this.loading = true
        await this.getApplication(this.$route.params.applicationGuid)
      } catch (error) {
        this.setFailureAlert('Failed to load the application', error)
      } finally {
        this.loading = false
        this.$emit('process', false)
      }
    },

    togglePanel() {
      this.panel = isEmpty(this.panel) ? this.allPageIDs : []
    },

    isPageComplete(page) {
      switch (page.id) {
        case APPLICATION_ROUTES.FACILITY_DETAILS:
        case RENEWAL_ROUTES.FACILITY_DETAILS:
          return this.isFacilityDetailsComplete
        case APPLICATION_ROUTES.ELIGIBILITY:
          return this.isEligibilityComplete
        case APPLICATION_ROUTES.SERVICE_DELIVERY:
        case RENEWAL_ROUTES.SERVICE_DELIVERY:
          return this.isServiceDeliveryComplete
        case APPLICATION_ROUTES.OPERATING_COSTS:
        case RENEWAL_ROUTES.OPERATING_COSTS:
          return this.isOperatingCostsComplete
        case APPLICATION_ROUTES.STAFFING:
        case RENEWAL_ROUTES.STAFFING:
          return this.isStaffingComplete
      }
    },
  },
}
</script>

<style scoped>
.header-label {
  font-weight: 700;
  font-size: 20px;
  margin-right: 12px;
}
</style>
