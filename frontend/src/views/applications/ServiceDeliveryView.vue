<template>
  <v-form ref="form">
    <h2 class="mb-4">Service Delivery Details</h2>
    <h4 class="mb-2">
      Your facility:
      <span class="facility-name ml-6">{{ currentApplication?.facilityName }}</span>
    </h4>

    <v-row v-if="!loading && licences?.length > 0" no-gutters class="mb-2">
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
          <v-expansion-panel v-for="licence in licences" :key="licence.licenceId" :value="licence.licenceId">
            <v-expansion-panel-title class="header-label">
              <LicenceHeader :licence="licence" />
            </v-expansion-panel-title>
            <v-expansion-panel-text>
              <h4 class="mb-2 text-decoration-underline">Category Details</h4>
              <LicenceDetails :licenceDetails="licence.licenceDetails" />
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-skeleton-loader>
    </div>
    <v-checkbox
      v-model="licenceDeclaration"
      :value="1"
      :false-value="0"
      :true-value="1"
      color="primary"
      :rules="rules.required"
      :disabled="readonly"
      label="I confirm that the above information is correct."
      class="mt-4"></v-checkbox>
    <p>
      Your organization account manager can update licence details in
      <router-link :to="{ name: 'manage-facility', params: { facilityId: currentApplication?.facilityId } }">Account Management</router-link>
      .
    </p>
  </v-form>
</template>

<script>
import AppButton from '@/components/ui/AppButton.vue'
import { useApplicationsStore } from '@/stores/applications'
import { useAppStore } from '@/stores/app'
import { mapState, mapWritableState, mapActions } from 'pinia'
import { APPLICATION_STATUS_CODES } from '@/utils/constants'
import LicenceHeader from '@/components/licences/LicenceHeader.vue'
import LicenceDetails from '@/components/licences/LicenceDetails.vue'
import rules from '@/utils/rules'
import ApplicationService from '@/services/applicationService'
import LicenceService from '@/services/licenceService'
import FacilityService from '@/services/facilityService'
import alertMixin from '@/mixins/alertMixin'
import { isEmpty } from 'lodash'

export default {
  name: 'ServiceDeliveryView',
  components: { AppButton, LicenceHeader, LicenceDetails },
  mixins: [alertMixin],
  async beforeRouteLeave(_to, _from, next) {
    if (this.loading) return
    if (!this.readonly) {
      await this.saveApplication()
    }
    next()
  },
  props: {
    back: {
      type: Boolean,
      default: false,
    },
    next: {
      type: Boolean,
      default: false,
    },
    save: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['process'],
  data() {
    return {
      rules,
      panel: [],
      licenceDeclaration: undefined,
      loading: false,
    }
  },
  computed: {
    ...mapState(useAppStore, ['getRoleNameById']),
    ...mapState(useApplicationsStore, ['currentApplication']),
    ...mapWritableState(useApplicationsStore, ['isServiceDeliveryComplete']),
    readonly() {
      return this.currentApplication?.statusCode != APPLICATION_STATUS_CODES.DRAFT
    },
    allLicenceIDs() {
      return this.licences?.map((licence) => licence.licenceId)
    },
  },
  watch: {
    licenceDeclaration: {
      handler(value) {
        if (this.loading) return
        this.isServiceDeliveryComplete = value
      },
    },
    back: {
      handler() {
        this.$router.push({ name: 'facility-details', params: { applicationGuid: this.$route.params.applicationGuid } })
      },
    },
    save: {
      async handler() {
        await this.saveApplication(true)
      },
    },
    next: {
      handler() {
        this.$router.push({ name: 'operating-costs', params: { applicationGuid: this.$route.params.applicationGuid } })
      },
    },
  },
  async created() {
    this.licenceDeclaration = this.currentApplication?.licenceDeclaration
    await this.loadData()
    this.panel = this.allLicenceIDs
  },
  methods: {
    ...mapActions(useApplicationsStore, ['getApplication']),
    isEmpty,
    async loadData() {
      try {
        this.$emit('process', true)
        this.loading = true
        this.licences = await FacilityService.getLicences(this.currentApplication?.facilityId)
        await Promise.all(
          this.licences?.map(async (licence) => {
            licence.licenceDetails = await LicenceService.getLicenceDetails(licence.licenceId)
          }),
        )
      } catch (error) {
        this.setFailureAlert('Failed to get licence(s) for your facility', error)
      } finally {
        this.loading = false
        this.$emit('process', false)
      }
    },

    async saveApplication(showAlert = false) {
      try {
        this.$emit('process', true)
        const payload = {
          licenceDeclaration: this.licenceDeclaration,
        }
        if (ApplicationService.isApplicationUpdated(payload)) {
          await ApplicationService.updateApplication(this.$route.params.applicationGuid, payload)
          await this.getApplication(this.$route.params.applicationGuid)
        }
        if (showAlert) {
          this.setSuccessAlert('Application saved successfully')
        }
      } catch (error) {
        this.setFailureAlert('Failed to save your application', error)
      } finally {
        this.$emit('process', false)
      }
    },
    togglePanel() {
      this.panel = isEmpty(this.panel) ? this.allLicenceIDs : []
    },
  },
}
</script>
<style scoped>
.facility-name {
  color: #003366;
  font-size: 1.3em;
  text-decoration: underline;
}
.header-label {
  font-size: 1.03em;
}
:deep(.v-label) {
  opacity: 1;
}
</style>
