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
              <IndigenousProgrammingAllowance :indigenousProgrammingModel="this.indigenousProgrammingModel" @update="updateIndigenousModel" v-if="page.id === 'indigenous'" />
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
import { isEmpty } from 'lodash'
import { useApplicationsStore } from '@/stores/applications'
import { mapActions } from 'pinia'
import ApplicationService from '@/services/applicationService'

function findAndUpdateModel(suppApplications, modelToUpdate) {
  let found = suppApplications.find((application) => application.supplementaryType === modelToUpdate.supplementaryType)
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

//TODO: check if existing applications are updated

export default {
  name: 'SupplementaryFormView',
  components: { AppButton, IndigenousProgrammingAllowance, SupportNeedsProgrammingAllowance, TransportationAllowance },
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
      indigenousProgrammingModel: {},
      transportModel: {},
      supportModel: {},
      hasUpdated: false,
    }
  },
  computed: {
    allPageIDs() {
      return this.PAGES?.map((page) => page.id)
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
        const models = [this.indigenousProgrammingModel, this.transportModel]

        models.forEach(async (applicationModel) => {
          //no data and no existing supplementary Application, skip adding to payload
          //TODO: check if data has changed, if no change should also skip
          if (isModelEmpty(applicationModel) && !applicationModel.supplementaryApplicationId) {
            return
          } else if (isModelEmpty(applicationModel)) {
            await ApplicationService.deleteSupplementaryApplication(applicationModel.supplementaryApplicationId)
            delete applicationModel.supplementaryApplicationId
            return
          }

          const payload = {
            ...applicationModel,
            applicationId: this.applicationId,
          }

          if (applicationModel.supplementaryApplicationId) {
            await ApplicationService.updateSupplementaryApplication(applicationModel.supplementaryApplicationId, payload)
          } else {
            //post
            let response = await ApplicationService.createSupplementaryApplication(payload)
            applicationModel.supplementaryApplicationId = response.supplementaryApplicationId
          }
        })
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
    ...mapActions(useApplicationsStore, ['getSupplementaryApplications']),
    isEmpty,
    togglePanel() {
      this.panel = isEmpty(this.panel) ? this.allPageIDs : []
    },
    async loadData() {
      this.setUpDefaultNewRequestModel(await this.getSupplementaryApplications(this.applicationId))
    },
    setUpDefaultNewRequestModel(suppApplications) {
      let indigenousProgrammingModel = {
        indigenousFundingModel: [],
        indigenousOtherDescription: null,
        supplementaryApplicationId: undefined,
        supplementaryType: 2,
      }

      let supportModel = { test: 'test', supplementaryType: 1 }
      let transportModel = { test: '', supplementaryType: 3 }

      this.transportModel = findAndUpdateModel(suppApplications, transportModel)
      this.indigenousProgrammingModel = findAndUpdateModel(suppApplications, indigenousProgrammingModel)
      this.supportModel = findAndUpdateModel(suppApplications, supportModel)
    },
    updateIndigenousModel(updatedModel) {
      this.indigenousProgrammingModel = updatedModel //funding model is an array
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
