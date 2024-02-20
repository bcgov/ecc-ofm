<template>
  <v-container fluid class="pt-0">
    <v-row no-gutters>
      <v-col cols="12" lg="6">
        <v-row no-gutters class="mr-2 my-2">
          <v-col cols="12" sm="6" class="pr-2 mt-1">
            <AppLabel>CCOF Facility ID:</AppLabel>
          </v-col>
          <v-col cols="12" sm="6" class="mt-1">{{ licence?.ccofFacilityId ? licence?.ccofFacilityId : BLANK_FIELD }}</v-col>
        </v-row>
      </v-col>
      <v-col cols="12" lg="6">
        <v-row no-gutters class="mr-2 my-2">
          <v-col cols="12" sm="6" class="pr-2 mt-1">
            <AppLabel>CCOF Organization ID:</AppLabel>
          </v-col>
          <v-col cols="12" sm="6" class="mt-1">{{ licence?.ccofOrganizationId ? licence?.ccofOrganizationId : BLANK_FIELD }}</v-col>
        </v-row>
      </v-col>
      <v-col cols="12" lg="6">
        <v-row no-gutters class="mr-2 my-2">
          <v-col cols="12" sm="6" class="pr-2 mt-1">
            <AppLabel>Health Authority:</AppLabel>
          </v-col>
          <v-col cols="12" sm="6" class="mt-1">{{ healthAuthority }}</v-col>
        </v-row>
      </v-col>
      <v-col cols="12" lg="6">
        <v-row no-gutters class="mr-2 my-2">
          <v-col cols="12" sm="6" class="pr-2 mt-1">
            <AppLabel>ACCB Provider ID:</AppLabel>
          </v-col>
          <v-col cols="12" sm="6" class="mt-1">
            {{ licence?.accbProviderId ? licence?.accbProviderId : BLANK_FIELD }}
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="12" lg="6">
        <v-row no-gutters class="mr-2 my-2">
          <v-col cols="12" sm="6" class="pr-2 mt-1">
            <AppLabel>TDAD Funding Agreement Number:</AppLabel>
          </v-col>
          <v-col cols="12" sm="6" class="mt-1">
            {{ licence?.tdadFundingAgreementNumber ? licence?.tdadFundingAgreementNumber : '- - - -' }}
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <v-row>
      <v-col class="pb-0">
        <h4 class="mb-2 text-decoration-underline">Category Details</h4>
      </v-col>
    </v-row>
    <v-row>
      <v-col class="pt-0">
        <v-expansion-panels v-model="panel" multiple>
          <v-expansion-panel v-for="licenceDetail in licence.licenceDetails" :key="licenceDetail.licenceDetailId" :value="licenceDetail.licenceDetailId">
            <v-expansion-panel-title>
              <AppLabel>{{ getLicenceTypeNameById(licenceDetail.licenceType) }}</AppLabel>
            </v-expansion-panel-title>
            <v-expansion-panel-text>
              <v-row no-gutters>
                <v-col cols="12" md="6" lg="4" xl="3">
                  <v-row no-gutters class="mr-2 my-2">
                    <v-col cols="12" sm="6" xl="6" class="pr-2">
                      <AppLabel>Licensed Spaces:</AppLabel>
                    </v-col>
                    <v-col cols="12" sm="6" xl="6">{{ licenceDetail?.licenceSpaces }}</v-col>
                  </v-row>
                </v-col>
                <v-col cols="12" md="6" lg="5" xl="6">
                  <v-row no-gutters class="mr-2 my-2">
                    <v-col cols="12" sm="6" xl="4" class="pr-2">
                      <AppLabel>Weeks in Operation:</AppLabel>
                    </v-col>
                    <v-col cols="12" sm="6" xl="8">{{ licenceDetail?.weeksInOperation }}</v-col>
                  </v-row>
                </v-col>
                <v-col cols="12" md="6" lg="3" xl="3">
                  <v-row no-gutters class="mr-2 my-2">
                    <v-col cols="12" sm="6" xl="5" class="pr-2">
                      <AppLabel>Care Type:</AppLabel>
                    </v-col>
                    <v-col cols="12" sm="6" xl="7">{{ licenceDetail?.careType === 1 ? 'Full-Time' : 'Part-Time' }}</v-col>
                  </v-row>
                </v-col>
                <v-col cols="12" md="6" lg="4" xl="3">
                  <v-row no-gutters class="mr-2 my-2">
                    <v-col cols="12" sm="6" xl="6" class="pr-2">
                      <AppLabel>Operational Spaces:</AppLabel>
                    </v-col>
                    <v-col cols="12" sm="6" xl="6">{{ licenceDetail?.operationalSpaces }}</v-col>
                  </v-row>
                </v-col>
                <v-col cols="12" md="6" lg="5" xl="6">
                  <v-row no-gutters class="mr-2 my-2">
                    <v-col cols="12" sm="6" xl="4" class="pr-2">
                      <AppLabel>Days of Week:</AppLabel>
                    </v-col>
                    <v-col cols="12" sm="6" xl="8">{{ convertDaysToString(licenceDetail?.weekDays) }}</v-col>
                  </v-row>
                </v-col>
                <v-col cols="12" md="6" lg="3" xl="3">
                  <v-row no-gutters class="mr-2 my-2">
                    <v-col cols="12" sm="6" xl="5" class="pr-2">
                      <AppLabel>Overnight Care:</AppLabel>
                    </v-col>
                    <v-col cols="12" sm="6" xl="7">{{ licenceDetail?.overnightCare ? 'Yes' : 'No' }}</v-col>
                  </v-row>
                </v-col>
                <v-col cols="12" md="6" lg="4" xl="3">
                  <v-row no-gutters class="mr-2 my-2">
                    <v-col cols="12" sm="6" xl="6" class="pr-2">
                      <AppLabel>Enrolled Spaces:</AppLabel>
                    </v-col>
                    <v-col cols="12" sm="6" xl="6">{{ licenceDetail?.enrolledSpaces }}</v-col>
                  </v-row>
                </v-col>
                <v-col cols="12" md="6" lg="5" xl="6">
                  <v-row no-gutters class="mr-2 my-2">
                    <v-col cols="12" sm="6" xl="4" class="pr-2">
                      <AppLabel>Hours:</AppLabel>
                    </v-col>
                    <v-col cols="12" sm="6" xl="8">{{ licenceDetail?.operationFromTime }} - {{ licenceDetail?.operationToTime }}</v-col>
                  </v-row>
                </v-col>
              </v-row>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import AppLabel from '@/components/ui/AppLabel.vue'
import { mapState } from 'pinia'
import { useAppStore } from '@/stores/app'

export default {
  components: { AppLabel },
  props: {
    licence: {
      type: Object,
      required: true,
      default: () => {
        return {}
      },
    },
  },
  data() {
    return {
      panel: [],
    }
  },
  computed: {
    ...mapState(useAppStore, ['getLicenceTypeNameById', 'getHealthAuthorityNameById']),

    allLicenceDetailsID() {
      return this.licence?.licenceDetails?.map((licenceDetail) => licenceDetail.licenceDetailId)
    },

    healthAuthority() {
      const healthAuthority = this.getHealthAuthorityNameById(this.licence?.healthAuthorityId)
      return healthAuthority ? healthAuthority : this.BLANK_FIELD
    },
  },
  async created() {
    this.panel = this.allLicenceDetailsID
    this.BLANK_FIELD = '- - - -'
  },
  methods: {
    convertDaysToString(days) {
      const daysOfWeek = { 1: 'Monday', 2: 'Tuesday', 3: 'Wednesday', 4: 'Thursday', 5: 'Friday', 6: 'Saturday', 7: 'Sunday' }
      const operationalDays = days?.split(',')
      return operationalDays?.map((day) => daysOfWeek[day])?.join(', ')
    },
  },
}
</script>
