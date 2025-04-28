<template>
  <v-form ref="form">
    <div class="mt-4"><strong>Please provide operating costs for the selected facility:</strong></div>
    <!-- SELECT FACILITY TYPE -->
    <v-row id="facility-types" no-gutters class="mt-4">
      <v-col cols="12" md="3" lg="2" xxl="1" class="mt-4">
        <AppLabel>Facility Type:</AppLabel>
      </v-col>
      <v-col cols="10" md="7" lg="5" xxl="3" class="mt-3">
        <v-select
          id="select-facility-types"
          v-model="facilityType"
          :items="facilityTypes"
          :disabled="readonly"
          item-title="description"
          item-value="id"
          label="Select a facility type"
          :rules="rules.required"
          density="compact"
          variant="outlined"></v-select>
      </v-col>
      <v-col v-if="facilityTypeTooltip" cols="2" md="2" lg="1" class="mt-4" align="center">
        <v-tooltip content-class="tooltip" :text="facilityTypeTooltip" max-width="300px">
          <template #activator="{ props }">
            <v-icon size="large" v-bind="props">mdi-information-slab-circle-outline</v-icon>
          </template>
        </v-tooltip>
      </v-col>
    </v-row>

    <div v-if="facilityType">
      <!-- RENT/LEASE INFORMATION -->
      <RentLeaseInformation v-if="isRentLease" id="rent-lease-info" :readonly="readonly" @update="updateRentLeaseInfoModel" />

      <!-- OPERATING COST / FACILITY COST -->
      <v-card class="my-4 px-6 py-4">
        <AppMissingInfoError v-if="showErrorMessage && totalOperationalCost === 0">{{ APPLICATION_ERROR_MESSAGES.OPERATIONAL_COST }}</AppMissingInfoError>
        <YearlyOperatingCost id="yearly-operating-cost" :readonly="readonly" @update="updateCostsModel" />
        <YearlyFacilityCost id="yearly-facility-cost" :readonly="readonly" :facility-type="facilityType" @update="updateCostsModel" />
      </v-card>

      <!-- UPLOAD DOCUMENTS -->
      <v-card class="my-6 px-6 py-4">
        <h4>Upload Documents</h4>
        <div>{{ SUPPORTED_DOCUMENTS_MESSAGE }}</div>
        <AppMissingInfoError v-if="showErrorMessage && isRentLease && !isRentLeaseDocsUploaded">
          {{ APPLICATION_ERROR_MESSAGES.DOCUMENT_RENT_LEASE_UPLOAD }}
        </AppMissingInfoError>
        <AppMissingInfoError v-if="showErrorMessage && isOwnedWithMortgage && !isMortgageDocsUploaded">
          {{ APPLICATION_ERROR_MESSAGES.DOCUMENT_MORTGAGE_UPLOAD }}
        </AppMissingInfoError>
        <AppMissingInfoError v-if="showErrorMessage && isRentLease && !isRenewal && (!isFinancialDocsUploaded || !isBalanceSheetUploaded)">
          {{ APPLICATION_ERROR_MESSAGES.DOCUMENT_FINANCIAL_UPLOAD }}
        </AppMissingInfoError>
        <v-card class="mt-2 pa-4" variant="outlined">
          <div class="grey-card mt-2">
            <v-card v-if="isRentLease" class="mb-4 pa-4">
              <AppDocumentUpload
                id="rent-lease-agreement-upload"
                v-model="rentLeaseAgreement.documentsToUpload"
                entity-name="ofm_applications"
                :document-type="DOCUMENT_TYPES.RENT_LEASE_AGREEMENT"
                :document-help-text="'The document upload must be the official rent/lease agreement signed by both parties.'"
                :loading="processing"
                :readonly="readonly"
                :uploaded-documents="rentLeaseAgreement.uploadedDocuments"
                @delete-uploaded-document="deleteUploadedDocument" />
            </v-card>
            <v-card v-if="isOwnedWithMortgage" class="mb-4 pa-4">
              <AppDocumentUpload
                id="mortgage-statement-upload"
                v-model="mortgageStatement.documentsToUpload"
                entity-name="ofm_applications"
                :document-type="DOCUMENT_TYPES.MORTGAGE_STATEMENT"
                :loading="processing"
                :readonly="readonly"
                :uploaded-documents="mortgageStatement.uploadedDocuments"
                @delete-uploaded-document="deleteUploadedDocument"></AppDocumentUpload>
            </v-card>
            <v-card v-if="!isRenewal" class="mb-4 pa-4">
              <AppDocumentUpload
                id="financial-document-upload"
                v-model="financialStatement.documentsToUpload"
                entity-name="ofm_applications"
                :document-type="DOCUMENT_TYPES.INCOME_STATEMENT"
                :loading="processing"
                :readonly="readonly"
                :uploaded-documents="financialStatement.uploadedDocuments"
                @delete-uploaded-document="deleteUploadedDocument"></AppDocumentUpload>
            </v-card>
            <v-card v-if="!isRenewal" class="mb-4 pa-4">
              <AppDocumentUpload
                id="balance-sheet-document-upload"
                v-model="balanceSheet.documentsToUpload"
                entity-name="ofm_applications"
                :document-type="DOCUMENT_TYPES.BALANCE_SHEET"
                :loading="processing"
                :readonly="readonly"
                :uploaded-documents="balanceSheet.uploadedDocuments"
                @delete-uploaded-document="deleteUploadedDocument"></AppDocumentUpload>
            </v-card>
            <v-card class="pa-4">
              <AppDocumentUpload
                id="supporting-document-upload"
                v-model="supporting.documentsToUpload"
                entity-name="ofm_applications"
                :document-type="DOCUMENT_TYPES.SUPPORTING_DOCS"
                :loading="processing"
                :readonly="readonly"
                :uploaded-documents="supporting.uploadedDocuments"
                @delete-uploaded-document="deleteUploadedDocument" />
            </v-card>
          </div>
        </v-card>
      </v-card>
    </div>
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
import RentLeaseInformation from '@/components/applications/RentLeaseInformation.vue'
import YearlyOperatingCost from '@/components/applications/YearlyOperatingCost.vue'
import YearlyFacilityCost from '@/components/applications/YearlyFacilityCost.vue'
import {
  FACILITY_TYPES,
  APPLICATION_ERROR_MESSAGES,
  APPLICATION_ROUTES,
  VIRUS_SCAN_ERROR_MESSAGE,
  DOCUMENT_TYPES,
  SUPPORTED_DOCUMENTS_MESSAGE,
  YES_NO_CHOICE_CRM_MAPPING,
  RENEWAL_ROUTES,
} from '@/utils/constants'

export default {
  name: 'OperatingCostsView',
  components: { AppLabel, AppDocumentUpload, AppMissingInfoError, RentLeaseInformation, YearlyOperatingCost, YearlyFacilityCost },
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
      facilityType: null,
      costsModel: {},
      rentLeaseInfoModel: {},
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
      mortgageStatement: {
        uploadedDocuments: [],
        documentsToUpload: [],
        documentsToDelete: [],
      },
      rentLeaseAgreement: {
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
    isRenewal() {
      return !!this.$route.meta.isRenewal
    },
    sanitizedCostsModel() {
      const sanitizedModel = {}
      Object.keys(this.costsModel)?.forEach((key) => {
        if (Number(this.costsModel[key]) <= 5000000) {
          sanitizedModel[key] = this.costsModel[key]
        }
      })
      return sanitizedModel
    },
    isFormComplete() {
      const applicationDocsUploaded = this.isRenewal ? true : this.isFinancialDocsUploaded && this.isBalanceSheetUploaded
      return (
        !!this.facilityType &&
        this.isRentLeaseInformationComplete &&
        this.totalOperationalCost > 0 &&
        applicationDocsUploaded &&
        ((this.isRentLease && this.isRentLeaseDocsUploaded) || (this.isOwnedWithMortgage && this.isMortgageDocsUploaded) || (!this.isRentLease && !this.isOwnedWithMortgage))
      )
    },
    isRentLeaseInformationComplete() {
      return (
        !this.isRentLease ||
        (this.rentLeaseInfoModel?.armsLength === YES_NO_CHOICE_CRM_MAPPING.YES &&
          (this.rentLeaseInfoModel?.monthToMonthRentLease === YES_NO_CHOICE_CRM_MAPPING.YES || (this.rentLeaseInfoModel?.rentLeaseStartDate && this.rentLeaseInfoModel?.rentLeaseEndDate)))
      )
    },
    totalOperationalCost() {
      return Object.values(this.costsModel).reduce((total, cost) => total + Number(cost), 0)
    },
    isFinancialDocsUploaded() {
      return !isEmpty(this.financialStatement?.documentsToUpload) || !isEmpty(this.financialStatement?.uploadedDocuments)
    },
    isBalanceSheetUploaded() {
      return !isEmpty(this.balanceSheet?.documentsToUpload) || !isEmpty(this.balanceSheet?.uploadedDocuments)
    },
    isRentLease() {
      return this.facilityType === FACILITY_TYPES.RENT_LEASE
    },
    isOwnedWithMortgage() {
      return this.facilityType === FACILITY_TYPES.OWNED_WITH_MORTGAGE
    },
    isSupportingDocsUploaded() {
      return !isEmpty(this.supporting?.documentsToUpload) || !isEmpty(this.supporting?.uploadedDocuments)
    },
    isRentLeaseDocsUploaded() {
      return !isEmpty(this.rentLeaseAgreement?.documentsToUpload) || !isEmpty(this.rentLeaseAgreement?.uploadedDocuments)
    },
    isMortgageDocsUploaded() {
      return !isEmpty(this.mortgageStatement?.documentsToUpload) || !isEmpty(this.mortgageStatement?.uploadedDocuments)
    },
    isDocumentsToProcess() {
      const isFinancialDocsToProcess = !isEmpty(this.financialStatement?.documentsToUpload) || !isEmpty(this.financialStatement?.documentsToDelete)
      const isBalanceSheetToProcess = !isEmpty(this.balanceSheet?.documentsToUpload) || !isEmpty(this.balanceSheet?.documentsToDelete)
      const isRentLeaseAgreementToProcess = !isEmpty(this.rentLeaseAgreement?.documentsToUpload) || !isEmpty(this.rentLeaseAgreement?.documentsToDelete)
      const isMortgageStatementToProcess = !isEmpty(this.mortgageStatement?.documentsToUpload) || !isEmpty(this.mortgageStatement?.documentsToDelete)
      const isSupportingDocsToProcess = !isEmpty(this.supporting?.documentsToUpload) || !isEmpty(this.supporting?.documentsToDelete)
      return isRentLeaseAgreementToProcess || isMortgageStatementToProcess || isSupportingDocsToProcess || isFinancialDocsToProcess || isBalanceSheetToProcess
    },
    showErrorMessage() {
      return !this.readonly && !this.processing && this.validation
    },
    facilityTypeTooltip() {
      switch (this.facilityType) {
        case FACILITY_TYPES.RENT_LEASE:
          return 'If you rent or lease the child care facility, please enter the payment details.'
        case FACILITY_TYPES.OWNED_WITH_MORTGAGE:
          return 'If you own the building and have a monthly mortgage payment for child care facility, please enter the payment details. Corporations, partnerships, sole proprietor participants (excluding home-based providers) are not eligible for this expense.'
        case FACILITY_TYPES.OWNED_WITHOUT_MORTGAGE:
          return 'If you own the building and do not have a monthly mortgage payment for child care facility, cost details are not needed. Corporations, partnerships, sole proprietor participants (excluding home-based providers) are not eligible for this expense.'
        case FACILITY_TYPES.PROVIDED_FREE_OF_CHARGE:
          return 'If you use the child care facility for free, the cost details are not needed.'
        default:
          return null
      }
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
        this.$router.push({
          name: this.isRenewal ? RENEWAL_ROUTES.SERVICE_DELIVERY : APPLICATION_ROUTES.SERVICE_DELIVERY,
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
          name: this.isRenewal ? RENEWAL_ROUTES.STAFFING : APPLICATION_ROUTES.STAFFING,
          params: { applicationGuid: this.$route.params.applicationGuid },
        })
      },
    },
  },

  created() {
    this.$emit('process', false)
    this.facilityType = this.currentApplication?.facilityType
    this.APPLICATION_ERROR_MESSAGES = APPLICATION_ERROR_MESSAGES
    this.DOCUMENT_TYPES = DOCUMENT_TYPES
    this.SUPPORTED_DOCUMENTS_MESSAGE = SUPPORTED_DOCUMENTS_MESSAGE
    this.YES_NO_CHOICE_CRM_MAPPING = YES_NO_CHOICE_CRM_MAPPING
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
        const payload = {
          facilityType: this.facilityType,
          ...this.rentLeaseInfoModel,
          ...this.sanitizedCostsModel,
        }

        if (ApplicationService.isApplicationUpdated(payload)) {
          await ApplicationService.updateApplication(this.$route.params.applicationGuid, payload)
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
        [this.DOCUMENT_TYPES.INCOME_STATEMENT]: this.financialStatement,
        [this.DOCUMENT_TYPES.BALANCE_SHEET]: this.balanceSheet,
        [this.DOCUMENT_TYPES.MORTGAGE_STATEMENT]: this.mortgageStatement,
        [this.DOCUMENT_TYPES.RENT_LEASE_AGREEMENT]: this.rentLeaseAgreement,
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
      const documentTypes = [this.financialStatement, this.balanceSheet, this.mortgageStatement, this.rentLeaseAgreement, this.supporting]
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

    updateRentLeaseInfoModel(updatedModel) {
      const isEndDateAfterStartDate = updatedModel.rentLeaseEndDate > updatedModel.rentLeaseStartDate
      this.rentLeaseInfoModel.rentLeaseStartDate = isEndDateAfterStartDate ? updatedModel?.rentLeaseStartDate : null
      this.rentLeaseInfoModel.rentLeaseEndDate = isEndDateAfterStartDate ? updatedModel?.rentLeaseEndDate : null
      this.rentLeaseInfoModel.monthToMonthRentLease = updatedModel?.monthToMonthRentLease
      this.rentLeaseInfoModel.armsLength = updatedModel?.armsLength
    },

    updateCostsModel(updatedModel) {
      Object.entries(updatedModel)?.forEach(([key, value]) => (this.costsModel[key] = Number(value)))
    },

    getUploadedDocuments(uploadedDocuments) {
      this.financialStatement.uploadedDocuments = uploadedDocuments?.filter((doc) => doc.documentType === DOCUMENT_TYPES.INCOME_STATEMENT)
      this.balanceSheet.uploadedDocuments = uploadedDocuments?.filter((doc) => doc.documentType === DOCUMENT_TYPES.BALANCE_SHEET)
      this.mortgageStatement.uploadedDocuments = uploadedDocuments?.filter((doc) => doc.documentType === DOCUMENT_TYPES.MORTGAGE_STATEMENT)
      this.rentLeaseAgreement.uploadedDocuments = uploadedDocuments?.filter((doc) => doc.documentType === DOCUMENT_TYPES.RENT_LEASE_AGREEMENT)
      this.supporting.uploadedDocuments = uploadedDocuments?.filter((doc) => doc.documentType === DOCUMENT_TYPES.SUPPORTING_DOCS)
    },
  },
}
</script>
