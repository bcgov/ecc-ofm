<template>
  <v-container fluid class="pa-2 pb-0">
    <div v-if="isEligibilityComplete">
      <div>
        <AppLabel>
          Is your facility currently in receipt of Child Care Operating Funding or $10 a Day ChildCareBC funding for a
          minimum of 1 year?
        </AppLabel>
        <div>{{ format.formatBooleanToYesNo(currentApplication?.greaterOneYearCCOFTDAD) }}</div>
      </div>
      <div v-if="isMultipleProgram()">
        <AppLabel>
          Is your facility approved or is your application being processed by the Ministry to participate in the Child
          Care Fee Reduction Initiative for the current year (if eligible)?
        </AppLabel>
        <div>{{ format.formatBooleanToYesNo(currentApplication?.ccfriParticipation) }}</div>
      </div>
      <div>
        <AppLabel>Is your facility in good standing with the Ministry of Education and Child Care?</AppLabel>
        <div>{{ format.formatBooleanToYesNo(currentApplication?.ministryGoodStanding) }}</div>
      </div>
      <div>
        <AppLabel>Is your facility and licence in good standing with your regional Health Authority?</AppLabel>
        <div>{{ format.formatBooleanToYesNo(currentApplication?.healthAuthorityGoodStanding) }}</div>
      </div>
      <div>
        <AppLabel>
          Do all your current Early Childhood Educator(s) have an active, valid certificate? (If your licence does not
          require an Early Childhood Educator and you have none working in your operation, select N/A)
        </AppLabel>
        <div>{{ format.formatBooleanToYesNo(currentApplication?.eceCertificatesGoodStanding) }}</div>
      </div>
      <div>
        <AppLabel>
          Is your facility approved or is your application being processed by the Ministry to participate in the Early
          Childhood Educator Wage Enhancement Initiative for the current year, if applicable?
        </AppLabel>
        <div>{{ format.formatBooleanToYesNo(currentApplication?.eceweParticipation) }}</div>
      </div>
      <div>
        <AppLabel>
          Have you enrolled, or are you willing to enroll, families eligible for the Affordable Child Care Benefit?
        </AppLabel>
        <div>{{ format.formatBooleanToYesNo(currentApplication?.accbParticipation) }}</div>
      </div>
      <div>
        <AppLabel>Will your facility be able to provide the actual expenses for your facility?</AppLabel>
        <div>{{ format.formatBooleanToYesNo(currentApplication?.provideActualExpenses) }}</div>
      </div>
      <div>
        <AppLabel>
          Will your facility be able to provide the financial statements for your facility (at a minimum, the income
          statement and balance sheet) for your prior fiscal year. The document must be verified (signed) by the
          designated representative for your organization i.e. your expense authority.
        </AppLabel>
        <div>{{ format.formatBooleanToYesNo(currentApplication?.providePreviousFYFinancialStatements) }}</div>
      </div>
      <div>
        <AppLabel>Does your facility have liability insurance coverage for a minimum of $5,000,000?</AppLabel>
        <div>{{ format.formatBooleanToYesNo(currentApplication?.liabilityInsuranceCoverage) }}</div>
      </div>
      <div>
        <AppLabel>
          Is your facility willing and able to accommodate and assist with an economic analysis on the cost of child
          care in various business models through the provision of your current business financials at the Ministry's
          request?
        </AppLabel>
        <div>{{ format.formatBooleanToYesNo(currentApplication?.economicAnalysisParticipation) }}</div>
      </div>
      <div v-if="isOperateInPersonalResidence()">
        <AppLabel>
          Is your facility willing to operate a separate business bank account to be used exclusively for revenue and
          allowable expenses under the $10 a Day ChildCareBC Funding Agreement?
        </AppLabel>
        <div>{{ format.formatBooleanToYesNo(currentApplication?.operateSeparateBankAccount) }}</div>
      </div>
    </div>
  </v-container>
</template>

<script>
import { mapState, mapActions } from 'pinia'
import AppLabel from '@/components/ui/AppLabel.vue'
import { useApplicationsStore } from '@/stores/applications'
import format from '@/utils/format'

export default {
  components: { AppLabel },
  computed: {
    ...mapState(useApplicationsStore, ['currentApplication', 'isEligibilityComplete']),
  },
  created() {
    this.format = format
  },
  methods: {
    ...mapActions(useApplicationsStore, ['isMultipleProgram', 'isOperateInPersonalResidence']),
  },
}
</script>
