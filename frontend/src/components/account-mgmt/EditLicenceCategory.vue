<template>
  <v-expansion-panels v-model="panel" multiple class="panels">
    <v-expansion-panel v-for="(licence, indexLicence) in editLicenceDetails" :key="licence.licenceDetailId" :value="indexLicence">
      <v-expansion-panel-title class="header-label">
        <v-col>
          <AppLabel>{{ getLicenceTypeNameById(licence.licenceType) }}</AppLabel>
        </v-col>
        <v-col>
          <v-row no-gutters justify="end">
            <AppButton variant="text" :disabled="loading" @click="deleteLicenceCategory(index)">
              <v-icon icon="fa:fa-regular fa-trash-can" class="mr-2"></v-icon>
            </AppButton>
          </v-row>
        </v-col>
      </v-expansion-panel-title>
      <v-expansion-panel-text>
        <v-row no-gutters>
          <v-col cols="12" sm="6" md="3" lg="3" xl="3">
            <v-row no-gutters class="mr-2 my-2">
              <v-col cols="12" sm="6" md="6" lg="5" xl="5" class="pr-2">
                <AppLabel>Licensed Spaces:</AppLabel>
              </v-col>
              <v-col cols="auto">
                <v-text-field id="licenceSpaces" v-model="licence.licenceSpaces" variant="outlined" density="compact" />
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="12" md="7" lg="6" xl="5">
            <v-row no-gutters class="mr-2 my-2">
              <v-col cols="12" sm="3" md="3" lg="3" xl="3" class="pr-2">
                <AppLabel>Weeks in Operation:</AppLabel>
              </v-col>
              <v-col cols="auto">
                <v-text-field id="weeksInOperation" v-model="licence.weeksInOperation" variant="outlined" density="compact" />
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="12" md="2" lg="3" xl="4">
            <v-row no-gutters class="mr-2 my-2">
              <v-col cols="12" sm="3" lg="4" xl="3" class="pr-2">
                <AppLabel>Care Type:</AppLabel>
              </v-col>
              <v-col cols="auto">
                <v-text-field id="careType" v-model="licence.careType" variant="outlined" density="compact" />
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="12" md="3" lg="3" xl="3">
            <v-row no-gutters class="mr-2 my-2">
              <v-col cols="12" sm="3" lg="5" xl="5" class="pr-2">
                <AppLabel>Operational Spaces:</AppLabel>
              </v-col>
              <v-col cols="auto">
                <v-text-field id="operationalSpaces" v-model="licence.operationalSpaces" variant="outlined" density="compact" />
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="12" md="7" lg="6" xl="5">
            <v-row class="mr-2 my-2">
              <v-col cols="12" sm="3" md="3" lg="3" xl="3" class="pr-2">
                <AppLabel>Days of Week:</AppLabel>
              </v-col>
              <v-col cols="auto">
                <v-row>
                  <v-col v-for="(day, indexDaysOfWeek) in daysOfWeek[indexLicence]" :key="indexDaysOfWeek" cols="auto" class="pa-2">
                    <v-card flat class="mb-2 text-center" density="compact">
                      <v-card-title class="pb-0 pl-0 pr-0 days-of-week">{{ day.label }}</v-card-title>
                      <v-checkbox v-model="day.checked" density="compact" hide-details @input="handleDayChange(day, indexLicence, indexDaysOfWeek)" />
                    </v-card>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="12" md="2" lg="3" xl="4">
            <v-row no-gutters class="mr-2 my-2">
              <v-col cols="12" sm="3" md="auto" lg="4" xl="3" class="pr-2">
                <AppLabel>Overnight Care:</AppLabel>
              </v-col>
              <v-col cols="auto">
                <v-text-field id="overnightCare" v-model="licence.overnightCare" variant="outlined" density="compact" />
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="12" md="3" lg="3" xl="3">
            <v-row no-gutters class="mr-2 my-2">
              <v-col cols="12" sm="3" lg="5" xl="5" class="pr-2">
                <AppLabel>Enrolled Spaces:</AppLabel>
              </v-col>
              <v-col cols="auto">
                <v-text-field id="enrolledSpaces" v-model="licence.enrolledSpaces" variant="outlined" density="compact" />
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="12" md="7" lg="6" xl="5">
            <v-row no-gutters class="mr-2 my-2">
              <v-col cols="12" sm="3" md="2" lg="3" xl="3" class="">
                <AppLabel>Hours:</AppLabel>
              </v-col>
              <v-col cols="auto">
                <v-row>
                  <v-col cols="auto" class="d-flex align-start justify-start pr-0">
                    Start:
                  </v-col>
                  <v-col cols="auto" class="d-flex align-start justify-start">
                    <v-select id="operationFromTimeAM" v-model="hoursOfOperation[indexLicence].timeFrom" :items="timesOfDay" label="Time" density="compact" variant="outlined" class="mr-1" @update:modelValue="updateOperationFromTime(indexLicence)" />
                    <v-select id="operationFromDayAM" v-model="hoursOfOperation[indexLicence].timePeriodFrom" :items="amPm" label="AM/PM" density="compact" variant="outlined" @update:modelValue="updateOperationFromTime(indexLicence)" />
                  </v-col>
                  <v-col cols="auto" class="d-flex align-start justify-start pr-0">
                    End:
                  </v-col>
                  <v-col cols="auto" class="d-flex align-start justify-start">
                    <v-select id="operationToTimePM" v-model="hoursOfOperation[indexLicence].timeEnd" :items="timesOfDay" label="Time" density="compact" variant="outlined" class="mr-1" @update:modelValue="updateOperationToTime(indexLicence)" />
                    <v-select id="operationToDayPM" v-model="hoursOfOperation[indexLicence].timePeriodEnd" :items="amPm" label="AM/PM" density="compact" variant="outlined" @update:modelValue="updateOperationToTime(indexLicence)" />
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-expansion-panel-text>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script>
import AppButton from '@/components/ui/AppButton.vue'
import alertMixin from '@/mixins/alertMixin'
import AppLabel from '@/components/ui/AppLabel.vue'
import { mapState } from 'pinia'
import { useAppStore } from '@/stores/app'

const DAYS_OF_WEEK = [
  { label: 'Mon', value: 1, checked: false },
  { label: 'Tues', value: 2, checked: false },
  { label: 'Wed', value: 3, checked: false },
  { label: 'Thu', value: 4, checked: false },
  { label: 'Fri', value: 5, checked: false },
  { label: 'Sat', value: 6, checked: false },
  { label: 'Sun', value: 7, checked: false },
]

export default {
  components: { AppLabel, AppButton },
  mixins: [alertMixin],
  props: {
    licenceDetails: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      panel: [],
      editLicenceDetails: [],
      daysOfWeek: [],
      hoursOfOperation: [],
      amPm: ['AM', 'PM'],
      timesOfDay: Array.from({ length: 12 }, (_, i) => { const hour = (i + 1).toString().padStart(2, '0'); return [`${hour}:00`, `${hour}:30`]; }).flat(),
      loading: false,
    }
  },
  computed: {
    ...mapState(useAppStore, ['getLicenceTypeNameById']),
  },
  watch: {
    licenceDetails: {
      handler: function (val) {
        console.log('watch')
        this.editLicenceDetails = val
        this.panel = this.editLicenceDetails.map((_, index) => index)
        this.editLicenceDetails.forEach(this.parseLicenceDetail)
      },
      deep: true,
    },
  },
  async created() {
    console.log('created')
    this.editLicenceDetails = this.licenceDetails
    this.panel = this.editLicenceDetails.map((_, index) => index)
    this.editLicenceDetails.forEach(this.parseLicenceDetail)
  },
  methods: {
    /**
     * Update the weekDays array for the given licence index
     * @param {number} indexLicence - The index of the licence
     * @param {number} value - The value of the day
     */
    updateWeekDays(indexLicence, value) {
      // Get the weekDays array for the given index, or an empty array if it doesn't exist
      let weekDays = this.editLicenceDetails[indexLicence].weekDays ? this.editLicenceDetails[indexLicence].weekDays.split(',').map(Number) : [];
      // Check if the value is in the array
      const valueIndex = weekDays.indexOf(value);
      if (valueIndex !== -1) {
        weekDays.splice(valueIndex, 1);
      } else {
        weekDays.push(value);
      }
      // Sort the array and convert it back to a comma-delimited string
      this.editLicenceDetails[indexLicence].weekDays = weekDays.sort((a, b) => a - b).join(',');
    },

    /**
     * Handle the day change (checked/unchecked)
     * @param {object} day - The day object
     * @param {number} indexLicence - The index of the licence
     * @param {number} indexLicenceDetails - The index of the licence details
     */
    handleDayChange(day, indexLicence, indexLicenceDetails) {
      this.updateWeekDays(indexLicence, this.daysOfWeek[indexLicence][indexLicenceDetails].value);
    },

    /**
     * Parses a licence detail object to extract hours of operation time/time period and week days.
    */
    parseLicenceDetail(licenceDetail) {
      this.parseOperationTime(licenceDetail);
      this.parseWeekDays(licenceDetail);
    },

    /**
     * Parses operation times from a licence detail object and adds them to the hoursOfOperation array.
    */
    parseOperationTime(licenceDetail) {
      const { time: timeFrom, period: timePeriodFrom } = this.parseTime(licenceDetail.operationFromTime);
      const { time: timeEnd, period: timePeriodEnd } = this.parseTime(licenceDetail.operationToTime);
      this.hoursOfOperation.push({ timeFrom, timePeriodFrom, timeEnd, timePeriodEnd });
    },

    /**
     * Parses week days from a licence detail object and adds them to the daysOfWeek array.
    */
    parseWeekDays(licenceDetail) {
      try {
        let daysOfWeek = this.getDaysOfWeek()
        if (licenceDetail.weekDays) {
          const weekDays = licenceDetail.weekDays.split(',').map(Number)
          daysOfWeek = daysOfWeek.map(day => {
            return weekDays.includes(day.value) ? { ...day, checked: true } : { ...day }
          })
        }
        this.daysOfWeek.push(daysOfWeek)
      } catch (error) {
        console.error('Error parsing weekDays', error)
      }
    },

    /**
     * Updates the operationFromTime property of a licence detail object at a specific index.
     * The new value is a string composed of the timeFrom and timePeriodFrom properties of the corresponding hoursOfOperation object.
     */
    updateOperationFromTime(indexLicence) {
      this.editLicenceDetails[indexLicence].operationFromTime = `${this.hoursOfOperation[indexLicence].timeFrom} ${this.hoursOfOperation[indexLicence].timePeriodFrom}`
    },

    /**
     * Updates the operationToTime property of a licence detail object at a specific index.
     * The new value is a string composed of the timeEnd and timePeriodEnd properties of the corresponding hoursOfOperation object.
     */
    updateOperationToTime(indexLicence) {
      this.editLicenceDetails[indexLicence].operationToTime = `${this.hoursOfOperation[indexLicence].timeEnd} ${this.hoursOfOperation[indexLicence].timePeriodEnd}`
    },

    /**
     * Deletes a licence category at a specific index.
     */
    deleteLicenceCategory(index) {
      this.editLicenceDetails.splice(index, 1)
      this.panel = this.editLicenceDetails.map((_, index) => index)
    },

    /**
     * Parses a time string (i.e. 12:00 AM) into an object with time (12:00) and period (AM) properties.
     */
    parseTime(timeString) {
      const [time, period] = timeString.split(' ');
      return { time, period };
    },

    /**
     * Get the days of the week constant
     */
    getDaysOfWeek() {
      return DAYS_OF_WEEK;
    },
  }
}

</script>
<style scoped>
.header-label {
  font-size: 1em;
}

.days-of-week {
  font-size: 1.0em;
}

.panels .v-expansion-panel--active {
  margin: 0;
}


.panels .v-expansion-panel-header {
  margin: 0;
}
</style>
