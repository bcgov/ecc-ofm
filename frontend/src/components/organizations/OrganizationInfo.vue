<template>
  <v-card class="my-4 pa-4" variant="outlined">
    <v-skeleton-loader :loading="loading" type="table-tbody">
      <v-container fluid class="pa-0">
        <v-row no-gutters class="mb-4">
          <v-col cols="12" md="6" lg="6">
            <v-card variant="outlined" class="card-outline fill-height">
              <v-row no-gutters>
                <v-col cols="12" sm="3" md="3" lg="3" class="ma-2">
                  <AppLabel>Organization legal name:</AppLabel>
                </v-col>
                <v-col cols="12" sm="8" md="8" lg="8" class="ma-2">
                  {{ organization?.name }}
                </v-col>
              </v-row>
              <v-row no-gutters>
                <v-col cols="12" sm="3" md="3" lg="3" class="ma-2">
                  <AppLabel>Doing business as:</AppLabel>
                </v-col>
                <v-col cols="12" sm="8" md="8" lg="8" class="ma-2">
                  {{ organization?.doingBusinessAsName }}
                </v-col>
              </v-row>
              <v-row no-gutters>
                <v-col cols="12" sm="3" md="3" lg="3" class="ma-2">
                  <AppLabel>Email address:</AppLabel>
                </v-col>
                <v-col cols="12" sm="8" md="8" lg="8" class="ma-2">
                  {{ organization?.email }}
                </v-col>
              </v-row>
              <v-row no-gutters>
                <v-col cols="12" sm="3" md="3" lg="3" class="ma-2">
                  <AppLabel>Phone (landline):</AppLabel>
                </v-col>
                <v-col cols="12" sm="8" md="8" lg="8" class="ma-2">
                  {{ organization?.phoneLandline }}
                </v-col>
              </v-row>
              <v-row no-gutters>
                <v-col cols="12" sm="3" md="3" lg="3" class="ma-2">
                  <AppLabel>Phone (cell):</AppLabel>
                </v-col>
                <v-col cols="12" sm="8" md="8" lg="8" class="ma-2">
                  {{ organization?.phoneCell }}
                </v-col>
              </v-row>
            </v-card>
          </v-col>
          <v-col cols="12" md="6" lg="6" class="mt-3 mt-md-0 pl-md-3">
            <v-card variant="outlined" class="card-outline fill-height">
              <v-row no-gutters>
                <v-col cols="12" sm="3" md="3" lg="3" class="ma-2">
                  <AppLabel>Mailing Address:</AppLabel>
                </v-col>
              </v-row>
              <v-row no-gutters>
                <v-col cols="12" sm="3" md="3" lg="3" class="ma-2">
                  <AppLabel>Street Address 1:</AppLabel>
                </v-col>
                <v-col cols="12" sm="8" md="8" lg="8" class="ma-2">
                  {{ organization?.isMailingAddressDifferent ? organization?.mailingStreetAddress1 : organization?.streetAddress1 }}
                </v-col>
              </v-row>
              <v-row no-gutters>
                <v-col cols="12" sm="3" md="3" lg="3" class="ma-2">
                  <AppLabel>Street Address 2:</AppLabel>
                </v-col>
                <v-col cols="12" sm="8" md="8" lg="8" class="ma-2">
                  {{ organization?.isMailingAddressDifferent ? organization?.mailingStreetAddress2 : organization?.streetAddress2 }}
                </v-col>
              </v-row>
              <v-row no-gutters>
                <v-col cols="auto" sm="auto" md="auto" lg="auto" class="ma-2">
                  <AppLabel>City:</AppLabel>
                </v-col>
                <v-col cols="3" class="ma-2">
                  {{ organization?.isMailingAddressDifferent ? organization?.mailingCity : organization?.city }}
                </v-col>
                <v-col cols="auto" class="ma-2">
                  <AppLabel>Prov:</AppLabel>
                </v-col>
                <v-col cols="auto" class="ma-2">
                  {{ organization?.isMailingAddressDifferent ? organization?.mailingProvince : organization?.province }}
                </v-col>
                <v-col cols="auto" class="ma-2">
                  <AppLabel>Postal Code:</AppLabel>
                </v-col>
                <v-col cols="2" class="ma-2">
                  {{ organization?.isMailingAddressDifferent ? organization?.mailingPostalCode : organization?.postalCode }}
                </v-col>
              </v-row>
              <v-row><v-col></v-col></v-row>
              <v-row no-gutters>
                <v-col cols="12" sm="3" class="ma-2">
                  <AppLabel>Physical Address:</AppLabel>
                </v-col>
              </v-row>
              <v-row no-gutters>
                <v-col cols="12" sm="3" md="3" lg="3" class="ma-2">
                  <AppLabel>Street Address 1:</AppLabel>
                </v-col>
                <v-col cols="12" sm="8" md="8" lg="8" class="ma-2">
                  {{ organization?.streetAddress1 }}
                </v-col>
              </v-row>
              <v-row no-gutters>
                <v-col cols="12" sm="3" md="2" lg="3" class="ma-2">
                  <AppLabel>Street Address 2:</AppLabel>
                </v-col>
                <v-col cols="12" sm="8" md="8" lg="8" class="ma-2">
                  {{ organization?.streetAddress2 }}
                </v-col>
              </v-row>
              <v-row no-gutters>
                <v-col cols="auto" class="ma-2">
                  <AppLabel>City:</AppLabel>
                </v-col>
                <v-col cols="3" class="ma-2">
                  {{ organization?.city }}
                </v-col>
                <v-col cols="auto" class="ma-2">
                  <AppLabel>Prov:</AppLabel>
                </v-col>
                <v-col cols="auto" class="ma-2">
                  {{ organization?.province }}
                </v-col>
                <v-col cols="auto" class="ma-2">
                  <AppLabel>Postal Code:</AppLabel>
                </v-col>
                <v-col cols="2" class="ma-2">
                  {{ organization?.postalCode }}
                </v-col>
              </v-row>
            </v-card>
          </v-col>
        </v-row>
        <v-skeleton-loader :loading="loadingInclusionPolicy" type="table-tbody">
          <v-card variant="outlined" class="card-outline pa-2 w-100">
            <div class="w-100">
              <v-row no-gutters>
                <v-col class="">
                  <AppLabel>Does your organization have an inclusion policy?</AppLabel>
                </v-col>
                <v-col class="mt-2">
                  <v-row v-if="editable && !editMode" justify="end">
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
                      <v-col cols="12" sm="2" md="1">
                        <v-radio :class="{ 'no-hover': !editMode }" label="Yes" :value="true"></v-radio>
                      </v-col>
                      <v-col cols="12" sm="2" md="1">
                        <v-radio :class="{ 'no-hover': !editMode }" label="No" :value="false"></v-radio>
                      </v-col>
                    </v-row>
                  </v-radio-group>
                  <template v-if="showDocuments">
                    <v-col cols="12" lg="10" xl="8" xxl="6" v-if="organizationEdit.hasInclusionPolicy" class="pt-0">
                      <AppLabel>Inclusion Policy Document:</AppLabel>
                      <AppDocumentUpload
                        id="inclusion-policy-upload"
                        ref="documentUpload"
                        v-model="documentsToUpload"
                        entityName="accounts"
                        :loading="loadingInclusionPolicy"
                        :readonly="!editMode"
                        :uploadedDocuments="uploadedDocumentsEdit"
                        @deleteUploadedDocument="deleteUploadedDocument" />
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
import AppLabel from '@/components/ui/AppLabel.vue'
import AppButton from '@/components/ui/AppButton.vue'
import AppDocumentUpload from '@/components/ui/AppDocumentUpload.vue'
import { isEmpty } from 'lodash'

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
.card-outline {
  border: 1px solid #dee2e6 !important;
}

.no-hover {
  pointer-events: none;
}
</style>
