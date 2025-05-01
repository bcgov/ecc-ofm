<template>
  <v-form ref="form">
    <div v-if="!isEmpty(currentApplication?.licences)">
      <v-row no-gutters class="mb-2">
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
      <v-expansion-panels v-model="panel" multiple>
        <v-expansion-panel v-for="licence in currentApplication?.licences" :key="licence.licenceId" :value="licence.licenceId">
          <v-expansion-panel-title>
            <LicenceHeader :id="licence.licenceId" :licence="licence" />
          </v-expansion-panel-title>
          <v-expansion-panel-text>
            <v-card>
              <LicenceDetails
                :loading="processing"
                :licence="licence"
                :editable="isLicenceDetailsEditable"
                :read-only="readonly"
                @update="updateLicenceDetails"
                @set-details-complete="setDetailsComplete" />
            </v-card>
            <v-card class="my-4 pa-4">
              <h4>Upload Documents</h4>
              <div>{{ SUPPORTED_DOCUMENTS_MESSAGE }}</div>
              <AppMissingInfoError v-if="showErrorMessage && !isLicenceDocumentUploaded(licence)">{{ APPLICATION_ERROR_MESSAGES.DOCUMENT_LICENCE_UPLOAD }}</AppMissingInfoError>
              <div class="grey-card mt-2">
                <v-card class="pa-4">
                  <AppDocumentUpload
                    id="licence-document-upload"
                    v-model="licenceDocuments[licence.licence].documentsToUpload"
                    entity-name="ofm_applications"
                    :loading="processing"
                    :readonly="readonly"
                    upload-limit="1"
                    :document-label="DOCUMENT_LABELS.LICENCE"
                    :document-type="`Licence ${licence?.licence}`"
                    :uploaded-documents="licenceDocuments[licence.licence]?.uploadedDocuments"
                    @delete-uploaded-document="deleteUploadedLicenceDocuments"
                    @update:model-value="setFormComplete" />
                </v-card>
              </div>
            </v-card>
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>

      <v-card class="my-4 pa-4">
        <h4>Upload Documents</h4>
        <div>{{ SUPPORTED_DOCUMENTS_MESSAGE }}</div>
        <AppMissingInfoError v-if="showErrorMessage && !isHealthAuthorityReportsUploaded">
          {{ APPLICATION_ERROR_MESSAGES.DOCUMENT_HA_REPORT_UPLOAD }}
        </AppMissingInfoError>
        <AppMissingInfoError v-if="showErrorMessage && !isPolicyProcedureManualUploaded">
          {{ APPLICATION_ERROR_MESSAGES.DOCUMENT_POLICY_PROCEDURE_UPLOAD }}
        </AppMissingInfoError>

        <div class="grey-card mt-2">
          <v-card class="pa-4">
            <AppDocumentUpload
              id="health-authority-report-upload"
              v-model="healthAuthorityReports.documentsToUpload"
              entity-name="ofm_applications"
              :loading="processing"
              :readonly="readonly"
              upload-limit="1"
              :document-label="DOCUMENT_LABELS.HEALTH_AUTHORITY_REPORT"
              :document-type="DOCUMENT_TYPES.HEALTH_AUTHORITY_REPORT"
              :uploaded-documents="healthAuthorityReports?.uploadedDocuments"
              @delete-uploaded-document="deleteUploadedHealthAuthorityReports"
              @update:model-value="setFormComplete" />
            <AppDocumentUpload
              id="policy-and-procedure-upload"
              v-model="policyProcedureManual.documentsToUpload"
              entity-name="ofm_applications"
              :loading="processing"
              :readonly="readonly"
              upload-limit="1"
              :document-label="DOCUMENT_LABELS.POLICY_PROCEDURE_MANUAL"
              :document-type="DOCUMENT_TYPES.POLICY_PROCEDURE_MANUAL"
              :uploaded-documents="policyProcedureManual?.uploadedDocuments"
              @delete-uploaded-document="deleteUploadedPolicyProcedureManual"
              @update:model-value="setFormComplete" />
          </v-card>
        </div>
      </v-card>

      <v-checkbox
        id="confirmation"
        v-model="licenceDeclaration"
        color="primary"
        :rules="rules.required"
        :disabled="readonly"
        :hide-details="readonly"
        label="I confirm that the above information is correct."
        class="mt-4"></v-checkbox>
    </div>

    <AppMissingInfoError v-else-if="showErrorMessage">{{ APPLICATION_ERROR_MESSAGES.LICENCE_INFO }}</AppMissingInfoError>

    <p id="account-management" class="pb-3">
      Your organization account manager can update licence details in
      <router-link :to="{ name: 'manage-facility', params: { facilityId: currentApplication?.facilityId } }">Account Management</router-link>
    </p>
  </v-form>
</template>

<script>
import { isEmpty, cloneDeep } from 'lodash'
import { mapState, mapWritableState, mapActions } from 'pinia'

import AppButton from '@/components/ui/AppButton.vue'
import AppDocumentUpload from '@/components/ui/AppDocumentUpload.vue'
import AppMissingInfoError from '@/components/ui/AppMissingInfoError.vue'
import LicenceHeader from '@/components/licences/LicenceHeader.vue'
import LicenceDetails from '@/components/licences/LicenceDetails.vue'
import ApplicationService from '@/services/applicationService'
import DocumentService from '@/services/documentService'
import LicenceService from '@/services/licenceService'
import { useApplicationsStore } from '@/stores/applications'
import { APPLICATION_ERROR_MESSAGES, APPLICATION_ROUTES, DOCUMENT_LABELS, DOCUMENT_TYPES, OFM_PROGRAM_CODES, SUPPORTED_DOCUMENTS_MESSAGE, RENEWAL_ROUTES } from '@/utils/constants'
import format from '@/utils/format'
import rules from '@/utils/rules'
import alertMixin from '@/mixins/alertMixin'

export default {
  name: 'ServiceDeliveryView',
  components: { AppButton, AppDocumentUpload, AppMissingInfoError, LicenceHeader, LicenceDetails },
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
      rules,
      processing: false,
      licences: [],
      panel: [],
      licenceDeclaration: undefined,
      changedLicences: [],
      licenceDocuments: {},
      healthAuthorityReports: {
        uploadedDocuments: [],
        documentsToUpload: [],
        documentsToDelete: [],
      },
      policyProcedureManual: {
        uploadedDocuments: [],
        documentsToUpload: [],
        documentsToDelete: [],
      },
    }
  },

  computed: {
    ...mapState(useApplicationsStore, ['currentApplication', 'validation']),
    ...mapWritableState(useApplicationsStore, ['isServiceDeliveryComplete']),
    isRenewal() {
      return !!this.$route.meta.isRenewal
    },
    showErrorMessage() {
      return !this.readonly && !this.processing && this.validation
    },

    allLicenceIDs() {
      return this.currentApplication?.licences?.map((licence) => licence.licenceId)
    },

    isLicenceDetailsEditable() {
      return (
        !this.readonly &&
        this.currentApplication?.facility?.programCode === OFM_PROGRAM_CODES.MULTIPLE &&
        !this.currentApplication?.facility?.facilityReviewComplete &&
        !this.currentApplication?.applicationReviewComplete
      )
    },

    isHealthAuthorityReportsUploaded() {
      return !isEmpty(this.healthAuthorityReports?.documentsToUpload) || !isEmpty(this.healthAuthorityReports?.uploadedDocuments)
    },
    isPolicyProcedureManualUploaded() {
      return !isEmpty(this.policyProcedureManual?.documentsToUpload) || !isEmpty(this.policyProcedureManual?.uploadedDocuments)
    },

    hasLicenceDocumentsToProcess() {
      return Object.keys(this.licenceDocuments)?.some((licence) => !isEmpty(this.licenceDocuments[licence]?.documentsToUpload) || !isEmpty(this.licenceDocuments[licence]?.documentsToDelete))
    },

    hasHealthAuthorityReportDocumentsToProcess() {
      return !isEmpty(this.healthAuthorityReports?.documentsToUpload) || !isEmpty(this.healthAuthorityReports?.documentsToDelete)
    },
    hasPolicyProcedureManualDocumentsToProcess() {
      return !isEmpty(this.policyProcedureManual?.documentsToUpload) || !isEmpty(this.policyProcedureManual?.documentsToDelete)
    },
  },

  watch: {
    licenceDeclaration: {
      handler() {
        this.setFormComplete()
      },
    },
    back: {
      handler() {
        this.$router.push({
          name: this.isRenewal ? RENEWAL_ROUTES.FACILITY_DETAILS : APPLICATION_ROUTES.ELIGIBILITY,
          params: { applicationGuid: this.$route.params.applicationGuid },
        })
      },
    },
    save: {
      async handler() {
        await this.saveApplication(true)
      },
    },
    next: {
      handler() {
        this.$router.push({
          name: this.isRenewal ? RENEWAL_ROUTES.OPERATING_COSTS : APPLICATION_ROUTES.OPERATING_COSTS,
          params: { applicationGuid: this.$route.params.applicationGuid },
        })
      },
    },
  },

  created() {
    this.$emit('process', false)
    this.licenceDeclaration = this.currentApplication?.licenceDeclaration
    this.panel = this.allLicenceIDs
    this.APPLICATION_ERROR_MESSAGES = APPLICATION_ERROR_MESSAGES
    this.DOCUMENT_LABELS = DOCUMENT_LABELS
    this.DOCUMENT_TYPES = DOCUMENT_TYPES
    this.SUPPORTED_DOCUMENTS_MESSAGE = SUPPORTED_DOCUMENTS_MESSAGE
    this.initializeDocuments()
  },

  async mounted() {
    if (this.validation) {
      await this.$refs.form?.validate()
    }
  },

  methods: {
    ...mapActions(useApplicationsStore, ['getApplication']),
    isEmpty,
    async saveApplication(showAlert = false) {
      try {
        this.$emit('process', true)
        this.processing = true
        let reloadApplication =
          !isEmpty(this.changedLicences) || this.hasLicenceDocumentsToProcess || this.hasHealthAuthorityReportDocumentsToProcess || this.hasPolicyProcedureManualDocumentsToProcess
        const payload = {
          licenceDeclaration: this.licenceDeclaration,
        }
        if (ApplicationService.isApplicationUpdated(payload)) {
          await ApplicationService.updateApplication(this.$route.params.applicationGuid, payload)
          reloadApplication = true
        }

        await Promise.all(
          this.changedLicences.map(async (licence) => {
            this.sanitizeLicenceDetailBeforeSave(licence)
            await LicenceService.updateLicenceDetails(licence.licenceDetailId, licence)
          }),
        )

        if (this.hasLicenceDocumentsToProcess) {
          await this.processLicenceDocuments()
        }

        if (this.hasHealthAuthorityReportDocumentsToProcess) {
          await this.processHealthAuthorityReportDocuments()
        }
        if (this.hasPolicyProcedureManualDocumentsToProcess) {
          await this.processPolicyProcedureManualDocuments()
        }

        if (reloadApplication) {
          await this.getApplication(this.$route.params.applicationGuid)
          this.initializeDocuments()
        }

        this.changedLicences = []

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

    togglePanel() {
      this.panel = isEmpty(this.panel) ? this.allLicenceIDs : []
    },

    updateLicenceDetails(updatedModel) {
      const clonedModel = cloneDeep(updatedModel)
      clonedModel.updatableOperationFromTime = format.convertTimeToDateTimeFormat(clonedModel.operationFromTime)
      clonedModel.updatableOperationToTime = format.convertTimeToDateTimeFormat(clonedModel.operationToTime)
      clonedModel.weekDays = clonedModel?.weekDays?.toString()
      const index = this.changedLicences.findIndex((el) => el.licenceDetailId == clonedModel.licenceDetailId)
      if (index === -1) {
        this.changedLicences.push(clonedModel)
      } else {
        this.changedLicences[index] = clonedModel
      }
    },

    sanitizeLicenceDetailBeforeSave(detail) {
      if (!LicenceService.isOperationalSpacesValid(detail.operationalSpaces)) {
        delete detail.operationalSpaces
      }
      if (!LicenceService.isEnrolledSpacesValid(detail.enrolledSpaces)) {
        delete detail.enrolledSpaces
      }
      if (!LicenceService.isWeeksInOperationValid(detail.weeksInOperation)) {
        delete detail.weeksInOperation
      }
      if (isEmpty(detail.weekDays)) {
        delete detail.weekDays
      }
      if (isEmpty(detail.operationFromTime)) {
        delete detail.updatableOperationFromTime
      }
      if (isEmpty(detail.operationToTime)) {
        delete detail.updatableOperationToTime
      }
      if (detail.updatableOperationFromTime >= detail.updatableOperationToTime) {
        delete detail.updatableOperationFromTime
        delete detail.updatableOperationToTime
      }
      delete detail.operationFromTime
      delete detail.operationToTime
    },

    setDetailsComplete(licenceId, value) {
      const currentLicence = this.currentApplication?.licences.find((el) => el.licenceId === licenceId)
      currentLicence.isLicenceDetailsComplete = value.valid
      this.setFormComplete()
    },

    setFormComplete() {
      this.isServiceDeliveryComplete =
        this.currentApplication.licences.every((licence) => licence.isLicenceDetailsComplete && this.isLicenceDocumentUploaded(licence)) &&
        this.isHealthAuthorityReportsUploaded &&
        this.isPolicyProcedureManualUploaded &&
        this.licenceDeclaration
    },

    initializeDocuments() {
      this.currentApplication?.licences?.forEach(
        (licence) =>
          (this.licenceDocuments[licence?.licence] = {
            uploadedDocuments: this.currentApplication?.uploadedDocuments?.filter((document) => document.documentType?.includes(licence?.licence)),
            documentsToUpload: [],
            documentsToDelete: [],
          }),
      )
      this.healthAuthorityReports = {
        uploadedDocuments: this.currentApplication?.uploadedDocuments?.filter((document) => document.documentType?.includes(DOCUMENT_TYPES.HEALTH_AUTHORITY_REPORT)),
        documentsToUpload: [],
        documentsToDelete: [],
      }
      this.policyProcedureManual = {
        uploadedDocuments: this.currentApplication?.uploadedDocuments?.filter((document) => document.documentType?.includes(DOCUMENT_TYPES.POLICY_PROCEDURE_MANUAL)),
        documentsToUpload: [],
        documentsToDelete: [],
      }
    },

    deleteUploadedLicenceDocuments(documentId, documentType) {
      const licence = documentType?.substring(documentType?.indexOf(' ') + 1)
      const index = this.licenceDocuments[licence]?.uploadedDocuments?.findIndex((item) => item.documentId === documentId)
      if (index > -1) {
        this.licenceDocuments[licence]?.documentsToDelete.push(documentId)
        this.licenceDocuments[licence]?.uploadedDocuments.splice(index, 1)
      }
      this.setFormComplete()
    },

    async processLicenceDocuments() {
      await Promise.all(
        Object.keys(this.licenceDocuments)?.map(async (licence) => {
          if (!isEmpty(this.licenceDocuments[licence]?.documentsToUpload)) {
            await DocumentService.createDocuments(this.licenceDocuments[licence]?.documentsToUpload, this.$route.params.applicationGuid)
          }
          if (!isEmpty(this.licenceDocuments[licence]?.documentsToDelete)) {
            this.licenceDocuments[licence]?.documentsToDelete.map(async (documentId) => await DocumentService.deleteDocument(documentId))
          }
        }),
      )
    },

    isLicenceDocumentUploaded(licence) {
      return !isEmpty(this.licenceDocuments[licence.licence]?.documentsToUpload) || !isEmpty(this.licenceDocuments[licence.licence]?.uploadedDocuments)
    },

    async processHealthAuthorityReportDocuments() {
      await DocumentService.createDocuments(this.healthAuthorityReports?.documentsToUpload, this.$route.params.applicationGuid)
      await Promise.all(this.healthAuthorityReports?.documentsToDelete.map(async (documentId) => await DocumentService.deleteDocument(documentId)))
    },

    deleteUploadedHealthAuthorityReports(documentId, _) {
      const index = this.healthAuthorityReports?.uploadedDocuments?.findIndex((item) => item.documentId === documentId)
      if (index > -1) {
        this.healthAuthorityReports?.documentsToDelete.push(documentId)
        this.healthAuthorityReports?.uploadedDocuments.splice(index, 1)
      }
      this.setFormComplete()
    },
    async processPolicyProcedureManualDocuments() {
      await DocumentService.createDocuments(this.policyProcedureManual?.documentsToUpload, this.$route.params.applicationGuid)
      await Promise.all(this.policyProcedureManual?.documentsToDelete.map(async (documentId) => await DocumentService.deleteDocument(documentId)))
    },

    deleteUploadedPolicyProcedureManual(documentId, _) {
      const index = this.policyProcedureManual?.uploadedDocuments?.findIndex((item) => item.documentId === documentId)
      if (index > -1) {
        this.policyProcedureManual?.documentsToDelete.push(documentId)
        this.policyProcedureManual?.uploadedDocuments.splice(index, 1)
      }
      this.setFormComplete()
    },
  },
}
</script>

<style scoped>
:deep(.v-label) {
  opacity: 1;
}
</style>
