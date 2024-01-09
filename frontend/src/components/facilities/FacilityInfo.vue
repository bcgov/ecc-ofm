<template>
  <v-card class="my-4 pa-4" variant="outlined">
    <v-skeleton-loader :loading="loading" type="table-tbody">
      <v-container fluid class="pa-0">
        <v-row v-if="!isApplicationPage" no-gutters>
          <v-col cols="9" lg="6">
            <v-row no-gutters class="ma-2">
              <v-col cols="12" md="4" lg="5" xl="4">
                <AppLabel>Facility name:</AppLabel>
              </v-col>
              <v-col cols="12" md="8" lg="7" xl="8">{{ facilityInfo?.name }}</v-col>
            </v-row>
          </v-col>
          <v-col cols="3" lg="6">
            <v-row no-gutters justify="end">
              <v-icon icon="fa:fa-regular fa-pen-to-square" class="mr-4"></v-icon>
              <v-icon icon="fa:fa-regular fa-trash-can"></v-icon>
            </v-row>
          </v-col>
        </v-row>
        <v-row no-gutters>
          <v-col cols="12" md="6">
            <v-row no-gutters class="ma-2">
              <v-col cols="12" md="6" lg="5" xl="4">
                <AppLabel>Phone (landline):</AppLabel>
              </v-col>
              <v-col cols="12" md="6" lg="7" xl="8">
                {{ facilityInfo?.phoneLandline }}
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="12" md="6">
            <v-row no-gutters class="ma-2">
              <v-col cols="12" md="6" lg="5" xl="4">
                <AppLabel>Phone (cell):</AppLabel>
              </v-col>
              <v-col cols="12" md="6" lg="7" xl="8">
                {{ facilityInfo?.phoneCell }}
              </v-col>
            </v-row>
          </v-col>
        </v-row>
        <v-row no-gutters>
          <v-col cols="12" md="6">
            <v-row no-gutters class="ma-2">
              <v-col cols="12" md="6" lg="5" xl="4">
                <AppLabel>Email Address:</AppLabel>
              </v-col>
              <v-col cols="12" md="6" lg="7" xl="8">
                {{ facilityInfo?.email }}
              </v-col>
            </v-row>
          </v-col>
        </v-row>
        <v-divider />
        <v-row no-gutters>
          <v-col cols="12">
            <v-row no-gutters class="ma-2">
              <h4>Physical address</h4>
            </v-row>
            <v-row no-gutters>
              <v-col cols="12" md="6">
                <v-row no-gutters class="ma-2">
                  <v-col cols="12" md="6" lg="5" xl="4">
                    <AppLabel>Street address 1:</AppLabel>
                  </v-col>
                  <v-col cols="12" md="6" lg="7" xl="8">
                    {{ facilityInfo?.streetAddress1 }}
                  </v-col>
                </v-row>
              </v-col>
              <v-col cols="12" md="6">
                <v-row no-gutters class="ma-2">
                  <v-col cols="12" md="6" lg="5" xl="4">
                    <AppLabel>Street address 2:</AppLabel>
                  </v-col>
                  <v-col cols="12" md="6" lg="7" xl="8">
                    {{ facilityInfo?.streetAddress2 }}
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
            <v-row no-gutters>
              <v-col cols="12" md="6">
                <v-row no-gutters class="ma-2">
                  <v-col cols="12" md="6" lg="5" xl="4">
                    <AppLabel>City:</AppLabel>
                  </v-col>
                  <v-col cols="12" md="6" lg="7" xl="8">
                    {{ facilityInfo?.city }}
                  </v-col>
                </v-row>
              </v-col>
              <v-col cols="12" md="6">
                <v-row no-gutters class="ma-2">
                  <v-col cols="12" md="6" lg="5" xl="4">
                    <AppLabel>Province:</AppLabel>
                  </v-col>
                  <v-col cols="12" md="6" lg="7" xl="8">
                    {{ facilityInfo?.province }}
                  </v-col>
                </v-row>
              </v-col>
              <v-col cols="12" md="6">
                <v-row no-gutters class="ma-2">
                  <v-col cols="12" md="6" lg="5" xl="4">
                    <AppLabel>Postal code:</AppLabel>
                  </v-col>
                  <v-col cols="12" md="6" lg="7" xl="8">
                    {{ facilityInfo?.postalCode }}
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
        <v-divider />
        <v-row no-gutters>
          <v-col cols="12">
            <v-row no-gutters class="ma-2">
              <h4>Mailing address</h4>
            </v-row>
            <v-row no-gutters>
              <v-col cols="12" md="6">
                <v-row no-gutters class="ma-2">
                  <v-col cols="12" md="6" lg="5" xl="4">
                    <AppLabel>Street address 1:</AppLabel>
                  </v-col>
                  <v-col cols="12" md="6" lg="7" xl="8">
                    {{ facilityInfo?.isMailingAddressDifferent ? facilityInfo?.mailingStreetAddress1 : facilityInfo?.streetAddress1 }}
                  </v-col>
                </v-row>
              </v-col>
              <v-col cols="12" md="6">
                <v-row no-gutters class="ma-2">
                  <v-col cols="12" md="6" lg="5" xl="4">
                    <AppLabel>Street address 2:</AppLabel>
                  </v-col>
                  <v-col cols="12" md="6" lg="7" xl="8">
                    {{ facilityInfo?.isMailingAddressDifferent ? facilityInfo?.mailingStreetAddress2 : facilityInfo?.streetAddress2 }}
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
            <v-row no-gutters>
              <v-col cols="12" md="6">
                <v-row no-gutters class="ma-2">
                  <v-col cols="12" md="6" lg="5" xl="4">
                    <AppLabel>City:</AppLabel>
                  </v-col>
                  <v-col cols="12" md="6" lg="7" xl="8">
                    {{ facilityInfo?.isMailingAddressDifferent ? facilityInfo?.mailingCity : facilityInfo?.city }}
                  </v-col>
                </v-row>
              </v-col>
              <v-col cols="12" md="6">
                <v-row no-gutters class="ma-2">
                  <v-col cols="12" md="6" lg="5" xl="4">
                    <AppLabel>Province:</AppLabel>
                  </v-col>
                  <v-col cols="12" md="6" lg="7" xl="8">
                    {{ facilityInfo?.isMailingAddressDifferent ? facilityInfo?.mailingProvince : facilityInfo?.province }}
                  </v-col>
                </v-row>
              </v-col>
              <v-col cols="12" md="6">
                <v-row no-gutters class="ma-2">
                  <v-col cols="12" md="6" lg="5" xl="4">
                    <AppLabel>Postal code:</AppLabel>
                  </v-col>
                  <v-col cols="12" md="6" lg="7" xl="8">
                    {{ facilityInfo?.isMailingAddressDifferent ? facilityInfo?.mailingPostalCode : facilityInfo?.postalCode }}
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-container>
    </v-skeleton-loader>
  </v-card>
</template>

<script>
import alertMixin from '@/mixins/alertMixin'
import FacilityService from '@/services/facilityService'
import AppLabel from '@/components/ui/AppLabel.vue'

export default {
  components: { AppLabel },
  mixins: [alertMixin],
  props: {
    facilityId: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      facilityInfo: undefined,
      loading: false,
    }
  },
  computed: {
    isApplicationPage() {
      return this.$route.path?.includes('/applications/')
    },
  },
  async created() {
    await this.loadFacilityInfo()
  },
  methods: {
    async loadFacilityInfo() {
      try {
        this.loading = true
        this.facilityInfo = await FacilityService.getFacility(this.facilityId)
      } catch (error) {
        this.setFailureAlert('Failed to get your facility information', error)
      } finally {
        this.loading = false
      }
    },
  },
}
</script>
