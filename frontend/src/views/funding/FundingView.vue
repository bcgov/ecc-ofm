<template>
  <OrganizationHeader :show-facility="false" />
  <v-container fluid v-bind="$attrs" class="px-md-16">
    <h1>{{ fundingAgreement?.fundingAgreementNumber }}</h1>

    <p>Carefully review your funding agreement.</p>

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

    <VuePdfEmbed :source="testFile" :height="500" />
    <!--
    <iframe title="title" :src="testFile" width="750px"></iframe> -->

    <br />
    <br />
    <h4 class="lg-px-10">Declaration</h4>
    <br />
    <br />

    <v-skeleton-loader v-if="loading" :loading="loading" type="table-tbody"></v-skeleton-loader>
    <v-row v-else>
      <v-col cols="12" class="pt-0">
        <div style="background-color: #eeeeee; border: 1px solid #333333" class="pa-lg-7 pa-5 overflow-y-auto">
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
              understand and acknowledge thatproviding false or misleading information either on the Form or otherwise to the Province to obtain any funding under the Funding Agreement or otherwise
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

      <v-checkbox v-model="fundingAgreement.agreeConsentCertify" class="ml-3" :disabled="!canEditFA" label="I agree, consent and certify" />
    </v-row>

    <v-row v-if="!loading" class="justify-center justify-md-space-between mx-md-7 my-3">
      <AppBackButton id="back-home-button" width="240px" :to="{ name: 'home' }">Home</AppBackButton>
      <AppButton id="submit-funding-agreement" size="large" width="240px" class="mt-2" :disabled="submitDisabled" :loading="loading" @click="submit()">Submit</AppButton>
    </v-row>
  </v-container>
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
import permissionsMixin from '@/mixins/permissionsMixin'
import { FUNDING_AGREEMENT_STATUS_CODES } from '@/utils/constants'
import VuePdfEmbed from 'vue-pdf-embed'
import base64 from 'base-64'

// essential styles
import 'vue-pdf-embed/dist/style/index.css'

const LOCKED_STATUSES = [
  FUNDING_AGREEMENT_STATUS_CODES.IN_REVIEW_WITH_MINISTRY_EA,
  FUNDING_AGREEMENT_STATUS_CODES.SUBMITTED,
  FUNDING_AGREEMENT_STATUS_CODES.ACTIVE,
  FUNDING_AGREEMENT_STATUS_CODES.CANCELLED,
]

function base64ToBlob(base64, type = 'application/octet-stream') {
  const binStr = atob(base64)
  const len = binStr.length
  const arr = new Uint8Array(len)
  for (let i = 0; i < len; i++) {
    arr[i] = binStr.charCodeAt(i)
  }
  return new Blob([arr], { type: type })
}

export default {
  name: 'FundingView',
  components: { AppBackButton, AppButton, OrganizationHeader, LicenceDetails, LicenceHeader, VuePdfEmbed },
  mixins: [alertMixin, permissionsMixin],
  data() {
    return {
      testFile: undefined,
      pdfUrl: 'https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/examples/learning/helloworld.pdf',
      fundingAgreement: undefined,
      licences: [],
      panel: [],
      loading: false,
    }
  },
  computed: {
    ...mapState(useAuthStore, ['userInfo']),
    canEditFA() {
      //TODO - JB: add permissions back in when complete
      return !this.isFundingAgreementLocked
    },
    isFundingAgreementLocked() {
      return LOCKED_STATUSES.includes(this.fundingAgreement?.statusCode)
    },
    submitDisabled() {
      return this.isFundingAgreementLocked || !this.fundingAgreement.agreeConsentCertify
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
        const resp = await FundingAgreementService.getFundingPDFById(this.$route.params.fundingGuid)

        const encoded = base64.encode(resp)
        //error 431 - Request header fields too large
        //this.testFile = encoded

        //this.testFile = `'data:application/pdf;base64,${encoded}'`

        //this gives no errors but doesn't work
        //this.testfile = { data: encoded }

        //found this deep on github - doesn't make sense why it gets converted twice to me - so I'm probably doing something wrong here
        const blob = base64ToBlob(encoded, 'application/pdf')
        const url = URL.createObjectURL(blob)

        this.testFile = `'data:application/pdf;base64,'${url}'`
        await this.getLicences()
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
        this.setFailureAlert('Failed to submit funding agreement')
      }
    },
  },
}
</script>
