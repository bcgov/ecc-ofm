<template>
  <v-card class="my-4 pa-4" variant="outlined">
    <v-skeleton-loader :loading="loading" type="table-tbody">
      <v-container fluid class="pa-0">
        <v-row no-gutters class="mb-4">
          <v-col cols="12" lg="6">
            <v-card variant="outlined" class="soft-outline fill-height px-2">
              <v-row no-gutters class="my-2">
                <v-col cols="12" sm="5" xl="4" xxl="3">
                  <AppLabel>Organization Legal Name:</AppLabel>
                </v-col>
                <v-col cols="12" sm="7" xl="8" xxl="9">
                  {{ organization?.name }}
                </v-col>
              </v-row>
              <v-row no-gutters class="my-2">
                <v-col cols="12" sm="5" xl="4" xxl="3">
                  <AppLabel>Doing Business As:</AppLabel>
                </v-col>
                <v-col cols="12" sm="7" xl="8" xxl="9">
                  {{ organization?.doingBusinessAsName }}
                </v-col>
              </v-row>
              <v-row no-gutters class="my-2">
                <v-col cols="12" sm="5" xl="4" xxl="3">
                  <AppLabel>Business Type:</AppLabel>
                </v-col>
                <v-col cols="12" sm="7" xl="8" xxl="9">
                  {{ getBusinessTypeNameById(organization?.businessTypeCode) }}
                </v-col>
              </v-row>
              <v-row no-gutters class="my-2">
                <v-col cols="12" sm="5" xl="4" xxl="3">
                  <AppLabel>Email Address:</AppLabel>
                </v-col>
                <v-col cols="12" sm="7" xl="8" xxl="9">
                  {{ organization?.email }}
                </v-col>
              </v-row>
              <v-row no-gutters class="my-2">
                <v-col cols="12" sm="5" xl="4" xxl="3">
                  <AppLabel>Phone (landline):</AppLabel>
                </v-col>
                <v-col cols="12" sm="7" xl="8" xxl="9">
                  {{ organization?.phoneLandline }}
                </v-col>
              </v-row>
              <v-row no-gutters class="my-2">
                <v-col cols="12" sm="5" xl="4" xxl="3">
                  <AppLabel>Phone (cell):</AppLabel>
                </v-col>
                <v-col cols="12" sm="7" xl="8" xxl="9">
                  {{ organization?.phoneCell }}
                </v-col>
              </v-row>
            </v-card>
          </v-col>
          <v-col cols="12" lg="6" class="mt-3 mt-lg-0 pl-lg-3">
            <v-card variant="outlined" class="soft-outline fill-height px-2">
              <v-row no-gutters class="my-2">
                <AppLabel>Mailing Address:</AppLabel>
              </v-row>
              <v-row no-gutters class="my-2">
                <v-col cols="12" sm="5" xl="4">
                  <AppLabel>Street Address 1:</AppLabel>
                </v-col>
                <v-col cols="12" sm="7" xl="8">
                  {{ organization?.isMailingAddressDifferent ? organization?.mailingStreetAddress1 : organization?.streetAddress1 }}
                </v-col>
              </v-row>
              <v-row no-gutters class="my-2">
                <v-col cols="12" sm="5" xl="4">
                  <AppLabel>Street Address 2:</AppLabel>
                </v-col>
                <v-col cols="12" sm="7" xl="8">
                  {{ organization?.isMailingAddressDifferent ? organization?.mailingStreetAddress2 : organization?.streetAddress2 }}
                </v-col>
              </v-row>
              <v-row no-gutters>
                <v-col cols="12" xl="4">
                  <v-row no-gutters>
                    <v-col cols="12" sm="5" xl="4" xxl="3">
                      <AppLabel>City:</AppLabel>
                    </v-col>
                    <v-col cols="12" sm="7" xl="8" xxl="9">
                      {{ organization?.isMailingAddressDifferent ? organization?.mailingCity : organization?.city }}
                    </v-col>
                  </v-row>
                </v-col>
                <v-col cols="12" xl="4" class="my-2 my-xl-0">
                  <v-row no-gutters>
                    <v-col cols="12" sm="5" xl="4" xxl="3">
                      <AppLabel>Province:</AppLabel>
                    </v-col>
                    <v-col cols="12" sm="7" xl="8" xxl="9">
                      {{ organization?.isMailingAddressDifferent ? organization?.mailingProvince : organization?.province }}
                    </v-col>
                  </v-row>
                </v-col>
                <v-col cols="12" xl="4">
                  <v-row no-gutters>
                    <v-col cols="12" sm="5" xxl="4">
                      <AppLabel>Postal Code:</AppLabel>
                    </v-col>
                    <v-col cols="12" sm="7" xxl="8">
                      {{ organization?.isMailingAddressDifferent ? organization?.mailingPostalCode : organization?.postalCode }}
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
              <v-row no-gutters class="mt-6 mt-xl-10 mb-2">
                <AppLabel>Physical Address:</AppLabel>
              </v-row>
              <v-row no-gutters class="my-2">
                <v-col cols="12" sm="5" xl="4">
                  <AppLabel>Street Address 1:</AppLabel>
                </v-col>
                <v-col cols="12" sm="7" xl="8">
                  {{ organization?.streetAddress1 }}
                </v-col>
              </v-row>
              <v-row no-gutters class="my-2">
                <v-col cols="12" sm="5" xl="4">
                  <AppLabel>Street Address 2:</AppLabel>
                </v-col>
                <v-col cols="12" sm="7" xl="8">
                  {{ organization?.streetAddress2 }}
                </v-col>
              </v-row>
              <v-row no-gutters class="my-2">
                <v-col cols="12" xl="4">
                  <v-row no-gutters>
                    <v-col cols="12" sm="5" xl="4" xxl="3">
                      <AppLabel>City:</AppLabel>
                    </v-col>
                    <v-col cols="12" sm="7" xl="8" xxl="9">
                      {{ organization?.city }}
                    </v-col>
                  </v-row>
                </v-col>
                <v-col cols="12" xl="4" class="my-2 my-xl-0">
                  <v-row no-gutters>
                    <v-col cols="12" sm="5" xl="4" xxl="3">
                      <AppLabel>Province:</AppLabel>
                    </v-col>
                    <v-col cols="12" sm="7" xl="8" xxl="9">
                      {{ organization?.province }}
                    </v-col>
                  </v-row>
                </v-col>
                <v-col cols="12" xl="4">
                  <v-row no-gutters>
                    <v-col cols="12" sm="5" xxl="4">
                      <AppLabel>Postal Code:</AppLabel>
                    </v-col>
                    <v-col cols="12" sm="7" xxl="8">
                      {{ organization?.postalCode }}
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
            </v-card>
          </v-col>
        </v-row>
        <v-skeleton-loader :loading="loadingInclusionPolicy" type="table-tbody">
          <v-card variant="outlined" class="soft-outline pa-2 w-100">
            <div class="w-100">
              <v-row no-gutters>
                <v-col class="">
                  <AppLabel>Does your organization have an inclusion policy?</AppLabel>
                </v-col>
                <v-col v-if="editable && !editMode" class="mt-2">
                  <v-row justify="end">
                    <AppButton id="edit-button" variant="text" :disabled="loading" @click="toggleEditMode()">
                      <v-icon icon="fa:fa-regular fa-edit" class="transaction-icon"></v-icon>
                    </AppButton>
                  </v-row>
                </v-col>
              </v-row>
              <v-row no-gutters>
                <v-col>
                  <v-radio-group v-model="organizationEdit.hasInclusionPolicy" :readonly="!editMode" hide-details>
                    <v-row no-gutters>
                      <v-col cols="12" sm="2" lg="1">
                        <v-radio :class="{ 'no-hover': !editMode }" label="Yes" :value="true"></v-radio>
                      </v-col>
                      <v-col cols="12" sm="2" lg="1">
                        <v-radio :class="{ 'no-hover': !editMode }" label="No" :value="false"></v-radio>
                      </v-col>
                    </v-row>
                  </v-radio-group>
                  <template v-if="showDocuments">
                    <v-col v-if="organizationEdit.hasInclusionPolicy" cols="12" lg="10" xl="8" xxl="6" class="pt-0">
                      <AppDocumentUpload
                        id="inclusion-policy-upload"
                        ref="documentUpload"
                        v-model="documentsToUpload"
                        :document-type="DOCUMENT_TYPES.INCLUSION_POLICY"
                        entity-name="accounts"
                        :loading="loadingInclusionPolicy"
                        :readonly="!editMode"
                        :uploaded-documents="uploadedDocumentsEdit"
                        @delete-uploaded-document="deleteUploadedDocument" />
                      <v-alert v-if="showUploadDocumentsAlert" density="compact" type="error" class="mt-1">
                        Please upload at least one document. To proceed, invoke 'Add File' button, 'Select a file' to upload. Then 'Save' to complete the process.
                      </v-alert>
                    </v-col>
                    <v-col v-else class="pt-0">
                      <v-icon size="30" color="amber">mdi-alert</v-icon>
                      This is a requirement to apply for Support Needs Allowance.
                    </v-col>
                  </template>
                  <v-col v-if="editMode" class="d-flex justify-end pt-0">
                    <AppButton id="cancel-edit" :primary="false" size="large" width="100px" :loading="loadingInclusionPolicy" class="mr-6" @click="toggleEditMode()">Cancel</AppButton>
                    <AppButton id="save" size="large" width="100px" :loading="loadingInclusionPolicy" :disabled="invalidInclusionPolicy" @click="save()">Save</AppButton>
                  </v-col>
                </v-col>
              </v-row>
            </div>
          </v-card>
        </v-skeleton-loader>
      </v-container>
    </v-skeleton-loader>
  </v-card>
</template>

<script>
import { isEmpty } from 'lodash'
import { mapState } from 'pinia'

import AppLabel from '@/components/ui/AppLabel.vue'
import AppButton from '@/components/ui/AppButton.vue'
import AppDocumentUpload from '@/components/ui/AppDocumentUpload.vue'
import { useAppStore } from '@/stores/app'
import { DOCUMENT_TYPES } from '@/utils/constants'

export default {
  components: { AppButton, AppLabel, AppDocumentUpload },
  props: {
    editable: {
      type: Boolean,
      default: false,
    },
    organization: {
      type: Object,
      required: true,
      default: () => {
        return {}
      },
    },
    uploadedDocuments: {
      type: Array,
      default: () => {
        return []
      },
    },
    showDocuments: {
      type: Boolean,
      default: false,
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['saveInclusionPolicyData'],
  data() {
    return {
      organizationEdit: {},
      editMode: false,
      uploadedDocumentsEdit: [],
      documentsToUpload: [],
      documentsToDelete: [],
      loadingInclusionPolicy: false,
    }
  },

  computed: {
    ...mapState(useAppStore, ['getBusinessTypeNameById']),
    documentsExistOrBeingAdded() {
      return !isEmpty(this.documentsToUpload) || !isEmpty(this.uploadedDocumentsEdit)
    },
    invalidInclusionPolicy() {
      return this.organizationEdit?.hasInclusionPolicy && !this.documentsExistOrBeingAdded
    },
    showUploadDocumentsAlert() {
      return this.editMode && this.invalidInclusionPolicy
    },
  },
  created() {
    this.DOCUMENT_TYPES = DOCUMENT_TYPES
  },

  updated() {
    this.initializeData()
  },

  methods: {
    initializeData() {
      this.organizationEdit.hasInclusionPolicy = this.organization.hasInclusionPolicy ?? false
      this.uploadedDocumentsEdit = JSON.parse(JSON.stringify(this.uploadedDocuments))
    },

    save() {
      if (!this.organizationEdit.hasInclusionPolicy) {
        this.documentsToUpload = []
        this.documentsToDelete = this.uploadedDocuments.map((document) => document.documentId)
      }
      this.loadingInclusionPolicy = true
      this.$emit('saveInclusionPolicyData', this.organizationEdit?.hasInclusionPolicy, this.documentsToUpload, this.documentsToDelete, this.onSaveCompleteCallBack)
    },

    onSaveCompleteCallBack() {
      this.initializeData()
      this.resetDocuments()
      this.editMode = false
      this.loadingInclusionPolicy = false
    },

    toggleEditMode() {
      this.editMode = !this.editMode
      if (!this.editMode) {
        this.initializeData()
        this.resetDocuments()
      }
    },

    async deleteUploadedDocument(documentId) {
      const index = this.uploadedDocumentsEdit.findIndex((item) => item.documentId === documentId)
      if (index > -1) {
        this.documentsToDelete.push(documentId)
        this.uploadedDocumentsEdit.splice(index, 1)
      }
    },

    resetDocuments() {
      this.documentsToUpload = []
      this.documentsToDelete = []
      this.$refs.documentUpload?.resetDocuments()
    },
  },
}
</script>

<style scoped>
.no-hover {
  pointer-events: none;
}
</style>
