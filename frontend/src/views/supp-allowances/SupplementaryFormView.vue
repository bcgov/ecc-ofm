<template>
  <v-form ref="form">
    <v-row no-gutters class="mb-2">
      <v-col cols="12" align="right">
        <AppButton @click="console.log(applicationId)">Click Me</AppButton>
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
              <IndigenousProgrammingAllowance :indigenousProgrammingModel="this.indigenousProgrammingModel" @update="updateModel" v-if="page.id === 'indigenous'" />
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
import { mapState, mapWritableState, mapActions } from 'pinia'

function findAndUpdateModel(suppApplications, modelToUpdate, supplementaryType) {
  let found = suppApplications.find((application) => application.supplementaryType === supplementaryType)
  if (!found) {
    return modelToUpdate
  } else {
    return found
  }
}

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
        // TODO
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
    console.log(this.applicationId)

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
      console.log('setting up model')
      let indigenousProgrammingModel = {
        indigenousFundingModel: [],
        indigenousOtherDescription: null,
        supplementaryApplicationId: undefined,
        supplementaryType: 2,
      }

      let transportModel = { test: 'test' }
      let supportModel = { test: 'test' }

      this.transportModel = findAndUpdateModel(suppApplications, transportModel, 1)
      this.indigenousProgrammingModel = findAndUpdateModel(suppApplications, indigenousProgrammingModel, 2)
      this.supportModel = findAndUpdateModel(suppApplications, supportModel, 3)

      // console.log(this.transportModel)
      // console.log(this.indigenousProgrammingModel)
      // console.log(this.supportModel)
    },
    updateModel(updatedModel) {
      console.log('incoming')
      console.log(updatedModel)
      this.indigenousProgrammingModel.indigenousFundingModel = updatedModel //funding model is an array
      console.log('updated')
      console.log(this.indigenousProgrammingModel.indigenousFundingModel)
      //Object.entries(updatedModel)?.forEach(([key, value]) => (this.model[key] = Number(value)))
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
