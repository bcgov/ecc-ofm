<!-- eslint-disable vue/attribute-hyphenation -->
<template>
  <p class="my-11">
    Currently, there are three Operating Funding Model Allowances available. Please check them and apply for
    <strong class="text-decoration-underline">one or all</strong>
    that applies to your organization.
  </p>
  <v-form ref="form">
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
    <div>
      <v-skeleton-loader v-if="loading" :loading="loading" type="table-tbody"></v-skeleton-loader>
      <v-expansion-panels v-else v-model="panel" multiple>
        <v-expansion-panel v-for="panel in PANELS" :key="panel.id" :value="panel.id">
          <v-expansion-panel-title>
            <span class="header-label">{{ panel.title }}</span>
          </v-expansion-panel-title>
          <v-expansion-panel-text>
            <IndigenousProgrammingAllowance v-if="panel.id === 'indigenous'" :indigenousProgrammingModel="getModel(SUPPLEMENTARY_TYPES.INDIGENOUS)" @update="updateModel" />
            <SupportNeedsProgrammingAllowance
              v-if="panel.id === 'support-needs'"
              :supportModel="getModel(SUPPLEMENTARY_TYPES.SUPPORT)"
              :hasInclusionPolicy="currentOrg.hasInclusionPolicy"
              @update="updateModel" />
            <TransportationAllowance
              v-if="panel.id === 'transportation'"
              :transportModels="getTransportModels()"
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
import AppButton from '@/components/ui/AppButton.vue'
import AppDialog from '@/components/ui/AppDialog.vue'
import ApplicationService from '@/services/applicationService'
import DocumentService from '@/services/documentService'
import IndigenousProgrammingAllowance from '@/components/supp-allowances/IndigenousProgrammingAllowance.vue'
import SupportNeedsProgrammingAllowance from '@/components/supp-allowances/SupportNeedsProgrammingAllowance.vue'
import TransportationAllowance from '@/components/supp-allowances/TransportationAllowance.vue'
import alertMixin from '@/mixins/alertMixin'
import { isEmpty, isEqual, cloneDeep } from 'lodash'
import { SUPPLEMENTARY_TYPES } from '@/utils/constants'
import { uuid } from 'vue-uuid'
import { mapState, mapActions } from 'pinia'
import { useAuthStore } from '@/stores/auth'
import { useOrgStore } from '@/stores/org'
import { isApplicationLocked } from '@/utils/common'

export default {
  name: 'SupplementaryFormView',
  components: { AppButton, AppDialog, IndigenousProgrammingAllowance, SupportNeedsProgrammingAllowance, TransportationAllowance },
  mixins: [alertMixin],
  props: {
    applicationId: {
      type: String,
      default: undefined,
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
      readonly: false, //will come later to support locked submitted apps
      showCancelDialog: false,
    }
  },
  computed: {
    allPanelIDs() {
      return this.PANELS?.map((panel) => panel.id)
    },
    ...mapState(useAuthStore, ['userInfo']),
    ...mapState(useOrgStore, ['currentOrg']),
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
    this.PANELS = [
      {
        title: 'Indigenous Programming Allowance',
        id: 'indigenous',
      },
      {
        title: 'Support Needs Programming Allowance',
        id: 'support-needs',
      },
      {
        title: 'Transportation Allowance',
        id: 'transportation',
      },
    ]
    this.panel = this.allPanelIDs
    this.SUPPLEMENTARY_TYPES = SUPPLEMENTARY_TYPES
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
              this.setFailureAlert('Failed to upload files')
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

      this.models = [{ ...this.findAndUpdateModel(suppApplications, indigenousProgrammingModel) }, { ...this.findAndUpdateModel(suppApplications, supportModel) }]

      const transportApplications = suppApplications.filter((el) => el.supplementaryType === SUPPLEMENTARY_TYPES.TRANSPORT)

      if (transportApplications.length > 0) {
        for (const application of transportApplications) {
          application.uploadedDocuments = await DocumentService.getDocuments(application.supplementaryApplicationId)
          application.documentsToUpload = []
        }
        this.models = [...this.models, ...transportApplications]
      } else {
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
        })
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
    getModel(type) {
      return this.models?.find((el) => el.supplementaryType === type)
    },
    getTransportModels() {
      return this.models?.filter((el) => el.supplementaryType === SUPPLEMENTARY_TYPES.TRANSPORT)
    },
    findAndUpdateModel(suppApplications, modelToUpdate) {
      const found = suppApplications.find((application) => application.supplementaryType === modelToUpdate.supplementaryType)
      return found ? found : modelToUpdate
    },
    isModelEmpty(model) {
      let modelData = { ...model }

      delete modelData.supplementaryApplicationId
      delete modelData.supplementaryType
      delete modelData.indigenousOtherDescription
      delete modelData.supportOtherDescription
      delete modelData.id
      delete modelData.statusCode

      return Object.values(modelData).every((value) => {
        return isEmpty(value)
      })
    },
    addBlankTransportModel(newModel) {
      this.models.push(newModel)
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
  },
}
</script>
<style scoped>
.header-label {
  font-weight: 700;
  font-size: 20px;
}
</style>
