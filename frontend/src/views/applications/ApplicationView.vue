<template>
  <v-container fluid>
    <ApplicationHeader v-if="!isSelectFacilityPage" />
    <div v-if="isApplicationConfirmationPage">
      <router-view class="min-screen-height" />
    </div>
    <div v-else>
      <v-row v-if="loading" justify="center">
        <v-progress-circular indeterminate size="100" :width="6" color="#003366" class="min-screen-height"></v-progress-circular>
      </v-row>
      <v-row v-else no-gutters>
        <v-col cols="12" md="3" lg="2">
          <ApplicationNavBar class="navBar" />
        </v-col>
        <v-col cols="12" md="9" lg="10">
          <router-view class="min-screen-height" :cancel="cancel" :back="back" :next="next" :save="save" :submit="submit" @process="process"></router-view>
          <CancelApplicationDialog :show="showCancelDialog" :applicationId="currentApplication?.applicationId" @close="toggleCancelDialog" @cancel="cancelApplication" />
          <AppNavButtons
            :loading="processing"
            :showBack="showBack"
            :showCancel="showCancel"
            :showSave="showSave"
            :showNext="showNext"
            :showSubmit="showSubmit"
            :disableNext="disableNext"
            :disableSubmit="disableSubmit"
            @back="toggleBack"
            @cancel="toggleCancel"
            @save="toggleSave"
            @next="toggleNext"
            @submit="toggleSubmit"></AppNavButtons>
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>

<script>
import { mapState, mapActions } from 'pinia'
import { useApplicationsStore } from '@/stores/applications'
import ApplicationNavBar from '@/components/applications/ApplicationNavBar.vue'
import AppNavButtons from '@/components/ui/AppNavButtons.vue'
import CancelApplicationDialog from '@/components/applications/CancelApplicationDialog.vue'
import ApplicationHeader from '@/components/applications/ApplicationHeader.vue'
import alertMixin from '@/mixins/alertMixin'

export default {
  name: 'ApplicationView',
  components: { ApplicationNavBar, ApplicationHeader, AppNavButtons, CancelApplicationDialog },
  mixins: [alertMixin],
  data() {
    return {
      loading: false,
      processing: false,
      cancel: false,
      back: false,
      next: false,
      save: false,
      submit: false,
      showCancelDialog: false,
    }
  },
  computed: {
    ...mapState(useApplicationsStore, ['currentApplication', 'isApplicationComplete', 'isSelectFacilityComplete', 'isDeclareSubmitComplete', 'isApplicationReadonly']),
    showBack() {
      return ['facility-details', 'service-delivery', 'operating-costs', 'staffing', 'review-application', 'declare-submit'].includes(this.$route.name)
    },
    showCancel() {
      return (
        this.isSelectFacilityPage ||
        (!this.isApplicationReadonly && ['facility-details', 'service-delivery', 'operating-costs', 'staffing', 'review-application', 'declare-submit'].includes(this.$route.name))
      )
    },
    showNext() {
      return ['select-facility', 'facility-details', 'service-delivery', 'operating-costs', 'staffing', 'review-application'].includes(this.$route.name)
    },
    showSave() {
      return !this.isApplicationReadonly && ['facility-details', 'service-delivery', 'operating-costs', 'staffing', 'declare-submit'].includes(this.$route.name)
    },
    showSubmit() {
      return ['declare-submit'].includes(this.$route.name) && !this.isApplicationReadonly
    },
    disableNext() {
      if (this.isSelectFacilityPage) {
        return !this.isSelectFacilityComplete
      }
      if (this.isReviewApplicationPage) {
        return !this.isApplicationComplete
      }
      return false
    },
    disableSubmit() {
      return !this.isApplicationComplete || !this.isDeclareSubmitComplete || this.isApplicationReadonly
    },
    isSelectFacilityPage() {
      return this.$route.name === 'select-facility'
    },
    isReviewApplicationPage() {
      return this.$route.name === 'review-application'
    },
    isApplicationConfirmationPage() {
      return this.$route.name === 'application-confirmation'
    },
  },
  async created() {
    await this.loadApplication()
  },
  methods: {
    ...mapActions(useApplicationsStore, ['getApplication', 'checkApplicationComplete']),
    async loadApplication() {
      try {
        if (!this.$route.params.applicationGuid) return
        this.loading = true
        await this.getApplication(this.$route.params.applicationGuid)
      } catch (error) {
        this.setFailureAlert('Failed to load the application', error)
      } finally {
        this.loading = false
      }
    },
    toggleCancel() {
      this.cancel = !this.cancel
      if (!this.isSelectFacilityPage) {
        this.toggleCancelDialog()
      }
    },
    toggleBack() {
      this.back = !this.back
    },
    toggleNext() {
      this.next = !this.next
    },
    toggleSave() {
      this.save = !this.save
    },
    toggleSubmit() {
      this.submit = !this.submit
    },
    toggleCancelDialog() {
      this.showCancelDialog = !this.showCancelDialog
    },
    cancelApplication() {
      this.$router.push({ name: 'applications-history' })
    },
    process(value) {
      this.processing = value
    },
  },
}
</script>
<style scoped>
.navBar {
  margin-left: 0px;
  min-width: 300px;
  max-width: 400px;
}

.min-screen-height {
  min-height: 45vh;
}
</style>
