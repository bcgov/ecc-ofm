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
            <div v-if="isPanelComplete(panel)">
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
            <IndigenousProgrammingSummary v-if="panel.id === 'indigenous'" :indigenousProgrammingModel="getModel(SUPPLEMENTARY_TYPES.INDIGENOUS)"></IndigenousProgrammingSummary>
            <SupportNeedsSummary v-if="panel.id === 'support-needs'" :supportModel="getModel(SUPPLEMENTARY_TYPES.SUPPORT)"></SupportNeedsSummary>
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
import SupportNeedsSummary from '@/components/supp-allowances/SupportNeedsSummary.vue'
import { isEmpty, isEqual, cloneDeep } from 'lodash'
import { INDIG_CHECKBOX_LABELS, SUPPORT_CHECKBOX_LABELS } from '@/components/supp-allowances/suppConstants.js'

export default {
  components: { AppLabel, AppNumberInput, AppButton, AppDocumentUpload, IndigenousProgrammingSummary, SupportNeedsSummary },
  props: {},
  emits: [],
  data() {
    return {
      loading: false,
      panel: undefined,
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
  computed: {
    isIndigenousComplete() {
      const model = this.getModel(SUPPLEMENTARY_TYPES.INDIGENOUS)
      if (!model?.indigenousFundingModel.includes(this.INDIG_CHECKBOX_LABELS.find((item) => item.label === 'Other').value)) {
        return true
      }
      return model?.indigenousFundingModel.includes(this.INDIG_CHECKBOX_LABELS.find((item) => item.label === 'Other').value) && !isEmpty(model.indigenousOtherDescription)
    },
    isSupportComplete() {
      const model = this.getModel(SUPPLEMENTARY_TYPES.SUPPORT)
      console.log(model)
      if (!model?.supportFundingModel.includes(this.SUPPORT_CHECKBOX_LABELS.find((item) => item.label === 'Other').value)) {
        return true
      }
      return model?.supportFundingModel.includes(this.SUPPORT_CHECKBOX_LABELS.find((item) => item.label === 'Other').value) && !isEmpty(model.supportOtherDescription)
    },
  },
  watch: {},
  async created() {
    this.SUPPLEMENTARY_TYPES = SUPPLEMENTARY_TYPES
    this.SUPPORT_CHECKBOX_LABELS = SUPPORT_CHECKBOX_LABELS
    this.INDIG_CHECKBOX_LABELS = INDIG_CHECKBOX_LABELS
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
        this.loading = true
        this.models = await ApplicationService.getSupplementaryApplications(this.$route.params.applicationGuid)

        this.models.forEach((el) => {
          const found = this.PANELS.find((panel) => panel.supplementaryType == el.supplementaryType)
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
    isPanelComplete(page) {
      switch (page.id) {
        case 'indigenous':
          return this.isIndigenousComplete
        case 'support-needs':
          return this.isSupportComplete
        // case 'transportation':
        //   return this.isOperatingCostsComplete
      }
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
