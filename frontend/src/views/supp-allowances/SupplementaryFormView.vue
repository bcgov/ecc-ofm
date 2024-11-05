<template>
  <p class="my-11">
    Allowances (Core and Discretionary) have a one-year term. You must re-apply annually to continue receiving funding.
    <br />
    The renewal date will be the anniversary of your OFM base funding agreement
  </p>

  <p class="my-11">
    You may apply for one or more allowances. You may also apply through
    <router-link :to="{ name: 'applications-history' }">Applications</router-link>
    at any time.
  </p>

  <AppAlertBanner v-if="isFundingTermComplete" type="warning">Your current year funding is ending and you are no longer able to make changes.</AppAlertBanner>
  <AppAlertBanner v-else-if="currentTermDisabled" type="warning">Your current year funding is ending and you are no longer able to make changes. Please apply for Next Year</AppAlertBanner>

  <v-form ref="form">
    <v-row no-gutters class="mb-2">
      <v-col cols="12" lg="2">
        <AppLabel>Application Year:</AppLabel>
      </v-col>

      <!-- These buttons should always be enabled/disabled with FA dates as we might not have a supp app date to go off of-->
      <v-col cols="6" lg="2" class="d-flex flex-column align-end">
        <AppButton id="current-year-button" class="mr-1" :active="!nextTermActive" :primary="false" size="large" width="200px" @click="setActiveTerm(false)">Current Year</AppButton>
      </v-col>
      <v-col cols="6" lg="2">
        <AppButton v-if="!isFundingTermComplete" id="next-year-button" :active="nextTermActive" :primary="false" :disabled="!isNextTermEnabled" size="large" width="200px" @click="setActiveTerm(true)">
          Next Year
        </AppButton>
      </v-col>
    </v-row>

    <v-row v-if="fundingExpiryDate != 'Invalid Date'">
      <v-col cols="12">
        <div v-if="!nextTermActive">If you apply for and receive funding in the current year of your funding agreement, the funds must be used by {{ format.formatDateToUTC(fundingExpiryDate) }}</div>
      </v-col>
    </v-row>
    <v-row no-gutters class="mb-2">
      <v-col cols="12" class="d-flex flex-column align-end">
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
    <AppDialog v-model="showCancelDialog" title="Cancel Changes" :isLoading="loading" persistent max-width="40%" @close="toggleCancelDialog">
      <template #content>
        <v-row class="mb-2">
          <v-col class="text-center">
            <p class="pt-4 text-h6">Are you sure you want to cancel your changes?</p>
            <p class="pt-4 text-h6">Your progress will not be saved.</p>
          </v-col>
        </v-row>
      </template>
      <template #button>
        <v-row justify="space-around">
          <v-col cols="12" md="6" class="d-flex justify-center">
            <AppButton id="go-back-button" :primary="false" size="large" width="200px" :to="{ name: 'applications-history' }">Cancel Changes</AppButton>
          </v-col>
          <v-col cols="12" md="6" class="d-flex justify-center">
            <AppButton id="cancel-button" size="large" width="200px" @click="toggleCancelDialog()">Stay on page</AppButton>
          </v-col>
        </v-row>
      </template>
    </AppDialog>

    <AppAlertBanner v-if="!hasGoodStanding && !loading" type="warning">
      {{ NOT_IN_GOOD_STANDING_WARNING_MESSAGE }}
    </AppAlertBanner>
    <div v-if="!nextTermActive">
      <v-skeleton-loader v-if="loading" :loading="loading" type="table-tbody"></v-skeleton-loader>
      <template v-else>
        <div class="supplementary-header">
          <p class="supplementary-header-label">Core Services Allowance</p>
        </div>
        <v-expansion-panels v-model="panel" multiple>
          <v-expansion-panel v-for="panelComponent in CORE_SERVICES_PANELS" :key="panelComponent.id" :value="panelComponent.id">
            <v-expansion-panel-title>
              <span class="supplementary-header-label">{{ panelComponent.title }}</span>
              <span v-if="isFundingActive(panelComponent.id, renewalTerm)" class="active-label ml-9">Active</span>
            </v-expansion-panel-title>
            <v-expansion-panel-text>
              <IndigenousProgrammingAllowance
                v-if="panelComponent.id === INDIGENOUS"
                :indigenousProgrammingModel="getModel(SUPPLEMENTARY_TYPES.INDIGENOUS, renewalTerm)"
                :formDisabled="currentTermDisabled || formDisabled"
                @update="updateModel" />
              <SupportNeedsProgrammingAllowance
                v-if="panelComponent.id === SUPPORT_NEEDS"
                :supportModel="getModel(SUPPLEMENTARY_TYPES.SUPPORT, renewalTerm)"
                :hasInclusionPolicy="currentOrg.hasInclusionPolicy"
                :formDisabled="currentTermDisabled || formDisabled"
                @update="updateModel" />
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>

        <div class="supplementary-header">
          <p class="supplementary-header-label">Discretionary Services Allowance</p>
        </div>
        <v-expansion-panels v-model="panel">
          <v-expansion-panel :value="DISCRETIONARY_PANEL.id">
            <v-expansion-panel-title>
              <span class="supplementary-header-label">{{ DISCRETIONARY_PANEL.title }}</span>
              <span v-if="isFundingActive(DISCRETIONARY_PANEL.id, renewalTerm)" class="active-label ml-9">Active</span>
            </v-expansion-panel-title>
            <v-expansion-panel-text>
              <TransportationAllowance
                :transportModels="getTransportModels(renewalTerm)"
                :formDisabled="currentTermDisabled || formDisabled"
                :renewalTerm="renewalTerm"
                :startDate="getStartDate(renewalTerm)"
                @update="updateModel"
                @add-model="addBlankTransportModel"
                @delete-model="deleteTransportModel"
                @delete-document="deleteDocument" />
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
      </template>
    </div>

    <div v-if="nextTermActive">
      <v-skeleton-loader v-if="loading" :loading="loading" type="table-tbody"></v-skeleton-loader>
      <template v-else>
        <div class="supplementary-header">
          <p class="supplementary-header-label">Core Services Allowance</p>
        </div>
        <v-expansion-panels v-model="panel" multiple>
          <v-expansion-panel v-for="panelComponent in CORE_SERVICES_PANELS" :key="panelComponent.id" :value="panelComponent.id">
            <v-expansion-panel-title>
              <span class="supplementary-header-label">{{ panelComponent.title }}</span>
              <span v-if="isFundingActive(panelComponent.id, nextRenewalTerm)" class="active-label ml-9">Active</span>
            </v-expansion-panel-title>
            <v-expansion-panel-text>
              <IndigenousProgrammingAllowance
                v-if="panelComponent.id === INDIGENOUS"
                :indigenousProgrammingModel="getModel(SUPPLEMENTARY_TYPES.INDIGENOUS, nextRenewalTerm)"
                :formDisabled="formDisabled"
                @update="updateModel" />
              <SupportNeedsProgrammingAllowance
                v-if="panelComponent.id === SUPPORT_NEEDS"
                :supportModel="getModel(SUPPLEMENTARY_TYPES.SUPPORT, nextRenewalTerm)"
                :hasInclusionPolicy="currentOrg.hasInclusionPolicy"
                :formDisabled="formDisabled"
                @update="updateModel" />
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>

        <div class="supplementary-header">
          <p class="supplementary-header-label">Discretionary Services Allowance</p>
        </div>
        <v-expansion-panels v-model="panel" multiple>
          <v-expansion-panel :value="DISCRETIONARY_PANEL.id">
            <v-expansion-panel-title>
              <span class="supplementary-header-label">{{ DISCRETIONARY_PANEL.title }}</span>
              <span v-if="isFundingActive(DISCRETIONARY_PANEL.id, nextRenewalTerm)" class="active-label ml-9">Active</span>
            </v-expansion-panel-title>
            <v-expansion-panel-text>
              <TransportationAllowance
                :transportModels="getTransportModels(nextRenewalTerm)"
                :formDisabled="formDisabled"
                :renewalTerm="nextRenewalTerm"
                :startDate="getStartDate(nextRenewalTerm)"
                @update="updateModel"
                @add-model="addBlankTransportModel"
                @delete-model="deleteTransportModel"
                @delete-document="deleteDocument" />
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
      </template>
    </div>
  </v-form>
</template>

<script>
import AppAlertBanner from '@/components/ui/AppAlertBanner.vue'
import AppButton from '@/components/ui/AppButton.vue'
import AppDialog from '@/components/ui/AppDialog.vue'
import AppLabel from '@/components/ui/AppLabel.vue'
import ApplicationService from '@/services/applicationService'
import DocumentService from '@/services/documentService'
import IndigenousProgrammingAllowance from '@/components/supp-allowances/IndigenousProgrammingAllowance.vue'
import SupportNeedsProgrammingAllowance from '@/components/supp-allowances/SupportNeedsProgrammingAllowance.vue'
import TransportationAllowance from '@/components/supp-allowances/TransportationAllowance.vue'
import alertMixin from '@/mixins/alertMixin'
import permissionsMixin from '@/mixins/permissionsMixin'
import { isEmpty, isEqual, cloneDeep } from 'lodash'
import { SUPPLEMENTARY_TYPES, VIRUS_SCAN_ERROR_MESSAGE, GOOD_STANDING_STATUS_CODES, SUPPLEMENTARY_APPLICATION_STATUS_CODES, NOT_IN_GOOD_STANDING_WARNING_MESSAGE } from '@/utils/constants'
import { uuid } from 'vue-uuid'
import { mapState } from 'pinia'
import { useOrgStore } from '@/stores/org'
import { isApplicationLocked } from '@/utils/common'
import { SUPP_TERM_CODES, CORE_SERVICES_PANELS, DISCRETIONARY_PANEL } from '@/utils/constants/suppConstants'
import format from '@/utils/format'
import moment from 'moment'

const DAYS_BEFORE_TERM_EXPIRES = 1
const DAYS_BEFORE_NEXT_TERM_ENABLED = 120
const TWO_YEARS = 732

export default {
  name: 'SupplementaryFormView',
  components: { AppAlertBanner, AppButton, AppDialog, AppLabel, IndigenousProgrammingAllowance, SupportNeedsProgrammingAllowance, TransportationAllowance },
  mixins: [alertMixin, permissionsMixin],
  props: {
    applicationId: {
      type: String,
      default: undefined,
    },
    fundingAgreement: {
      type: Object,
      default: () => {
        return {}
      },
      required: true,
    },
    back: {
      type: Boolean,
      default: false,
    },
    save: {
      type: Boolean,
      default: false,
    },
    next: {
      type: Boolean,
      default: false,
    },
    cancel: {
      type: Boolean,
      default: false,
    },
    submit: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['process', 'setSubmit', 'setNext'],
  data() {
    return {
      loading: true,
      panel: [],
      models: undefined,
      clonedModels: [],
      documentsToDelete: [],
      showCancelDialog: false,
      renewalTerm: undefined,
      nextRenewalTerm: undefined,
      isNextTermEnabled: false,
      currentTermDisabled: false,
      nextTermActive: false,
      fundingExpiryDate: undefined,
      isFundingTermComplete: false,
    }
  },
  computed: {
    ...mapState(useOrgStore, ['currentOrg']),
    allPanelIDs() {
      const allPanels = [...this.CORE_SERVICES_PANELS, this.DISCRETIONARY_PANEL]
      return allPanels?.map((panel) => panel.id)
    },
    hasGoodStanding() {
      return this.currentOrg?.goodStandingStatusCode === GOOD_STANDING_STATUS_CODES.GOOD
    },
    formDisabled() {
      //disable all components on the form if user is in bad standing or does not have correct permissions
      return !this.hasGoodStanding || !this.hasPermission(this.PERMISSIONS.APPLY_FOR_FUNDING)
    },
    transportAppsHaveZero() {
      return this.models
        .filter((el) => el.supplementaryType === SUPPLEMENTARY_TYPES.TRANSPORT)
        ?.some((el) => el?.odometer === 0 || el?.odometer === '0' || el?.estimatedMileage === 0 || el?.estimatedMileage === '0')
    },
  },
  watch: {
    back: {
      async handler() {
        if (this.hasPermission(this.PERMISSIONS.APPLY_FOR_FUNDING)) {
          await this.saveApplication()
        }
        this.$router.push({ name: 'applications-history' })
      },
    },
    cancel: {
      handler() {
        this.toggleCancelDialog()
      },
    },
    save: {
      async handler() {
        await this.saveApplication(true)
      },
    },
    next: {
      async handler() {
        if (this.transportAppsHaveZero) {
          await this.$refs.form?.validate()
          return
        } else if (this.hasPermission(this.PERMISSIONS.APPLY_FOR_FUNDING)) {
          await this.saveApplication()
        }
        const applicationId = this.applicationId ? this.applicationId : this.$route.params.applicationGuid
        this.$router.push({ name: 'supp-allowances-submit', params: { applicationGuid: applicationId } })
      },
    },
  },
  async created() {
    this.format = format
    this.TRANSPORTATION = 'transportation'
    this.SUPPORT_NEEDS = 'support-needs'
    this.INDIGENOUS = 'indigenous'
    this.CORE_SERVICES_PANELS = CORE_SERVICES_PANELS
    this.DISCRETIONARY_PANEL = DISCRETIONARY_PANEL
    this.panel = this.allPanelIDs
    this.SUPPLEMENTARY_TYPES = SUPPLEMENTARY_TYPES
    this.NOT_IN_GOOD_STANDING_WARNING_MESSAGE = NOT_IN_GOOD_STANDING_WARNING_MESSAGE

    this.setSuppTermDates()
    await this.loadData()
  },
  methods: {
    isEmpty,
    togglePanel() {
      this.panel = isEmpty(this.panel) ? this.allPanelIDs : []
    },
    async loadData() {
      try {
        this.loading = true
        this.$emit('process', true)
        if (this.$route?.query?.nextTerm === 'true') {
          this.setActiveTerm(true)
        }
        this.setUpDefaultNewRequestModel(await ApplicationService.getSupplementaryApplicationsForForm(this.applicationId))
      } catch (error) {
        this.setFailureAlert('Failed to load Allowances applications', error)
      }
    },
    async saveApplication(showAlert = false) {
      if (this.transportAppsHaveZero) {
        await this.$refs.form?.validate()
        this.setFailureAlert('Failed to save Transportation Allowance')
        return
      }
      try {
        this.loading = true
        this.$emit('process', true)
        for (const applicationModel of this.models) {
          if (this.isModelSame(applicationModel)) {
            continue
          } else if (this.isModelEmpty(applicationModel) || applicationModel.toDelete) {
            await ApplicationService.deleteSupplementaryApplication(applicationModel.supplementaryApplicationId)
            delete applicationModel.supplementaryApplicationId
            continue
          }

          if (applicationModel.invalidDate) {
            applicationModel.retroactiveDate = null
          }

          const payload = {
            ...applicationModel,
            applicationId: this.applicationId,
          }

          if (payload.monthlyLease) {
            payload.monthlyLease = Number(payload.monthlyLease)
          }

          if (applicationModel.supplementaryApplicationId) {
            await ApplicationService.updateSupplementaryApplication(applicationModel.supplementaryApplicationId, payload)
          } else {
            const response = await ApplicationService.createSupplementaryApplication(payload)
            applicationModel.supplementaryApplicationId = response.supplementaryApplicationId
          }

          if (this.documentsToDelete.length > 0) {
            for (const documentID of this.documentsToDelete) {
              await DocumentService.deleteDocument(documentID)
            }
            this.documentsToDelete = []
          }
          if (applicationModel.documentsToUpload) {
            try {
              await DocumentService.createDocuments(applicationModel.documentsToUpload, applicationModel.supplementaryApplicationId)
            } catch (error) {
              if (error?.response?.data?.status === 422) {
                this.setFailureAlert(VIRUS_SCAN_ERROR_MESSAGE, error)
              } else {
                this.setFailureAlert('Failed to upload files', error)
              }
            }
          }
        }
        await this.loadData()
        this.clonedModels = cloneDeep(this.models)
        if (showAlert) {
          this.setSuccessAlert('Application saved successfully')
        }
      } catch (error) {
        this.setFailureAlert('Failed to save Allowances application', error)
        this.loading = false
        this.$emit('process', false)
      }
    },
    async setUpDefaultNewRequestModel(suppApplications) {
      const indigenousProgrammingModel = {
        indigenousFundingModel: [],
        indigenousOtherDescription: null,
        supplementaryApplicationId: undefined,
        supplementaryType: SUPPLEMENTARY_TYPES.INDIGENOUS,
      }

      const supportModel = {
        supportFundingModel: [],
        supportOtherDescription: null,
        supplementaryApplicationId: undefined,
        supplementaryType: SUPPLEMENTARY_TYPES.SUPPORT,
      }

      this.models = [{ ...this.findAndUpdateModel(suppApplications, indigenousProgrammingModel, this.renewalTerm) }, { ...this.findAndUpdateModel(suppApplications, supportModel, this.renewalTerm) }]

      const transportApplications = suppApplications.filter((el) => el.supplementaryType === SUPPLEMENTARY_TYPES.TRANSPORT)

      this.updateTransportModel(transportApplications, this.renewalTerm)

      if (this.isNextTermEnabled) {
        this.models.push(
          { ...this.findAndUpdateModel(suppApplications, indigenousProgrammingModel, this.nextRenewalTerm) },
          { ...this.findAndUpdateModel(suppApplications, supportModel, this.nextRenewalTerm) },
        )
        this.updateTransportModel(transportApplications, this.nextRenewalTerm)
      }

      if (transportApplications.length > 0) {
        for (const application of transportApplications) {
          application.uploadedDocuments = await DocumentService.getDocuments(application.supplementaryApplicationId)
          application.documentsToUpload = []
          application.retroactiveDate = application.retroactiveDate ? this.format.formatTwoMonthDate(application.retroactiveDate) : null
        }
        this.models = [...this.models, ...transportApplications]
      }
      this.clonedModels = cloneDeep(this.models)
      this.setNext()
      this.loading = false
      this.$emit('process', false)
    },
    updateModel(updatedModel) {
      let index = this.models.indexOf(this.models.find((el) => updatedModel.supplementaryApplicationId && el.supplementaryApplicationId == updatedModel.supplementaryApplicationId))

      if (index === -1) {
        index = this.models.indexOf(this.models.find((el) => el.id === updatedModel.id))
      }
      this.models[index] = updatedModel

      this.setNext()
    },
    isModelSame(applicationModel) {
      return isEqual(
        this.clonedModels?.find((el) => {
          if (applicationModel.supplementaryApplicationId) {
            return el.supplementaryApplicationId === applicationModel.supplementaryApplicationId
          }
          return el.id === applicationModel.id
        }),
        applicationModel,
      )
    },
    getModel(type, currentTerm) {
      return this.models?.find((el) => el.supplementaryType === type && el.renewalTerm === currentTerm)
    },
    getTransportModels(term) {
      return this.models?.filter((el) => el.supplementaryType === SUPPLEMENTARY_TYPES.TRANSPORT && el.renewalTerm === term)
    },
    findAndUpdateModel(suppApplications, modelToUpdate, renewalTerm) {
      const foundApp = suppApplications.find((application) => application.supplementaryType === modelToUpdate.supplementaryType && application.renewalTerm == renewalTerm)
      modelToUpdate.renewalTerm = renewalTerm
      modelToUpdate.id = uuid.v4()
      return foundApp ?? modelToUpdate
    },
    updateTransportModel(transportApplications, term) {
      const foundApp = transportApplications.find((application) => application.renewalTerm == term)
      if (!foundApp) {
        this.addBlankTransportModel({
          monthlyLease: 0.0,
          estimatedMileage: null,
          odometer: null,
          VIN: null,
          supplementaryApplicationId: undefined,
          supplementaryType: SUPPLEMENTARY_TYPES.TRANSPORT,
          uploadedDocuments: [],
          documentsToUpload: [],
          id: uuid.v4(),
          renewalTerm: term,
          retroactiveDate: null,
        })
      }
    },
    isModelEmpty(model) {
      let modelData = { ...model }

      delete modelData.supplementaryApplicationId
      delete modelData.supplementaryType
      delete modelData.indigenousOtherDescription
      delete modelData.supportOtherDescription
      delete modelData.id
      delete modelData.statusCode
      delete modelData.startDate
      delete modelData.endDate
      delete modelData.renewalTerm

      //the first time a user selects a date - it will be a Date obj, which always returns true with .isEmpty
      modelData.retroactiveDate = modelData?.retroactiveDate ? String(modelData.retroactiveDate) : null

      //we delete the fields above because they will always have a value - so when running our isEmpty check below- those fields would fail the isEmpty check-
      //and then our application would be trying to save empty models.
      return Object.values(modelData).every((value) => {
        return isEmpty(value)
      })
    },
    addBlankTransportModel(transportModel) {
      this.models.push(transportModel)
    },
    deleteTransportModel(model) {
      //application exists in Dynamics, so flag it to get deleted on save
      if (model.supplementaryApplicationId) {
        this.models[this.models.indexOf(this.models.find((el) => el.supplementaryApplicationId == model.supplementaryApplicationId))].toDelete = true
      } else {
        //remove it from the list because we have nothing to delete from dynamics
        this.models.splice(this.models.indexOf(this.models.find((el) => el.id === model.id)), 1)
      }
    },
    deleteDocument(documentId) {
      this.documentsToDelete.push(documentId)
    },
    toggleCancelDialog() {
      this.showCancelDialog = !this.showCancelDialog
    },
    setNext() {
      this.$emit(
        'setNext',
        this.models.every((el) => {
          if (el.statusCode && isApplicationLocked(el.statusCode)) {
            return true
          }
          return this.isModelEmpty(el)
        }),
      )
    },
    setSuppTermDates() {
      const today = new Date()
      const formattedEndDate = moment(this.fundingAgreement?.endDate).endOf('day').toDate()
      const formattedStartDate = new Date(this.fundingAgreement.startDate)
      const daysOfTerm = Math.floor(moment.duration(moment(formattedEndDate).diff(moment(formattedStartDate))).asDays())
      let termTwoEndDate
      let termOneEndDate

      //ofmcc-6357- allow supp terms to work with both a FA term of 2 and 3 years in length
      //this will account for leap years as a standard non leap year term would be 729 days.
      if (daysOfTerm > TWO_YEARS) {
        termTwoEndDate = moment(formattedEndDate).subtract(1, 'years').endOf('day').toDate()
        termOneEndDate = moment(formattedEndDate).subtract(2, 'years').endOf('day').toDate()
      } else {
        termTwoEndDate = formattedEndDate
        termOneEndDate = moment(formattedEndDate).subtract(1, 'years').endOf('day').toDate()
      }

      switch (true) {
        //not having a funding agreement or FA end date will only happen if a user navigates to SuppApp right after
        //OFM core creation. They moved too quickly and the FA did not have time to generate in Dynamics before returning.
        //In this case, we can safely assume they are in term 1. Upon refresh, the FA will exist.
        case today < termOneEndDate || !this.fundingAgreement?.endDate:
          this.fundingExpiryDate = termOneEndDate
          this.renewalTerm = SUPP_TERM_CODES.TERM_ONE
          this.nextRenewalTerm = SUPP_TERM_CODES.TERM_TWO
          this.setIsCurrentTermDisabled(termOneEndDate, today)
          this.setIsNextTermEnabled(termOneEndDate, today)
          break

        case today < termTwoEndDate:
          this.fundingExpiryDate = termTwoEndDate
          this.renewalTerm = SUPP_TERM_CODES.TERM_TWO
          this.nextRenewalTerm = SUPP_TERM_CODES.TERM_THREE
          this.setIsCurrentTermDisabled(termTwoEndDate, today)
          if (daysOfTerm > TWO_YEARS) {
            this.setIsNextTermEnabled(termTwoEndDate, today)
          }

          break

        case today < formattedEndDate && daysOfTerm > TWO_YEARS:
          this.fundingExpiryDate = formattedEndDate
          this.renewalTerm = SUPP_TERM_CODES.TERM_THREE
          this.setIsCurrentTermDisabled(formattedEndDate, today)
          break

        default:
          //outside of funding term, so most recent term should be read only? we don't have requirements on this
          this.renewalTerm = SUPP_TERM_CODES.TERM_THREE
          this.currentTermDisabled = true
      }

      this.setIsNearTermEndDate(formattedEndDate, today)
    },
    setIsCurrentTermDisabled(termEndDate, today) {
      const priorDate = moment(termEndDate).subtract(DAYS_BEFORE_TERM_EXPIRES, 'days').toDate()
      this.currentTermDisabled = today > priorDate
    },
    setIsNextTermEnabled(termEndDate, today) {
      const priorDate = moment(termEndDate).subtract(DAYS_BEFORE_NEXT_TERM_ENABLED, 'days').toDate()
      this.isNextTermEnabled = today > priorDate
    },
    setIsNearTermEndDate(formattedEndDate, today) {
      const priorDate = moment(formattedEndDate).subtract(DAYS_BEFORE_TERM_EXPIRES, 'days').toDate()
      this.isFundingTermComplete = today > priorDate || today > formattedEndDate
    },
    setActiveTerm(value) {
      this.nextTermActive = value
    },
    isFundingActive(panel, term) {
      switch (panel) {
        case this.TRANSPORTATION: {
          const models = this.getTransportModels(term)
          return models.some((el) => el.statusCode == SUPPLEMENTARY_APPLICATION_STATUS_CODES.APPROVED)
        }
        case this.SUPPORT_NEEDS:
          return this.getModel(SUPPLEMENTARY_TYPES.SUPPORT, term)?.statusCode == SUPPLEMENTARY_APPLICATION_STATUS_CODES.APPROVED
        case this.INDIGENOUS:
          return this.getModel(SUPPLEMENTARY_TYPES.INDIGENOUS, term)?.statusCode == SUPPLEMENTARY_APPLICATION_STATUS_CODES.APPROVED
      }
    },
    getStartDate(term) {
      const termTwoStartDate = moment(new Date(this.fundingAgreement.startDate)).add(1, 'years').toDate()
      const termThreeStartDate = moment(new Date(this.fundingAgreement.startDate)).add(2, 'years').toDate()

      switch (true) {
        case term === SUPP_TERM_CODES.TERM_ONE:
          return this.format.formatTwoMonthDate(this.fundingAgreement.startDate)

        case term === SUPP_TERM_CODES.TERM_TWO:
          return this.format.formatTwoMonthDate(termTwoStartDate)

        case term === SUPP_TERM_CODES.TERM_THREE:
          return this.format.formatTwoMonthDate(termThreeStartDate)
      }
    },
  },
}
</script>
<style scoped>
.active-label {
  font-weight: 700;
  font-size: 18px;
  color: green;
}
</style>
