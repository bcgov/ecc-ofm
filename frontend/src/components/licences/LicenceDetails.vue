<template>
  <v-expansion-panels v-model="panel" multiple>
    <v-expansion-panel v-for="licence in licenceDetails" :key="licence.licenceDetailId" :value="licence.licenceDetailId">
      <v-expansion-panel-title>
        <AppLabel>{{ getLicenceTypeNameById(licence?.licenceType) }}</AppLabel>
      </v-expansion-panel-title>
      <v-expansion-panel-text>
        <v-row no-gutters>
          <v-col cols="12" md="6" lg="4" xl="3">
            <v-row no-gutters class="mr-2 my-2">
              <v-col cols="12" sm="6" class="pr-2">
                <AppLabel>Licensed Spaces:</AppLabel>
              </v-col>
              <v-col cols="12" sm="6">{{ licence?.licenceSpaces }}</v-col>
            </v-row>
          </v-col>
          <v-col cols="12" md="6" lg="5" xl="6">
            <v-row no-gutters class="mr-2 my-2">
              <v-col cols="12" sm="6" xl="4" class="pr-2">
                <AppLabel>Weeks in Operation:</AppLabel>
              </v-col>
              <v-col cols="12" sm="6" xl="8">{{ licence?.weeksInOperation }}</v-col>
            </v-row>
          </v-col>
          <v-col cols="12" md="6" lg="3">
            <v-row no-gutters class="mr-2 my-2">
              <v-col cols="12" sm="6" xl="5" class="pr-2">
                <AppLabel>Care Type:</AppLabel>
              </v-col>
              <v-col cols="12" sm="6" xl="7">{{ licence?.careType === 1 ? 'Full-Time' : 'Part-Time' }}</v-col>
            </v-row>
          </v-col>
          <v-col cols="12" md="6" lg="4" xl="3">
            <v-row no-gutters class="mr-2 my-2">
              <v-col cols="12" sm="6" class="pr-2">
                <AppLabel>Operational Spaces:</AppLabel>
              </v-col>
              <v-col cols="12" sm="6">{{ licence?.operationalSpaces }}</v-col>
            </v-row>
          </v-col>
          <v-col cols="12" md="6" lg="5" xl="6">
            <v-row no-gutters class="mr-2 my-2">
              <v-col cols="12" sm="6" xl="4" class="pr-2">
                <AppLabel>Days of Week:</AppLabel>
              </v-col>
              <v-col cols="12" sm="6" xl="8">{{ convertDaysToString(licence?.weekDays) }}</v-col>
            </v-row>
          </v-col>
          <v-col cols="12" md="6" lg="3">
            <v-row no-gutters class="mr-2 my-2">
              <v-col cols="12" sm="6" xl="5" class="pr-2">
                <AppLabel>Overnight Care:</AppLabel>
              </v-col>
              <v-col cols="12" sm="6" xl="7">{{ licence?.overnightCare ? 'Yes' : 'No' }}</v-col>
            </v-row>
          </v-col>
          <v-col cols="12" md="6" lg="4" xl="3">
            <v-row no-gutters class="mr-2 my-2">
              <v-col cols="12" sm="6" class="pr-2">
                <AppLabel>Enrolled Spaces:</AppLabel>
              </v-col>
              <v-col cols="12" sm="6">{{ licence?.enrolledSpaces }}</v-col>
            </v-row>
          </v-col>
          <v-col cols="12" md="6" lg="5" xl="6">
            <v-row no-gutters class="mr-2 my-2">
              <v-col cols="12" sm="6" xl="4" class="pr-2">
                <AppLabel>Hours:</AppLabel>
              </v-col>
              <v-col cols="12" sm="6" xl="8">{{ licence?.operationFromTime }} - {{ licence?.operationToTime }}</v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-expansion-panel-text>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script>
import AppLabel from '@/components/ui/AppLabel.vue'
import { mapState } from 'pinia'
import { useAppStore } from '@/stores/app'

export default {
  components: { AppLabel },
  props: {
    licenceDetails: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      panel: [],
    }
  },
  computed: {
    ...mapState(useAppStore, ['getLicenceTypeNameById']),
    allLicenceDetailsID() {
      return this.licenceDetails.map((licence) => licence.licenceDetailId)
    },
  },
  async created() {
    this.panel = this.allLicenceDetailsID
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
