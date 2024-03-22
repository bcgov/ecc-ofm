<template>
  <v-container fluid>
    <h1 class="my-2">Supplementary Allowance</h1>
    <div v-if="loading" align="center">
      <v-progress-circular indeterminate size="100" :width="6" color="#003366" class="min-height-screen"></v-progress-circular>
    </div>
    <div v-else>
      <div class="min-height-screen my-4">
        <v-row v-if="!$route.params.applicationGuid" no-gutters class="my-8">
          <v-col cols="12" md="6" lg="4" xl="3" class="mr-md-4">
            <AppLabel>To start your application, select a facility:</AppLabel>
            <div>
              <v-icon class="mr-1">mdi-information-slab-circle-outline</v-icon>
              <span>If your facility is not listed, contact your Account Manager.</span>
            </div>
          </v-col>
          <v-col cols="12" md="6" xl="4">
            <v-select
              id="select-facility"
              v-model="facilityId"
              :items="facilities"
              item-title="facilityName"
              item-value="facilityId"
              :rules="rules.required"
              placeholder="Select a facility"
              density="compact"
              variant="outlined"></v-select>
          </v-col>
        </v-row>
        <div v-if="application">
          <span>You are applying this program for the Application&ensp;</span>
          <span class="application-number">{{ application?.referenceNumber }}</span>

          <router-view :applicationId="application?.applicationId" :cancel="cancel" :back="back" :next="next" :save="save" :submit="submit" @process="process" @setSubmit="setSubmit" />
        </div>
      </div>
      <AppNavButtons
        :loading="processing"
        :showBack="showBack"
        :showCancel="showCancel"
        :showSave="showSave"
        :showNext="showNext"
        :showSubmit="showSubmit"
        :disableSubmit="disableSubmit"
        @back="toggleBack"
        @cancel="toggleCancel"
        @save="toggleSave"
        @next="toggleNext"
        @submit="toggleSubmit" />
    </div>
  </v-container>
</template>

<script>
import AppLabel from '@/components/ui/AppLabel.vue'
import AppNavButtons from '@/components/ui/AppNavButtons.vue'
import { useAuthStore } from '@/stores/auth'
import { mapState } from 'pinia'
import ApplicationService from '@/services/applicationService'
import FundingAgreementService from '@/services/fundingAgreementService'
import alertMixin from '@/mixins/alertMixin'
import { isEmpty } from 'lodash'
import rules from '@/utils/rules'

export default {
  name: 'SupplementaryAllowanceView',
  components: { AppLabel, AppNavButtons },
  mixins: [alertMixin],
  emits: ['process'],
  data() {
    return {
      rules,
      disableSubmit: true,
      loading: false,
      processing: false,
      back: false,
      cancel: false,
      save: false,
      next: false,
      submit: false,
      applications: [],
      application: undefined,
      facilities: [],
      facilityId: undefined,
    }
  },

  computed: {
    ...mapState(useAuthStore, ['userInfo']),
    showBack() {
      return true
    },
    showCancel() {
      return !isEmpty(this.application)
    },
    showSave() {
      return !isEmpty(this.application)
    },
    showNext() {
      return !isEmpty(this.application) && ['supp-allowances-form'].includes(this.$route.name)
    },
    showSubmit() {
      return !isEmpty(this.application) && ['supp-allowances-submit'].includes(this.$route.name)
    },
  },

  watch: {
    facilityId: {
      handler(facilityId) {
        this.application = this.getValidApplication(facilityId)
      },
    },
  },

  async created() {
    // To prevent users from accessing this page by entering url manually
    if (!window.history.state.back) {
      this.$router.push({ name: 'applications-history' })
    }
    await this.loadData()
  },

  methods: {
    isEmpty,
    async loadData() {
      try {
        this.loading = true
        // navigate from the Application Confirmation page (after the providers have just submitted their core funding application)
        if (this.$route.params.applicationGuid) {
          this.application = await ApplicationService.getApplication(this.$route.params.applicationGuid)
        }
        // navigate from the Application History page
        else {
          this.applications = await ApplicationService.getApplications()
          this.applications = this.applications?.filter((application) => ApplicationService.checkApplicationStatus(application))
          await Promise.all(
            this.applications?.map(async (application) => {
              application.fundingAgreements = await FundingAgreementService.getActiveFundingAgreementsByApplicationId(application.applicationId)
            }),
          )
          this.facilities = this.userInfo?.facilities?.filter((facility) => this.getValidApplication(facility.facilityId))
        }
      } catch (error) {
        this.setFailureAlert('Failed to load data', error)
      } finally {
        this.loading = false
      }
    },

    getValidApplication(facilityId) {
      return this.applications?.find((application) => application.facilityId === facilityId && ApplicationService.isValidApplication(application))
    },

    process(value) {
      this.processing = value
    },

    toggleBack() {
      if (!this.application) {
        this.$router.push({ name: 'applications-history' })
      }
      this.back = !this.back
    },
    toggleCancel() {
      this.cancel = !this.cancel
    },
    toggleSave() {
      this.save = !this.save
    },
    toggleNext() {
      this.next = !this.next
    },
    toggleSubmit() {
      this.submit = !this.submit
    },
    setSubmit(value) {
      this.disableSubmit = !value
    },
  },
}
</script>

<style scoped>
.min-height-screen {
  min-height: 55vh;
}

.application-number {
  font-size: 1.3em;
  font-weight: 700;
}
</style>
