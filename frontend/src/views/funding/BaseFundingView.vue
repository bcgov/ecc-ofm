<template>
  <OrganizationHeader :show-facility="false" />
  <v-container fluid v-bind="$attrs" class="px-md-16">
    <h1>{{ fundingAgreement?.fundingAgreementNumber }}</h1>

    <p>Carefully review your funding agreement.</p>

    <AppButton size="medium" width="240px" class="mt-2" :loading="loading" @click="goToDeclaration()">Scroll to bottom</AppButton>

    <h4 class="my-10">Service Delivery Details</h4>

    <v-row class="mt-lg-10">
      <v-col cols="12" class="pt-0">
        <v-card elevation="0" variant="outlined">
          <v-skeleton-loader :loading="loading" type="table-tbody">
            <v-expansion-panels v-if="licences?.length > 0" v-model="panel" multiple>
              <v-expansion-panel v-for="licence in licences" :key="licence.licenceId" :value="licence.licenceId">
                <v-expansion-panel-title>
                  <LicenceHeader :licence="licence" />
                </v-expansion-panel-title>
                <v-expansion-panel-text>
                  <LicenceDetails :read-only="true" :licence="licence" />
                </v-expansion-panel-text>
              </v-expansion-panel>
            </v-expansion-panels>
            <div v-else class="pa-5">0 Licences</div>
          </v-skeleton-loader>
        </v-card>
      </v-col>
    </v-row>

    <AppPDFViewer :pdf-file="pdfFile" />

    <a style="text-decoration: none" :download="downloadFileName" :href="pdfDownloadLink">
      <AppButton size="medium" width="240px" class="mt-2" :loading="loading">Download PDF</AppButton>
    </a>

    <br />
    <br />
    <h4 id="declaration" class="lg-px-10">Declaration</h4>
    <br />
    <br />

    <v-skeleton-loader v-if="loading" :loading="loading" type="table-tbody"></v-skeleton-loader>
    <v-row v-else>
      <v-col cols="12" class="pt-0">
        <div class="pa-lg-7 pa-5 overflow-y-auto grey-div-with-border">
          I do hereby certify that I am the
          <strong>authorized signing authority</strong>
          and that all of the information provided is true and complete to the best of my knowledge and belief. I consent to the Ministry contacting other branches within the Ministry and other
          Province ministries to validate the accuracy of any information that I have provided.
          <br />
          <br />
          By completing and submitting this Program Confirmation Form (the Form) electronically, I hereby confirm that I have carefully read this Form and the corresponding terms and conditions of the
          Operating Funding Model (OFM) Funding Agreement (the Funding Agreement) and that I agree to be bound by such terms and conditions. I further confirm that by clicking “I agree” below, I
          represent and warrant that:
          <br />
          <br />
          <ol class="pl-4">
            <li class="pl-4">I am the authorized representative and signing authority of the Provider as named in the OFM Agreement (the Provider);</li>
            <li class="pl-4">
              I have authority to submit the Form on behalf of the Provider and that by clicking “I agree”, I do hereby bind the Provider to the terms and conditions of the Funding Agreement if the
              Province accepts this Form and enrolls the Provider in the Operating Funding Model Program; and
            </li>
            <li class="pl-4">
              All information provided in the Form or otherwise in support of the Provider to receive funding under the Funding Agreement is true and complete to the best of my knowledge and belief. I
              understand and acknowledge that providing false or misleading information either on the Form or otherwise to the Province to obtain any funding under the Funding Agreement or otherwise
              failing to comply with the Funding Agreement could result in certain penalties or repayment obligations, or both, under any or all of the Child Care BC Act, any successor legislation, or
              the Funding Agreement.
              <br />
              <br />
              I understand and acknowledge that until such time as the Province confirms approval or temporary approval of enrolment, in writing the Provider is not formally enrolled in the Program.
              The Province is not responsible for any pre-payments the Provider may make in anticipation of enrolment in either of these initiatives and any pre-payments made are at the Provider's own
              risk.
            </li>
          </ol>
        </div>
      </v-col>

      <v-checkbox v-model="fundingAgreement.agreeConsentCertify" class="ml-3" :disabled="readonly" color="primary" label="I agree, consent and certify" />
    </v-row>

    <v-row v-if="!loading" class="justify-center justify-sm-space-between mx-md-7 my-3">
      <v-col cols="auto">
        <div class="d-flex" style="gap: 28px">
          <AppBackButton id="back-button" width="240px" :to="{ name: 'funding-overview' }">Funding</AppBackButton>
          <AppButton id="decline-funding-agreement" :primary="false" size="large" width="240px" class="mt-2" :disabled="declineDisabled" :loading="loading" @click="showDeclineDialog = true">
            Decline
          </AppButton>
        </div>
      </v-col>
      <v-col cols="auto">
        <AppButton id="submit-funding-agreement" size="large" width="240px" height="52px" class="mt-2" :disabled="submitDisabled" :loading="loading" @click="submit()">Submit</AppButton>
      </v-col>
    </v-row>
  </v-container>
  <AppDialog v-model="showDeclineDialog" title="Confirm" :isLoading="isLoading" persistent max-width="50%" @close="closeDialog">
    <template #content>
      <div class="confirm-dialog-text d-flex flex-column align-center">Are you sure you want to decline this Funding Agreement?</div>
    </template>
    <template #button>
      <v-row justify="space-around">
        <v-col cols="12" md="6" class="d-flex justify-center">
          <AppButton id="dialog-go-back" :primary="false" size="large" width="250px" :loading="isLoading" @click="closeDialog">Go Back</AppButton>
        </v-col>
        <v-col cols="12" md="6" class="d-flex justify-center">
          <AppButton id="dialog-cancel-application" size="large" min-width="250px" max-width="450px" :loading="isLoading" @click="decline()">Decline</AppButton>
        </v-col>
      </v-row>
    </template>
  </AppDialog>
</template>

<script>
import { mapState } from 'pinia'
import { useAuthStore } from '@/stores/auth'
import { getMomentDate } from '@/utils/dateHelpers'
import alertMixin from '@/mixins/alertMixin'
import AppButton from '@/components/ui/AppButton.vue'
import OrganizationHeader from '@/components/organizations/OrganizationHeader.vue'
import AppBackButton from '@/components/ui/AppBackButton.vue'
import FacilityService from '@/services/facilityService'
import FundingAgreementService from '@/services/fundingAgreementService'
import LicenceService from '@/services/licenceService'
import LicenceHeader from '@/components/licences/LicenceHeader.vue'
import LicenceDetails from '@/components/licences/LicenceDetails.vue'
import { FUNDING_AGREEMENT_STATUS_CODES, FUNDING_AGREEMENT_STATE_CODES } from '@/utils/constants'
import AppPDFViewer from '@/components/ui/AppPDFViewer.vue'
import AppDialog from '@/components/ui/AppDialog.vue'

const LOCKED_STATUSES = [
  FUNDING_AGREEMENT_STATUS_CODES.IN_REVIEW_WITH_MINISTRY_EA,
  FUNDING_AGREEMENT_STATUS_CODES.SUBMITTED,
  FUNDING_AGREEMENT_STATUS_CODES.ACTIVE,
  FUNDING_AGREEMENT_STATUS_CODES.CANCELLED,
]

export default {
  name: 'FundingView',
  components: { AppBackButton, AppDialog, AppButton, OrganizationHeader, LicenceDetails, LicenceHeader, AppPDFViewer },
  mixins: [alertMixin],
  data() {
    return {
      pdfFile: undefined,
      pdfDownloadLink: undefined,
      fundingAgreement: undefined,
      licences: [],
      panel: [],
      loading: false,
      showDeclineDialog: false,
    }
  },

  computed: {
    ...mapState(useAuthStore, ['userInfo']),
    readonly() {
      const isExpenseAuthority = this.userInfo?.facilities?.some((facility) => facility.facilityId === this.fundingAgreement?.facilityId && facility.isExpenseAuthority)
      return !isExpenseAuthority || LOCKED_STATUSES.includes(this.fundingAgreement?.statusCode)
    },
    submitDisabled() {
      return this.readonly || !this.fundingAgreement.agreeConsentCertify
    },
    declineDisabled() {
      return this.readonly || this.fundingAgreement.agreeConsentCertify
    },
    downloadFileName() {
      return `Funding_Agreement_${this.fundingAgreement?.fundingAgreementNumber}`
    },
  },

  async created() {
    await this.loadData()
  },

  methods: {
    async loadData() {
      try {
        this.loading = true
        this.fundingAgreement = await FundingAgreementService.getFundingAgreementById(this.$route.params.fundingGuid)
        await this.getLicences()
        const resp = await FundingAgreementService.getFundingPDFById(this.$route.params.fundingGuid)
        this.pdfFile = {
          data: atob(resp),
        }
        this.pdfDownloadLink = `data:application/pdf;base64,${resp}`
      } catch (ignoreError) {
        this.setWarningAlert('PDF Generation is still in progress. Please wait a few minutes before you try again.')
      } finally {
        this.loading = false
      }
    },

    async getLicences() {
      try {
        this.licences = await FacilityService.getLicences(this.fundingAgreement?.facilityId)
        await Promise.all(
          this.licences.map(async (licence) => {
            licence.licenceDetails = await LicenceService.getLicenceDetails(licence?.licenceId)
          }),
        )
      } catch (error) {
        this.setFailureAlert('Failed to licence(s) for facilityId = ' + this.fundingAgreement?.facilityId, error)
      }
    },

    async submit() {
      const payload = {
        agreeConsentCertify: this.fundingAgreement?.agreeConsentCertify,
        statusCode: FUNDING_AGREEMENT_STATUS_CODES.SUBMITTED,
        contactId: this.userInfo?.contactId,
        signedOn: getMomentDate(new Date()),
      }

      try {
        await FundingAgreementService.updateFundingAgreement(this.fundingAgreement?.fundingId, payload)
        this.setSuccessAlert('Funding Agreement submitted')
        this.$router.push({ name: 'funding-confirmation' })
      } catch (error) {
        this.setFailureAlert('Failed to submit funding agreement', error)
      }
    },
    async decline() {
      const payload_decliner = {
        ofm_provider_decliner: this.userInfo?.contactId,
        ofm_provider_decline_date: getMomentDate(new Date()),
      }
      const payload = {
        stateCode: FUNDING_AGREEMENT_STATE_CODES.INACTIVE,
        statusCode: FUNDING_AGREEMENT_STATUS_CODES.PROVIDER_DECLINED,
      }

      try {
        await FundingAgreementService.updateFundingAgreement(this.fundingAgreement?.fundingId, payload_decliner)
        await FundingAgreementService.updateFundingAgreement(this.fundingAgreement?.fundingId, payload)
        this.setSuccessAlert('Funding Agreement declined')
        this.$router.push({ name: 'funding-declined' })
      } catch (error) {
        this.setFailureAlert('Failed to decline funding agreement', error)
      }
    },
    goToDeclaration() {
      const declarationElement = document.getElementById('declaration')
      declarationElement.scrollIntoView({ behavior: 'smooth' })
    },
  },
}
</script>
