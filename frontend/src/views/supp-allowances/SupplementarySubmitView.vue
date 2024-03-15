<template>
  <v-form ref="form">
    <h2>THIS IS SUPP SUBMIT</h2>
    <v-row v-if="!loading" no-gutters class="mb-2">
      <v-col cols="12" align="right">
        <!-- <AppButton v-if="isEmpty(panel)" id="expand-button" :primary="false" size="large" width="200px" @click="togglePanel">
          <v-icon>mdi-arrow-expand-vertical</v-icon>
          Expand All
        </AppButton>
        <AppButton v-else id="collapse-button" :primary="false" size="large" width="200px" @click="togglePanel">
          <v-icon>mdi-arrow-collapse-vertical</v-icon>
          Collapse All
        </AppButton> -->
      </v-col>
    </v-row>
    <div>
      <v-skeleton-loader v-if="loading" :loading="loading" type="table-tbody"></v-skeleton-loader>
      <v-expansion-panels v-else v-model="panel" multiple>
        <v-expansion-panel v-for="panel in PANELS" :key="panel.id" :value="panel.id">
          <v-expansion-panel-title v-if="panel.supplementaryApplicationId">
            <!-- page complete -->
            <div v-if="true">
              <span class="header-label">{{ panel.title }}</span>
              <v-icon class="check-icon pb-1">mdi-check-circle</v-icon>
            </div>
            <div v-else>
              <span class="header-label">{{ panel.title }}</span>
              <v-icon class="alert-icon pb-1 mr-2">mdi-alert-circle</v-icon>
              <span class="error-message">Your form is missing required information.</span>
            </div>
          </v-expansion-panel-title>
          <v-expansion-panel-text>
            <IndigenousProgrammingSummary :indigenousProgrammingModel="getModel(SUPPLEMENTARY_TYPES.INDIGENOUS)"></IndigenousProgrammingSummary>
            <!-- <FacilityDetailsSummary v-if="page.id === 'facility-details'" :facility="facility" :contacts="contacts" />
              <ServiceDeliverySummary v-if="page.id === 'service-delivery'" :licences="currentApplication?.licences" />
              <OperatingCostsSummary v-if="page.id === 'operating-costs'" :documents="currentApplication?.uploadedDocuments" />
              <StaffingSummary v-if="page.id === 'staffing'" /> -->
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>
    </div>
  </v-form>
</template>

<script>
import AppLabel from '@/components/ui/AppLabel.vue'
import rules from '@/utils/rules'
import AppNumberInput from '@/components/ui/AppNumberInput.vue'
import AppButton from '@/components/ui/AppButton.vue'
import AppDocumentUpload from '@/components/ui/AppDocumentUpload.vue'
import ApplicationService from '@/services/applicationService'
import { SUPPLEMENTARY_TYPES } from '@/utils/constants'
import IndigenousProgrammingSummary from '@/components/supp-allowances/IndigenousProgrammingSummary.vue'

export default {
  components: { AppLabel, AppNumberInput, AppButton, AppDocumentUpload, IndigenousProgrammingSummary },
  props: {},
  emits: [],
  data() {
    return {
      loading: false,
      panel: [],
      models: [],
      rules,
      readonly: false, //update later when we have submitted forms
      monthlyLeaseFormat: {
        nullValue: '0.00',
        min: 0,
        decimal: '.',
        separator: ',',
        precision: 2,
      },
    }
  },
  computed: {},
  watch: {},
  async created() {
    this.SUPPLEMENTARY_TYPES = SUPPLEMENTARY_TYPES
    this.PANELS = [
      {
        title: 'Indigenous Programming Allowance',
        id: 'indigenous',
        supplementaryType: this.SUPPLEMENTARY_TYPES.INDIGENOUS,
      },
      {
        title: 'Support Needs Programming Allowance',
        id: 'support-needs',
        supplementaryType: this.SUPPLEMENTARY_TYPES.SUPPORT,
      },
      {
        title: 'Transportation Allowance',
        id: 'transportation',
        supplementaryType: this.SUPPLEMENTARY_TYPES.TRANSPORT,
      },
    ]
    await this.loadData()
  },
  methods: {
    async loadData() {
      try {
        console.log(this.$route.params.applicationGuid)
        this.loading = true
        this.models = await ApplicationService.getSupplementaryApplications(this.$route.params.applicationGuid)
        console.log(this.models)

        this.models.forEach((el) => {
          const found = this.PANELS.find((panel) => panel.supplementaryType == el.supplementaryType)
          console.log(found)
          found.supplementaryApplicationId = el.supplementaryApplicationId
        })
      } catch (error) {
        this.setFailureAlert('Failed to load supplementary applications')
      } finally {
        this.loading = false
      }
    },
    getModel(type) {
      return this.models?.find((el) => el.supplementaryType === type)
    },
  },
}
</script>

<style scoped>
.greyBorder {
  border: 1px solid #0000001a;
}

.header-label {
  font-weight: 700;
  font-size: 20px;
  margin-right: 12px;
}
</style>
