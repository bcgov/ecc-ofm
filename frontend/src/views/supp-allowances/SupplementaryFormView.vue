<!-- eslint-disable vue/attribute-hyphenation -->
<template>
  <p class="my-11">
    Currently, there are three Operating Funding Model Allowances available. Please check them and apply for
    <strong class="text-decoration-underline">one or all</strong>
    that applies to your organization.
  </p>

  <AppAlertBanner v-if="currentTermDisabled" type="warning">
    <div>Your current term funding is ending and you are no longer able to make changes. Please apply for Next Term</div>
  </AppAlertBanner>

  <v-form ref="form">
    <v-row no-gutters class="mb-2">
      <v-col cols="12" lg="1" class="">
        <AppLabel>Application Term:</AppLabel>
      </v-col>

      <!-- These buttons should always be enabled/disabled with FA dates as we might not have a supp app date to go off of-->
      <v-col cols="6" lg="2" class="d-flex flex-column align-end">
        <AppButton id="current-term-button" class="mr-1" :active="!nextTermActive" :primary="false" size="large" width="200px" @click="setActiveTerm(false)">Current Term</AppButton>
      </v-col>
      <v-col cols="6" lg="2" class="">
        <AppButton id="next-term-button" :active="nextTermActive" :primary="false" :disabled="!isNextTermEnabled" size="large" width="200px" @click="setActiveTerm(true)">Next Term</AppButton>
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
    <!-- I use v-show here because if I use a v-if, this component has issues re-rendering if a user switches between two apps quickly -->
    <div v-show="!nextTermActive">
      <v-skeleton-loader v-if="loading" :loading="loading" type="table-tbody"></v-skeleton-loader>
      <v-expansion-panels v-else v-model="panel" multiple>
        <v-expansion-panel v-for="panel in PANELS" :key="panel.id" :value="panel.id">
          <v-expansion-panel-title>
            <span class="header-label">{{ panel.title }}</span>
            <span v-if="isFundingActive(panel.id, renewalTerm)" class="active-label ml-9">Active</span>
          </v-expansion-panel-title>
          <v-expansion-panel-text>
            <IndigenousProgrammingAllowance
              v-if="panel.id === INDIGENOUS"
              :indigenousProgrammingModel="getModel(SUPPLEMENTARY_TYPES.INDIGENOUS, renewalTerm)"
              @update="updateModel"
              :formDisabled="currentTermDisabled || formDisabled" />
            <SupportNeedsProgrammingAllowance
              v-if="panel.id === SUPPORT_NEEDS"
              :supportModel="getModel(SUPPLEMENTARY_TYPES.SUPPORT, renewalTerm)"
              :hasInclusionPolicy="currentOrg.hasInclusionPolicy"
              :formDisabled="currentTermDisabled || formDisabled"
              @update="updateModel" />
            <TransportationAllowance
              v-if="panel.id === TRANSPORTATION"
              :transportModels="getTransportModels(renewalTerm)"
              :formDisabled="currentTermDisabled || formDisabled"
              :renewalTerm="renewalTerm"
              @update="updateModel"
              @addModel="addBlankTransportModel"
              @deleteModel="deleteTransportModel"
              @deleteDocument="deleteDocument" />
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>
    </div>
    <div v-if="nextTermActive">
      <v-skeleton-loader v-if="loading" :loading="loading" type="table-tbody"></v-skeleton-loader>
      <v-expansion-panels v-else v-model="panel" multiple>
        <v-expansion-panel v-for="panel in PANELS" :key="panel.id" :value="panel.id">
          <v-expansion-panel-title>
            <span class="header-label">{{ panel.title }}</span>
            <span v-if="isFundingActive(panel.id, nextRenewalTerm)" class="active-label ml-9">Active</span>
          </v-expansion-panel-title>
          <v-expansion-panel-text>
            <IndigenousProgrammingAllowance
              v-if="panel.id === INDIGENOUS"
              :indigenousProgrammingModel="getModel(SUPPLEMENTARY_TYPES.INDIGENOUS, nextRenewalTerm)"
              @update="updateModel"
              :formDisabled="formDisabled" />
            <SupportNeedsProgrammingAllowance
              v-if="panel.id === SUPPORT_NEEDS"
              :supportModel="getModel(SUPPLEMENTARY_TYPES.SUPPORT, nextRenewalTerm)"
              :hasInclusionPolicy="currentOrg.hasInclusionPolicy"
              :formDisabled="formDisabled"
              @update="updateModel" />
            <TransportationAllowance
              v-if="panel.id === TRANSPORTATION"
              :transportModels="getTransportModels(nextRenewalTerm)"
              :formDisabled="formDisabled"
              :renewalTerm="nextRenewalTerm"
              @update="updateModel"
              @addModel="addBlankTransportModel"
              @deleteModel="deleteTransportModel"
              @deleteDocument="deleteDocument" />
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>
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
import { mapState, mapActions } from 'pinia'
import { useAuthStore } from '@/stores/auth'
import { useOrgStore } from '@/stores/org'
import { isApplicationLocked } from '@/utils/common'
import { SUPP_TERM_CODES } from '@/utils/constants/suppConstants'

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
    }
  },
  computed: {
    ...mapState(useAuthStore, ['userInfo']),
    ...mapState(useOrgStore, ['currentOrg']),
    allPanelIDs() {
      return this.PANELS?.map((panel) => panel.id)
    },
    hasGoodStanding() {
      return this.currentOrg?.goodStandingStatusCode === GOOD_STANDING_STATUS_CODES.GOOD
    },
    formDisabled() {
      //disable all components on the form if user is in bad standing or does not have correct permissions
      return !this.hasGoodStanding || !this.hasPermission(this.PERMISSIONS.APPLY_FOR_FUNDING)
    },
  },
  watch: {
    back: {
      async handler() {
        await this.saveApplication()
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
        await this.saveApplication()
        const applicationId = this.applicationId ? this.applicationId : this.$route.params.applicationGuid
        this.$router.push({ name: 'supp-allowances-submit', params: { applicationGuid: applicationId } })
      },
    },
  },
  async created() {
    this.TRANSPORTATION = 'transportation'
    this.SUPPORT_NEEDS = 'support-needs'
    this.INDIGENOUS = 'indigenous'
    this.PANELS = [
      {
        title: 'Indigenous Programming Allowance',
        id: this.INDIGENOUS,
      },
      {
        title: 'Support Needs Programming Allowance',
        id: this.SUPPORT_NEEDS,
      },
      {
        title: 'Transportation Allowance',
        id: this.TRANSPORTATION,
      },
    ]
    this.panel = this.allPanelIDs
    this.SUPPLEMENTARY_TYPES = SUPPLEMENTARY_TYPES
    this.NOT_IN_GOOD_STANDING_WARNING_MESSAGE = NOT_IN_GOOD_STANDING_WARNING_MESSAGE
    this.DAYS_BEFORE_TERM_EXPIRES = 45
    this.DAYS_BEFORE_NEXT_TERM_ENABLED = 120
    this.setSuppTermDates()
    await this.loadData()
  },
  methods: {
    ...mapActions(useOrgStore, ['getOrganizationInfo']),
    isEmpty,
    togglePanel() {
      this.panel = isEmpty(this.panel) ? this.allPanelIDs : []
    },
    async loadData() {
      try {
        this.loading = true
        this.$emit('process', true)
        if (!this.currentOrg) {
          await this.getOrganizationInfo(this.userInfo?.organizationId)
        }
        this.setUpDefaultNewRequestModel(await ApplicationService.getSupplementaryApplicationsForForm(this.applicationId))
      } catch (error) {
        this.setFailureAlert('Failed to load supplementary applications')
      }
    },
    async saveApplication(showAlert = false) {
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
          this.setSuccessAlert(`Application Saved`)
        }
      } catch (error) {
        this.setFailureAlert('Failed to save supplementary applications')
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
        id: uuid.v1(),
      }

      const supportModel = {
        supportFundingModel: [],
        supportOtherDescription: null,
        supplementaryApplicationId: undefined,
        supplementaryType: SUPPLEMENTARY_TYPES.SUPPORT,
        id: uuid.v1(),
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
          id: uuid.v1(),
          renewalTerm: term,
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

      const formattedEndDate = new Date(this.fundingAgreement.endDate)
      const termTwoEndDate = new Date(new Date(formattedEndDate).setFullYear(new Date(formattedEndDate).getFullYear() - 1))
      const termOneEndDate = new Date(new Date(termTwoEndDate).setFullYear(new Date(termTwoEndDate).getFullYear() - 1))

      switch (true) {
        case today < termOneEndDate:
          this.renewalTerm = SUPP_TERM_CODES.TERM_ONE
          this.nextRenewalTerm = SUPP_TERM_CODES.TERM_TWO
          this.setIsCurrentTermDisabled(termOneEndDate, today)
          this.setIsNextTermEnabled(termOneEndDate, today)
          break

        case today < termTwoEndDate:
          this.renewalTerm = SUPP_TERM_CODES.TERM_TWO
          this.nextRenewalTerm = SUPP_TERM_CODES.TERM_THREE
          this.setIsCurrentTermDisabled(termTwoEndDate, today)
          this.setIsNextTermEnabled(termTwoEndDate, today)
          break

        case today < formattedEndDate:
          this.renewalTerm = SUPP_TERM_CODES.TERM_THREE
          this.setIsCurrentTermDisabled(formattedEndDate, today)
          break

        default:
          //outside of funding term, so most recent term should be read only? we don't have requirements on this
          this.renewalTerm = SUPP_TERM_CODES.TERM_THREE
          this.currentTermDisabled = true
      }
    },
    setIsCurrentTermDisabled(termEndDate, today) {
      const priorDate = new Date(new Date(termEndDate).setDate(termEndDate.getDate() - this.DAYS_BEFORE_TERM_EXPIRES))
      this.currentTermDisabled = today > priorDate
    },
    setIsNextTermEnabled(termEndDate, today) {
      const priorDate = new Date(new Date(termEndDate).setDate(termEndDate.getDate() - this.DAYS_BEFORE_NEXT_TERM_ENABLED))
      this.isNextTermEnabled = today > priorDate
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
          return this.getModel(SUPPLEMENTARY_TYPES.SUPPORT, term).statusCode == SUPPLEMENTARY_APPLICATION_STATUS_CODES.APPROVED
        case this.INDIGENOUS:
          return this.getModel(SUPPLEMENTARY_TYPES.INDIGENOUS, term).statusCode == SUPPLEMENTARY_APPLICATION_STATUS_CODES.APPROVED
      }
    },
  },
}
</script>
<style scoped>
.header-label {
  font-weight: 700;
  font-size: 20px;
}
.active-label {
  font-weight: 700;
  font-size: 18px;
  color: green;
}
</style>
