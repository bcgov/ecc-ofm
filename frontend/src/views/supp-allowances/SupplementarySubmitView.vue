<template>
  <v-form ref="form" class="mt-10">
    <h2>Supplementary Application Submit</h2>
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
    <AppDialog v-model="showCancelDialog" title="Cancel Changes" :isLoading="loading" persistent max-width="40%" @close="toggleCancelDialog">
      <template #content>
        <v-row class="mb-2">
          <v-col class="text-center">
            <p class="pt-4 text-h6">Are you sure you want to cancel your changes?</p>
            <p class="pt-4 text-h6">Your progress will not be saved.</p>
          </v-col>
        </v-row>
      </template>
      <template #button>
        <v-row justify="space-around">
          <v-col cols="12" md="6" class="d-flex justify-center">
            <AppButton id="go-back-button" :primary="false" size="large" width="200px" :to="{ name: 'applications-history' }">Cancel Changes</AppButton>
          </v-col>
          <v-col cols="12" md="6" class="d-flex justify-center">
            <AppButton id="cancel-button" size="large" width="200px" @click="toggleCancelDialog()">Stay on page</AppButton>
          </v-col>
        </v-row>
      </template>
    </AppDialog>
    <div>
      <v-skeleton-loader v-if="loading" :loading="loading" type="table-tbody"></v-skeleton-loader>
      <div v-else>
        <v-expansion-panels v-model="panel" multiple>
          <v-expansion-panel v-for="panel in PANELS" :key="panel.id" :value="panel.id">
            <div v-if="panel.supplementaryApplicationId">
              <v-expansion-panel-title>
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
                <IndigenousProgrammingSummary
                  v-if="panel.id === 'indigenous' && panel.supplementaryApplicationId"
                  :indigenousProgrammingModel="getModel(SUPPLEMENTARY_TYPES.INDIGENOUS)"></IndigenousProgrammingSummary>
                <SupportNeedsSummary v-if="panel.id === 'support-needs' && panel.supplementaryApplicationId" :supportModel="getModel(SUPPLEMENTARY_TYPES.SUPPORT)"></SupportNeedsSummary>
                <TransportationSummary v-if="panel.id === 'transportation' && panel.supplementaryApplicationId" :transportModels="getTransportModels()"></TransportationSummary>
              </v-expansion-panel-text>
            </div>
          </v-expansion-panel>
        </v-expansion-panels>

        <v-checkbox
          id="declaration"
          v-model="supplementaryDeclaration"
          color="primary"
          :rules="rules.required"
          :disabled="readonly"
          label="I certify that all of the information provided is true and complete to the best of my knowledge."
          class="my-10"
          @input="setSubmit"></v-checkbox>
      </div>
    </div>
  </v-form>
</template>

<script>
import AppButton from '@/components/ui/AppButton.vue'
import AppDialog from '@/components/ui/AppDialog.vue'
import ApplicationService from '@/services/applicationService'
import alertMixin from '@/mixins/alertMixin'
import DocumentService from '@/services/documentService'
import IndigenousProgrammingSummary from '@/components/supp-allowances/IndigenousProgrammingSummary.vue'
import SupportNeedsSummary from '@/components/supp-allowances/SupportNeedsSummary.vue'
import TransportationSummary from '@/components/supp-allowances/TransportationSummary.vue'
import { SUPPLEMENTARY_TYPES, SUPPLEMENTARY_APPLICATION_STATUS_CODES } from '@/utils/constants'
import { isEmpty } from 'lodash'
import { INDIG_CHECKBOX_LABELS, SUPPORT_CHECKBOX_LABELS } from '@/components/supp-allowances/suppConstants.js'

import rules from '@/utils/rules'

export default {
  components: { AppDialog, AppButton, IndigenousProgrammingSummary, SupportNeedsSummary, TransportationSummary },
  mixins: [alertMixin],
  props: {
    back: {
      type: Boolean,
      default: false,
    },
    save: {
      type: Boolean,
      default: false,
    },
    next: {
      type: Boolean,
      default: false,
    },
    cancel: {
      type: Boolean,
      default: false,
    },
    submit: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['setSubmit', 'process'],
  data() {
    return {
      supplementaryDeclaration: false,
      loading: false,
      processing: false,
      panel: undefined,
      showCancelDialog: false,
      models: [],
      rules,
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
    allPanelIDs() {
      return this.PANELS?.map((panel) => panel.id)
    },
    isIndigenousComplete() {
      const model = this.getModel(SUPPLEMENTARY_TYPES.INDIGENOUS)
      if (!model?.indigenousFundingModel.includes(this.INDIG_CHECKBOX_LABELS.find((item) => item.label === 'Other').value)) {
        return true
      }
      return model?.indigenousFundingModel.includes(this.INDIG_CHECKBOX_LABELS.find((item) => item.label === 'Other').value) && !isEmpty(model.indigenousOtherDescription)
    },
    isSupportComplete() {
      const model = this.getModel(SUPPLEMENTARY_TYPES.SUPPORT)
      if (!model?.supportFundingModel.includes(this.SUPPORT_CHECKBOX_LABELS.find((item) => item.label === 'Other').value)) {
        return true
      }
      return model?.supportFundingModel.includes(this.SUPPORT_CHECKBOX_LABELS.find((item) => item.label === 'Other').value) && !isEmpty(model.supportOtherDescription)
    },
    isTransportComplete() {
      const models = this.getTransportModels()
      return models.every((el) => el.VIN && el.estimatedMileage && el.odometer && el.uploadedDocuments?.length > 0)
    },
    isApplicationComplete() {
      return this.isIndigenousComplete && this.isSupportComplete && this.isTransportComplete //&&checkbox clicked
    },
    readonly() {
      return !this.isApplicationComplete || this.processing || this.loading
    },
  },
  watch: {
    back: {
      async handler() {
        await this.saveApplication()
        this.$router.push({ name: 'supp-allowances-form' })
      },
    },
    cancel: {
      handler() {
        this.toggleCancelDialog()
      },
    },
    save: {
      async handler() {
        await this.saveApplication(true)
      },
    },
    submit: {
      async handler() {
        await this.submitApplication()
      },
    },
  },
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
    this.panel = this.allPanelIDs
    await this.loadData()
  },
  methods: {
    isEmpty,
    togglePanel() {
      this.panel = isEmpty(this.panel) ? this.allPanelIDs : []
    },
    async loadData() {
      try {
        this.loading = true
        this.$emit('process', true)
        //this page should specifiy to load only those applications in "draft" status - as there will be
        //scenarios where some applications have been submitted, but the user will want to come back and fill in others.
        this.models = await ApplicationService.getSupplementaryApplications(this.$route.params.applicationGuid)

        for (const el of this.models) {
          const found = this.PANELS.find((panel) => panel.supplementaryType == el.supplementaryType)
          found.supplementaryApplicationId = el.supplementaryApplicationId

          if (el.supplementaryType === SUPPLEMENTARY_TYPES.TRANSPORT) {
            el.uploadedDocuments = await DocumentService.getDocuments(el.supplementaryApplicationId)
          }
        }
        //every model should have the same decleration status
        this.supplementaryDeclaration = this.models.every((el) => el.supplementaryDeclaration)
        this.setSubmit()
      } catch (error) {
        this.setFailureAlert('Failed to load supplementary applications')
      } finally {
        this.loading = false
        this.$emit('process', false)
      }
    },
    getTransportModels() {
      return this.models?.filter((el) => el.supplementaryType === SUPPLEMENTARY_TYPES.TRANSPORT)
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
        case 'transportation':
          return this.isTransportComplete
      }
    },
    setSubmit() {
      this.$emit('setSubmit', this.supplementaryDeclaration)
    },
    async saveApplication(showAlert = false, isSubmit = false) {
      try {
        this.loading = true
        this.$emit('process', true)
        for (const applicationModel of this.models) {
          const payload = {
            supplementaryDeclaration: this.supplementaryDeclaration,
          }
          if (isSubmit) {
            payload.statusCode = SUPPLEMENTARY_APPLICATION_STATUS_CODES.SUBMITTED
          }

          await ApplicationService.updateSupplementaryApplication(applicationModel.supplementaryApplicationId, payload)
        }

        if (showAlert) {
          this.setSuccessAlert(`Application Saved`)
        }
      } catch (error) {
        this.setFailureAlert('Failed to save supplementary applications')
      } finally {
        this.$emit('process', false)
        this.loading = false
      }
    },
    async submitApplication() {
      await this.saveApplication(true, true)
      this.$router.push({ name: 'supplementary-confirmation', params: { applicationGuid: this.$route.params.applicationGuid } })
    },
    toggleCancelDialog() {
      this.showCancelDialog = !this.showCancelDialog
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
