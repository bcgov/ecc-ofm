<template>
  <v-container>
    <AppDialog v-model="isDisplayed" title="New request" :is-loading="isLoading" persistent max-width="60%" @close="closeNewRequestDialog">
      <template #content>
        <v-form ref="newRequestForm" v-model="isFormComplete" class="px-lg-5 mx-lg-1">
          <v-row no-gutters class="mt-2">
            <v-col cols="12" md="3" xl="1" class="pt-2">
              <AppLabel variant="modal">Topic:</AppLabel>
            </v-col>
            <v-col class="v-col-12 v-col-md-9 v-col-xl-11">
              <v-select
                v-model="newRequestModel.requestCategoryId"
                placeholder="[select a topic]"
                variant="outlined"
                :items="permittedRequestCategories"
                item-title="categoryName"
                item-value="categoryId"
                :rules="rules.required"
                density="compact"
                :disabled="isLoading || lockRequestCategory"></v-select>
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
                :disabled="isLoadingOrDisabled || lockSubject"></v-text-field>
            </v-col>
          </v-row>
          <template v-if="isAccountMaintenanceRequest">
            <v-row no-gutters>
              <v-col class="v-col-12 v-col-md-3 v-col-xl-2">
                <AppLabel variant="modal">Change type:</AppLabel>
              </v-col>
            </v-row>
            <v-row no-gutters>
              <v-col v-for="(item, index) in requestSubCategories" :key="index" class="v-col-12 v-col-md-6 v-col-lg-4">
                <v-checkbox
                  :label="item.categoryName"
                  :input-value="newRequestModel.subCategories.some((subCategory) => subCategory.subCategoryId === item.subCategoryId)"
                  density="compact"
                  :class="changeTypeClass"
                  hide-details
                  @change="(val) => handleCheckboxChange(val, { subCategoryId: item.subCategoryId, subCategoryName: item.categoryName })"></v-checkbox>
              </v-col>
            </v-row>
            <div v-if="changeTypeClass" align="center" class="v-messages error-message pb-4">At least one Change type is required</div>
          </template>
          <v-row v-if="showFacility" no-gutters>
            <v-col class="v-col-12 v-col-md-3 v-col-xl-2 pt-2">
              <AppLabel variant="modal">{{ facilityLabel }}</AppLabel>
            </v-col>
            <v-col class="v-col-12 v-col-md-9 v-col-xl-11">
              <v-select
                v-if="isMultipleFacilities"
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
                :disabled="isLoading || lockFacility"
                return-object>
                <template #prepend-item>
                  <v-list-item title="Select All" @click="toggleFacilities">
                    <template #prepend>
                      <v-checkbox-btn
                        :color="someFacilitiesSelected ? '#003366' : undefined"
                        :indeterminate="someFacilitiesSelected && !allFacilitiesSelected"
                        :model-value="someFacilitiesSelected"></v-checkbox-btn>
                    </template>
                  </v-list-item>
                  <v-divider class="mt-2"></v-divider>
                </template>
              </v-select>
              <v-select
                v-else
                id="selectFacility"
                v-model="newRequestModel.facilities"
                placeholder="[select facility]"
                variant="outlined"
                density="compact"
                :items="filteredFacilties"
                :rules="rules.required"
                item-title="facilityName"
                :disabled="isLoading || lockFacility"
                return-object></v-select>
            </v-col>
          </v-row>
          <div v-if="isAccountMaintenanceRequest && showFacility" class="mb-6">
            <div v-if="showFacilityNotInOFMMessage" class="d-flex align-center mb-2">
              <v-icon size="large" class="alert-icon">mdi-alert-circle</v-icon>
              <p class="text-error ml-2">
                The selected facility is not enrolled in the $10 a Day - Operating Funding Model and therefore cannot be updated using this method. Click
                <a href="#" @click.prevent="toggleUnableToSubmitCrDialog">here</a>
                for further instructions.
              </p>
            </div>
            <div class="facility-tip">Submit a separate request for each facility</div>
          </div>
          <template v-if="isOrgPhoneEmailChecked">
            <v-row no-gutters>
              <v-col class="v-col-12 v-col-md-3 v-col-xl-3 pt-1 mb-0">
                <AppLabel variant="modal">Organization phone (land):</AppLabel>
              </v-col>
              <v-col class="v-col-12 v-col-md-9 v-col-xl-9 mb-1">
                <v-text-field
                  id="organization-phone"
                  v-model.trim="organizationModel.phoneLandline"
                  :placeholder="PHONE_FORMAT"
                  :rules="[rules.phone, ...orgPhoneEmailRule]"
                  maxlength="12"
                  variant="outlined"
                  density="compact"
                  :disabled="isLoadingOrDisabled"></v-text-field>
              </v-col>
            </v-row>
            <v-row no-gutters>
              <v-col class="v-col-12 v-col-md-3 v-col-xl-3 pt-1 mb-0">
                <AppLabel variant="modal">Organization phone (cell):</AppLabel>
              </v-col>
              <v-col class="v-col-12 v-col-md-9 v-col-xl-9 mb-1">
                <v-text-field
                  id="organization-cell"
                  v-model.trim="organizationModel.phoneCell"
                  :placeholder="PHONE_FORMAT"
                  :rules="[rules.phone, ...orgPhoneEmailRule]"
                  maxlength="12"
                  variant="outlined"
                  density="compact"
                  :disabled="isLoadingOrDisabled"></v-text-field>
              </v-col>
            </v-row>
            <v-row no-gutters>
              <v-col class="v-col-12 v-col-md-3 v-col-xl-3 pt-1 mb-0">
                <AppLabel variant="modal">Organization email:</AppLabel>
              </v-col>
              <v-col class="v-col-12 v-col-md-9 v-col-xl-9 mb-1">
                <v-text-field
                  id="organization-email"
                  v-model.trim="organizationModel.email"
                  :placeholder="EMAIL_FORMAT"
                  :rules="[rules.email, ...orgPhoneEmailRule]"
                  maxlength="100"
                  variant="outlined"
                  density="compact"
                  :disabled="isLoadingOrDisabled"></v-text-field>
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
                  :rules="[rules.phone, ...facilityPhoneEmailRule]"
                  maxlength="12"
                  variant="outlined"
                  density="compact"
                  :disabled="isLoadingOrDisabled"></v-text-field>
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
                  :rules="[rules.phone, ...facilityPhoneEmailRule]"
                  maxlength="12"
                  variant="outlined"
                  density="compact"
                  :disabled="isLoadingOrDisabled"></v-text-field>
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
                  :rules="[rules.email, ...facilityPhoneEmailRule]"
                  maxlength="100"
                  variant="outlined"
                  density="compact"
                  :disabled="isLoadingOrDisabled"></v-text-field>
              </v-col>
            </v-row>
          </template>
          <v-row v-if="showRequestDescription" no-gutters>
            <v-col class="v-col-12 pb-0">
              <AppLabel variant="modal">Request description:</AppLabel>
              <div v-if="isFundingEnvelopeRequest" class="mt-2 mb-4">
                <div class="mb-2">
                  Each Funding Envelope has restrictions for how the funding can be used and if or how it can be re-allocated between the Funding Envelopes and between line items within the Funding
                  Envelopes, as applicable. Please see the Policy and Procedures Manual for detailed information.
                </div>
                <div>
                  In the box below, please outline your request to re-allocate funds, including the amount and the envelopes you are moving funds between. Please also attach any relevant documents.
                </div>
              </div>
            </v-col>
            <v-col class="v-col-12">
              <v-textarea
                v-model.trim="newRequestModel.description"
                placeholder="Detailed description of request"
                counter
                maxlength="1000"
                variant="outlined"
                :rules="rules.required"
                :disabled="isLoadingOrDisabled"></v-textarea>
            </v-col>
          </v-row>

          <v-row v-if="isIrregularExpenseRequest" class="my-3">
            <v-col cols="12">
              <h5>You must complete and attach an Irregular Expense application form with your request.</h5>
              <p>Download the application below, and attach the completed form to this request using the Add File button.</p>
            </v-col>
            <v-row>
              <v-col cols="12" class="ml-3">
                <AppButton id="download-irregular-expense-form" :href="expenseFormURL" target="_blank" size="large" width="200px" :disabled="isDisabled" :loading="isLoading">Download Form</AppButton>
              </v-col>
            </v-row>
          </v-row>

          <v-row v-if="showSupportingDocuments" no-gutters align="center">
            <div class="mr-8">
              <AppLabel v-if="isIrregularExpenseRequest" variant="modal">Supporting documents (required):</AppLabel>
              <AppLabel v-else variant="modal">Supporting documents (optional):</AppLabel>
            </div>
            <AppDocumentUpload
              v-model="documentsToUpload"
              entity-name="ofm_assistance_requests"
              :disabled="isDisabled"
              :loading="isLoading"
              @validate-documents-to-upload="validateDocumentsToUpload"></AppDocumentUpload>
            <AppMissingInfoError v-if="isIrregularExpenseRequest && !documentsToUpload.length">Document upload required</AppMissingInfoError>
          </v-row>
          <template v-if="showContactMethods">
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
            <AppButton id="cancel-new-request" :primary="false" size="large" width="200px" :loading="isLoading" @click="closeNewRequestDialog()">Cancel</AppButton>
          </v-col>
          <v-col cols="12" md="6" class="d-flex justify-center pt-2">
            <AppButton id="submit-new-request" size="large" width="200px" :disabled="isDisabled" :loading="isLoading" @click="submit()">Submit</AppButton>
          </v-col>
        </v-row>
      </template>
    </AppDialog>
    <UnableToSubmitCrDialog :show="showUnableToSubmitCrDialog" :display-type="preventChangeRequestType" @close="toggleUnableToSubmitCrDialog" />
    <NewRequestConfirmationDialog :reference-number="referenceNumber" :show="showNewRequestConfirmationDialog" :return-to="returnTo" @close="toggleNewRequestConfirmationDialog" />
  </v-container>
</template>

<script>
import { isEmpty } from 'lodash'
import { mapState, mapActions } from 'pinia'
import { useAuthStore } from '@/stores/auth'
import { useAppStore } from '@/stores/app'
import { useMessagesStore } from '@/stores/messages'
import { useOrgStore } from '@/stores/org'
import AppButton from '@/components/ui/AppButton.vue'
import AppDialog from '@/components/ui/AppDialog.vue'
import AppLabel from '@/components/ui/AppLabel.vue'
import AppDocumentUpload from '@/components/ui/AppDocumentUpload.vue'
import AppMissingInfoError from '@/components/ui/AppMissingInfoError.vue'
import StaticConfig from '@/common/staticConfig'
import rules from '@/utils/rules'
import NewRequestConfirmationDialog from '@/components/messages/NewRequestConfirmationDialog.vue'
import UnableToSubmitCrDialog from '@/components/account-mgmt/UnableToSubmitCrDialog.vue'
import alertMixin from '@/mixins/alertMixin'
import permissionsMixin from '@/mixins/permissionsMixin'
import ApplicationService from '@/services/applicationService'
import DocumentService from '@/services/documentService'
import FacilityService from '@/services/facilityService'
import MessageService from '@/services/messageService'
import OrganizationService from '@/services/organizationService'
import FundingAgreementService from '@/services/fundingAgreementService'
import { ASSISTANCE_REQUEST_STATUS_CODES, CRM_STATE_CODES, OFM_PROGRAM_CODES, PREVENT_CHANGE_REQUEST_TYPES } from '@/utils/constants'
import { REQUEST_CATEGORY_NAMES, REQUEST_SUB_CATEGORY_NAMES, PHONE_FORMAT, EMAIL_FORMAT, VIRUS_SCAN_ERROR_MESSAGE, FUNDING_AGREEMENT_STATUS_CODES, PROVIDER_TYPE_CODES } from '@/utils/constants'

export default {
  name: 'NewRequestDialog',
  components: { AppButton, AppDialog, AppLabel, AppDocumentUpload, NewRequestConfirmationDialog, UnableToSubmitCrDialog, AppMissingInfoError },
  mixins: [alertMixin, permissionsMixin],
  props: {
    show: {
      type: Boolean,
      default: false,
      required: true,
    },
    defaultRequestCategoryId: {
      type: String,
      default: null,
    },
    defaultFacility: {
      type: Object,
      default: null,
    },
    defaultSubject: {
      type: String,
      default: null,
    },
    lockRequestCategory: {
      type: Boolean,
      default: false,
    },
    lockFacility: {
      type: Boolean,
      default: false,
    },
    lockSubject: {
      type: Boolean,
      default: false,
    },
    returnTo: {
      type: String,
      default: 'home',
    },
  },
  emits: ['close', 'submitPhoneEmail'],
  data() {
    return {
      isFormComplete: false,
      newRequestModel: {},
      organizationModel: {},
      facilityModel: {},
      rules,
      isDisplayed: false,
      isLoading: false,
      isDisabled: false,
      showNewRequestConfirmationDialog: false,
      showUnableToSubmitCrDialog: false,
      referenceNumber: '',
      documentsToUpload: [],
      areValidFilesUploaded: true,
      changeTypeClass: '',
      showFacilityNotInOFMMessage: false,
      preventChangeRequestType: undefined,
      fundingAgreements: undefined,
      facilityValidInOFM: new Map(),
      expenseFormURL: StaticConfig.IRREGULAR_EXPENSE_FORM_URL,
    }
  },
  computed: {
    ...mapState(useAppStore, ['requestCategories', 'requestSubCategories', 'getRequestCategoryIdByName', 'getRequestSubCategoryIdByName']),
    ...mapState(useAuthStore, ['currentFacility', 'userInfo']),
    ...mapState(useOrgStore, ['currentOrg']),
    permittedRequestCategories() {
      let categories = [...this.requestCategories]

      if (!this.hasPermission(this.PERMISSIONS.SUBMIT_CHANGE_REQUEST)) {
        categories = categories.filter((cat) => cat.categoryName !== REQUEST_CATEGORY_NAMES.ACCOUNT_MAINTENANCE)
      }

      if (!this.hasPermission(this.PERMISSIONS.APPLY_FOR_FUNDING)) {
        categories = categories.filter((cat) => cat.categoryName !== REQUEST_CATEGORY_NAMES.IRREGULAR_EXPENSES)
      }

      if (!this.hasPermission(this.PERMISSIONS.SUBMIT_DRAFT_REPORTS)) {
        categories = categories.filter((cat) => cat.categoryName !== REQUEST_CATEGORY_NAMES.REPORTING)
      }

      return categories
    },
    facilities() {
      return this.userInfo?.facilities
    },
    allFacilitiesSelected() {
      return this.newRequestModel.facilities.length == this.facilities.length
    },
    someFacilitiesSelected() {
      return this.newRequestModel.facilities.length > 0
    },
    isAccountMaintenanceRequest() {
      return this.newRequestModel.requestCategoryId === this.getRequestCategoryIdByName(REQUEST_CATEGORY_NAMES.ACCOUNT_MAINTENANCE)
    },
    isIrregularExpenseRequest() {
      return this.newRequestModel.requestCategoryId === this.getRequestCategoryIdByName(REQUEST_CATEGORY_NAMES.IRREGULAR_EXPENSES)
    },
    isReportingRequest() {
      return this.newRequestModel.requestCategoryId === this.getRequestCategoryIdByName(REQUEST_CATEGORY_NAMES.REPORTING)
    },
    isFundingEnvelopeRequest() {
      return this.newRequestModel.requestCategoryId === this.getRequestCategoryIdByName(REQUEST_CATEGORY_NAMES.FUNDING_ENVELOPE_CR)
    },
    isAnySubCategoryChecked() {
      return this.newRequestModel.subCategories.length > 0
    },
    isOrgPhoneEmailChecked() {
      return this.isSubCategoryChecked(REQUEST_SUB_CATEGORY_NAMES.ORGANIZATION_PHONE_EMAIL)
    },
    isFacilityPhoneEmailChecked() {
      return this.isSubCategoryChecked(REQUEST_SUB_CATEGORY_NAMES.FACILITY_PHONE_EMAIL)
    },
    isAnyDetailOrChangeChecked() {
      return (
        this.isSubCategoryChecked(REQUEST_SUB_CATEGORY_NAMES.ORGANIZATION_DETAILS) ||
        this.isSubCategoryChecked(REQUEST_SUB_CATEGORY_NAMES.FACILITY_DETAILS) ||
        this.isSubCategoryChecked(REQUEST_SUB_CATEGORY_NAMES.ADD_CHANGE_LICENCE) ||
        this.isSubCategoryChecked(REQUEST_SUB_CATEGORY_NAMES.OTHER)
      )
    },
    isOnlyPhoneEmailChecked() {
      return (
        ((this.isSubCategoryChecked(REQUEST_SUB_CATEGORY_NAMES.ORGANIZATION_PHONE_EMAIL) || this.isSubCategoryChecked(REQUEST_SUB_CATEGORY_NAMES.FACILITY_PHONE_EMAIL)) &&
          this.newRequestModel.subCategories.length === 1) ||
        (this.isSubCategoryChecked(REQUEST_SUB_CATEGORY_NAMES.ORGANIZATION_PHONE_EMAIL) &&
          this.isSubCategoryChecked(REQUEST_SUB_CATEGORY_NAMES.FACILITY_PHONE_EMAIL) &&
          this.newRequestModel.subCategories.length === 2)
      )
    },
    showFacility() {
      return (
        (this.isAccountMaintenanceRequest &&
          (this.isSubCategoryChecked(REQUEST_SUB_CATEGORY_NAMES.FACILITY_DETAILS) ||
            this.isSubCategoryChecked(REQUEST_SUB_CATEGORY_NAMES.FACILITY_PHONE_EMAIL) ||
            this.isSubCategoryChecked(REQUEST_SUB_CATEGORY_NAMES.ADD_CHANGE_LICENCE))) ||
        !this.isAccountMaintenanceRequest
      )
    },
    showRequestDescription() {
      return (this.isAccountMaintenanceRequest && this.isAnyDetailOrChangeChecked) || !this.isAccountMaintenanceRequest
    },
    showSupportingDocuments() {
      return (this.isAccountMaintenanceRequest && this.isAnyDetailOrChangeChecked) || (!this.isAccountMaintenanceRequest && !this.isReportingRequest)
    },
    showContactMethods() {
      return !this.isAccountMaintenanceRequest && !this.isReportingRequest
    },
    isLoadingOrDisabled() {
      return this.isLoading || this.isDisabled
    },
    orgPhoneEmailRule() {
      return [
        (v) =>
          !!v ||
          !this.isOrgPhoneEmailChecked ||
          !!this.organizationModel.phoneLandline ||
          !!this.organizationModel.phoneCell ||
          !!this.organizationModel.email ||
          'A phone/cell or email is required when Organization phone/email checked',
      ]
    },
    facilityPhoneEmailRule() {
      return [
        (v) =>
          !!v ||
          !this.isFacilityPhoneEmailChecked ||
          !!this.facilityModel.phoneLandline ||
          !!this.facilityModel.phoneCell ||
          !!this.facilityModel.email ||
          'A phone/cell or email is required when Facility phone/email checked',
      ]
    },
    filteredFacilties() {
      if (this.isIrregularExpenseRequest) {
        //family org can never apply for irregular expense
        if (this.currentOrg?.providerType === PROVIDER_TYPE_CODES.FAMILY) {
          return []
        }
        return this.facilities.filter((fac) => this.fundingAgreements.some((app) => app?.facilityId === fac?.facilityId) && fac?.isUnionized === 0)
      }
      return this.facilities
    },
    documentsComplete() {
      if (!this.isIrregularExpenseRequest) {
        return true
      }
      return this.documentsToUpload.length
    },
    isMultipleFacilities() {
      return !(this.isAccountMaintenanceRequest || this.isFundingEnvelopeRequest || this.isIrregularExpenseRequest || this.isReportingRequest)
    },
    facilityLabel() {
      return `Facility${this.isMultipleFacilities ? '(s)' : ''}:`
    },
  },
  watch: {
    show: {
      handler(value) {
        this.isDisplayed = value
      },
    },
    'newRequestModel.subCategories': {
      handler(value) {
        if (this.changeTypeClass === 'change-type-required' && this.isAnySubCategoryChecked) {
          this.changeTypeClass = ''
        }
        this.validateSubCategories(value)
      },
      deep: true,
    },
    defaultFacility: {
      handler(value) {
        this.newRequestModel.facilities = [this.facilities?.find((facility) => facility.facilityId === value?.facilityId)]
      },
    },
    defaultSubject: {
      handler(value) {
        this.newRequestModel.subject = value
      },
    },

    'newRequestModel.requestCategoryId': {
      async handler() {
        if (this.isIrregularExpenseRequest && !this.fundingAgreements) {
          this.isLoading = true
          await this.getFundingAgreements()
          if (!this.currentOrg) {
            await this.getOrganizationInfo(this.userInfo?.organizationId)
          }
          this.isLoading = false
        }
        this.resetModelData(this.isAccountMaintenanceRequest)
        // Reset the Selected Facility if not allowed
        if (!isEmpty(this.newRequestModel.facilities) && !this.filteredFacilties?.some((fac) => fac.facilityId === this.newRequestModel.facilities[0]?.facilityId)) {
          this.newRequestModel.facilities = []
          //then shorten the facility model to 1 item if going from multi-select to single select
        } else if (this.newRequestModel.facilities?.length > 1 && !this.isMultipleFacilities) {
          this.newRequestModel.facilities = this.newRequestModel.facilities[0]
        }
      },
    },
    'newRequestModel.facilities': {
      async handler() {
        if (this.isAccountMaintenanceRequest) {
          this.isLoading = true
          const isValid = await this.validateOfmProgram()
          this.isLoading = false
          if (isValid) {
            this.showFacilityNotInOFMMessage = false
            this.isDisabled = false
          } else {
            this.showFacilityNotInOFMMessage = true
            this.isDisabled = true
          }
        }
      },
      deep: true,
    },
  },
  created() {
    this.PHONE_FORMAT = PHONE_FORMAT
    this.EMAIL_FORMAT = EMAIL_FORMAT
    this.setUpDefaultNewRequestModel()
  },
  methods: {
    ...mapActions(useMessagesStore, ['addNewAssistanceRequestToStore', 'updateAssistanceRequestInStore']),
    ...mapActions(useOrgStore, ['getOrganizationInfo']),

    //this function runs to check if the selected facility is able to submit certain kinds of assitance requests.
    //it is only available to Account Managers and should only be called if the correct checkbox(es) are selected
    async validateOfmProgram() {
      //on load newRequestModel.facilites is sometimes an array because of multi-select. however AM requests will only have one item selected.
      const selectedFacility = this.newRequestModel?.facilities.length > 0 ? this.newRequestModel?.facilities[0] : this.newRequestModel?.facilities

      if (this.facilityValidInOFM.has(selectedFacility.facilityId)) {
        return this.facilityValidInOFM.get(selectedFacility.facilityId)
      }

      const isCCOForMultipleProgram = [OFM_PROGRAM_CODES.CCOF, OFM_PROGRAM_CODES.MULTIPLE].includes(selectedFacility?.programCode)
      const isTDADProgram = OFM_PROGRAM_CODES.TDAD === selectedFacility?.programCode
      const hasApprovedApplication = await ApplicationService.hasApprovedApplication([selectedFacility])
      if ((isCCOForMultipleProgram || isTDADProgram) && !hasApprovedApplication) {
        this.facilityValidInOFM.set(selectedFacility.facilityId, false)
        this.preventChangeRequestType = isCCOForMultipleProgram ? PREVENT_CHANGE_REQUEST_TYPES.IN_CCOF_PROGRAM : PREVENT_CHANGE_REQUEST_TYPES.IN_TDAD_PROGRAM
        this.showFacilityNotInOFMMessage = true
        this.disabled = true
        return false
      }
      this.facilityValidInOFM.set(selectedFacility.facilityId, true)
      return true
    },

    //the only change type that has sub categories are Account Maint requests
    async validateSubCategories(subCategories) {
      if (this.facilityChangeTypesChecked(subCategories)) {
        this.isLoading = true
        const isValid = await this.validateOfmProgram()
        this.isLoading = false
        this.isDisabled = !isValid
      } else {
        this.isDisabled = false
      }
    },

    facilityChangeTypesChecked(subCategories) {
      return subCategories.some(
        (subCategory) =>
          subCategory.subCategoryId === this.getRequestSubCategoryIdByName(REQUEST_SUB_CATEGORY_NAMES.FACILITY_DETAILS) ||
          subCategory.subCategoryId === this.getRequestSubCategoryIdByName(REQUEST_SUB_CATEGORY_NAMES.FACILITY_PHONE_EMAIL) ||
          subCategory.subCategoryId === this.getRequestSubCategoryIdByName(REQUEST_SUB_CATEGORY_NAMES.ADD_CHANGE_LICENCE),
      )
    },

    toggleUnableToSubmitCrDialog() {
      this.showUnableToSubmitCrDialog = !this.showUnableToSubmitCrDialog
    },
    setUpDefaultNewRequestModel() {
      const facilityId = this.defaultFacility?.facilityId || this.currentFacility?.facilityId
      this.newRequestModel = {
        requestCategoryId: this.defaultRequestCategoryId,
        subCategories: [],
        subject: this.defaultSubject,
        contactId: this.userInfo?.contactId,
        facilities: [this.filteredFacilties?.find((facility) => facility.facilityId === facilityId)],
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
      this.isDisabled = false
    },

    closeNewRequestDialog() {
      this.resetForm()
      this.$emit('close')
    },

    setAssistanceRequestDescription() {
      if (this.isOnlyPhoneEmailChecked) {
        this.newRequestModel.description =
          'Account maintenance CR: ' +
          (this.isSubCategoryChecked(REQUEST_SUB_CATEGORY_NAMES.ORGANIZATION_PHONE_EMAIL) ? 'Organization' : '') +
          (this.isSubCategoryChecked(REQUEST_SUB_CATEGORY_NAMES.FACILITY_PHONE_EMAIL) ? ' Facility' : '') +
          ' phone/cell/email'
      }
    },

    async createRequestAndDocuments() {
      try {
        //facilities must be saved as an array or the backend will be unable to handle the request
        if (!Array.isArray(this.newRequestModel.facilities)) {
          this.newRequestModel.facilities = [this.newRequestModel.facilities]
        }
        const response = await MessageService.createAssistanceRequest(this.newRequestModel)
        this.referenceNumber = response?.referenceNumber
        await this.addNewAssistanceRequestToStore(response?.assistanceRequestId)
        await DocumentService.createDocuments(this.documentsToUpload, response?.assistanceRequestId)
        return response
      } catch (error) {
        if (error?.response?.data?.status === 422) {
          this.setFailureAlert(VIRUS_SCAN_ERROR_MESSAGE, error)
        } else {
          this.setFailureAlert('Failed to create a new assistance request', error)
          throw error
        }
      }
    },

    async submit() {
      const isFormValid = await this.$refs.newRequestForm?.validate()

      if (isFormValid && this.validateChangeTypeSelection() && this.isFormComplete && this.areValidFilesUploaded && this.documentsComplete) {
        try {
          this.isLoading = true
          this.setAssistanceRequestDescription()
          const assistanceRequest = await this.createRequestAndDocuments()
          if (this.isSubCategoryChecked(REQUEST_SUB_CATEGORY_NAMES.ORGANIZATION_PHONE_EMAIL)) {
            await this.updateOrgPhoneEmail()
          }
          if (this.isSubCategoryChecked(REQUEST_SUB_CATEGORY_NAMES.FACILITY_PHONE_EMAIL)) {
            await this.updateFacilityPhoneEmail()
          }
          if (this.isOnlyPhoneEmailChecked) {
            // If only phone/email change is checked, close the request and create an auto reply
            await this.closeAssistanceRequest(assistanceRequest.assistanceRequestId)
            await this.updateAssistanceRequestInStore(assistanceRequest.assistanceRequestId)
            await this.createReplyAssistanceRequest(assistanceRequest.assistanceRequestId)
          }
          this.toggleNewRequestConfirmationDialog()

          // Emit an event so the parent can refresh its data
          if (this.isSubCategoryChecked(REQUEST_SUB_CATEGORY_NAMES.ORGANIZATION_PHONE_EMAIL) || this.isSubCategoryChecked(REQUEST_SUB_CATEGORY_NAMES.FACILITY_PHONE_EMAIL)) {
            this.$emit('submitPhoneEmail')
          }
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
      const index = this.newRequestModel.subCategories.findIndex((item) => item.subCategoryId === subCategory.subCategoryId)
      if (index > -1) {
        this.newRequestModel.subCategories.splice(index, 1)
      } else if (val) {
        this.newRequestModel.subCategories.push(subCategory)
      }
    },

    validateChangeTypeSelection() {
      const shouldValidate = this.isAccountMaintenanceRequest && !this.isAnySubCategoryChecked
      if (shouldValidate) {
        this.changeTypeClass = 'change-type-required'
      }
      return !shouldValidate
    },

    async closeAssistanceRequest(assistanceRequestId) {
      try {
        const payload = {
          statusCode: ASSISTANCE_REQUEST_STATUS_CODES.CLOSED_COMPLETE,
          stateCode: CRM_STATE_CODES.INACTIVE,
        }
        await MessageService.updateAssistanceRequest(assistanceRequestId, payload)
        await this.updateAssistanceRequestInStore(assistanceRequestId)
      } catch (error) {
        this.setFailureAlert('Failed to close Assistance Request', error)
        throw error
      }
    },

    async createReplyAssistanceRequest(assistanceRequestId) {
      try {
        const payload = {
          assistanceRequestId: assistanceRequestId,
          message: 'Your change request is complete.',
        }
        await MessageService.createAssistanceRequestConversation(payload)
      } catch (error) {
        this.setFailureAlert('Failed to create auto reply for Assistance Request', error)
        throw error
      }
    },

    async updateOrgPhoneEmail() {
      try {
        if (!this.organizationModel.phoneLandline) delete this.organizationModel.phoneLandline
        if (!this.organizationModel.phoneCell) delete this.organizationModel.phoneCell
        if (!this.organizationModel.email) delete this.organizationModel.email
        await OrganizationService.updateOrganization(this.userInfo?.organizationId, this.organizationModel)
      } catch (error) {
        this.setFailureAlert('Failed to update organization', error)
        throw error
      }
    },

    async updateFacilityPhoneEmail() {
      try {
        const facilityId = this.newRequestModel.facilities[0].facilityId
        this.facilityModel.facilityId = facilityId
        if (!this.facilityModel.phoneLandline) delete this.facilityModel.phoneLandline
        if (!this.facilityModel.phoneCell) delete this.facilityModel.phoneCell
        if (!this.facilityModel.email) delete this.facilityModel.email
        await FacilityService.updateFacility(facilityId, this.facilityModel)
      } catch (error) {
        this.setFailureAlert('Failed to update facility', error)
        throw error
      }
    },

    isSubCategoryChecked(categoryName) {
      return this.newRequestModel.subCategories.some((subCategory) => subCategory.subCategoryId === this.getRequestSubCategoryIdByName(categoryName))
    },

    resetModelData(isAccountMaintenanceRequest) {
      if (!isAccountMaintenanceRequest) {
        this.newRequestModel.subCategories = []
        this.organizationModel = {}
        this.facilityModel = {}
      }
      this.disabled = false
    },
    async getFundingAgreements() {
      this.fundingAgreements = []
      try {
        await Promise.all(
          this.facilities?.map(async (facility) => {
            const fa = await FundingAgreementService.getActiveFundingAgreementByFacilityIdAndStatus(facility.facilityId, FUNDING_AGREEMENT_STATUS_CODES.ACTIVE)
            if (fa) {
              this.fundingAgreements.push(fa)
            }
          }),
        )
      } catch (error) {
        this.setFailureAlert('Failed to load Funding Agreements', error)
        throw error
      }
    },
  },
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
  content: '\F0131';
  border-color: #d8292f;
  border-block-color: #d8292f;
  border-style: groove;
  border-width: 2px;
}

.v-messages {
  opacity: 1;
}

:deep(.v-select__selection-text) {
  white-space: normal; /* Wraps the selected item text */
  word-wrap: break-word;
}
</style>
