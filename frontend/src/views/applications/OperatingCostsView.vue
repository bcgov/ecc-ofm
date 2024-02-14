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
          :disabled="readonly || processing"
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
      <YearlyOperatingCost id="yearly-operating-cost" :readonly="readonly || processing" @update="updateModel" />
      <YearlyFacilityCost id="yearly-facility-cost" :readonly="readonly || processing" :facilityType="model.facilityType" @update="updateModel" />
      <div v-if="isRentLease" no-gutters class="pb-6">
        <AppLabel>Supporting Documents</AppLabel>
        <AppMissingInfoError v-if="validation && !isDocumentUploaded">{{ APPLICATION_ERROR_MESSAGES.DOCUMENT_UPLOAD }}</AppMissingInfoError>
        <AppDocumentUpload
          id="application-document-upload"
          entityName="ofm_applications"
          :loading="processing"
          :readonly="readonly"
          :uploadedDocuments="uploadedDocuments"
          @updateDocuments="updateDocumentsToUpload"
          @deleteUploadedDocument="deleteUploadedDocument"></AppDocumentUpload>
      </div>
    </div>
  </v-form>
</template>

<script>
import { useAppStore } from '@/stores/app'
import { useApplicationsStore } from '@/stores/applications'
import { mapState, mapWritableState, mapActions } from 'pinia'
import { APPLICATION_STATUS_CODES } from '@/utils/constants'
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
import { FACILITY_TYPES, APPLICATION_ERROR_MESSAGES } from '@/utils/constants'

export default {
  name: 'OperatingCostsView',
  components: { AppLabel, AppDocumentUpload, AppMissingInfoError, YearlyOperatingCost, YearlyFacilityCost },
  mixins: [alertMixin],
  async beforeRouteLeave(_to, _from, next) {
    this.processing = true
    if (!this.readonly) {
      await this.saveApplication()
    }
    next()
  },
  props: {
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
      uploadedDocuments: [],
      documentsToUpload: [],
      documentsToDelete: [],
      processing: false,
    }
  },
  computed: {
    ...mapState(useAppStore, ['facilityTypes']),
    ...mapState(useApplicationsStore, ['currentApplication', 'validation']),
    ...mapWritableState(useApplicationsStore, ['isOperatingCostsComplete']),
    readonly() {
      return this.currentApplication?.statusCode != APPLICATION_STATUS_CODES.DRAFT
    },
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
      return this.model.facilityType && this.totalOperationalCost > 0 && this.isDocumentUploaded
    },
    totalOperationalCost() {
      const costsModel = Object.assign({}, this.model)
      delete costsModel?.facilityType
      return Object.values(costsModel).reduce((total, cost) => total + Number(cost), 0)
    },
    isRentLease() {
      return this.model.facilityType === FACILITY_TYPES.RENT_LEASE
    },
    isDocumentUploaded() {
      return !this.isRentLease || (this.isRentLease && (!isEmpty(this.documentsToUpload) || !isEmpty(this.uploadedDocuments)))
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
        this.$router.push({ name: 'service-delivery', params: { applicationGuid: this.$route.params.applicationGuid } })
      },
    },
    save: {
      async handler() {
        await this.saveApplication(true)
      },
    },
    next: {
      handler() {
        this.$router.push({ name: 'staffing', params: { applicationGuid: this.$route.params.applicationGuid } })
      },
    },
  },
  async created() {
    this.model.facilityType = this.currentApplication?.facilityType
    this.FACILITY_TYPE_INFO_TXT = 'This is a placeholder message'
    this.APPLICATION_ERROR_MESSAGES = APPLICATION_ERROR_MESSAGES
    await this.getDocuments()
  },
  async mounted() {
    if (this.validation) {
      await this.$refs.form?.validate()
    }
  },
  methods: {
    ...mapActions(useApplicationsStore, ['getApplication']),

    async saveApplication(showAlert = false) {
      try {
        this.$emit('process', true)
        this.processing = true
        await this.processDocuments()
        if (ApplicationService.isApplicationUpdated(this.sanitizedModel)) {
          await ApplicationService.updateApplication(this.$route.params.applicationGuid, this.sanitizedModel)
          await this.getApplication(this.$route.params.applicationGuid)
        }
        if (showAlert) {
          this.setSuccessAlert('Application saved successfully')
        }
      } catch (error) {
        this.setFailureAlert('Failed to save your application', error)
      } finally {
        this.processing = false
        this.$emit('process', false)
      }
    },

    async getDocuments() {
      try {
        this.$emit('process', true)
        this.processing = true
        this.uploadedDocuments = await DocumentService.getDocuments(this.$route.params.applicationGuid)
      } catch (error) {
        this.setFailureAlert('Failed to retrieve supporting documents', error)
      } finally {
        this.processing = false
        this.$emit('process', false)
      }
    },

    updateDocumentsToUpload({ documents, areValidFilesUploaded }) {
      this.documentsToUpload = documents?.filter((document) => document.isValidFile && document.file)
    },

    async deleteUploadedDocument(documentId) {
      const index = this.uploadedDocuments.findIndex((item) => item.documentId === documentId)
      if (index > -1) {
        this.documentsToDelete.push(documentId)
        this.uploadedDocuments.splice(index, 1)
      }
    },

    // Only service providers who rent, or lease space need to upload documents (i.e.: a copy of my rent/lease agreement).
    async processDocuments() {
      if (!this.isRentLease || (isEmpty(this.documentsToUpload) && isEmpty(this.documentsToDelete))) return
      if (!isEmpty(this.documentsToUpload)) {
        await DocumentService.createDocuments(this.documentsToUpload, this.$route.params.applicationGuid)
      }
      if (!isEmpty(this.documentsToDelete)) {
        await Promise.all(
          this.documentsToDelete.map(async (documentId) => {
            await DocumentService.deleteDocument(documentId)
          }),
        )
        this.documentsToDelete = []
      }
      await this.getDocuments()
    },

    updateModel(updatedModel) {
      Object.entries(updatedModel)?.forEach(([key, value]) => (this.model[key] = Number(value)))
    },
  },
}
</script>
