<!-- eslint-disable vue/attribute-hyphenation -->
<template>
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
    <div>
      <v-skeleton-loader :loading="loading" type="table-tbody">
        <v-expansion-panels v-model="panel" multiple>
          <v-expansion-panel v-for="panel in PANELS" :key="panel.id" :value="panel.id">
            <v-expansion-panel-title>
              <span class="header-label">{{ panel.title }}</span>
            </v-expansion-panel-title>
            <v-expansion-panel-text>
              <IndigenousProgrammingAllowance v-if="panel.id === 'indigenous'" :indigenousProgrammingModel="getModel(SUPPLEMENTARY_TYPES.INDIGENOUS)" @update="updateModel" />
              <SupportNeedsProgrammingAllowance v-if="panel.id === 'support-needs'" :supportModel="getModel(SUPPLEMENTARY_TYPES.SUPPORT)" @update="updateModel" />
              <TransportationAllowance
                v-if="panel.id === 'transportation'"
                :transportModels="getTransportModels()"
                @update="updateModel"
                @addModel="addBlankTransportModel()"
                @deleteModel="deleteTransportModel" />
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-skeleton-loader>
    </div>
  </v-form>
</template>

<script>
import AppButton from '@/components/ui/AppButton.vue'
import IndigenousProgrammingAllowance from '@/components/supp-allowances/IndigenousProgrammingAllowance.vue'
import SupportNeedsProgrammingAllowance from '@/components/supp-allowances/SupportNeedsProgrammingAllowance.vue'
import TransportationAllowance from '@/components/supp-allowances/TransportationAllowance.vue'
import { isEmpty, isEqual, cloneDeep } from 'lodash'
import ApplicationService from '@/services/applicationService'
import alertMixin from '@/mixins/alertMixin'
import { SUPPLEMENTARY_TYPES } from '@/utils/constants'
import { uuid } from 'vue-uuid'
import DocumentService from '@/services/documentService'

export default {
  name: 'SupplementaryFormView',
  components: { AppButton, IndigenousProgrammingAllowance, SupportNeedsProgrammingAllowance, TransportationAllowance },
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
  },
  emits: ['process'],
  data() {
    return {
      loading: false,
      panel: [],
      models: undefined,
      clonedModels: [],
    }
  },
  computed: {
    allPanelIDs() {
      return this.PANELS?.map((panel) => panel.id)
    },
  },
  watch: {
    back: {
      handler() {
        this.$router.push({ name: 'applications-history' })
      },
    },
    save: {
      async handler() {
        try {
          for (let applicationModel of this.models) {
            if (this.isModelSame(applicationModel)) {
              continue
            } else if (this.isModelEmpty(applicationModel)) {
              await ApplicationService.deleteSupplementaryApplication(applicationModel.supplementaryApplicationId)
              delete applicationModel.supplementaryApplicationId
              continue
            }

            const payload = {
              ...applicationModel,
              applicationId: this.applicationId,
            }

            if (applicationModel.supplementaryApplicationId) {
              await ApplicationService.updateSupplementaryApplication(applicationModel.supplementaryApplicationId, payload)
            } else {
              const response = await ApplicationService.createSupplementaryApplication(payload)
              applicationModel.supplementaryApplicationId = response.supplementaryApplicationId
            }
          }

          this.clonedModels = cloneDeep(this.models)

          this.setSuccessAlert(`Application Saved`)
        } catch (error) {
          this.setFailureAlert('Failed to save supplementary applications')
        }
      },
    },
    next: {
      handler() {
        const applicationId = this.applicationId ? this.applicationId : this.$route.params.applicationGuid
        this.$router.push({ name: 'supp-allowances-submit', params: { applicationGuid: applicationId } })
      },
    },
  },
  async created() {
    this.loading = true
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
    isEmpty,
    togglePanel() {
      this.panel = isEmpty(this.panel) ? this.allPanelIDs : []
    },
    async loadData() {
      try {
        this.setUpDefaultNewRequestModel(await ApplicationService.getSupplementaryApplications(this.applicationId))
      } catch (error) {
        this.setFailureAlert('Failed to load supplementary applications')
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

      const transportApplications = suppApplications.filter((el) => el.supplementaryType == SUPPLEMENTARY_TYPES.TRANSPORT)

      if (transportApplications.length > 0) {
        for (const application of transportApplications) {
          application.documents = await DocumentService.getDocuments(application.supplementaryApplicationId)
        }
        this.models = [...this.models, ...transportApplications]
      } else {
        this.addBlankTransportModel()
      }

      this.clonedModels = cloneDeep(this.models)
      this.loading = false
    },
    updateModel(updatedModel) {
      let index = this.models.indexOf(this.models.find((el) => updatedModel.supplementaryApplicationId && el.supplementaryApplicationId == updatedModel.supplementaryApplicationId))

      if (index === -1) {
        index = this.models.indexOf(this.models.find((el) => el.id == updatedModel.id))
      }
      this.models[index] = updatedModel
    },
    isModelSame(applicationModel) {
      return isEqual(
        this.clonedModels?.find((el) => {
          if (applicationModel.supplementaryApplicationId) {
            return el.supplementaryApplicationId == applicationModel.supplementaryApplicationId
          }
          return el.id == applicationModel.id
        }),
        applicationModel,
      )
    },
    getModel(type) {
      return this.models?.find((el) => el.supplementaryType == type)
    },
    getTransportModels() {
      return this.models?.filter((el) => el.supplementaryType == SUPPLEMENTARY_TYPES.TRANSPORT)
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

      return Object.values(modelData).every((value) => {
        return isEmpty(value)
      })
    },
    addBlankTransportModel() {
      const transportModel = {
        supportFundingModel: [],
        supportOtherDescription: null,
        supplementaryApplicationId: undefined,
        supplementaryType: SUPPLEMENTARY_TYPES.TRANSPORT,
        documents: [],
        id: uuid.v1(),
      }

      this.models.push(transportModel)
    },
    async deleteTransportModel(model) {
      let index = this.models.indexOf(this.models.find((el) => model.supplementaryApplicationId && el.supplementaryApplicationId == model.supplementaryApplicationId))

      //application exists in Dynamics, so we need to delete it first
      if (index != -1) {
        await ApplicationService.deleteSupplementaryApplication(model.supplementaryApplicationId)
      } else {
        index = this.models.indexOf(this.models.find((el) => el.id == model.id))
      }
      //remove it from display
      this.models.splice(index, 1)
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
