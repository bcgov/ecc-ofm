<template>
  <v-form ref="form">
    <v-row no-gutters class="mt-4"><strong>Please provide operating costs for the selected facility:</strong></v-row>
    <v-row id="facility-types" no-gutters class="mt-4">
      <v-col cols="12" md="3" lg="2" class="mt-4">
        <AppLabel>Facility Type:</AppLabel>
      </v-col>
      <v-col cols="10" md="7" lg="5" class="mt-3">
        <v-select
          id="select-facility-types"
          v-model="model.facilityType"
          :items="facilityTypes"
          :disabled="readonly"
          item-title="description"
          item-value="id"
          label="Select a facility type"
          :rules="rules.required"
          density="compact"
          variant="outlined"></v-select>
      </v-col>
      <v-col cols="2" md="2" lg="1" class="mt-4" align="center">
        <v-tooltip content-class="tooltip" :text="FACILITY_TYPE_INFO_TXT">
          <template v-slot:activator="{ props }">
            <v-icon size="large" v-bind="props">mdi-information-slab-circle-outline</v-icon>
          </template>
        </v-tooltip>
      </v-col>
    </v-row>
    <div v-if="model.facilityType">
      <AppMissingInfoError v-if="validation && totalOperationalCost === 0">{{ APPLICATION_ERROR_MESSAGES.OPERATIONAL_COST }}</AppMissingInfoError>
      <YearlyOperatingCost id="yearly-operating-cost" :readonly="readonly" @update="updateModel" />
      <YearlyFacilityCost id="yearly-facility-cost" :readonly="readonly" :facilityType="model.facilityType" @update="updateModel" />
    </div>
    <v-row>
      <v-col>
        <h4>Upload Documents</h4>
        {{ SUPPORTED_DOCUMENTS_MESSAGE }}
        <AppMissingInfoError v-if="validation && !isFinancialDocsUploaded">{{ APPLICATION_ERROR_MESSAGES.DOCUMENT_FINANCIAL_UPLOAD }}</AppMissingInfoError>
        <AppMissingInfoError v-if="validation && isRentLease && !isSupportingDocsUploaded">{{ APPLICATION_ERROR_MESSAGES.DOCUMENT_SUPPORTING_UPLOAD }}</AppMissingInfoError>
      </v-col>
    </v-row>
    <v-card class="mt-2 pa-4" variant="outlined">
      <v-card class="mt-2 mb-4 pa-4">
        <AppDocumentUpload
          id="financial-document-upload"
          v-model="financialStatement.documentsToUpload"
          entityName="ofm_applications"
          :documentType="DOCUMENT_TYPES.FINANCIAL_STATEMENT"
          :loading="processing"
          :readonly="readonly"
          :uploadedDocuments="financialStatement.uploadedDocuments"
          @deleteUploadedDocument="deleteUploadedDocument"></AppDocumentUpload>
      </v-card>
      <v-card class="mt-2 mb-4 pa-4">
        <AppDocumentUpload
          id="balance-sheet-document-upload"
          v-model="balanceSheet.documentsToUpload"
          entityName="ofm_applications"
          :documentType="DOCUMENT_TYPES.BALANCE_SHEET"
          :loading="processing"
          :readonly="readonly"
          :uploadedDocuments="balanceSheet.uploadedDocuments"
          @deleteUploadedDocument="deleteUploadedDocument"></AppDocumentUpload>
      </v-card>
      <v-card class="mt-2 mb-4 pa-4">
        <AppDocumentUpload
          id="supporting-document-upload"
          v-model="supporting.documentsToUpload"
          entityName="ofm_applications"
          :documentType="DOCUMENT_TYPES.SUPPORTING_DOCS"
          :loading="processing"
          :readonly="readonly"
          :uploadedDocuments="supporting.uploadedDocuments"
          @deleteUploadedDocument="deleteUploadedDocument"></AppDocumentUpload>
      </v-card>
    </v-card>
  </v-form>
</template>

<script>
import { useAppStore } from '@/stores/app'
import { useApplicationsStore } from '@/stores/applications'
import { mapState, mapWritableState, mapActions } from 'pinia'
import ApplicationService from '@/services/applicationService'
import DocumentService from '@/services/documentService'
import alertMixin from '@/mixins/alertMixin'
import rules from '@/utils/rules'
import { isEmpty } from 'lodash'
import AppLabel from '@/components/ui/AppLabel.vue'
import AppMissingInfoError from '@/components/ui/AppMissingInfoError.vue'
import AppDocumentUpload from '@/components/ui/AppDocumentUpload.vue'
import YearlyOperatingCost from '@/components/applications/YearlyOperatingCost.vue'
import YearlyFacilityCost from '@/components/applications/YearlyFacilityCost.vue'
import { FACILITY_TYPES, APPLICATION_ERROR_MESSAGES, APPLICATION_ROUTES, VIRUS_SCAN_ERROR_MESSAGE, DOCUMENT_TYPES, SUPPORTED_DOCUMENTS_MESSAGE } from '@/utils/constants'

export default {
  name: 'OperatingCostsView',
  components: { AppLabel, AppDocumentUpload, AppMissingInfoError, YearlyOperatingCost, YearlyFacilityCost },
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
      model: {},
      financialStatement: {
        uploadedDocuments: [],
        documentsToUpload: [],
        documentsToDelete: [],
      },
      balanceSheet: {
        uploadedDocuments: [],
        documentsToUpload: [],
        documentsToDelete: [],
      },
      supporting: {
        uploadedDocuments: [],
        documentsToUpload: [],
        documentsToDelete: [],
      },
      processing: false,
    }
  },

  computed: {
    ...mapState(useAppStore, ['facilityTypes']),
    ...mapState(useApplicationsStore, ['currentApplication', 'validation']),
    ...mapWritableState(useApplicationsStore, ['isOperatingCostsComplete']),
    sanitizedModel() {
      const sanitizedModel = {}
      Object.keys(this.model)?.forEach((key) => {
        if (key === 'facilityType' || Number(this.model[key]) <= 5000000) {
          sanitizedModel[key] = this.model[key]
        }
      })
      return sanitizedModel
    },
    isFormComplete() {
      return this.model.facilityType && this.totalOperationalCost > 0 && this.isFinancialDocsUploaded
    },
    totalOperationalCost() {
      const costsModel = Object.assign({}, this.model)
      delete costsModel?.facilityType
      return Object.values(costsModel).reduce((total, cost) => total + Number(cost), 0)
    },
    isRentLease() {
      return this.model.facilityType === FACILITY_TYPES.RENT_LEASE
    },
    isFinancialDocsUploaded() {
      const isFinancialStatementUploaded = !isEmpty(this.financialStatement?.documentsToUpload) || !isEmpty(this.financialStatement?.uploadedDocuments)
      const isBalanceSheetUploaded = !isEmpty(this.balanceSheet?.documentsToUpload) || !isEmpty(this.balanceSheet?.uploadedDocuments)
      return isFinancialStatementUploaded && isBalanceSheetUploaded
    },
    isSupportingDocsUploaded() {
      return !isEmpty(this.supporting?.documentsToUpload) || !isEmpty(this.supporting?.uploadedDocuments)
    },
    isDocumentsToProcess() {
      const isFinancialDocsToProcess = !isEmpty(this.financialStatement?.documentsToUpload) || !isEmpty(this.financialStatement?.documentsToDelete)
      const isBalanceSheetToProcess = !isEmpty(this.balanceSheet?.documentsToUpload) || !isEmpty(this.balanceSheet?.documentsToDelete)
      const isSupportingDocsToProcess = !isEmpty(this.supporting?.documentsToUpload) || !isEmpty(this.supporting?.documentsToDelete)
      return isFinancialDocsToProcess || isBalanceSheetToProcess || isSupportingDocsToProcess
    },
  },

  watch: {
    isFormComplete: {
      handler(value) {
        if (this.processing) return
        this.isOperatingCostsComplete = value
      },
    },
    back: {
      handler() {
        this.$router.push({ name: APPLICATION_ROUTES.SERVICE_DELIVERY, params: { applicationGuid: this.$route.params.applicationGuid } })
      },
    },
    save: {
      async handler() {
        await this.saveApplication(true)
      },
    },
    next: {
      handler() {
        this.$router.push({ name: APPLICATION_ROUTES.STAFFING, params: { applicationGuid: this.$route.params.applicationGuid } })
      },
    },
  },

  created() {
    this.$emit('process', false)
    this.model.facilityType = this.currentApplication?.facilityType
    this.FACILITY_TYPE_INFO_TXT = 'This is a placeholder message'
    this.APPLICATION_ERROR_MESSAGES = APPLICATION_ERROR_MESSAGES
    this.DOCUMENT_TYPES = DOCUMENT_TYPES
    this.SUPPORTED_DOCUMENTS_MESSAGE = SUPPORTED_DOCUMENTS_MESSAGE
    this.getUploadedDocuments(this.currentApplication?.uploadedDocuments)
  },

  async mounted() {
    if (this.validation) {
      await this.$refs.form?.validate()
    }
  },

  methods: {
    ...mapActions(useApplicationsStore, ['getApplication']),

    // Only service providers who rent, or lease space need to upload documents (i.e.: a copy of my rent/lease agreement).
    async saveApplication(showAlert = false) {
      try {
        let reloadApplication = false
        this.$emit('process', true)
        this.processing = true
        if (this.isDocumentsToProcess) {
          const reload = await this.processDocuments()
          if (reload) reloadApplication = true
        }
        if (ApplicationService.isApplicationUpdated(this.sanitizedModel)) {
          await ApplicationService.updateApplication(this.$route.params.applicationGuid, this.sanitizedModel)
          reloadApplication = true
        }
        if (reloadApplication) {
          await this.getApplication(this.$route.params.applicationGuid)
          this.getUploadedDocuments(this.currentApplication?.uploadedDocuments)
        }
        if (showAlert) {
          this.setSuccessAlert('Application saved successfully')
        }
      } catch (error) {
        if (error?.response?.data?.status === 422) {
          this.setFailureAlert(VIRUS_SCAN_ERROR_MESSAGE, error)
        } else {
          this.setFailureAlert('Failed to save your application', error)
        }
      } finally {
        this.processing = false
        this.$emit('process', false)
      }
    },

    async deleteUploadedDocument(documentId, documentType) {
      if (Object.values(this.DOCUMENT_TYPES).includes(documentType)) {
        this.deleteDocumentFromType(documentId, documentType)
      } else {
        throw Error('Invalid document type')
      }
    },

    deleteDocumentFromType(documentId, documentType) {
      const docTypeMapping = {
        [this.DOCUMENT_TYPES.FINANCIAL_STATEMENT]: this.financialStatement,
        [this.DOCUMENT_TYPES.BALANCE_SHEET]: this.balanceSheet,
        [this.DOCUMENT_TYPES.SUPPORTING_DOCS]: this.supporting,
      }
      const docTypeObj = docTypeMapping[documentType]
      if (docTypeObj) {
        const index = docTypeObj.uploadedDocuments.findIndex((item) => item.documentId === documentId)
        if (index > -1) {
          docTypeObj.documentsToDelete.push(documentId)
          docTypeObj.uploadedDocuments.splice(index, 1)
        }
      } else {
        throw Error('Invalid document type')
      }
    },

    async processDocuments() {
      const documentTypes = [this.financialStatement, this.balanceSheet, this.supporting]
      let atLeastOneDocumentProcessed = false
      for (const docType of documentTypes) {
        if (!isEmpty(docType.documentsToUpload) || !isEmpty(docType.documentsToDelete)) {
          await this.processDocumentType(docType)
          atLeastOneDocumentProcessed = true
        }
      }
      return atLeastOneDocumentProcessed
    },

    async processDocumentType(docTypeObj) {
      if (!isEmpty(docTypeObj.documentsToUpload)) {
        await DocumentService.createDocuments(docTypeObj.documentsToUpload, this.$route.params.applicationGuid)
        docTypeObj.documentsToUpload = []
      }
      if (!isEmpty(docTypeObj.documentsToDelete)) {
        await Promise.all(
          docTypeObj.documentsToDelete.map(async (documentId) => {
            await DocumentService.deleteDocument(documentId)
          }),
        )
        docTypeObj.documentsToDelete = []
      }
    },

    updateModel(updatedModel) {
      Object.entries(updatedModel)?.forEach(([key, value]) => (this.model[key] = Number(value)))
    },

    getUploadedDocuments(uploadedDocuments) {
      this.financialStatement.uploadedDocuments = uploadedDocuments?.filter((doc) => doc.documentType === DOCUMENT_TYPES.FINANCIAL_STATEMENT)
      this.balanceSheet.uploadedDocuments = uploadedDocuments?.filter((doc) => doc.documentType === DOCUMENT_TYPES.BALANCE_SHEET)
      this.supporting.uploadedDocuments = uploadedDocuments?.filter((doc) => doc.documentType === DOCUMENT_TYPES.SUPPORTING_DOCS)
    },
  },
}
</script>
