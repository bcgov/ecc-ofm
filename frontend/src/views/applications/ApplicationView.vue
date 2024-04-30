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
          <router-view
            class="min-screen-height"
            :readonly="readonly"
            :facility="facility"
            :contacts="contacts"
            :cancel="cancel"
            :back="back"
            :next="next"
            :save="save"
            :submit="submit"
            @process="process"></router-view>
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
import { useAppStore } from '@/stores/app'
import { useApplicationsStore } from '@/stores/applications'
import FacilityService from '@/services/facilityService'
import ApplicationNavBar from '@/components/applications/ApplicationNavBar.vue'
import AppNavButtons from '@/components/ui/AppNavButtons.vue'
import CancelApplicationDialog from '@/components/applications/CancelApplicationDialog.vue'
import ApplicationHeader from '@/components/applications/ApplicationHeader.vue'
import alertMixin from '@/mixins/alertMixin'
import permissionsMixin from '@/mixins/permissionsMixin'
import { APPLICATION_ROUTES } from '@/utils/constants'
import { isEmpty } from 'lodash'

export default {
  name: 'ApplicationView',
  components: { ApplicationNavBar, ApplicationHeader, AppNavButtons, CancelApplicationDialog },
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
      facility: {},
      contacts: [],
    }
  },

  computed: {
    ...mapState(useApplicationsStore, ['currentApplication', 'isApplicationComplete', 'isSelectFacilityComplete', 'isDeclareSubmitComplete', 'isApplicationReadonly']),
    readonly() {
      if (this.$route.name === APPLICATION_ROUTES.SELECT_FACILITY) {
        return this.loading || this.processing || !this.hasPermission(this.PERMISSIONS.APPLY_FOR_FUNDING)
      }
      return this.loading || this.processing || this.isApplicationReadonly || !this.hasPermission(this.PERMISSIONS.APPLY_FOR_FUNDING)
    },
    showBack() {
      return [
        APPLICATION_ROUTES.FACILITY_DETAILS,
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
        [APPLICATION_ROUTES.FACILITY_DETAILS, APPLICATION_ROUTES.SERVICE_DELIVERY, APPLICATION_ROUTES.OPERATING_COSTS, APPLICATION_ROUTES.STAFFING, APPLICATION_ROUTES.SUBMIT].includes(
          this.$route.name,
        )
      )
    },
    showSubmit() {
      return !this.readonly && APPLICATION_ROUTES.SUBMIT === this.$route.name
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
      return this.readonly || !this.isApplicationComplete || !this.isDeclareSubmitComplete
    },
    isSelectFacilityPage() {
      return this.$route.name === APPLICATION_ROUTES.SELECT_FACILITY
    },
    isReviewApplicationPage() {
      return this.$route.name === APPLICATION_ROUTES.REVIEW
    },
    isApplicationConfirmationPage() {
      return this.$route.name === APPLICATION_ROUTES.CONFIRMATION
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
        this.loading = true
        await this.getApplication(this.$route.params.applicationGuid)
        await Promise.all([this.getContacts(), this.getFacility()])
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
          contact.fullName = `${contact.firstName} ${contact.lastName}`
        })
      } catch (error) {
        this.setFailureAlert('Failed to get contacts for facilityId = ' + this.currentApplication?.facilityId, error)
      }
    },

    async getFacility() {
      try {
        if (isEmpty(this.currentApplication)) return
        this.facility = await FacilityService.getFacility(this.currentApplication?.facilityId)
      } catch (error) {
        this.setFailureAlert('Failed to get Facility information for facilityId = ' + this.currentApplication?.facilityId, error)
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
