<template>
  <v-form ref="form">
    <AppAlertBanner type="info">
      Note: If you answer "No" to any of these questions, you will not be eligible for a $10 a Day Funding. More information can be at the
      <a href="https://www2.gov.bc.ca/gov/content?id=F0D0FD2A00064CDDBF634CF83E4E2599" target="_blank">$10 a Day Funding website</a>
      for eligibility.
    </AppAlertBanner>
    <v-card variant="outlined" class="pa-4 my-6">
      <div>
        <div>Is your facility currently in receipt of Child Care Operating Funding or $10 a Day ChildCareBC funding for a minimum of 1 year?</div>
        <AppYesNoRadioGroup
          id="greater-one-year-ccof-tdad"
          v-model="model.greaterOneYearCCOFTDAD"
          :rules="rules.required"
          :hide-details="readonly"
          :disabled="readonly"
          @update:model-value="validateResponse(model.greaterOneYearCCOFTDAD)" />
      </div>
      <div v-if="isMultipleProgram()">
        <div>Is your facility approved or is your application being processed by the Ministry to participate in the Child Care Fee Reduction Initiative for the current year (if eligible)?</div>
        <AppYesNoRadioGroup
          id="ccfri-participation"
          v-model="model.ccfriParticipation"
          :rules="rules.required"
          :hide-details="readonly"
          :disabled="readonly"
          @update:model-value="validateResponse(model.ccfriParticipation)" />
      </div>
      <div>
        <div>Is your facility in good standing with the Ministry of Education and Child Care?</div>
        <AppYesNoRadioGroup
          id="ministry-good-standing"
          v-model="model.ministryGoodStanding"
          :rules="rules.required"
          :hide-details="readonly"
          :disabled="readonly"
          @update:model-value="validateResponse(model.ministryGoodStanding)" />
      </div>
      <div>
        <div>Is your facility and licence in good standing with your regional Health Authority?</div>
        <AppYesNoRadioGroup
          id="health-authority-good-standing"
          v-model="model.healthAuthorityGoodStanding"
          :rules="rules.required"
          :hide-details="readonly"
          :disabled="readonly"
          @update:model-value="validateResponse(model.healthAuthorityGoodStanding)" />
      </div>
      <div>
        <div>
          Do all your current Early Childhood Educator(s) have an active, valid certificate? (If your licence does not require an Early Childhood Educator and you have none working in your operation,
          select N/A)
        </div>
        <AppYesNoRadioGroup
          id="ece-certificates-good-standing"
          v-model="model.eceCertificatesGoodStanding"
          :rules="rules.required"
          :hide-details="readonly"
          :disabled="readonly"
          :allow-not-applicable="true"
          @update:model-value="validateResponse(model.eceCertificatesGoodStanding)" />
      </div>
      <div>
        <div>
          Is your facility approved or is your application being processed by the Ministry to participate in the Early Childhood Educator Wage Enhancement Initiative for the current year, if
          applicable?
        </div>
        <AppYesNoRadioGroup
          id="ecewe-participation"
          v-model="model.eceweParticipation"
          :rules="rules.required"
          :hide-details="readonly"
          :disabled="readonly"
          :allow-not-applicable="true"
          @update:model-value="validateResponse(model.eceweParticipation)" />
      </div>
      <div>
        <div>Have you enrolled, or are you willing to enroll, families eligible for the Affordable Child Care Benefit?</div>
        <AppYesNoRadioGroup
          id="accb-participation"
          v-model="model.accbParticipation"
          :rules="rules.required"
          :hide-details="readonly"
          :disabled="readonly"
          @update:model-value="validateResponse(model.accbParticipation)" />
      </div>
      <div>
        <div>Will your facility be able to provide the actual expenses for your facility?</div>
        <AppYesNoRadioGroup
          id="provide-actual-expenses"
          v-model="model.provideActualExpenses"
          :rules="rules.required"
          :hide-details="readonly"
          :disabled="readonly"
          @update:model-value="validateResponse(model.provideActualExpenses)" />
      </div>
      <div>
        <div>
          Will your facility be able to provide the financial statements for your facility (at a minimum, the income statement and balance sheet) for your prior fiscal year. The document must be
          verified (signed) by the designated representative for your organization i.e. your expense authority.
        </div>
        <AppYesNoRadioGroup
          id="provide-previous-fy-financial-statements"
          v-model="model.providePreviousFYFinancialStatements"
          :rules="rules.required"
          :hide-details="readonly"
          :disabled="readonly"
          @update:model-value="validateResponse(model.providePreviousFYFinancialStatements)" />
      </div>
      <div>
        <div>Does your facility have liability insurance coverage for a minimum of $2,000,000?</div>
        <AppYesNoRadioGroup
          id="liability-insurance-coverage"
          v-model="model.liabilityInsuranceCoverage"
          :rules="rules.required"
          :hide-details="readonly"
          :disabled="readonly"
          @update:model-value="validateResponse(model.liabilityInsuranceCoverage)" />
      </div>
      <div>
        <div>
          Is your facility willing and able to accommodate and assist with an economic analysis on the cost of child care in various business models through the provision of your current business
          financials at the Ministry's request?
        </div>
        <AppYesNoRadioGroup
          id="economic-analysis-participation"
          v-model="model.economicAnalysisParticipation"
          :rules="rules.required"
          :hide-details="readonly"
          :disabled="readonly"
          @update:model-value="validateResponse(model.economicAnalysisParticipation)" />
      </div>
      <div v-if="isOperateInPersonalResidence()">
        <div>Is your facility willing to operate a separate business bank account to be used exclusively for revenue and allowable expenses under the $10 a Day ChildCareBC Funding Agreement?</div>
        <AppYesNoRadioGroup
          id="operate-separate-bank-account"
          v-model="model.operateSeparateBankAccount"
          :rules="rules.required"
          :hide-details="readonly"
          :disabled="readonly"
          @update:model-value="validateResponse(model.operateSeparateBankAccount)" />
      </div>
    </v-card>
    <EligibilityNotificationDialog
      :application-id="currentApplication?.applicationId"
      :show="showEligibilityNotificationDialog && !readonly"
      @close="toggleEligibilityNotificationDialog"
      @cancel="goToApplicationHistory" />
  </v-form>
</template>

<script>
import { mapState, mapWritableState, mapActions } from 'pinia'

import AppAlertBanner from '@/components/ui/AppAlertBanner.vue'
import AppYesNoRadioGroup from '@/components/ui/AppYesNoRadioGroup.vue'
import EligibilityNotificationDialog from '@/components/applications/EligibilityNotificationDialog.vue'
import { useApplicationsStore } from '@/stores/applications'
import ApplicationService from '@/services/applicationService'
import rules from '@/utils/rules'
import alertMixin from '@/mixins/alertMixin'
import { APPLICATION_ROUTES, YES_NO_RADIO_GROUP_MAPPING } from '@/utils/constants'

export default {
  name: 'EligibilityView',
  components: { AppAlertBanner, AppYesNoRadioGroup, EligibilityNotificationDialog },
  mixins: [alertMixin],

  async beforeRouteLeave(_to, _from, next) {
    if (!this.readonly) {
      await this.saveApplication()
    }
    next(!this.processing) // only go to the next page after saveApplication is complete
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
    save: {
      type: Boolean,
      default: false,
    },
  },

  emits: ['process'],

  data() {
    return {
      model: {},
      processing: false,
      showEligibilityNotificationDialog: false,
    }
  },

  computed: {
    ...mapState(useApplicationsStore, ['currentApplication', 'validation']),
    ...mapWritableState(useApplicationsStore, ['isEligibilityComplete']),
  },

  watch: {
    back: {
      handler() {
        this.$router.push({ name: APPLICATION_ROUTES.FACILITY_DETAILS, params: { applicationGuid: this.$route.params.applicationGuid } })
      },
    },
    save: {
      async handler() {
        await this.saveApplication(true)
      },
    },
    next: {
      async handler() {
        await this.$refs.form?.validate()
        if (!this.checkEligibilityComplete(this.model)) return
        this.$router.push({ name: APPLICATION_ROUTES.SERVICE_DELIVERY, params: { applicationGuid: this.$route.params.applicationGuid } })
      },
    },
  },

  created() {
    this.$emit('process', false)
    this.rules = rules
    this.model = {
      greaterOneYearCCOFTDAD: this.currentApplication?.greaterOneYearCCOFTDAD,
      ccfriParticipation: this.isMultipleProgram() ? this.currentApplication?.ccfriParticipation : null,
      ministryGoodStanding: this.currentApplication?.ministryGoodStanding,
      healthAuthorityGoodStanding: this.currentApplication?.healthAuthorityGoodStanding,
      eceCertificatesGoodStanding: this.currentApplication?.eceCertificatesGoodStanding,
      eceweParticipation: this.currentApplication?.eceweParticipation,
      accbParticipation: this.currentApplication?.accbParticipation,
      provideActualExpenses: this.currentApplication?.provideActualExpenses,
      providePreviousFYFinancialStatements: this.currentApplication?.providePreviousFYFinancialStatements,
      liabilityInsuranceCoverage: this.currentApplication?.liabilityInsuranceCoverage,
      economicAnalysisParticipation: this.currentApplication?.economicAnalysisParticipation,
      operateSeparateBankAccount: this.isOperateInPersonalResidence() ? this.currentApplication?.operateSeparateBankAccount : null,
    }
  },

  async mounted() {
    if (this.validation) {
      await this.$refs.form?.validate()
    }
  },

  methods: {
    ...mapActions(useApplicationsStore, ['getApplication', 'checkEligibilityComplete', 'isMultipleProgram', 'isOperateInPersonalResidence']),
    async saveApplication(showAlert = false) {
      try {
        this.$emit('process', true)
        this.processing = true
        if (ApplicationService.isApplicationUpdated(this.model)) {
          await ApplicationService.updateApplication(this.$route.params.applicationGuid, this.model)
          await this.getApplication(this.$route.params.applicationGuid)
        }
        if (showAlert) {
          this.setSuccessAlert('Application saved successfully')
        }
      } catch (error) {
        this.setFailureAlert('Failed to save your application', error)
      } finally {
        this.$emit('process', false)
        this.processing = false
      }
    },

    validateResponse(response) {
      this.isEligibilityComplete = this.checkEligibilityComplete(this.model)
      if (response === YES_NO_RADIO_GROUP_MAPPING.NO) {
        this.showEligibilityNotificationDialog = true
      }
    },

    toggleEligibilityNotificationDialog() {
      this.showEligibilityNotificationDialog = !this.showEligibilityNotificationDialog
    },

    goToApplicationHistory() {
      this.$router.push({ name: 'applications-history' })
    },
  },
}
</script>
