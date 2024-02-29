<template>
  <v-card class="my-4 pa-4" variant="outlined">
    <v-skeleton-loader :loading="loadingAll" type="table-tbody">
      <v-container fluid class="pa-0">
        <v-row no-gutters>
          <v-col cols="11" md="6" lg="6">
            <v-card variant="outlined" class="card-outline mr-3 fill-height">
              <v-row no-gutters>
                <v-col cols="11" sm="3" md="3" lg="3" class="ma-2">
                  <AppLabel>Organization legal name:</AppLabel>
                </v-col>
                <v-col cols="11" sm="8" md="8" lg="8" class="ma-2">
                  {{ organization?.name }}
                </v-col>
              </v-row>
              <v-row no-gutters>
                <v-col cols="11" sm="3" md="3" lg="3" class="ma-2">
                  <AppLabel>Doing business as:</AppLabel>
                </v-col>
                <v-col cols="11" sm="8" md="8" lg="8" class="ma-2">
                  {{ organization?.businessType }}
                </v-col>
              </v-row>
              <v-row no-gutters>
                <v-col cols="11" sm="3" md="3" lg="3" class="ma-2">
                  <AppLabel>Email address:</AppLabel>
                </v-col>
                <v-col cols="11" sm="8" md="8" lg="8" class="ma-2">
                  {{ organization?.email }}
                </v-col>
              </v-row>
              <v-row no-gutters>
                <v-col cols="11" sm="3" md="3" lg="3" class="ma-2">
                  <AppLabel>Phone (landline):</AppLabel>
                </v-col>
                <v-col cols="11" sm="8" md="8" lg="8" class="ma-2">
                  {{ organization?.phoneLandline }}
                </v-col>
              </v-row>
              <v-row no-gutters>
                <v-col cols="11" sm="3" md="3" lg="3" class="ma-2">
                  <AppLabel>Phone (cell):</AppLabel>
                </v-col>
                <v-col cols="11" sm="8" md="8" lg="8" class="ma-2">
                  {{ organization?.phoneCell }}
                </v-col>
              </v-row>
            </v-card>
          </v-col>
          <v-col cols="11" md="6" lg="6">
            <v-card variant="outlined" class="card-outline fill-height">
              <v-row no-gutters>
                <v-col cols="11" sm="3" md="3" lg="3" class="ma-2">
                  <AppLabel>Mailing Address:</AppLabel>
                </v-col>
              </v-row>
              <v-row no-gutters>
                <v-col cols="11" sm="3" md="3" lg="3" class="ma-2">
                  <AppLabel>Street Address 1:</AppLabel>
                </v-col>
                <v-col cols="11" sm="8" md="8" lg="8" class="ma-2">
                  {{ organization?.isMailingAddressDifferent ? organization?.mailingStreetAddress1 : organization?.streetAddress1 }}
                </v-col>
              </v-row>
              <v-row no-gutters>
                <v-col cols="11" sm="3" md="3" lg="3" class="ma-2">
                  <AppLabel>Street Address 2:</AppLabel>
                </v-col>
                <v-col cols="11" sm="8" md="8" lg="8" class="ma-2">
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
                <v-col cols="11" sm="3" class="ma-2">
                  <AppLabel>Physical Address:</AppLabel>
                </v-col>
              </v-row>
              <v-row no-gutters>
                <v-col cols="11" sm="3" md="3" lg="3" class="ma-2">
                  <AppLabel>Street Address 1:</AppLabel>
                </v-col>
                <v-col cols="11" sm="8" md="8" lg="8" class="ma-2">
                  {{ organization?.streetAddress1 }}
                </v-col>
              </v-row>
              <v-row no-gutters>
                <v-col cols="11" sm="3" md="2" lg="3" class="ma-2">
                  <AppLabel>Street Address 2:</AppLabel>
                </v-col>
                <v-col cols="11" sm="8" md="8" lg="8" class="ma-2">
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
        <v-row>
          <v-col class="pt-0">
            <v-card variant="outlined" class="card-outline pa-2 w-100">
              <v-skeleton-loader :loading="loadingInclusionPolicy" type="table-tbody">
                <div class="w-100">
                  <v-row no-gutters>
                    <v-col class="">
                      <AppLabel>Does your organization have an inclusion policy?</AppLabel>
                    </v-col>
                    <v-col class="mt-2">
                      <v-row v-if="editable && !editMode" justify="end">
                        <AppButton variant="text" :disabled="loadingAll">
                          <v-icon icon="fa:fa-regular fa-edit" class="transaction-icon" @click="toggleEditMode()"></v-icon>
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
                      <v-col v-if="!organizationEdit.hasInclusionPolicy" class="pt-0">
                        <v-icon size="30" color="amber">mdi-alert</v-icon>
                        An Inclusive Policy is a requirement to apply for Support Needs Supplementary Funding
                      </v-col>
                      <v-col v-if="organizationEdit.hasInclusionPolicy" class="pt-0 w-75">
                        <AppLabel>Inclusion Policy Document:</AppLabel>
                        <AppDocumentUpload
                          id="inclusion-policy-upload"
                          ref="documentUpload"
                          entityName="accounts"
                          :loading="loadingInclusionPolicy"
                          :readonly="!editMode"
                          :uploadedDocuments="uploadedDocumentsEdit"
                          @updateDocuments="updateDocumentsToUpload"
                          @deleteUploadedDocument="deleteUploadedDocument" />
                        <v-alert density="compact" v-if="showUploadDocumentsAlert" type="error" class="w-76 mt-1">
                          Please upload at least one document. To proceed, invoke 'Add File' button, 'Select a file' to upload. Then 'Save' to complete the process.
                        </v-alert>
                      </v-col>
                      <v-col v-if="editMode" class="d-flex justify-end pt-0">
                        <AppButton id="cancel-edit" :primary="false" size="large" width="100px" @click="toggleEditMode()" class="mr-6">Cancel</AppButton>
                        <AppButton id="save" size="large" width="100px" @click="save()">Save</AppButton>
                      </v-col>
                    </v-col>
                  </v-row>
                </div>
              </v-skeleton-loader>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-skeleton-loader>
  </v-card>
</template>

<script>
import alertMixin from '@/mixins/alertMixin'
import AppLabel from '@/components/ui/AppLabel.vue'
import AppButton from '@/components/ui/AppButton.vue'
import AppDocumentUpload from '@/components/ui/AppDocumentUpload.vue'
import { isEmpty } from 'lodash'

export default {
  components: { AppButton, AppLabel, AppDocumentUpload },
  mixins: [alertMixin],
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
    loadingAll: {
      type: Boolean,
      default: false,
    },
    loadingInclusionPolicy: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['updateDocumentsToDelete', 'updateDocumentsToUpload', 'saveInclusionPolicyData'],
  data() {
    return {
      organizationEdit: {},
      editMode: false,
      uploadedDocumentsEdit: [],
      documentsToUpload: [],
      showUploadDocumentsAlert: false,
    }
  },
  async updated() {
    this.initializeData()
  },
  methods: {
    async initializeData() {
      this.organizationEdit = { ...this.organization, hasInclusionPolicy: this.organization.hasInclusionPolicy || false }
      this.uploadedDocumentsEdit = JSON.parse(JSON.stringify(this.uploadedDocuments))
    },

    documentsExistOrBeingAdded() {
      return !isEmpty(this.documentsToUpload) || !isEmpty(this.uploadedDocumentsEdit)
    },

    async save() {
      if (this.organizationEdit?.hasInclusionPolicy && !this.documentsExistOrBeingAdded()) {
        this.showUploadDocumentsAlert = true
        return
      }
      if (!this.organizationEdit.hasInclusionPolicy && this.organization.hasInclusionPolicy) {
        this.$emit('updateDocumentsToDelete', this.uploadedDocumentsEdit.map((document) => document.documentId), null)
      }
      this.$emit('saveInclusionPolicyData', this.organizationEdit)
    },

    toggleEditMode() {
      this.editMode = !this.editMode
      this.showUploadDocumentsAlert = false
      if (!this.editMode) {
        this.organizationEdit.hasInclusionPolicy = this.organization.hasInclusionPolicy
      }
    },

    updateDocumentsToUpload({ documents }) {
      this.documentsToUpload = documents?.filter((document) => document.isValidFile && document.file)
      this.$emit('updateDocumentsToUpload', this.documentsToUpload)
    },

    async deleteUploadedDocument(documentId) {
      const index = this.uploadedDocumentsEdit.findIndex((item) => item.documentId === documentId)
      if (index > -1) {
        this.uploadedDocumentsEdit.splice(index, 1)
        this.$emit('updateDocumentsToDelete', [], documentId)
      }
    },

    resetData() {
      this.documentsToUpload = []
      this.documentsToDelete = []
      this.showUploadDocumentsAlert = false
      if (this.$refs.documentUpload) {
        this.$refs.documentUpload.resetDocuments()
      }
      this.editMode = false
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