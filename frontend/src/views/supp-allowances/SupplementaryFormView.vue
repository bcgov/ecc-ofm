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
          <v-expansion-panel v-for="page in PAGES" :key="page.id" :value="page.id">
            <v-expansion-panel-title>
              <span class="header-label">{{ page.title }}</span>
            </v-expansion-panel-title>
            <v-expansion-panel-text>
              <IndigenousProgrammingAllowance :indigenousProgrammingModel="getModel(getSupplementaryTypes.INDIGENOUS)" @update="updateModel" v-if="page.id === 'indigenous'" />
              <SupportNeedsProgrammingAllowance v-if="page.id === 'support-needs'" />
              <TransportationAllowance v-if="page.id === 'transportation'" />
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

function findAndUpdateModel(suppApplications, modelToUpdate) {
  const found = suppApplications.find((application) => application.supplementaryType === modelToUpdate.supplementaryType)
  if (!found) {
    //no existing application, a blank model is required
    return modelToUpdate
  } else {
    //use the application from dynamics
    return found
  }
}

//should add more in depth checks as model for transport will have string/number
function isModelEmpty(model) {
  let modelData = { ...model }

  delete modelData.supplementaryApplicationId
  delete modelData.supplementaryType

  return Object.values(modelData).some((value) => {
    return value?.length === 0
  })
}

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
    allPageIDs() {
      return this.PAGES?.map((page) => page.id)
    },
    getSupplementaryTypes() {
      return SUPPLEMENTARY_TYPES
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
            } else if (isModelEmpty(applicationModel)) {
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
    this.PAGES = [
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
    this.panel = this.allPageIDs
    await this.loadData()
    this.loading = false
  },
  methods: {
    isEmpty,
    togglePanel() {
      this.panel = isEmpty(this.panel) ? this.allPageIDs : []
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

      const supportModel = { test: 'support', supplementaryType: SUPPLEMENTARY_TYPES.SUPPORT }
      const transportModel = { test: 'transport', supplementaryType: SUPPLEMENTARY_TYPES.TRANSPORT }

      this.models = [
        { ...findAndUpdateModel(suppApplications, transportModel) },
        { ...findAndUpdateModel(suppApplications, indigenousProgrammingModel) },
        { ...findAndUpdateModel(suppApplications, supportModel) },
      ]

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
  },
}
</script>
<style scoped>
.header-label {
  font-weight: 700;
  font-size: 20px;
}
</style>
