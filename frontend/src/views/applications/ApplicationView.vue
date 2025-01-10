<template>
  <v-container fluid>
    <div v-if="isApplicationConfirmationPage">
      <router-view class="min-screen-height" />
    </div>
    <div v-else>
      <v-row v-if="loading" justify="center">
        <v-progress-circular
          indeterminate
          size="100"
          :width="6"
          color="#003366"
          class="min-screen-height"></v-progress-circular>
      </v-row>
      <v-row v-else no-gutters>
        <v-col cols="12" md="3" lg="2" xxl="1">
          <ApplicationNavBar />
        </v-col>
        <v-col cols="12" md="9" lg="10" xxl="11">
          <ApplicationHeader v-if="!isSelectFacilityPage" />
          <router-view
            class="min-screen-height"
            :readonly="readonly"
            :cancel="cancel"
            :back="back"
            :next="next"
            :save="save"
            :submit="submit"
            :contacts="contacts"
            @process="process" />
          <AppCancelDialog :show="showCancelDialog" @close="toggleCancelDialog" @cancel="cancelChanges" />
          <AppNavButtons
            :loading="processing"
            :show-back="showBack"
            :show-cancel="showCancel"
            :show-save="showSave"
            :show-next="showNext"
            :show-submit="showSubmit"
            :disable-next="disableNext"
            :disable-submit="disableSubmit"
            @back="toggleBack"
            @cancel="toggleCancel"
            @save="toggleSave"
            @next="toggleNext"
            @submit="toggleSubmit" />
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>

<script>
import { mapState, mapActions, mapWritableState } from 'pinia'
import { useApplicationsStore } from '@/stores/applications'
import FacilityService from '@/services/facilityService'
import AppCancelDialog from '../../components/ui/AppCancelDialog.vue'
import ApplicationNavBar from '@/components/applications/ApplicationNavBar.vue'
import AppNavButtons from '@/components/ui/AppNavButtons.vue'
import ApplicationHeader from '@/components/applications/ApplicationHeader.vue'
import alertMixin from '@/mixins/alertMixin'
import permissionsMixin from '@/mixins/permissionsMixin'
import { APPLICATION_ROUTES } from '@/utils/constants'
import { isEmpty } from 'lodash'

export default {
  name: 'ApplicationView',
  components: { AppCancelDialog, ApplicationNavBar, ApplicationHeader, AppNavButtons },
  mixins: [alertMixin, permissionsMixin],

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
      contacts: [],
    }
  },

  computed: {
    ...mapState(useApplicationsStore, [
      'currentApplication',
      'isApplicationComplete',
      'isSelectFacilityComplete',
      'isDeclareSubmitComplete',
      'isApplicationReadonly',
      'isFacilityDetailsComplete',
      'isEligibilityComplete',
    ]),
    ...mapWritableState(useApplicationsStore, ['validation']),
    readonly() {
      if (this.$route.name === APPLICATION_ROUTES.SELECT_FACILITY) {
        return this.loading || this.processing || !this.hasPermission(this.PERMISSIONS.APPLY_FOR_FUNDING)
      }
      return (
        this.loading ||
        this.processing ||
        this.isApplicationReadonly ||
        !this.hasPermission(this.PERMISSIONS.APPLY_FOR_FUNDING)
      )
    },
    showBack() {
      return [
        APPLICATION_ROUTES.FACILITY_DETAILS,
        APPLICATION_ROUTES.ELIGIBILITY,
        APPLICATION_ROUTES.SERVICE_DELIVERY,
        APPLICATION_ROUTES.OPERATING_COSTS,
        APPLICATION_ROUTES.STAFFING,
        APPLICATION_ROUTES.REVIEW,
        APPLICATION_ROUTES.SUBMIT,
      ].includes(this.$route.name)
    },
    showCancel() {
      return (
        this.isSelectFacilityPage ||
        (!this.readonly &&
          [
            APPLICATION_ROUTES.FACILITY_DETAILS,
            APPLICATION_ROUTES.ELIGIBILITY,
            APPLICATION_ROUTES.SERVICE_DELIVERY,
            APPLICATION_ROUTES.OPERATING_COSTS,
            APPLICATION_ROUTES.STAFFING,
            APPLICATION_ROUTES.REVIEW,
            APPLICATION_ROUTES.SUBMIT,
          ].includes(this.$route.name))
      )
    },
    showNext() {
      return [
        APPLICATION_ROUTES.SELECT_FACILITY,
        APPLICATION_ROUTES.ELIGIBILITY,
        APPLICATION_ROUTES.FACILITY_DETAILS,
        APPLICATION_ROUTES.SERVICE_DELIVERY,
        APPLICATION_ROUTES.OPERATING_COSTS,
        APPLICATION_ROUTES.STAFFING,
        APPLICATION_ROUTES.REVIEW,
      ].includes(this.$route.name)
    },
    showSave() {
      return (
        !this.readonly &&
        [
          APPLICATION_ROUTES.FACILITY_DETAILS,
          APPLICATION_ROUTES.ELIGIBILITY,
          APPLICATION_ROUTES.SERVICE_DELIVERY,
          APPLICATION_ROUTES.OPERATING_COSTS,
          APPLICATION_ROUTES.STAFFING,
          APPLICATION_ROUTES.SUBMIT,
        ].includes(this.$route.name)
      )
    },
    showSubmit() {
      return !this.readonly && APPLICATION_ROUTES.SUBMIT === this.$route.name
    },
    disableNext() {
      if (this.isSelectFacilityPage) {
        return false
      }
      if (this.isReviewApplicationPage) {
        return !this.isApplicationComplete
      }
      return false
    },
    disableSubmit() {
      return this.readonly || !this.isApplicationComplete || !this.isDeclareSubmitComplete
    },
    isSelectFacilityPage() {
      return this.$route.name === APPLICATION_ROUTES.SELECT_FACILITY
    },
    isFacilityDetailsPage() {
      return this.$route.name === APPLICATION_ROUTES.FACILITY_DETAILS
    },
    isEligibilityPage() {
      return this.$route.name === APPLICATION_ROUTES.ELIGIBILITY
    },
    isReviewApplicationPage() {
      return this.$route.name === APPLICATION_ROUTES.REVIEW
    },
    isApplicationConfirmationPage() {
      return this.$route.name === APPLICATION_ROUTES.CONFIRMATION
    },
    isPageAccessible() {
      return (
        this.isSelectFacilityPage ||
        this.isFacilityDetailsPage ||
        (this.isEligibilityPage && this.isFacilityDetailsComplete) ||
        (this.isFacilityDetailsComplete && this.isEligibilityComplete)
      )
    },
  },

  watch: {
    '$route.params.applicationGuid': {
      async handler() {
        await this.loadApplication()
      },
    },
  },

  async created() {
    await this.loadApplication()
  },

  methods: {
    ...mapActions(useApplicationsStore, ['getApplication']),
    async loadApplication() {
      try {
        if (!this.$route.params.applicationGuid) return
        this.validation = false
        this.loading = true
        await this.getApplication(this.$route.params.applicationGuid)
        await this.getContacts()
        if (!this.isPageAccessible) {
          this.$router.push({ name: 'applications-history' })
        }
      } catch (error) {
        this.setFailureAlert('Failed to load the application', error)
      } finally {
        this.loading = false
      }
    },

    async getContacts() {
      try {
        if (isEmpty(this.currentApplication)) return
        this.contacts = await FacilityService.getContacts(this.currentApplication?.facilityId)
        this.contacts?.forEach((contact) => {
          contact.fullName = `${contact.firstName ?? ''} ${contact.lastName}`
        })
      } catch (error) {
        this.setFailureAlert('Failed to get contacts for facilityId = ' + this.currentApplication?.facilityId, error)
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
    async cancelChanges() {
      try {
        if (!this.$route.params.applicationGuid) return
        this.loading = true
        await this.getApplication(this.$route.params.applicationGuid)
      } catch (error) {
        this.setFailureAlert('Failed to reload the application', error)
      } finally {
        this.loading = false
      }
    },
    process(value) {
      this.processing = value
    },
  },
}
</script>

<style scoped>
.min-screen-height {
  min-height: 45vh;
}
</style>
