<template>
  <v-form ref="form">
    <v-row no-gutters class="mb-2">
      <v-col cols="12" align="right">
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
              <IndigenousProgrammingAllowance :indigenousProgrammingModel="getModel(SUPPLEMENTARY_TYPES.INDIGENOUS)" @update="updateModel" v-if="panel.id === 'indigenous'" />
              <SupportNeedsProgrammingAllowance v-if="panel.id === 'support-needs'" />
              <TransportationAllowance v-if="panel.id === 'transportation'" />
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
    await this.loadData()
    this.SUPPLEMENTARY_TYPES = SUPPLEMENTARY_TYPES
    this.loading = false
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
    setUpDefaultNewRequestModel(suppApplications) {
      const indigenousProgrammingModel = {
        indigenousFundingModel: [],
        indigenousOtherDescription: null,
        supplementaryApplicationId: undefined,
        supplementaryType: SUPPLEMENTARY_TYPES.INDIGENOUS,
      }

      this.models = [{ ...this.findAndUpdateModel(suppApplications, indigenousProgrammingModel) }]

      this.clonedModels = cloneDeep(this.models)
    },
    updateModel(updatedModel) {
      const index = this.models.indexOf(this.getModel(updatedModel.supplementaryType))
      this.models[index] = updatedModel
    },
    isModelSame(applicationModel) {
      return isEqual(
        this.clonedModels?.find((el) => el.supplementaryApplicationId == applicationModel.supplementaryApplicationId),
        applicationModel,
      )
    },
    getModel(type) {
      return this.models?.find((el) => el.supplementaryType == type)
    },
    findAndUpdateModel(suppApplications, modelToUpdate) {
      const found = suppApplications.find((application) => application.supplementaryType === modelToUpdate.supplementaryType)
      return found ? found : modelToUpdate
    },
    isModelEmpty(model) {
      let modelData = { ...model }

      delete modelData.supplementaryApplicationId
      delete modelData.supplementaryType

      return Object.values(modelData).some((value) => {
        return value?.length === 0
      })
    },
  },
}
</script>
<style scoped>
.header-label {
  font-weight: 700;
  font-size: 20px;
}
:deep(.v-label) {
  opacity: 1;
}
</style>
