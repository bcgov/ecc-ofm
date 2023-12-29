<template>
  <v-container fluid>
    <ApplicationHeader />
    <v-row v-if="loading" justify="center">
      <v-progress-circular indeterminate size="100" :width="6" color="#003366" class="loading-screen"></v-progress-circular>
    </v-row>
    <v-row v-else no-gutters>
      <v-col cols="12" md="3" lg="2">
        <ApplicationNavBar class="navBar" />
      </v-col>
      <v-col cols="12" md="9" lg="10">
        <router-view :cancel="cancel" :back="back" :next="next" :save="save" :submit="submit" @completeForm="completeForm" @process="process"></router-view>
        <CancelApplicationDialog :show="showCancelDialog" :applicationId="currentApplication?.applicationId" @close="toggleCancelDialog" @cancel="cancelApplication" />
        <AppNavButtons
          :loading="processing"
          :showBack="showBack"
          :showCancel="showCancel"
          :showSave="showSave"
          :showNext="showNext"
          :showSubmit="showSubmit"
          :disableNext="disableNext"
          @back="toggleBack"
          @cancel="toggleCancel"
          @save="toggleSave"
          @next="toggleNext"
          @submit="toggleSubmit"></AppNavButtons>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapState, mapActions } from 'pinia'
import { useApplicationsStore } from '@/stores/applications'
import ApplicationNavBar from '@/components/applications/ApplicationNavBar.vue'
import AppNavButtons from '@/components/ui/AppNavButtons.vue'
import { APPLICATION_STATUS_CODES } from '@/utils/constants'
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
      disableNext: false,
      showCancelDialog: false,
    }
  },
  computed: {
    ...mapState(useApplicationsStore, ['currentApplication']),
    showBack() {
      return ['facility-details', 'licences', 'operating-costs', 'staffing', 'submit-application'].includes(this.$route.name)
    },
    showCancel() {
      return this.$route.name === 'select-facility' || (!this.readonly && ['facility-details', 'licences', 'operating-costs', 'staffing', 'submit-application'].includes(this.$route.name))
    },
    showNext() {
      return ['select-facility', 'facility-details', 'licences', 'operating-costs', 'staffing'].includes(this.$route.name)
    },
    showSave() {
      return !this.readonly && ['facility-details', 'licences', 'operating-costs', 'staffing'].includes(this.$route.name)
    },
    showSubmit() {
      return ['submit-application'].includes(this.$route.name) && !this.readonly
    },
    readonly() {
      return this.currentApplication?.statusCode != APPLICATION_STATUS_CODES.DRAFT
    },
  },
  async created() {
    await this.loadApplication()
  },
  methods: {
    ...mapActions(useApplicationsStore, ['getApplication']),
    async loadApplication() {
      try {
        if (!this.$route.params.applicationGuid || this.currentApplication?.applicationId === this.$route.params.applicationGuid) return
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
      if (this.$route.name != 'select-facility') {
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
    completeForm(isFormComplete) {
      this.disableNext = this.$route.name === 'select-facility' && !isFormComplete
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

.loading-screen {
  min-height: 45vh;
}
</style>
