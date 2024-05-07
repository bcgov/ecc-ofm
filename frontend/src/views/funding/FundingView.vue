<template>
  <OrganizationHeader :show-facility="false" />
  <v-container fluid v-bind="$attrs">
    <h1>{{ fundingAgreement?.fundingAgreementNumber }}</h1>
    <!-- <div style="color: #999999">FA GUID: {{ $route.params.fundingGuid }}</div> -->
    <p>Carefully review your funding agreement.</p>

    <h4 class="lg-px-10 my-10">Service Delivery Details</h4>

    <v-row class="lg-mt-10 lg-px-10">
      <v-col cols="12" class="pt-0">
        <v-card elevation="0" variant="outlined" class="">
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

    <br />
    <br />
    <h4 class="lg-px-10">Declaration</h4>
    <br />
    <br />

    <v-skeleton-loader v-if="loading" :loading="loading" type="table-tbody"></v-skeleton-loader>
    <v-row v-else class="lg-px-10">
      <v-col cols="12" class="pt-0">
        <div style="background-color: #eeeeee; border: 1px solid #333333" class="lg-pa-10 pa-5 overflow-y-auto">
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

      <v-checkbox v-model="fundingAgreement.agreeConsentCertify" class="ml-3" :disabled="!canEdit" label="I agree, consent and certify" />
    </v-row>

    <v-row v-if="!loading" class="justify-space-between mx-5">
      <AppBackButton id="back-home-button" width="220px" :to="{ name: 'home' }">Home</AppBackButton>
      <AppButton id="submit-funding-agreement" size="large" width="220px" class="mt-2" :disabled="!fundingAgreement.agreeConsentCertify" :loading="loading" @click="submit()">Submit</AppButton>
    </v-row>
  </v-container>
</template>

<script>
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

export default {
  name: 'FundingView',
  components: { AppBackButton, AppButton, OrganizationHeader, LicenceDetails, LicenceHeader },
  mixins: [alertMixin, permissionsMixin],
  props: {
    facility: {
      type: Object,
      required: false, //should be true
      default: () => {
        return { facilityId: '03d677db-0f04-ef11-9f8a-000d3af4865d' }
      },
    },
  },
  data() {
    return {
      fundingAgreement: undefined,
      licences: [],
      panel: [],
      loading: false,
    }
  },
  computed: {
    canEdit() {
      return this.hasPermission(this.PERMISSIONS.SIGN_FUNDING_AGREEMENT) && !this.isFundingAgreementLocked
    },
    isFundingAgreementLocked() {
      return (
        this.fundingAgreement?.statusCode === FUNDING_AGREEMENT_STATUS_CODES.IN_REVIEW_WITH_MINISTRY_EA ||
        this.fundingAgreement?.statusCode === FUNDING_AGREEMENT_STATUS_CODES.SUBMITTED ||
        this.fundingAgreement?.statusCode === FUNDING_AGREEMENT_STATUS_CODES.ACTIVE ||
        this.fundingAgreement?.statusCode === FUNDING_AGREEMENT_STATUS_CODES.CANCELLED
      )
    },
  },
  async created() {
    await this.loadData()
  },
  methods: {
    async loadData() {
      try {
        this.loading = true
        this.fundingAgreement = await FundingAgreementService.getActiveFundingAgreementByFacilityId(this.facility.facilityId)
        await this.getLicences()
      } finally {
        this.loading = false
      }
    },
    async getLicences() {
      try {
        this.licences = await FacilityService.getLicences(this.facility?.facilityId)
        await Promise.all(
          this.licences.map(async (licence) => {
            licence.licenceDetails = await LicenceService.getLicenceDetails(licence.licenceId)
          }),
        )
      } catch (error) {
        this.setFailureAlert('Failed to licence(s) for facilityId = ' + this.facilityId, error)
      }
    },

    async submit() {
      this.fundingAgreement.statusCode = FUNDING_AGREEMENT_STATUS_CODES.SUBMITTED

      const payload = {
        agreeConsentCertify: this.fundingAgreement?.agreeConsentCertify,
        statusCode: this.fundingAgreement.statusCode,
      }

      try {
        await FundingAgreementService.updateFundingAgreement(this.fundingAgreement?.fundingId, payload)
        this.setSuccessAlert('Funding Agreement submitted')
      } catch (error) {
        this.setFailureAlert('Failed to submit funding agreement')
      }
    },
  },
}
</script>

<style scoped></style>
