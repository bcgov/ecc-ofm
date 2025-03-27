<template>
  <p class="my-11">
    Your application is almost ready to submit. Please check and review all your inputs.
    <br />
    You will not be able to change these details after submission
  </p>
  <v-form ref="form" class="mt-10">
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
    <AppDialog v-model="showCancelDialog" title="Cancel Changes" :is-loading="loading" persistent max-width="40%" @close="toggleCancelDialog">
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

    <v-skeleton-loader v-if="loading" :loading="loading" type="table-tbody"></v-skeleton-loader>
    <div v-else>
      <v-expansion-panels v-model="panel" multiple>
        <div v-if="hasCoreServiesApplication" class="w-100">
          <div class="supplementary-header">
            <p class="supplementary-header-label">Core Services Allowance</p>
          </div>
          <v-expansion-panel v-for="panelComponent in CORE_SERVICES_PANELS" :key="panelComponent.id" :value="panelComponent.id">
            <div v-if="!isEmpty(getModelsByType(panelComponent.supplementaryType))">
              <v-expansion-panel-title>
                <!-- page complete -->
                <div v-if="isPanelComplete(panelComponent)">
                  <span class="supplementary-header-label">{{ panelComponent.title }}</span>
                  <v-icon class="check-icon pb-1">mdi-check-circle</v-icon>
                </div>
                <div v-else>
                  <span class="supplementary-header-label">{{ panelComponent.title }}</span>
                  <v-icon class="alert-icon pb-1 mr-2">mdi-alert-circle</v-icon>
                  <span class="error-message">Your form is missing required information.</span>
                </div>
              </v-expansion-panel-title>
              <v-expansion-panel-text>
                <IndigenousProgrammingSummary
                  v-if="panelComponent.supplementaryType === SUPPLEMENTARY_TYPES.INDIGENOUS"
                  :indigenous-programming-models="getModelsByType(SUPPLEMENTARY_TYPES.INDIGENOUS)"></IndigenousProgrammingSummary>
                <SupportNeedsSummary
                  v-if="panelComponent.supplementaryType === SUPPLEMENTARY_TYPES.SUPPORT"
                  :support-models="getModelsByType(SUPPLEMENTARY_TYPES.SUPPORT)"
                  :has-inclusion-policy="currentOrg.hasInclusionPolicy"></SupportNeedsSummary>
              </v-expansion-panel-text>
            </div>
          </v-expansion-panel>
        </div>

        <div v-if="hasTransportApplication" class="w-100">
          <div class="supplementary-header">
            <p class="supplementary-header-label">Discretionary Services Allowance</p>
          </div>
          <v-expansion-panel :value="DISCRETIONARY_PANEL.id">
            <div>
              <v-expansion-panel-title>
                <!-- page complete -->
                <div v-if="isPanelComplete(DISCRETIONARY_PANEL)">
                  <span class="supplementary-header-label">{{ DISCRETIONARY_PANEL.title }}</span>
                  <v-icon class="check-icon pb-1">mdi-check-circle</v-icon>
                </div>
                <div v-else>
                  <span class="supplementary-header-label">{{ DISCRETIONARY_PANEL.title }}</span>
                  <v-icon class="alert-icon pb-1 mr-2">mdi-alert-circle</v-icon>
                  <span class="error-message">Your form is missing required information.</span>
                </div>
              </v-expansion-panel-title>
              <v-expansion-panel-text>
                <TransportationSummary :draft-transport-models="getModelsByType(SUPPLEMENTARY_TYPES.TRANSPORT)" :all-transport-models="allTransportModels"></TransportationSummary>
              </v-expansion-panel-text>
            </div>
          </v-expansion-panel>
        </div>
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
  </v-form>
</template>

<script>
import AppButton from '@/components/ui/AppButton.vue'
import AppDialog from '@/components/ui/AppDialog.vue'
import ApplicationService from '@/services/applicationService'
import alertMixin from '@/mixins/alertMixin'
import permissionsMixin from '@/mixins/permissionsMixin'
import DocumentService from '@/services/documentService'
import FundingAgreementService from '@/services/fundingAgreementService'
import IndigenousProgrammingSummary from '@/components/supp-allowances/IndigenousProgrammingSummary.vue'
import SupportNeedsSummary from '@/components/supp-allowances/SupportNeedsSummary.vue'
import TransportationSummary from '@/components/supp-allowances/TransportationSummary.vue'
import { SUPPLEMENTARY_TYPES, SUPPLEMENTARY_APPLICATION_STATUS_CODES } from '@/utils/constants'
import { isEmpty } from 'lodash'
import { INDIG_CHECKBOX_LABELS, SUPPORT_CHECKBOX_LABELS, SUPP_TERM_CODES, CORE_SERVICES_PANELS, DISCRETIONARY_PANEL, TWO_YEARS } from '@/utils/constants/suppConstants'
import { hasDuplicateVIN } from '@/utils/common'
import { mapState } from 'pinia'
import { useOrgStore } from '@/stores/org'
import moment from 'moment'

import rules from '@/utils/rules'

export default {
  components: { AppDialog, AppButton, IndigenousProgrammingSummary, SupportNeedsSummary, TransportationSummary },
  mixins: [alertMixin, permissionsMixin],
  inheritAttrs: false,
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
      fundingAgreement: undefined,
      renewalTerm: undefined,
      loading: false,
      processing: false,
      panel: undefined,
      showCancelDialog: false,
      models: [],
      allTransportModels: undefined,
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
    ...mapState(useOrgStore, ['currentOrg']),
    allPanelIDs() {
      return this.allPanels?.map((panel) => panel.id)
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
      const models = this.getModelsByType(SUPPLEMENTARY_TYPES.TRANSPORT)
      return models.every((model) => {
        if (!model.VIN || !model.estimatedMileage || !model.odometer || hasDuplicateVIN(model, this.allTransportModels)) {
          return false
        } else if (model.monthlyLease == 0) {
          return model.uploadedDocuments?.length != 0
        }
        return model.uploadedDocuments?.length > 1
      })
    },
    isApplicationComplete() {
      return this.isIndigenousComplete && this.isSupportComplete && this.isTransportComplete && this.hasSupportApplicationAndInclusionPolicy
    },
    readonly() {
      return !this.isApplicationComplete || this.processing || this.loading || !this.hasPermission(this.PERMISSIONS.APPLY_FOR_FUNDING)
    },
    //this function disables submit if user has filled out a Support Needs App - but then after removes inclusion policy.
    //The logic was moved out of isSupportComplete() so the red 'missing info' messaging won't appear when user is missing inclusion policy
    hasSupportApplicationAndInclusionPolicy() {
      return !this.getModel(SUPPLEMENTARY_TYPES.SUPPORT) || this.currentOrg.hasInclusionPolicy
    },
    hasTransportApplication() {
      return !isEmpty(this.getModelsByType(SUPPLEMENTARY_TYPES.TRANSPORT))
    },
    hasCoreServiesApplication() {
      return !isEmpty(this.getModelsByType(SUPPLEMENTARY_TYPES.SUPPORT)) || !isEmpty(this.getModelsByType(SUPPLEMENTARY_TYPES.INDIGENOUS))
    },
  },
  watch: {
    back: {
      async handler() {
        if (this.hasPermission(this.PERMISSIONS.APPLY_FOR_FUNDING)) {
          await this.saveApplication()
        }
        this.$router.push({ name: 'supp-allowances-form', params: { applicationGuid: this.$route.params.applicationGuid } })
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
    this.CORE_SERVICES_PANELS = CORE_SERVICES_PANELS
    this.DISCRETIONARY_PANEL = DISCRETIONARY_PANEL
    this.allPanels = [...CORE_SERVICES_PANELS, DISCRETIONARY_PANEL]
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
        this.fundingAgreement = await FundingAgreementService.getActiveFundingAgreementByApplicationId(this.$route.params.applicationGuid, true)

        this.setSuppTermDates()
        //we need submitted transport applications to verify that all VINs are unique, even in past applications
        this.allTransportModels = [...this.getModelsByType(SUPPLEMENTARY_TYPES.TRANSPORT)]
        this.models = this.models.filter((el) => el.statusCode == SUPPLEMENTARY_APPLICATION_STATUS_CODES.DRAFT || el.statusCode == SUPPLEMENTARY_APPLICATION_STATUS_CODES.ACTION_REQUIRED)

        for (const el of this.models) {
          if (el.supplementaryType === SUPPLEMENTARY_TYPES.TRANSPORT) {
            el.uploadedDocuments = await DocumentService.getDocuments(el.supplementaryApplicationId)
          }

          //check if the model is for current or next term -
          //so the "missing info" red links point to the correct section
          el.isNextTerm = el?.renewalTerm !== this.renewalTerm
        }

        //every model should have the same decleration status
        this.supplementaryDeclaration = this.models.every((el) => el.supplementaryDeclaration)
        this.setSubmit()
      } catch (error) {
        this.setFailureAlert('Failed to load supplementary applications', error)
      } finally {
        this.loading = false
        this.$emit('process', false)
      }
    },
    setSuppTermDates() {
      const today = new Date()
      const formattedEndDate = moment(this.fundingAgreement?.endDate).endOf('day').toDate()
      const formattedStartDate = new Date(this.fundingAgreement.startDate)
      const daysOfTerm = Math.floor(moment.duration(moment(formattedEndDate).diff(moment(formattedStartDate))).asDays())
      let termTwoEndDate
      let termOneEndDate

      if (daysOfTerm > TWO_YEARS) {
        termTwoEndDate = moment(formattedEndDate).subtract(1, 'years').endOf('day').toDate()
        termOneEndDate = moment(formattedEndDate).subtract(2, 'years').endOf('day').toDate()
      } else {
        termTwoEndDate = formattedEndDate
        termOneEndDate = moment(formattedEndDate).subtract(1, 'years').endOf('day').toDate()
      }

      switch (true) {
        case today < termOneEndDate || !this.fundingAgreement?.endDate:
          this.renewalTerm = SUPP_TERM_CODES.TERM_ONE
          break

        case today < termTwoEndDate:
          this.renewalTerm = SUPP_TERM_CODES.TERM_TWO
          break

        case today < formattedEndDate:
          this.renewalTerm = SUPP_TERM_CODES.TERM_THREE
          break

        default:
          //outside of funding term, so most recent term should be read only? we don't have requirements on this
          this.renewalTerm = SUPP_TERM_CODES.TERM_THREE
      }
    },
    getModelsByType(supplementaryType) {
      return this.models?.filter((el) => el.supplementaryType === supplementaryType)
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
      this.$emit('setSubmit', this.supplementaryDeclaration && this.isApplicationComplete && this.hasPermission(this.PERMISSIONS.APPLY_FOR_FUNDING))
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
          this.setSuccessAlert('Application Saved')
        }
      } catch (error) {
        this.setFailureAlert('Failed to save supplementary applications', error)
      } finally {
        this.$emit('process', false)
        this.loading = false
      }
    },
    async submitApplication() {
      await this.saveApplication(true, true)
      this.$router.push({ name: 'supplementary-confirmation' })
    },
    toggleCancelDialog() {
      this.showCancelDialog = !this.showCancelDialog
    },
  },
}
</script>
