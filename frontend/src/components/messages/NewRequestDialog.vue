<template>
  <v-container>
    <AppDialog v-model="isDisplayed" title="New request" :isLoading="isLoading" persistent max-width="70%" @close="closeNewRequestDialog">
      <template #content>
        <v-form ref="newRequestForm" v-model="isFormComplete" class="px-lg-12 mx-lg-8">
          <v-row no-gutters class="mt-2">
            <v-col class="v-col-12 v-col-md-3 v-col-xl-1 pt-2">
              <AppLabel variant="modal">Topic:</AppLabel>
            </v-col>
            <v-col class="v-col-12 v-col-md-9 v-col-xl-11">
              <v-select
                v-model="newRequestModel.requestCategoryId"
                placeholder="[select a topic]"
                variant="outlined"
                :items="requestCategories"
                item-title="categoryName"
                item-value="categoryId"
                :rules="rules.required"
                density="compact"
                :disabled="isLoading"></v-select>
            </v-col>
          </v-row>
          <v-row no-gutters>
            <v-col class="v-col-12 v-col-md-3 v-col-xl-1 pt-1 mb-0">
              <AppLabel variant="modal">Subject:</AppLabel>
            </v-col>
            <v-col class="v-col-12 v-col-md-9 v-col-xl-11 mb-0">
              <v-text-field
                v-model.trim="newRequestModel.subject"
                placeholder="Brief summary of request"
                counter
                maxlength="100"
                variant="outlined"
                density="compact"
                :rules="rules.required"
                :disabled="isLoading"></v-text-field>
            </v-col>
          </v-row>
          <template v-if="isAnAccountMaintenanceRequest">
            <v-row no-gutters>
              <v-col class="v-col-12 v-col-md-3 v-col-xl-2">
                <AppLabel variant="modal">Change type:</AppLabel>
              </v-col>
            </v-row>
            <v-row no-gutters>
              <v-col v-for="(item, index) in sortedRequestSubCategories" :key="index" cols="4">
                <v-checkbox
                  :label="item.categoryName"
                  :input-value="newRequestModel.subCategories.some((subCategory) => subCategory.subCategoryId === item.subCategoryId)"
                  @change="(val) => handleCheckboxChange(val, { subCategoryId: item.subCategoryId, subCategoryName: item.categoryName })"
                  density="compact"
                  :class="changeTypeClass"
                  hide-details>
                </v-checkbox>
              </v-col>
            </v-row>
            <v-row no-gutters class="pb-4">
              <v-col class="d-flex flex-column align-center">
                <span class="v-messages error-text-red" v-if="changeTypeClass !== ''">
                  At least one Change type is required
                </span>
              </v-col>
            </v-row>
          </template>
          <v-row v-if="showFacility" no-gutters>
            <v-col class="v-col-12 v-col-md-3 v-col-xl-1 pt-2">
              <AppLabel variant="modal">Facility{{ (!isAnAccountMaintenanceRequest) ? '(s):' : ':' }}</AppLabel>
            </v-col>
            <v-col class="v-col-12 v-col-md-9 v-col-xl-11">
              <v-select
                v-if="isAnAccountMaintenanceRequest"
                id="selectFacility"
                v-model="newRequestModel.facilities"
                placeholder="[select facility]"
                variant="outlined"
                density="compact"
                :items="facilities"
                item-title="facilityName"
                :disabled="isLoading"
                return-object
                hide-details>
              </v-select>
              <v-select
                v-else
                id="selectFacility"
                v-model="newRequestModel.facilities"
                placeholder="[selected facility] (add more)"
                variant="outlined"
                density="compact"
                chips
                multiple
                :rules="rules.listIsNotEmpty"
                :items="facilities"
                item-title="facilityName"
                :disabled="isLoading"
                return-object>
                <template v-slot:prepend-item>
                  <v-list-item title="Select All" @click="toggleFacilities">
                    <template v-slot:prepend>
                      <v-checkbox-btn
                        :color="someFacilitiesSelected ? '#003366' : undefined"
                        :indeterminate="someFacilitiesSelected && !allFacilitiesSelected"
                        :model-value="someFacilitiesSelected"></v-checkbox-btn>
                    </template>
                  </v-list-item>
                  <v-divider class="mt-2"></v-divider>
                </template>
              </v-select>
            </v-col>
          </v-row>
          <v-row v-if="isAnAccountMaintenanceRequest && showFacility" no-gutters class="pb-6">
            <v-col class="v-col-12 v-col-md-3 v-col-xl-1 pt-3 mt-0" />
            <v-col class="v-col-12 v-col-md-9 v-col-xl-11 mt-0">
              <span class="facility-tip">&nbsp;Submit a separate request for each facility</span>
            </v-col>
          </v-row>
          <template v-if="isOrgPhoneEmailChecked">
            <v-row no-gutters>
              <v-col class="v-col-12 v-col-md-3 v-col-xl-3 pt-1 mb-0">
                <AppLabel variant="modal">Organization phone (land):</AppLabel>
              </v-col>
              <v-col class="v-col-12 v-col-md-9 v-col-xl-9 mb-0">
                <v-text-field
                  v-model.trim="organizationModel.phoneLandline"
                  :placeholder="PHONE_FORMAT"
                  :rules="[rules.phone]"
                  maxlength="12"
                  variant="outlined"
                  density="compact"
                  :disabled="isLoading"></v-text-field>
              </v-col>
            </v-row>
            <v-row no-gutters>
              <v-col class="v-col-12 v-col-md-3 v-col-xl-3 pt-1 mb-0">
                <AppLabel variant="modal">Organization phone (cell):</AppLabel>
              </v-col>
              <v-col class="v-col-12 v-col-md-9 v-col-xl-9 mb-0">
                <v-text-field
                  v-model.trim="organizationModel.phoneCell"
                  :placeholder="PHONE_FORMAT"
                  :rules="[rules.phone]"
                  maxlength="12"
                  variant="outlined"
                  density="compact"
                  :disabled="isLoading"></v-text-field>
              </v-col>
            </v-row>
            <v-row no-gutters>
              <v-col class="v-col-12 v-col-md-3 v-col-xl-3 pt-1 mb-0">
                <AppLabel variant="modal">Organization email:</AppLabel>
              </v-col>
              <v-col class="v-col-12 v-col-md-9 v-col-xl-9 mb-0">
                <v-text-field
                  v-model.trim="organizationModel.email"
                  :placeholder="EMAIL_FORMAT"
                  :rules="rules.email"
                  maxlength="100"
                  variant="outlined"
                  density="compact"
                  :disabled="isLoading"></v-text-field>
              </v-col>
            </v-row>
          </template>
          <template v-if="isFacilityPhoneEmailChecked">
            <v-row no-gutters>
              <v-col class="v-col-12 v-col-md-3 v-col-xl-3 pt-1 mb-0">
                <AppLabel variant="modal">Facility phone (land):</AppLabel>
              </v-col>
              <v-col class="v-col-12 v-col-md-9 v-col-xl-9 mb-0">
                <v-text-field
                  v-model.trim="facilityModel.phoneLandline"
                  :placeholder="PHONE_FORMAT"
                  :rules="[rules.phone]"
                  maxlength="12"
                  variant="outlined"
                  density="compact"
                  :disabled="isLoading"></v-text-field>
              </v-col>
            </v-row>
            <v-row no-gutters>
              <v-col class="v-col-12 v-col-md-3 v-col-xl-3 pt-1 mb-0">
                <AppLabel variant="modal">Facility phone (cell):</AppLabel>
              </v-col>
              <v-col class="v-col-12 v-col-md-9 v-col-xl-9 mb-0">
                <v-text-field
                  v-model.trim="facilityModel.phoneCell"
                  :placeholder="PHONE_FORMAT"
                  :rules="[rules.phone]"
                  maxlength="12"
                  variant="outlined"
                  density="compact"
                  :disabled="isLoading"></v-text-field>
              </v-col>
            </v-row>
            <v-row no-gutters>
              <v-col class="v-col-12 v-col-md-3 v-col-xl-3 pt-1 mb-0">
                <AppLabel variant="modal">Facility email:</AppLabel>
              </v-col>
              <v-col class="v-col-12 v-col-md-9 v-col-xl-9 mb-0">
                <v-text-field
                  v-model.trim="facilityModel.email"
                  :placeholder="EMAIL_FORMAT"
                  :rules="rules.email"
                  maxlength="100"
                  variant="outlined"
                  density="compact"
                  :disabled="isLoading"></v-text-field>
              </v-col>
            </v-row>
          </template>
          <v-row v-if="showRequestDescription" no-gutters>
            <v-col class="v-col-12 pb-0">
              <AppLabel variant="modal">Request description:</AppLabel>
            </v-col>
            <v-col class="v-col-12">
              <v-textarea
                v-model.trim="newRequestModel.description"
                placeholder="Detailed description of request"
                counter
                maxlength="1000"
                variant="outlined"
                :rules="rules.required"
                :disabled="isLoading"></v-textarea>
            </v-col>
          </v-row>
          <v-row v-if="showSupportingDocuments" no-gutters align="center">
            <div class="mr-8">
              <AppLabel variant="modal">Supporting documents (optional):</AppLabel>
            </div>
            <AppDocumentUpload v-model="documentsToUpload" entityName="ofm_assistance_requests" :loading="isLoading" @validateDocumentsToUpload="validateDocumentsToUpload"></AppDocumentUpload>
          </v-row>
          <template v-if="!isAnAccountMaintenanceRequest">
            <v-row no-gutters class="mt-4">
              <v-col class="v-col-12 pb-0">
                <AppLabel variant="modal">Preferred method of contact:</AppLabel>
              </v-col>
              <v-col class="v-col-12">
                <v-radio-group v-model="newRequestModel.contactMethod" :rules="rules.required" :disabled="isLoading" inline color="primary">
                  <v-radio label="Phone" value="2"></v-radio>
                  <v-radio label="Portal message" value="1"></v-radio>
                </v-radio-group>
              </v-col>
            </v-row>
            <v-row v-if="newRequestModel.contactMethod === '2'" no-gutters class="mt-2">
              <v-col class="v-col-12 v-col-md-3 v-col-xl-2 pt-3">
                <AppLabel variant="modal">Business phone:</AppLabel>
              </v-col>
              <v-col class="v-col-12 v-col-md-9 v-col-xl-10">
                <v-text-field v-model="newRequestModel.phone" variant="outlined" :rules="[...rules.required, rules.phone]" :disabled="isLoading" />
              </v-col>
            </v-row>
          </template>
        </v-form>
      </template>
      <template #button>
        <v-row justify="space-around">
          <v-col cols="12" md="6" class="d-flex justify-center pt-2">
            <AppButton id="cancel-new-request" :primary="false" size="large" width="200px" @click="closeNewRequestDialog()" :loading="isLoading">Cancel</AppButton>
          </v-col>
          <v-col cols="12" md="6" class="d-flex justify-center pt-2">
            <AppButton id="submit-new-request" size="large" width="200px" @click="submit()" :loading="isLoading">Submit</AppButton>
          </v-col>
        </v-row>
      </template>
    </AppDialog>
    <NewRequestConfirmationDialog :referenceNumber="referenceNumber" :show="showNewRequestConfirmationDialog" :isInvokedFromMessages="isInvokedFromMessages" @close="toggleNewRequestConfirmationDialog" />
  </v-container>
</template>

<script>
import { mapState, mapActions } from 'pinia'
import { useAuthStore } from '@/stores/auth'
import { useAppStore } from '@/stores/app'
import { useMessagesStore } from '@/stores/messages'
import AppButton from '@/components/ui/AppButton.vue'
import AppDialog from '@/components/ui/AppDialog.vue'
import AppLabel from '@/components/ui/AppLabel.vue'
import AppDocumentUpload from '@/components/ui/AppDocumentUpload.vue'
import rules from '@/utils/rules'
import NewRequestConfirmationDialog from '@/components/messages/NewRequestConfirmationDialog.vue'
import alertMixin from '@/mixins/alertMixin'
import DocumentService from '@/services/documentService'
import FacilityService from '@/services/facilityService'
import OrganizationService from '@/services/organizationService'
import { ASSISTANCE_REQUEST_STATUS_CODES, CRM_STATE_CODES } from '@/utils/constants'
import { REQUEST_CATEGORY_TYPES, REQUEST_SUB_CATEGORY_TYPES, PHONE_FORMAT, EMAIL_FORMAT } from '@/utils/constants'

export default {
  name: 'NewRequestDialog',
  components: { AppButton, AppDialog, AppLabel, AppDocumentUpload, NewRequestConfirmationDialog },
  mixins: [alertMixin],
  props: {
    show: {
      type: Boolean,
      default: false,
      required: true,
    },
    isInvokedFromMessages: {
      type: Boolean,
      default: false, // If true, the dialog is invoked from the Messages page
    },
  },
  emits: ['close'],
  data() {
    return {
      isFormComplete: false,
      newRequestModel: {},
      organizationModel: {},
      facilityModel: {},
      rules,
      isDisplayed: false,
      isLoading: false,
      showNewRequestConfirmationDialog: false,
      referenceNumber: '',
      documentsToUpload: [],
      areValidFilesUploaded: true,
      changeTypeClass: '',
    }
  },
  computed: {
    ...mapState(useAppStore, ['requestCategories', 'requestSubCategories']),
    ...mapState(useAuthStore, ['currentFacility', 'userInfo']),
    facilities() {
      return this.userInfo?.facilities
    },
    allFacilitiesSelected() {
      return this.newRequestModel.facilities.length == this.facilities.length
    },
    someFacilitiesSelected() {
      return this.newRequestModel.facilities.length > 0
    },
    isAnAccountMaintenanceRequest() {
      return this.newRequestModel.requestCategoryId === REQUEST_CATEGORY_TYPES.ACCOUNT_MAINTENANCE
    },
    isAnySubCategoryChecked() {
      return this.newRequestModel.subCategories.length > 0
    },
    isOrgPhoneEmailChecked() {
      return this.isSubCategoryChecked(REQUEST_SUB_CATEGORY_TYPES.ORGANIZATION_PHONE_EMAIL)
    },
    isFacilityPhoneEmailChecked() {
      return this.isSubCategoryChecked(REQUEST_SUB_CATEGORY_TYPES.FACILITY_PHONE_EMAIL)
    },
    isAnyDetailOrChangeChecked() {
      return this.isSubCategoryChecked(REQUEST_SUB_CATEGORY_TYPES.ORGANIZATION_DETAILS) || this.isSubCategoryChecked(REQUEST_SUB_CATEGORY_TYPES.FACILITY_DETAILS) || this.isSubCategoryChecked(REQUEST_SUB_CATEGORY_TYPES.ADD_CHANGE_LICENCE) || this.isSubCategoryChecked(REQUEST_SUB_CATEGORY_TYPES.OTHER)
    },
    isOnlyPhoneEmailChecked() {
      return (((this.isSubCategoryChecked(REQUEST_SUB_CATEGORY_TYPES.ORGANIZATION_PHONE_EMAIL) || this.isSubCategoryChecked(REQUEST_SUB_CATEGORY_TYPES.FACILITY_PHONE_EMAIL)) && this.newRequestModel.subCategories.length === 1) ||
        ((this.isSubCategoryChecked(REQUEST_SUB_CATEGORY_TYPES.ORGANIZATION_PHONE_EMAIL) && this.isSubCategoryChecked(REQUEST_SUB_CATEGORY_TYPES.FACILITY_PHONE_EMAIL)) && this.newRequestModel.subCategories.length === 2))
    },
    showFacility() {
      return this.isAnAccountMaintenanceRequest && (this.isSubCategoryChecked(REQUEST_SUB_CATEGORY_TYPES.FACILITY_DETAILS) || this.isSubCategoryChecked(REQUEST_SUB_CATEGORY_TYPES.FACILITY_PHONE_EMAIL)) || !this.isAnAccountMaintenanceRequest
    },
    showRequestDescription() {
      return this.isAnAccountMaintenanceRequest && this.isAnyDetailOrChangeChecked || !this.isAnAccountMaintenanceRequest
    },
    showSupportingDocuments() {
      return this.isAnAccountMaintenanceRequest && this.isAnyDetailOrChangeChecked || !this.isAnAccountMaintenanceRequest
    },
  },
  watch: {
    show: {
      handler(value) {
        this.isDisplayed = value
      },
    },
    currentFacility: {
      handler() {
        this.setUpDefaultNewRequestModel()
      },
    },
    'newRequestModel.subCategories': {
      handler() {
        if (this.changeTypeClass === 'change-type-required' && this.isAnySubCategoryChecked) {
          this.changeTypeClass = ''
        }
      },
      deep: true
    }
  },
  created() {
    this.PHONE_FORMAT = PHONE_FORMAT
    this.EMAIL_FORMAT = EMAIL_FORMAT
    this.AUTO_REPLY_MESSAGE = 'Your change request is complete.'
    this.requestSubCategorySortOrder = [
      "Organization Details",
      "Facility Details",
      "Organization phone/email",
      "Facility phone/email",
      "Add/change a licence",
      "Other"
    ]
    this.sortedRequestSubCategories = this.sortRequestSubCategories(this.requestSubCategories, this.requestSubCategorySortOrder)
    this.setUpDefaultNewRequestModel()
  },
  methods: {
    ...mapActions(useMessagesStore, ['createAssistanceRequest', 'addNewAssistanceRequestToStore', 'updateAssistanceRequest', 'updateAssistanceRequestInStore', 'replyToAssistanceRequest', 'getAssistanceRequest', 'getAssistanceRequests']),

    setUpDefaultNewRequestModel() {
      this.newRequestModel = {
        requestCategoryId: REQUEST_CATEGORY_TYPES.ACCOUNT_MAINTENANCE,
        subCategories: [],
        contactId: this.userInfo?.contactId,
        facilities: [this.facilities?.find((facility) => facility.facilityId === this.currentFacility.facilityId)],
        contactMethod: '1',
        phone: this.userInfo?.phone,
      }
    },
    toggleFacilities() {
      if (this.allFacilitiesSelected) {
        this.newRequestModel.facilities = []
      } else {
        this.newRequestModel.facilities = this.facilities.slice()
      }
    },

    resetForm() {
      this.$refs.newRequestForm?.reset()
      this.setUpDefaultNewRequestModel()
      this.changeTypeClass = ''
    },

    closeNewRequestDialog() {
      this.resetForm()
      this.$emit('close')
    },

    setAssistanceRequestDescription() {
      if (this.isOnlyPhoneEmailChecked) {
        this.newRequestModel.description = 'Account maintenance CR: ' + (this.isSubCategoryChecked(REQUEST_SUB_CATEGORY_TYPES.ORGANIZATION_PHONE_EMAIL) ? 'Organization' : '') + (this.isSubCategoryChecked(REQUEST_SUB_CATEGORY_TYPES.FACILITY_PHONE_EMAIL) ? 'Facility' : '') + 'phone/email'
      }
    },

    async createRequestAndDocuments() {
      try {
        const response = await this.createAssistanceRequest(this.newRequestModel)
        this.referenceNumber = response?.referenceNumber
        await this.addNewAssistanceRequestToStore(response?.assistanceRequestId)
        await DocumentService.createDocuments(this.documentsToUpload, response?.assistanceRequestId)
        return response
      } catch (error) {
        if (error?.response?.data?.status === 422) {
          this.setWarningAlert('Supporting documents not saved, virus scan failed')
        } else {
          this.setFailureAlert('Failed to create a new assistance request', error)
          throw error
        }
      }
    },

    async submit() {
      this.$refs.newRequestForm?.validate()
      if (this.validateChangeTypeSelection() && this.isFormComplete && this.areValidFilesUploaded) {
        try {
          this.isLoading = true
          this.setAssistanceRequestDescription()
          const assistanceRequest = await this.createRequestAndDocuments()
          if (this.isSubCategoryChecked(REQUEST_SUB_CATEGORY_TYPES.ORGANIZATION_PHONE_EMAIL)) {
            await OrganizationService.updateOrganization(this.userInfo?.organizationId, this.organizationModel)
          }
          if (this.isSubCategoryChecked(REQUEST_SUB_CATEGORY_TYPES.FACILITY_PHONE_EMAIL)) {
            this.updateFacility()
          }
          if (this.isOnlyPhoneEmailChecked) {
            // If only phone/email change is checked, close the request and create an auto reply
            await this.closeAssistanceRequest(assistanceRequest.assistanceRequestId)
            await this.updateAssistanceRequestInStore(assistanceRequest.assistanceRequestId)
            await this.createReplyAssistanceRequest(assistanceRequest.assistanceRequestId)
          }
          this.toggleNewRequestConfirmationDialog()
        } catch (error) {
          this.setFailureAlert('Failed to submit change request', error)
        } finally {
          this.closeNewRequestDialog()
          this.isLoading = false
        }
      }
    },

    toggleNewRequestConfirmationDialog() {
      this.showNewRequestConfirmationDialog = !this.showNewRequestConfirmationDialog
    },

    validateDocumentsToUpload(value) {
      this.areValidFilesUploaded = value
    },

    handleCheckboxChange(val, subCategory) {
      const index = this.newRequestModel.subCategories.findIndex(item => item.subCategoryId === subCategory.subCategoryId)
      if (index > -1) {
        this.newRequestModel.subCategories.splice(index, 1)
      } else if (val) {
        this.newRequestModel.subCategories.push(subCategory)
      }
    },

    validateChangeTypeSelection() {
      const shouldValidate = this.isAnAccountMaintenanceRequest && !this.isAnySubCategoryChecked
      if (shouldValidate) {
        this.changeTypeClass = 'change-type-required'
      }
      return !shouldValidate
    },

    sortRequestSubCategories(subCategories, sortOrder) {
      subCategories.sort((a, b) => {
        let indexA = sortOrder.indexOf(a.categoryName)
        let indexB = sortOrder.indexOf(b.categoryName)
        if (indexA === -1) indexA = sortOrder.length
        if (indexB === -1) indexB = sortOrder.length
        return indexA - indexB;
      })
      return subCategories
    },

    async closeAssistanceRequest(assistanceRequestId) {
      try {
        const payload = {
          statusCode: ASSISTANCE_REQUEST_STATUS_CODES.CLOSED_COMPLETE,
          stateCode: CRM_STATE_CODES.INACTIVE,
        }
        await this.getAssistanceRequests(this.userInfo?.contactId)
        await this.updateAssistanceRequest(assistanceRequestId, payload)
        await this.updateAssistanceRequestInStore(assistanceRequestId)
      } catch (error) {
        this.setFailureAlert(`Failed to close Assistance Request - ${error}`)
        throw error
      }
    },

    async createReplyAssistanceRequest(assistanceRequestId) {
      try {
        const payload = {
          assistanceRequestId: assistanceRequestId,
          message: this.AUTO_REPLY_MESSAGE,
        }
        await this.replyToAssistanceRequest(payload)
      } catch (error) {
        this.setFailureAlert(`Failed to create auto reply for Assistance Request - ${error}`)
        throw error
      }
    },

    async updateFacility() {
      try {
        this.facilityModel.facilityId = this.newRequestModel.facilities[0].facilityId
        await FacilityService.updateFacility(this.newRequestModel.facilities[0].facilityId, this.facilityModel)
      } catch (error) {
        this.setFailureAlert('Failed to update facility', error)
        throw error
      }
    },

    isSubCategoryChecked(category) {
      return this.newRequestModel.subCategories.some(subCategory => subCategory.subCategoryId === category)
    },

  }
}
</script>

<style scoped>
.facility-tip {
  font-size: 13px;
  color: #666;
  font-style: italic;
  font-weight: bold;
}

.change-type-required:deep(.mdi-checkbox-blank-outline)::before {
  content: "\F0131";
  border-color: #b00020;
  border-block-color: #b00020;
  border-style: groove;
  border-width: 2px;
}

.error-text-red {
  color: #b00020;
}
</style>
