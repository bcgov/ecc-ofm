<template>
  <v-container fluid>
    <h2>{{ getPageTitle }}</h2>
    <v-row>
      <v-col class="ml-6 mt-6 pb-0">
        <h4>Licence Details</h4>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" class="ml-6 pr-9 pt-0">
        <v-card class="pl-6" variant="outlined">
          <v-skeleton-loader :loading="loading" type="table-tbody">
            <EditLicence :licence="licence" :facilityName="facility.name" :defaultReadOnly="false" />
          </v-skeleton-loader>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col class="ml-6 pb-0">
        <h4>Licence Category Details</h4>
      </v-col>
      <v-col class="d-flex justify-end align-end licence-card-header">
        <AppButton variant="text" :disabled="loading" @click="addLicenceCategory()">
          <v-icon left>mdi-plus</v-icon>
          Add Licence Category
        </AppButton>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" class="ml-6 pr-9 pt-0">
        <v-card variant="outlined">
          <v-skeleton-loader :loading="loading" type="table-tbody">
            <EditLicenceCategory :licenceDetails="licence?.licenceDetails" />
          </v-skeleton-loader>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="6">
        <v-row justify="center" justify-md="start" class="pb-2">
          <AppBackButton id="back-to-manage-organization" width="450px" :to="{ name: 'manage-facility' }" :loading="loading">Update Facility Information</AppBackButton>
        </v-row>
      </v-col>
      <v-row>
        <v-col cols="11" class="d-flex justify-end">
          <AppButton id="cancel-edit" :primary="false" size="large" width="200px" :to="{ name: 'manage-facility' }" class="mr-6">Cancel</AppButton>
          <AppButton id="save" size="large" width="200px" @click="save()">Save</AppButton>
        </v-col>
      </v-row>
    </v-row>
  </v-container>
</template>

<script>
import AppButton from '@/components/ui/AppButton.vue'
import AppBackButton from '@/components/ui/AppBackButton.vue'
import alertMixin from '@/mixins/alertMixin'
import rules from '@/utils/rules'
import { useAppStore } from '@/stores/app'
import { mapState } from 'pinia'
import FacilityService from '@/services/facilityService'
import LicenceService from '@/services/licenceService'
import EditLicence from '@/components/account-mgmt/EditLicence.vue'
import EditLicenceCategory from '@/components/account-mgmt/EditLicenceCategory.vue'

const LICENCE_MODEL = {
  licenceId: null,
  licence: null,
  healthAuthorityId: null,
  tdadFundingAgreementNumber: null,
  accbProviderId: null,
  ccofOrganizationId: null,
  ccofFacilityId: null,
  statusCode: null,
  stateCode: null
}

const LICENCE_DETAILS_MODEL = {
  licenceDetailId: null,
  licenceType: null,
  licenceSpaces: null,
  operationalSpaces: null,
  enrolledSpaces: null,
  operationFromTime: ' AM',
  operationToTime: ' PM',
  weekDays: '',
  weeksInOperation: null,
  careType: null,
  overnightCare: null,
  statusCode: null,
  stateCode: null
}

export default {
  name: 'ManageFacilityView',
  components: { AppButton, AppBackButton, EditLicence, EditLicenceCategory },
  mixins: [alertMixin],
  data() {
    return {
      facilityId: null,
      licenceId: null,
      licence: [],
      licencesToAdd: [],
      panel: [],
      facility: undefined,
      loading: false,
      rules,
    }
  },
  computed: {
    ...mapState(useAppStore, ['healthAuthorities', 'getHealthAuthorityNameById']),
    getPageTitle() {
      return (this.facilityId && this.licenceId) ? 'Update Facility Licence' : 'Add Facility Licence'
    },
  },
  async created() {
    this.facilityId = this.$route.params.facilityId
    this.licenceId = this.$route.params.licenceId
    await this.loadData()
  },
  methods: {
    /**
     * Load the data for the page
     */
    async loadData() {
      try {
        this.loading = true
        await Promise.all([this.getFacility(), this.getLicence()])
        if (this.licence?.length === 0) {
          this.licence = this.getLicenceModel()
          this.licence.licenceDetails = [this.getLicenceDetailsModel()]
        }
      } finally {
        this.loading = false
      }
    },

    /**
     * Get the licences for the facility
     */
    async getLicence() {
      try {
        if (!this.licenceId) return
        this.licence = await FacilityService.getLicence(this.facilityId, this.licenceId)
        this.licence.licenceDetails = await LicenceService.getLicenceDetails(this.licenceId)
      } catch (error) {
        this.setFailureAlert('Failed to licence(s) for facilityId = ' + this.facilityId, error)
      }
    },

    /**
     * Get facility by facilityId
     */
    async getFacility() {
      try {
        this.facility = await FacilityService.getFacility(this.facilityId)
      } catch (error) {
        this.setFailureAlert('Failed to get Facility information for facilityId = ' + this.facilityId, error)
      }
    },

    /**
     * Add a new licence category
     */
    addLicenceCategory() {
      this.licence.licenceDetails.push(this.getLicenceDetailsModel())
    },

    /**
     * Save the licence
     */
    save() {
      this.setWarningAlert('Save not implemented in sprint 10. Field validation and save will be a future sprint.')
    },

    /**
     * Get the licence model
     */
    getLicenceModel() {
      return LICENCE_MODEL
    },

    /**
     * Get the licence details model
     */
    getLicenceDetailsModel() {
      return LICENCE_DETAILS_MODEL
    }

  },
}
</script>

<style>
.licence-card-header {
  margin-left: 24px;
  padding-right: 9px;
  padding-top: 0px;
  padding-bottom: 1px;
}

.licence-card {
  margin-top: 12px;
  padding: 10px;
  border: 1px solid black;
  box-shadow: none;
}
</style>
