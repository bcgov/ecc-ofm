<template>
  <v-form ref="form">
    <h2>Review</h2>
    <v-row v-if="!loading" no-gutters class="mb-2">
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
                <div v-if="!readonly">
                  <v-icon class="alert-icon pb-1 mr-2">mdi-alert-circle</v-icon>
                  <span class="error-message">Your form is missing required information.</span>
                </div>
              </div>
            </v-expansion-panel-title>
            <v-expansion-panel-text>
              <FacilityDetailsSummary v-if="page.id === APPLICATION_ROUTES.FACILITY_DETAILS" :readonly="readonly" :facility="facility" :contacts="contacts" />
              <ServiceDeliverySummary v-if="page.id === APPLICATION_ROUTES.SERVICE_DELIVERY" :readonly="readonly" :licences="currentApplication?.licences" />
              <OperatingCostsSummary v-if="page.id === APPLICATION_ROUTES.OPERATING_COSTS" :readonly="readonly" :documents="currentApplication?.uploadedDocuments" />
              <StaffingSummary v-if="page.id === APPLICATION_ROUTES.STAFFING" :readonly="readonly" />
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
import ServiceDeliverySummary from '@/components/applications/review/ServiceDeliverySummary.vue'
import OperatingCostsSummary from '@/components/applications/review/OperatingCostsSummary.vue'
import StaffingSummary from '@/components/applications/review/StaffingSummary.vue'
import alertMixin from '@/mixins/alertMixin'
import permissionsMixin from '@/mixins/permissionsMixin'
import { APPLICATION_ROUTES } from '@/utils/constants'
import { isEmpty } from 'lodash'

export default {
  name: 'ReviewApplicationView',
  components: { AppButton, FacilityDetailsSummary, ServiceDeliverySummary, OperatingCostsSummary, StaffingSummary },
  mixins: [alertMixin, permissionsMixin],
  async beforeRouteLeave(_to, _from, next) {
    this.validation = true
    next()
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
    facility: {
      type: Object,
      default: () => {
        return {}
      },
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
    ...mapState(useApplicationsStore, ['currentApplication', 'isFacilityDetailsComplete', 'isServiceDeliveryComplete', 'isOperatingCostsComplete', 'isStaffingComplete']),
    ...mapWritableState(useApplicationsStore, ['validation']),
    allPageIDs() {
      return this.PAGES?.map((page) => page.id)
    },
  },
  watch: {
    back: {
      handler() {
        this.$router.push({ name: APPLICATION_ROUTES.STAFFING, params: { applicationGuid: this.$route.params.applicationGuid } })
      },
    },
    next: {
      handler() {
        this.$router.push({ name: APPLICATION_ROUTES.SUBMIT, params: { applicationGuid: this.$route.params.applicationGuid } })
      },
    },
  },
  async created() {
    this.APPLICATION_ROUTES = APPLICATION_ROUTES
    this.PAGES = [
      {
        title: 'Facility',
        id: APPLICATION_ROUTES.FACILITY_DETAILS,
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
          return this.isFacilityDetailsComplete
        case APPLICATION_ROUTES.SERVICE_DELIVERY:
          return this.isServiceDeliveryComplete
        case APPLICATION_ROUTES.OPERATING_COSTS:
          return this.isOperatingCostsComplete
        case APPLICATION_ROUTES.STAFFING:
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
