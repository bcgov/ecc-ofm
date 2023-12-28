<template>
  <v-card class="my-4 pa-4" variant="outlined">
    <v-skeleton-loader :loading="loading" type="table-tbody">
      <v-container fluid class="pa-0">
        <v-row no-gutters>
          <v-col v-if="organizationInfo?.name" cols="12" md="6">
            <v-row no-gutters class="ma-2">
              <v-col cols="12" md="6" lg="5" xl="4">
                <AppLabel>Organization legal name:</AppLabel>
              </v-col>
              <v-col cols="12" md="6" lg="7" xl="8">{{ organizationInfo?.name }}</v-col>
            </v-row>
          </v-col>
          <v-col v-if="organizationInfo?.businessType" cols="12" md="6">
            <v-row no-gutters class="ma-2">
              <v-col cols="12" md="6" lg="5" xl="4">
                <AppLabel>Doing business as:</AppLabel>
              </v-col>
              <v-col cols="12" md="6" lg="7" xl="8">
                {{ organizationInfo?.businessType }}
              </v-col>
            </v-row>
          </v-col>
        </v-row>
        <v-row no-gutters>
          <v-col v-if="organizationInfo?.phoneLandline" cols="12" md="6">
            <v-row no-gutters class="ma-2">
              <v-col cols="12" md="6" lg="5" xl="4">
                <AppLabel>Phone (landline):</AppLabel>
              </v-col>
              <v-col cols="12" md="6" lg="7" xl="8">
                {{ organizationInfo?.phoneLandline }}
              </v-col>
            </v-row>
          </v-col>
          <v-col v-if="organizationInfo?.phoneCell" cols="12" md="6">
            <v-row no-gutters class="ma-2">
              <v-col cols="12" md="6" lg="5" xl="4">
                <AppLabel>Phone (cell):</AppLabel>
              </v-col>
              <v-col cols="12" md="6" lg="7" xl="8">
                {{ organizationInfo?.phoneCell }}
              </v-col>
            </v-row>
          </v-col>
        </v-row>
        <v-row no-gutters>
          <v-col v-if="organizationInfo?.email" cols="12" md="6">
            <v-row no-gutters class="ma-2">
              <v-col cols="12" md="6" lg="5" xl="4">
                <AppLabel>Email address:</AppLabel>
              </v-col>
              <v-col cols="12" md="6" lg="7" xl="8">
                {{ organizationInfo?.email }}
              </v-col>
            </v-row>
          </v-col>
        </v-row>
        <v-row no-gutters>
          <v-col v-if="organizationInfo" cols="12">
            <v-row no-gutters class="ma-2">
              <AppLabel>Physical address:</AppLabel>
            </v-row>
            <v-row no-gutters>
              <v-col v-if="organizationInfo?.streetAddress1" cols="12" md="6">
                <v-row no-gutters class="ma-2">
                  <v-col cols="12" md="6" lg="5" xl="4">
                    <AppLabel>Street address 1:</AppLabel>
                  </v-col>
                  <v-col cols="12" md="6" lg="7" xl="8">
                    {{ organizationInfo?.streetAddress1 }}
                  </v-col>
                </v-row>
              </v-col>
              <v-col v-if="organizationInfo?.streetAddress2" cols="12" md="6">
                <v-row no-gutters class="ma-2">
                  <v-col cols="12" md="6" lg="5" xl="4">
                    <AppLabel>Street address 2:</AppLabel>
                  </v-col>
                  <v-col cols="12" md="6" lg="7" xl="8">
                    {{ organizationInfo?.streetAddress2 }}
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
            <v-row no-gutters>
              <v-col v-if="organizationInfo?.city" cols="12" md="6">
                <v-row no-gutters class="ma-2">
                  <v-col cols="12" md="6" lg="5" xl="4">
                    <AppLabel>City:</AppLabel>
                  </v-col>
                  <v-col cols="12" md="6" lg="7" xl="8">
                    {{ organizationInfo?.city }}
                  </v-col>
                </v-row>
              </v-col>
              <v-col v-if="organizationInfo?.province" cols="12" md="6">
                <v-row no-gutters class="ma-2">
                  <v-col cols="12" md="6" lg="5" xl="4">
                    <AppLabel>Province:</AppLabel>
                  </v-col>
                  <v-col cols="12" md="6" lg="7" xl="8">
                    {{ organizationInfo?.province }}
                  </v-col>
                </v-row>
              </v-col>
              <v-col v-if="organizationInfo?.postalCode" cols="12" md="6">
                <v-row no-gutters class="ma-2">
                  <v-col cols="12" md="6" lg="5" xl="4">
                    <AppLabel>Postal code:</AppLabel>
                  </v-col>
                  <v-col cols="12" md="6" lg="7" xl="8">
                    {{ organizationInfo?.postalCode }}
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
        <v-row no-gutters>
          <v-col v-if="organizationInfo?.isMailingAddressDifferent" cols="12">
            <v-row no-gutters class="ma-2">
              <AppLabel>Mailing address:</AppLabel>
            </v-row>
            <v-row no-gutters>
              <v-col v-if="organizationInfo?.mailingStreetAddress1" cols="12" md="6">
                <v-row no-gutters class="ma-2">
                  <v-col cols="12" md="6" lg="5" xl="4">
                    <AppLabel>Street address 1:</AppLabel>
                  </v-col>
                  <v-col cols="12" md="6" lg="7" xl="8">
                    {{ organizationInfo?.mailingStreetAddress1 }}
                  </v-col>
                </v-row>
              </v-col>
              <v-col v-if="organizationInfo?.mailingStreetAddress2" cols="12" md="6">
                <v-row no-gutters class="ma-2">
                  <v-col cols="12" md="6" lg="5" xl="4">
                    <AppLabel>Street address 2:</AppLabel>
                  </v-col>
                  <v-col cols="12" md="6" lg="7" xl="8">
                    {{ organizationInfo?.mailingStreetAddress2 }}
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
            <v-row no-gutters>
              <v-col v-if="organizationInfo?.mailingCity" cols="12" md="6">
                <v-row no-gutters class="ma-2">
                  <v-col cols="12" md="6" lg="5" xl="4">
                    <AppLabel>City:</AppLabel>
                  </v-col>
                  <v-col cols="12" md="6" lg="7" xl="8">
                    {{ organizationInfo?.mailingCity }}
                  </v-col>
                </v-row>
              </v-col>
              <v-col v-if="organizationInfo?.mailingProvince" cols="12" md="6">
                <v-row no-gutters class="ma-2">
                  <v-col cols="12" md="6" lg="5" xl="4">
                    <AppLabel>Province:</AppLabel>
                  </v-col>
                  <v-col cols="12" md="6" lg="7" xl="8">
                    {{ organizationInfo?.mailingProvince }}
                  </v-col>
                </v-row>
              </v-col>
              <v-col v-if="organizationInfo?.mailingPostalCode" cols="12" md="6">
                <v-row no-gutters class="ma-2">
                  <v-col cols="12" md="6" lg="5" xl="4">
                    <AppLabel>Postal code:</AppLabel>
                  </v-col>
                  <v-col cols="12" md="6" lg="7" xl="8">
                    {{ organizationInfo?.mailingPostalCode }}
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
import { mapState } from 'pinia'
import { useAuthStore } from '@/stores/auth'
import alertMixin from '@/mixins/alertMixin'
import OrganizationService from '@/services/organizationService'
import AppLabel from '@/components/ui/AppLabel.vue'

export default {
  components: { AppLabel },
  mixins: [alertMixin],
  data() {
    return {
      organizationInfo: undefined,
      loading: false,
    }
  },
  computed: {
    ...mapState(useAuthStore, ['userInfo']),
  },
  async created() {
    await this.loadOrganizationInfo()
  },
  methods: {
    async loadOrganizationInfo() {
      try {
        this.loading = true
        this.organizationInfo = await OrganizationService.getOrganization(this.userInfo?.organizationId)
      } catch (error) {
        this.setFailureAlert('Failed to get your organization information', error)
      } finally {
        this.loading = false
      }
    },
  },
}
</script>
