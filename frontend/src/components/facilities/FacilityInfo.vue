<template>
  <v-card class="pa-4" variant="outlined">
    <v-skeleton-loader :loading="loading" type="table-tbody">
      <v-container fluid class="pa-0">
        <v-row v-if="!isApplicationPage" no-gutters>
          <v-col cols="9" lg="6">
            <v-row no-gutters class="ma-2">
              <v-col cols="12" md="4" lg="5" xl="4">
                <AppLabel>Facility name:</AppLabel>
              </v-col>
              <v-col cols="12" md="8" lg="7" xl="8">{{ facility?.name }}</v-col>
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
                {{ facility?.phoneLandline }}
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="12" md="6">
            <v-row no-gutters class="ma-2">
              <v-col cols="12" md="6" lg="5" xl="4">
                <AppLabel>Phone (cell):</AppLabel>
              </v-col>
              <v-col cols="12" md="6" lg="7" xl="8">
                {{ facility?.phoneCell }}
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
                {{ facility?.email }}
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
                    {{ facility?.streetAddress1 }}
                  </v-col>
                </v-row>
              </v-col>
              <v-col cols="12" md="6">
                <v-row no-gutters class="ma-2">
                  <v-col cols="12" md="6" lg="5" xl="4">
                    <AppLabel>Street address 2:</AppLabel>
                  </v-col>
                  <v-col cols="12" md="6" lg="7" xl="8">
                    {{ facility?.streetAddress2 }}
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
                    {{ facility?.city }}
                  </v-col>
                </v-row>
              </v-col>
              <v-col cols="12" md="6">
                <v-row no-gutters class="ma-2">
                  <v-col cols="12" md="6" lg="5" xl="4">
                    <AppLabel>Province:</AppLabel>
                  </v-col>
                  <v-col cols="12" md="6" lg="7" xl="8">
                    {{ facility?.province }}
                  </v-col>
                </v-row>
              </v-col>
              <v-col cols="12" md="6">
                <v-row no-gutters class="ma-2">
                  <v-col cols="12" md="6" lg="5" xl="4">
                    <AppLabel>Postal code:</AppLabel>
                  </v-col>
                  <v-col cols="12" md="6" lg="7" xl="8">
                    {{ facility?.postalCode }}
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
        <v-divider v-if="facility?.additionalAddresses?.length === 0" />

        <v-expansion-panels v-else>
          <v-expansion-panel>
            <v-expansion-panel-title><AppLabel>Additional Addresses</AppLabel></v-expansion-panel-title>
            <v-expansion-panel-text>
              <v-row v-for="(additionalAddress, index) in facility?.additionalAddresses" :key="index" no-gutters>
                <v-divider class="my-2" />
                <v-col cols="12">
                  <v-row no-gutters class="ma-2">
                    <h4>Additional address {{ String(index + 1) }}</h4>
                  </v-row>
                  <v-row no-gutters>
                    <v-col cols="12" md="6">
                      <v-row no-gutters class="ma-2">
                        <v-col cols="12" md="6" lg="5" xl="4">
                          <AppLabel>Street address 1:</AppLabel>
                        </v-col>
                        <v-col cols="12" md="6" lg="7" xl="8">
                          {{ additionalAddress?.address1 }}
                        </v-col>
                      </v-row>
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-row no-gutters class="ma-2">
                        <v-col cols="12" md="6" lg="5" xl="4">
                          <AppLabel>Street address 2:</AppLabel>
                        </v-col>
                        <v-col cols="12" md="6" lg="7" xl="8">
                          {{ additionalAddress?.address2 }}
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
                          {{ additionalAddress?.city }}
                        </v-col>
                      </v-row>
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-row no-gutters class="ma-2">
                        <v-col cols="12" md="6" lg="5" xl="4">
                          <AppLabel>Province:</AppLabel>
                        </v-col>
                        <v-col cols="12" md="6" lg="7" xl="8">
                          {{ additionalAddress?.province }}
                        </v-col>
                      </v-row>
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-row no-gutters class="ma-2">
                        <v-col cols="12" md="6" lg="5" xl="4">
                          <AppLabel>Postal code:</AppLabel>
                        </v-col>
                        <v-col cols="12" md="6" lg="7" xl="8">
                          {{ additionalAddress?.postalCode }}
                        </v-col>
                      </v-row>
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>

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
                    {{ facility?.isMailingAddressDifferent ? facility?.mailingStreetAddress1 : facility?.streetAddress1 }}
                  </v-col>
                </v-row>
              </v-col>
              <v-col cols="12" md="6">
                <v-row no-gutters class="ma-2">
                  <v-col cols="12" md="6" lg="5" xl="4">
                    <AppLabel>Street address 2:</AppLabel>
                  </v-col>
                  <v-col cols="12" md="6" lg="7" xl="8">
                    {{ facility?.isMailingAddressDifferent ? facility?.mailingStreetAddress2 : facility?.streetAddress2 }}
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
                    {{ facility?.isMailingAddressDifferent ? facility?.mailingCity : facility?.city }}
                  </v-col>
                </v-row>
              </v-col>
              <v-col cols="12" md="6">
                <v-row no-gutters class="ma-2">
                  <v-col cols="12" md="6" lg="5" xl="4">
                    <AppLabel>Province:</AppLabel>
                  </v-col>
                  <v-col cols="12" md="6" lg="7" xl="8">
                    {{ facility?.isMailingAddressDifferent ? facility?.mailingProvince : facility?.province }}
                  </v-col>
                </v-row>
              </v-col>
              <v-col cols="12" md="6">
                <v-row no-gutters class="ma-2">
                  <v-col cols="12" md="6" lg="5" xl="4">
                    <AppLabel>Postal code:</AppLabel>
                  </v-col>
                  <v-col cols="12" md="6" lg="7" xl="8">
                    {{ facility?.isMailingAddressDifferent ? facility?.mailingPostalCode : facility?.postalCode }}
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
import AppLabel from '@/components/ui/AppLabel.vue'

export default {
  components: { AppLabel },
  props: {
    facility: {
      type: Object,
      required: true,
      default: () => {
        return {}
      },
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    isApplicationPage() {
      return this.$route.path?.includes('/applications/')
    },
  },
}
</script>
