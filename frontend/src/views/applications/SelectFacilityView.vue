<template>
  <v-form ref="form" v-model="isFormComplete" class="mx-4">
    <h1 v-if="!isRenewal">Begin a $10 a Day Funding application</h1>
    <h1 v-else>Begin a $10 a Day Funding Agreement renewal</h1>
    <div class="mt-8">
      <h4>Organization information</h4>
      <div>
        <v-icon class="mr-1">mdi-information-slab-circle-outline</v-icon>
        <span>Please review the following pre-populated information for correctness and contact your organization's account manager to make updates if required.</span>
      </div>
      <OrganizationInfo :loading="loading" :organization="organization" />

      <v-card v-if="loading" class="my-4 pa-4 w-100" variant="outlined">
        <v-skeleton-loader :loading="loading" type="table-tbody"></v-skeleton-loader>
      </v-card>
      <div v-else-if="organization?.businessTypeCode === BUSINESS_TYPE_CODES.NON_PROFIT_SOCIETY">
        <NotForProfitQuestions
          class="mb-6"
          :loading="loading"
          :organization="organization"
          @documents-complete="setDocumentsComplete"
          @update="updateModel"
          @delete-document="deleteDocument"></NotForProfitQuestions>
      </div>

      <v-checkbox :value="1" :rules="rules.required" color="primary" label="I confirm that Organization information is correct."></v-checkbox>
    </div>

    <div class="mb-6">
      <template v-if="isRenewal">
        <h4>To start your renewal, select a facility</h4>
        <div>
          <v-icon class="mr-1">mdi-information-slab-circle-outline</v-icon>
          <span>Only facilities with funding agreements expiriring within 120 days will be listed below.</span>
        </div>
      </template>
      <template v-else>
        <h4>To start your application, select a facility</h4>
        <div>
          <v-icon class="mr-1">mdi-information-slab-circle-outline</v-icon>
          <span>If your facility is not listed, contact your Account Manager.</span>
        </div>
      </template>

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
  </v-form>
</template>

<script>
import { useApplicationsStore } from '@/stores/applications'
import { useAppStore } from '@/stores/app'
import { useAuthStore } from '@/stores/auth'
import { mapState, mapWritableState } from 'pinia'
import rules from '@/utils/rules'
import OrganizationInfo from '@/components/organizations/OrganizationInfo.vue'
import ApplicationService from '@/services/applicationService'
import OrganizationService from '@/services/organizationService'
import DocumentService from '@/services/documentService'
import FacilityService from '@/services/facilityService'
import alertMixin from '@/mixins/alertMixin'
import { APPLICATION_ROUTES, APPLICATION_STATUS_CODES, BUSINESS_TYPE_CODES, CRM_STATE_CODES, DOCUMENT_TYPES, VIRUS_SCAN_ERROR_MESSAGE, RENEWAL_ROUTES } from '@/utils/constants'
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
      updatedOrganization: undefined,
      loadedApplications: undefined,
      documentsToDelete: [],
      documentsComplete: true,
      redirectedApplications: undefined,
    }
  },

  computed: {
    ...mapState(useAuthStore, ['userInfo']),
    ...mapWritableState(useApplicationsStore, ['isSelectFacilityComplete']),
    ...mapWritableState(useAppStore, ['facilitiesForRenewal']),
    isRenewal() {
      return !!this.$route.meta.isRenewal
    },
    filteredFacilities() {
      //TODO - check this logic. Right now we are just looking if there is an eligible application for a facility.
      if (this.isRenewal) {
        return this.userInfo?.facilities?.filter((facility) => {
          return this.loadedApplications?.some((app) => app.facilityId === facility.facilityId) || this.facilitiesForRenewal?.some((fac) => fac.facilityId === facility.facilityId)
        })
      }

      return this.userInfo?.facilities?.filter(
        (facility) =>
          facility.facilityStateCode === CRM_STATE_CODES.ACTIVE &&
          facility.intakeWindowCheckForAddApplication &&
          facility.ccofEnrolmentCheckForAddApplication &&
          !this.redirectedApplications?.some((el) => el.facilityId === facility.facilityId),
      )
    },
  },

  watch: {
    isFormComplete: {
      handler() {
        this.checkFacilityComplete()
      },
    },
    cancel: {
      handler() {
        this.$router.push({ name: 'applications-history' })
      },
    },

    next: {
      //TODO - this will change more as we create the renewal application
      async handler() {
        this.$refs.form?.validate()
        if (!this.isFormComplete || !this.documentsComplete) return
        this.$emit('process', true)

        //remove the time otherwise isEqual will always return false
        this.organization.dateOfIncorporation = this.organization.dateOfIncorporation ? this.organization.dateOfIncorporation.slice(0, 10) : null

        if (!isEqual(this.organization, this.updatedOrganization)) {
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

          if (this.isRenewal) {
            this.$router.push({ name: RENEWAL_ROUTES.FACILITY_DETAILS, params: { applicationGuid: existingApplication?.applicationId } })
          } else {
            this.$router.push({ name: APPLICATION_ROUTES.FACILITY_DETAILS, params: { applicationGuid: existingApplication?.applicationId } })
          }
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

    if (this.isRenewal) {
      if (this.facilitiesForRenewal === null) {
        this.facilitiesForRenewal = await FacilityService.getRenewalFacilities()
      }
      this.loadedApplications = await ApplicationService.getActiveRenewalApplications()
    } else {
      this.loadedApplications = await ApplicationService.getActiveApplications()

      //get the redirected applications so we can prevent those facilities from starting another OFM app
      this.redirectedApplications = await ApplicationService.getRedirectedApplications(
        this.userInfo?.facilities.filter((fac) => !this.loadedApplications.some((el) => el.facilityId === fac.facilityId)),
      )
    }
  },

  methods: {
    updateModel(updatedModel) {
      this.updatedOrganization = cloneDeep(updatedModel)
    },
    deleteDocument(documentId) {
      this.documentsToDelete.push(documentId)
    },
    setDocumentsComplete(value) {
      this.documentsComplete = value
      this.checkFacilityComplete()
    },
    checkFacilityComplete() {
      this.isSelectFacilityComplete = this.documentsComplete && this.isFormComplete
    },
    async getOrganization() {
      try {
        this.$emit('process', true)
        this.loading = true
        this.organization = await OrganizationService.getOrganization(this.userInfo?.organizationId)
        if (this.organization?.businessTypeCode === BUSINESS_TYPE_CODES.NON_PROFIT_SOCIETY) {
          this.organization.uploadedDocuments = await this.getCommunitySupportDocs()
          this.organization.documentsToUpload = []
        }

        this.updatedOrganization = cloneDeep(this.organization)
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
        dateOfIncorporation: format.convertUTCDatetoPSTDate(this.updatedOrganization.dateOfIncorporation),
        openMembership: this.updatedOrganization.openMembership,
        boardMembersElected: this.updatedOrganization.boardMembersElected,
        boardMembersSelectedMembership: this.updatedOrganization.boardMembersSelectedMembership,
        boardMembersResidentsOfBC: this.updatedOrganization.boardMembersResidentsOfBC,
      }
      try {
        await OrganizationService.updateOrganization(this.organization?.organizationId, payload)
        await this.processDocuments()
      } catch (error) {
        this.setFailureAlert('Failed to update the organization', error)
      }
    },

    async getCommunitySupportDocs() {
      try {
        const docs = await DocumentService.getDocuments(this.organization.organizationId)
        return docs?.filter((doc) => doc.documentType === DOCUMENT_TYPES.COMMUNITY_LETTER) ?? []
      } catch (error) {
        this.setFailureAlert("Failed to get organization's community support docs", error)
        return
      }
    },

    async processDocuments() {
      try {
        if (!isEmpty(this.updatedOrganization?.documentsToUpload)) {
          await DocumentService.createDocuments(this.updatedOrganization.documentsToUpload, this.updatedOrganization.organizationId)
        }
        if (!isEmpty(this.documentsToDelete)) {
          await Promise.all(
            this.documentsToDelete.map(async (documentId) => {
              await DocumentService.deleteDocument(documentId)
            }),
          )
        }
      } catch (error) {
        if (error?.response?.data?.status === 422) {
          this.setFailureAlert(VIRUS_SCAN_ERROR_MESSAGE, error)
        } else {
          this.setFailureAlert('Failed to process documents', error)
        }
      }
    },
  },
}
</script>

<style scoped>
:deep(.v-label) {
  opacity: 1;
}
</style>
