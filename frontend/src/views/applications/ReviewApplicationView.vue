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
          <v-expansion-panel v-for="page in pages" :key="page.id" :value="page.id">
            <v-expansion-panel-title>
              <div v-if="isPageComplete(page)">
                <span class="header-label">{{ page.title }}</span>
                <v-icon class="check-icon pb-1">mdi-check-circle</v-icon>
              </div>
              <div v-else>
                <span class="header-label">{{ page.title }}</span>
                <v-icon class="alert-icon pb-1 mr-2">mdi-alert-circle</v-icon>
                <span class="error-message">Your form is missing required information.</span>
              </div>
            </v-expansion-panel-title>
            <v-expansion-panel-text>
              <FacilityDetailsSummary v-if="page.id === 'facility-details'" :facility="facility" :contacts="contacts" />
              <ServiceDeliverySummary v-if="page.id === 'service-delivery'" :licences="currentApplication?.licences" />
              <OperatingCostsSummary v-if="page.id === 'operating-costs'" :documents="currentApplication?.uploadedDocuments" />
              <StaffingSummary v-if="page.id === 'staffing'" />
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
import { useAppStore } from '@/stores/app'
import { mapState, mapWritableState, mapActions } from 'pinia'
import FacilityDetailsSummary from '@/components/applications/review/FacilityDetailsSummary.vue'
import ServiceDeliverySummary from '@/components/applications/review/ServiceDeliverySummary.vue'
import OperatingCostsSummary from '@/components/applications/review/OperatingCostsSummary.vue'
import StaffingSummary from '@/components/applications/review/StaffingSummary.vue'
import FacilityService from '@/services/facilityService'
import alertMixin from '@/mixins/alertMixin'
import { isEmpty } from 'lodash'

export default {
  name: 'ReviewApplicationView',
  components: { AppButton, FacilityDetailsSummary, ServiceDeliverySummary, OperatingCostsSummary, StaffingSummary },
  mixins: [alertMixin],
  async beforeRouteLeave(_to, _from, next) {
    this.validation = true
    next()
  },
  props: {
    back: {
      type: Boolean,
      default: false,
    },
    next: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['process'],
  data() {
    return {
      panel: [],
      loading: false,
      facility: undefined,
      contacts: [],
      pages: [
        {
          title: 'Facility',
          id: 'facility-details',
        },
        {
          title: 'Service Delivery Details',
          id: 'service-delivery',
        },
        {
          title: 'Operating Costs',
          id: 'operating-costs',
        },
        {
          title: 'Staffing',
          id: 'staffing',
        },
      ],
    }
  },
  computed: {
    ...mapState(useAppStore, ['getRoleNameById']),
    ...mapState(useApplicationsStore, ['currentApplication', 'isFacilityDetailsComplete', 'isServiceDeliveryComplete', 'isOperatingCostsComplete', 'isStaffingComplete']),
    ...mapWritableState(useApplicationsStore, ['validation']),
    allPageIDs() {
      return this.pages?.map((page) => page.id)
    },
  },
  watch: {
    back: {
      handler() {
        this.$router.push({ name: 'staffing', params: { applicationGuid: this.$route.params.applicationGuid } })
      },
    },
    next: {
      handler() {
        this.$router.push({ name: 'declare-submit', params: { applicationGuid: this.$route.params.applicationGuid } })
      },
    },
  },
  async created() {
    await this.loadData()
    this.panel = this.allPageIDs
  },
  methods: {
    ...mapActions(useApplicationsStore, ['getApplication']),
    isEmpty,
    async loadData() {
      try {
        this.$emit('process', true)
        this.loading = true
        await this.getApplication(this.$route.params.applicationGuid)
        await Promise.all([this.getFacility(), this.getContacts()])
      } catch (error) {
        this.setFailureAlert('Failed to load the application', error)
      } finally {
        this.loading = false
        this.$emit('process', false)
      }
    },

    async getContacts() {
      try {
        this.contacts = await FacilityService.getContacts(this.currentApplication?.facilityId)
        this.contacts?.forEach((contact) => {
          contact.fullName = `${contact.firstName} ${contact.lastName}`
          contact.roleName = this.getRoleNameById(Number(contact.role))
        })
      } catch (error) {
        this.setFailureAlert('Failed to get contacts for facilityId = ' + this.currentApplication?.facilityId, error)
      }
    },

    async getFacility() {
      try {
        this.facility = await FacilityService.getFacility(this.currentApplication?.facilityId)
      } catch (error) {
        this.setFailureAlert('Failed to get Facility information for facilityId = ' + this.currentApplication?.facilityId, error)
      }
    },

    togglePanel() {
      this.panel = isEmpty(this.panel) ? this.allPageIDs : []
    },

    isPageComplete(page) {
      switch (page.id) {
        case 'facility-details':
          return this.isFacilityDetailsComplete
        case 'service-delivery':
          return this.isServiceDeliveryComplete
        case 'operating-costs':
          return this.isOperatingCostsComplete
        case 'staffing':
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
