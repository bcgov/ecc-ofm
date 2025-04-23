<template>
  <v-container fluid class="pa-2 pb-0">
    <template v-if="!readonly">
      <AppMissingInfoError
        v-if="isEmpty(currentApplication?.licences) || !isCCOFMissingDetailComplete()"
        :to="{ name: APPLICATION_ROUTES.SERVICE_DELIVERY, hash: '#account-management', params: { applicationGuid: $route.params.applicationGuid } }">
        {{ APPLICATION_ERROR_MESSAGES.LICENCE_INFO }}
      </AppMissingInfoError>
      <AppMissingInfoError v-else-if="!isSplitClassroomComplete()" :to="{ name: APPLICATION_ROUTES.SERVICE_DELIVERY, params: { applicationGuid: $route.params.applicationGuid } }">
        {{ APPLICATION_ERROR_MESSAGES.SPLIT_CLASSROOM_INFO }}
      </AppMissingInfoError>
      <AppMissingInfoError
        v-else-if="!currentApplication?.licenceDeclaration"
        :to="{ name: APPLICATION_ROUTES.SERVICE_DELIVERY, hash: '#confirmation', params: { applicationGuid: $route.params.applicationGuid } }">
        {{ APPLICATION_ERROR_MESSAGES.LICENCE_CONFIRMATION }}
      </AppMissingInfoError>
    </template>
    <v-expansion-panels v-if="showSummary" v-model="panel" multiple>
      <v-expansion-panel v-for="licence in licences" :key="licence.licenceId" :value="licence.licenceId">
        <v-expansion-panel-title>
          <LicenceHeader :licence="licence" />
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          <v-card>
            <LicenceDetails :licence="licence" :read-only="true" />
          </v-card>
          <v-card class="mt-4">
            <AppDocumentUpload class="pa-4" :readonly="true" :document-label="DOCUMENT_LABELS.LICENCE" :document-type="`Licence ${licence.licence}`" :uploaded-documents="getLicenceDocument(licence)">
              <AppMissingInfoError
                v-if="!readonly && !getLicenceDocument(licence)?.length"
                :to="{ name: APPLICATION_ROUTES.SERVICE_DELIVERY, hash: `#${licence.licenceId}`, params: { applicationGuid: $route.params.applicationGuid } }">
                {{ APPLICATION_ERROR_MESSAGES.DOCUMENT_LICENCE_UPLOAD }}
              </AppMissingInfoError>
            </AppDocumentUpload>
          </v-card>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>

    <v-card class="mt-4">
      <AppDocumentUpload
        class="pa-4"
        :readonly="true"
        :document-label="DOCUMENT_LABELS.HEALTH_AUTHORITY_REPORT"
        :document-type="DOCUMENT_TYPES.HEALTH_AUTHORITY_REPORT"
        :uploaded-documents="healthAuthorityReportDocument">
        <AppMissingInfoError
          v-if="!readonly && !isHealthAuthorityReportUploaded()"
          :to="{ name: APPLICATION_ROUTES.SERVICE_DELIVERY, hash: '#health-authority-report-upload', params: { applicationGuid: $route.params.applicationGuid } }">
          {{ APPLICATION_ERROR_MESSAGES.DOCUMENT_HA_REPORT_UPLOAD }}
        </AppMissingInfoError>
      </AppDocumentUpload>
      <AppDocumentUpload
        class="pa-4"
        :readonly="true"
        :document-label="DOCUMENT_LABELS.POLICY_PROCEDURE_MANUAL"
        :document-type="DOCUMENT_TYPES.POLICY_PROCEDURE_MANUAL"
        :uploaded-documents="policyProcedureManualDocument">
        <AppMissingInfoError
          v-if="!readonly && !isPolicyProcedureManualUploaded()"
          :to="{ name: APPLICATION_ROUTES.SERVICE_DELIVERY, hash: '#policy-and-procedure-upload', params: { applicationGuid: $route.params.applicationGuid } }">
          {{ APPLICATION_ERROR_MESSAGES.DOCUMENT_POLICY_PROCEDURE_UPLOAD }}
        </AppMissingInfoError>
      </AppDocumentUpload>
    </v-card>
  </v-container>
</template>

<script>
import { isEmpty } from 'lodash'
import { mapState, mapActions } from 'pinia'

import AppDocumentUpload from '@/components/ui/AppDocumentUpload.vue'
import AppMissingInfoError from '@/components/ui/AppMissingInfoError.vue'
import { useApplicationsStore } from '@/stores/applications'
import LicenceHeader from '@/components/licences/LicenceHeader.vue'
import LicenceDetails from '@/components/licences/LicenceDetails.vue'
import { APPLICATION_ERROR_MESSAGES, APPLICATION_ROUTES, DOCUMENT_LABELS, DOCUMENT_TYPES } from '@/utils/constants'

export default {
  components: { AppDocumentUpload, AppMissingInfoError, LicenceHeader, LicenceDetails },
  props: {
    readonly: {
      type: Boolean,
      default: false,
    },
    licences: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      panel: [],
    }
  },
  computed: {
    ...mapState(useApplicationsStore, ['currentApplication']),
    allLicenceIDs() {
      return this.licences?.map((licence) => licence.licenceId)
    },
    showSummary() {
      return !isEmpty(this.currentApplication?.licences) && (this.readonly || this.isLicenceDetailComplete())
    },
    healthAuthorityReportDocument() {
      return this.currentApplication?.uploadedDocuments?.filter((document) => document.documentType?.includes(DOCUMENT_TYPES.HEALTH_AUTHORITY_REPORT))
    },
    policyProcedureManualDocument() {
      return this.currentApplication?.uploadedDocuments?.filter((document) => document.documentType?.includes(DOCUMENT_TYPES.POLICY_PROCEDURE_MANUAL))
    },
  },
  async created() {
    this.panel = this.allLicenceIDs
    this.APPLICATION_ERROR_MESSAGES = APPLICATION_ERROR_MESSAGES
    this.APPLICATION_ROUTES = APPLICATION_ROUTES
    this.DOCUMENT_LABELS = DOCUMENT_LABELS
    this.DOCUMENT_TYPES = DOCUMENT_TYPES
  },
  methods: {
    ...mapActions(useApplicationsStore, ['isCCOFMissingDetailComplete', 'isSplitClassroomComplete', 'isLicenceDetailComplete', 'isHealthAuthorityReportUploaded', 'isPolicyProcedureManualUploaded']),
    isEmpty,
    getLicenceDocument(licence) {
      return this.currentApplication?.uploadedDocuments?.filter((document) => document.documentType?.includes(licence?.licence))
    },
  },
}
</script>
