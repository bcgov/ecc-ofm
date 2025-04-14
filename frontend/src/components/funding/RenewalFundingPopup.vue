<template>
  <v-container>
    <AppDialog v-model="isDisplayed" title="Action Required!" persistent max-width="60%" @close="closeDialog">
      <template #content>
        <br />
        <h2 class="confirm-dialog-text d-flex flex-column text-center">You have one or more Funding Agreement(s) expiring soon.</h2>
        <div class="confirm-dialog-text d-flex flex-column text-center">Please visit the Applications tab to renew your Funding Agreement(s).</div>
        <div class="confirm-dialog-text d-flex flex-column text-center">Would you like to take action now?</div>
        <br />
      </template>
      <template #button>
        <v-row justify="space-around">
          <v-col cols="12" md="6" class="d-flex justify-center">
            <AppButton id="dialog-go-back" :primary="false" size="large" width="200px" :loading="loading" @click="closeDialog">Not Now</AppButton>
          </v-col>
          <v-col cols="12" md="6" class="d-flex justify-center">
            <AppButton id="dialog-cancel-application" size="large" min-width="250px" max-width="500px" :loading="loading" @click="goToApplications">Yes, take me to Applications</AppButton>
          </v-col>
        </v-row>
      </template>
    </AppDialog>
  </v-container>
</template>

<script>
import { mapState } from 'pinia'
import { useAppStore } from '@/stores/app'
import { useAuthStore } from '@/stores/auth'
import AppButton from '@/components/ui/AppButton.vue'
import AppDialog from '@/components/ui/AppDialog.vue'
import FacilityService from '@/services/facilityService'
import alertMixin from '@/mixins/alertMixin'
import permissionsMixin from '@/mixins/permissionsMixin.js'
import { isEmpty } from 'lodash'

export default {
  name: 'RenewalFundingPopup',
  components: { AppButton, AppDialog },
  mixins: [alertMixin, permissionsMixin],
  emits: ['loading'],
  data() {
    return {
      loading: false,
      isDisplayed: false,
      fundingAgreements: [],
    }
  },

  computed: {
    ...mapState(useAuthStore, ['userInfo']),
    ...mapState(useAppStore, ['facilitiesForRenewal']),
  },

  async created() {
    await this.loadRenewalFacilities()
  },

  methods: {
    closeDialog() {
      this.isDisplayed = false
    },
    goToApplications() {
      this.$router.push({ name: 'applications-history' })
    },
    async loadRenewalFacilities() {
      try {
        const facilityIds = this.userInfo?.facilities.map((f) => f.facilityId)
        const renewalFacilities = await FacilityService.getRenewalFacilities(facilityIds)
        const appStore = useAppStore()
        appStore.facilitiesForRenewal = renewalFacilities
        if (!isEmpty(renewalFacilities)) {
          this.isDisplayed = true
        }
      } catch (error) {
        console.error('Error loading funding agreements for renewal:', error)
      }
    },
  },
}
</script>
