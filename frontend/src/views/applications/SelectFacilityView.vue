<template>
  <v-form ref="form" v-model="isFormComplete" class="mx-4">
    <h1>Begin an Operating Funding Model application</h1>
    <div class="mt-8">
      <h4>Organization information</h4>
      <div>
        <v-icon class="mr-1">mdi-information-slab-circle-outline</v-icon>
        <span>Please review the following pre-populated information for correctness and contact your organization's account manager to make updates if required.</span>
      </div>
      <OrganizationInfo :loading="loading" :organization="organization" />
      <v-checkbox id="confirm-info" :value="1" :rules="rules.required" color="primary" label="I confirm that Organization information is correct."></v-checkbox>
    </div>
    <div class="mb-6">
      <h4>To start your application, select a facility</h4>
      <div>
        <v-icon class="mr-1">mdi-information-slab-circle-outline</v-icon>
        <span>If your facility is not listed, contact your Account Manager.</span>
      </div>
      <v-row no-gutters class="mt-4">
        <v-col cols="12" md="4" lg="2">
          <div>Select your facility:</div>
        </v-col>
        <v-col cols="12" md="8" lg="10">
          <v-select
            id="select-facility"
            v-model="facilityId"
            :items="filteredFacilities"
            item-title="facilityName"
            item-value="facilityId"
            :rules="rules.required"
            placeholder="Select facility"
            density="compact"
            variant="outlined"></v-select>
        </v-col>
      </v-row>
    </div>
    <div v-if="organization?.businessTypeCode === BUSINESS_TYPE_CODES.NON_PROFIT_SOCIETY" class="mb-6">
      <NotForProfitQuestions :loading="loading" :organization="organization" @update="updateModel"></NotForProfitQuestions>
    </div>
  </v-form>
</template>

<script>
import { useApplicationsStore } from '@/stores/applications'
import { useAuthStore } from '@/stores/auth'
import { mapState, mapWritableState } from 'pinia'
import rules from '@/utils/rules'
import OrganizationInfo from '@/components/organizations/OrganizationInfo.vue'
import ApplicationService from '@/services/applicationService'
import OrganizationService from '@/services/organizationService'
import alertMixin from '@/mixins/alertMixin'
import { APPLICATION_ROUTES, APPLICATION_STATUS_CODES, BUSINESS_TYPE_CODES } from '@/utils/constants'
import { isEmpty } from 'lodash'
import NotForProfitQuestions from '@/components/organizations/NotForProfitQuestions.vue'
import { isEqual, cloneDeep } from 'lodash'
import format from '@/utils/format'

export default {
  name: 'SelectFacilityView',
  components: { OrganizationInfo, NotForProfitQuestions },
  mixins: [alertMixin],

  props: {
    cancel: {
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
      rules,
      loading: false,
      facilityId: undefined,
      isFormComplete: false,
      organization: undefined,
      originalOrganization: undefined,
      loadedApplications: undefined,
      isOrganizationUpdated: false,
    }
  },

  computed: {
    ...mapState(useAuthStore, ['userInfo']),
    ...mapWritableState(useApplicationsStore, ['isSelectFacilityComplete']),

    filteredFacilities() {
      return this.userInfo?.facilities?.filter((facility) => facility.intakeWindowCheckForAddApplication && facility.ccofEnrolmentCheckForAddApplication)
    },
  },

  watch: {
    isFormComplete: {
      handler(value) {
        this.isSelectFacilityComplete = value
      },
    },
    cancel: {
      handler() {
        this.$router.push({ name: 'applications-history' })
      },
    },

    next: {
      async handler() {
        this.$refs.form?.validate()
        if (!this.isFormComplete) return
        this.$emit('process', true)

        if (!isEqual(this.organization, this.originalOrganization)) {
          await this.updateOrganization()
        }
        const activeApplications = this.loadedApplications?.filter((el) => el.facilityId === this.facilityId)
        if (isEmpty(activeApplications)) {
          await this.createApplication()
        } else {
          activeApplications?.sort((a, b) => {
            const dateA = new Date(a.submittedDate)
            const dateB = new Date(b.submittedDate)
            return dateB - dateA // descending order (the most recent submitted application at the top)
          })
          const existingApplication = activeApplications?.find((el) => el.statusCode === APPLICATION_STATUS_CODES.DRAFT) ?? activeApplications[0]
          this.$router.push({ name: APPLICATION_ROUTES.FACILITY_DETAILS, params: { applicationGuid: existingApplication?.applicationId } })
        }
      },
    },
  },

  async created() {
    this.isSelectFacilityComplete = false
    this.BUSINESS_TYPE_CODES = BUSINESS_TYPE_CODES
    if (this.userInfo?.facilities?.length === 1) {
      this.facilityId = this.userInfo?.facilities[0].facilityId
    }
    await this.getOrganization()
    this.loadedApplications = await ApplicationService.getActiveApplications()
  },

  methods: {
    async getOrganization() {
      try {
        this.$emit('process', true)
        this.loading = true
        this.organization = await OrganizationService.getOrganization(this.userInfo?.organizationId)
        this.originalOrganization = cloneDeep(this.organization)
      } catch (error) {
        this.setFailureAlert('Failed to get your organization information', error)
      } finally {
        this.loading = false
        this.$emit('process', false)
      }
    },

    async createApplication() {
      try {
        this.$emit('process', true)
        const payload = {
          facilityId: this.facilityId,
          organizationId: this.organization?.organizationId,
          providerType: this.organization?.providerType,
          ownership: this.organization?.ownership,
          createdBy: this.userInfo?.contactId,
        }
        const response = await ApplicationService.createApplication(payload)
        this.setSuccessAlert('Started a new application successfully')
        this.$router.push({ name: APPLICATION_ROUTES.FACILITY_DETAILS, params: { applicationGuid: response?.applicationId } })
      } catch (error) {
        this.setFailureAlert('Failed to start a new application', error)
      } finally {
        this.$emit('process', false)
      }
    },
    async updateOrganization() {
      const payload = {
        dateOfIncorporation: format.convertUTCDatetoPSTDate(this.organization.dateOfIncorporation),
        openMembership: this.organization.openMembership,
        boardMembersElected: this.organization.boardMembersElected,
        boardMembersSelectedMembership: this.organization.boardMembersSelectedMembership,
        boardMembersResidentsOfBC: this.organization.boardMembersResidentsOfBC,
      }
      await OrganizationService.updateOrganization(this.organization?.organizationId, payload)
    },
    updateModel(updatedModel) {
      this.organization = { ...updatedModel }
    },
  },
}
</script>

<style scoped>
:deep(.v-label) {
  opacity: 1;
}
</style>
