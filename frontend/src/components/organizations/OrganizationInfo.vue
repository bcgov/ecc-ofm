<template>
  <v-card class="my-4 pa-4" variant="outlined">
    <v-skeleton-loader :loading="loading" type="table-tbody">
      <v-container fluid class="pa-0">
        <v-row no-gutters>
          <v-col cols="9" md="6">
            <v-row no-gutters class="ma-2">
              <v-col cols="12" md="6" lg="5" xl="4">
                <AppLabel>Organization legal name:</AppLabel>
              </v-col>
              <v-col cols="12" md="6" lg="7" xl="8">{{ organizationInfo?.name }}</v-col>
            </v-row>
          </v-col>
          <v-col v-if="editable" cols="3" md="6">
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
                <AppLabel>Doing business as:</AppLabel>
              </v-col>
              <v-col cols="12" md="6" lg="7" xl="8">
                {{ organizationInfo?.businessType }}
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="12" md="6">
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
          <v-col cols="12" md="6">
            <v-row no-gutters class="ma-2">
              <v-col cols="12" md="6" lg="5" xl="4">
                <AppLabel>Phone (landline):</AppLabel>
              </v-col>
              <v-col cols="12" md="6" lg="7" xl="8">
                {{ organizationInfo?.phoneLandline }}
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="12" md="6">
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
                    {{ organizationInfo?.streetAddress1 }}
                  </v-col>
                </v-row>
              </v-col>
              <v-col cols="12" md="6">
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
              <v-col cols="12" md="6">
                <v-row no-gutters class="ma-2">
                  <v-col cols="12" md="6" lg="5" xl="4">
                    <AppLabel>City:</AppLabel>
                  </v-col>
                  <v-col cols="12" md="6" lg="7" xl="8">
                    {{ organizationInfo?.city }}
                  </v-col>
                </v-row>
              </v-col>
              <v-col cols="12" md="6">
                <v-row no-gutters class="ma-2">
                  <v-col cols="12" md="6" lg="5" xl="4">
                    <AppLabel>Province:</AppLabel>
                  </v-col>
                  <v-col cols="12" md="6" lg="7" xl="8">
                    {{ organizationInfo?.province }}
                  </v-col>
                </v-row>
              </v-col>
              <v-col cols="12" md="6">
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
                    {{ organizationInfo?.isMailingAddressDifferent ? organizationInfo?.mailingStreetAddress1 : organizationInfo?.streetAddress1 }}
                  </v-col>
                </v-row>
              </v-col>
              <v-col cols="12" md="6">
                <v-row no-gutters class="ma-2">
                  <v-col cols="12" md="6" lg="5" xl="4">
                    <AppLabel>Street address 2:</AppLabel>
                  </v-col>
                  <v-col cols="12" md="6" lg="7" xl="8">
                    {{ organizationInfo?.isMailingAddressDifferent ? organizationInfo?.mailingStreetAddress2 : organizationInfo?.streetAddress2 }}
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
                    {{ organizationInfo?.isMailingAddressDifferent ? organizationInfo?.mailingCity : organizationInfo?.city }}
                  </v-col>
                </v-row>
              </v-col>
              <v-col cols="12" md="6">
                <v-row no-gutters class="ma-2">
                  <v-col cols="12" md="6" lg="5" xl="4">
                    <AppLabel>Province:</AppLabel>
                  </v-col>
                  <v-col cols="12" md="6" lg="7" xl="8">
                    {{ organizationInfo?.isMailingAddressDifferent ? organizationInfo?.mailingProvince : organizationInfo?.province }}
                  </v-col>
                </v-row>
              </v-col>
              <v-col cols="12" md="6">
                <v-row no-gutters class="ma-2">
                  <v-col cols="12" md="6" lg="5" xl="4">
                    <AppLabel>Postal code:</AppLabel>
                  </v-col>
                  <v-col cols="12" md="6" lg="7" xl="8">
                    {{ organizationInfo?.isMailingAddressDifferent ? organizationInfo?.mailingPostalCode : organizationInfo?.postalCode }}
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
  props: {
    editable: {
      type: Boolean,
      default: false,
    },
  },
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
