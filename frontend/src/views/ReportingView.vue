<template>
  <OrganizationHeader />
  <v-container fluid v-bind="$attrs">
    <v-row>
      <v-col>
        <h1>Reporting</h1>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="auto" class="pb-0" />
      <v-col cols="12" xs="12" sm="3" md="2" lg="1" xl="1" class="pb-0">
        <AppLabel>Facility:</AppLabel>
      </v-col>
      <v-col cols="12" xs="12" sm="6" md="4" lg="4" xl="4" class="pb-0">
        <v-select v-model="selectedFacility" :items="userInfo.facilities" item-title="facilityName" item-value="facilityId" label="Select facility to report on" density="compact" variant="outlined" />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="auto" class="pb-1 pt-0" />
      <v-col cols="12" xs="12" sm="3" md="2" lg="1" xl="1" class="pb-1 pt-0">
        <AppLabel>Report Types:</AppLabel>
      </v-col>
      <v-col cols="12" xs="12" sm="6" md="5" lg="5" xl="5" class="pb-1 pt-0">
        <v-row>
          <v-col class="pb-0 pt-1">
            <v-checkbox v-model="isCheckedMonthly" density="compact" class="pl-8">Monthly</v-checkbox>
          </v-col>
          <v-col class="pb-0 pt-1">
            <v-checkbox v-model="isCheckedAnnual" density="compact" class="pl-0">Annual</v-checkbox>
          </v-col>
          <v-col class="pb-0 pt-1">
            <v-checkbox v-model="isCheckedOther" density="compact" class="pl-0">Other</v-checkbox>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <v-row></v-row>
    <v-row>
      <v-col cols="auto" class="pb-0 pt-0" />
      <v-col cols="12" xs="12" sm="3" md="2" lg="1" xl="1" class="pb-0 pt-0">
        <AppLabel>Date Range:</AppLabel>
      </v-col>
      <v-col cols="12" xs="12" sm="3" md="2" lg="2" xl="2" class="pb-0 pt-0">
        <v-menu ref="menuFromDate" v-model="menuFromDate" :close-on-content-click="false" @update:model-value="(val) => (menuFromDate = val)" transition="scale-transition" offset-y min-width="auto">
          <template #activator="{ on, attrs }">
            <v-text-field
              v-model="formattedFromDate"
              label="From Date"
              prepend-icon="mdi-calendar"
              readonly
              v-bind="attrs"
              v-on="{ ...on }"
              density="compact"
              variant="outlined"
              @click:prepend="menuFromDate = !menuFromDate"></v-text-field>
          </template>
          <v-date-picker v-model="fromDate" @input="menuFromDate = false" :locale="locale"></v-date-picker>
        </v-menu>
      </v-col>
      <v-col cols="12" xs="12" sm="3" md="2" lg="2" xl="2" class="pb-0 pt-0">
        <v-menu ref="menuEndDate" v-model="menuEndDate" :close-on-content-click="false" @update:model-value="(val) => (menuEndDate = val)" transition="scale-transition" offset-y min-width="auto">
          <template #activator="{ on, attrs }">
            <v-text-field
              v-model="formattedEndDate"
              label="To Date"
              prepend-icon="mdi-calendar"
              readonly
              v-bind="attrs"
              v-on="{ ...on }"
              density="compact"
              variant="outlined"
              @click:prepend="menuEndDate = !menuEndDate"></v-text-field>
          </template>
          <v-date-picker v-model="endDate" @input="menuEndDate = false" :locale="locale"></v-date-picker>
        </v-menu>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="auto" class="pb-0 pt-0" />
      <v-col cols="12" xs="12" sm="3" md="2" lg="1" xl="1" class="pb-0 pt-0">
        <AppLabel>Status:</AppLabel>
      </v-col>
      <v-col cols="12" xs="12" sm="4" md="4" lg="4" xl="4" class="pb-0 pt-0">
        <v-select v-model="selectedStatus" :items="statusTypes" item-title="title" item-value="id" label="Select status to report on" density="compact" variant="outlined" clearable />
      </v-col>
      <v-col cols="auto" class="pb-0 pt-0" />
      <v-col cols="auto" class="pb-0 pt-0">
        <AppLabel>Include Submitted:</AppLabel>
      </v-col>
      <v-col cols="auto" class="pb-0 pt-0 pl-0 d-flex align-top">
        <v-row>
          <v-col class="pt-1">
            <v-checkbox v-model="includeSubmitted" density="compact"></v-checkbox>
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="1" />
      <v-col>
        <v-row class="d-flex" justify="start">
          <AppButton id="reset" :primary="false" size="large" width="100px" class="mr-8" @click="resetFilters()">Reset</AppButton>
          <AppButton id="run-report" size="large" :disabled="!selectedFacility" width="150px" @click="search()">Search</AppButton>
        </v-row>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-divider />
      </v-col>
    </v-row>
    <v-row v-if="isSearched">
      <v-skeleton-loader :loading="loading" type="table-tbody">
        <v-col>
          <v-data-table :headers="headers" :items="displayedFacilities" item-key="reportId" :items-per-page="15" density="compact">
            <template #[`item.alertType`]="{ item }">
              <v-icon v-if="item.alertType === 'Due'" color="#c48600" size="34" title="Due now">mdi-alert</v-icon>
              <v-icon v-else-if="item.alertType === 'Overdue'" color="#d8292f" size="34" title="Overdue">mdi-alert-octagon</v-icon>
              <v-icon v-else-if="item.alertType === 'Completed'" color="#2e8540" size="34" title="Completed">mdi-check-circle</v-icon>
            </template>
            <template #[`item.actions`]="{ item }">
              <router-link to="">
                {{ item.actions }}
              </router-link>
            </template>
          </v-data-table>
        </v-col>
      </v-skeleton-loader>
    </v-row>
    <v-row>
      <v-col cols="5">
        <AppBackButton id="back-home-button" width="220px" :to="{ name: 'home' }">Home</AppBackButton>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import OrganizationHeader from '@/components/organizations/OrganizationHeader.vue'
import AppLabel from '@/components/ui/AppLabel.vue'
import AppButton from '@/components/ui/AppButton.vue'
import AppBackButton from '@/components/ui/AppBackButton.vue'
import ReportsService from '@/services/reportsService'
import alertMixin from '@/mixins/alertMixin'
import { mapState } from 'pinia'
import { useAuthStore } from '@/stores/auth'

export default {
  name: 'ReportingView',
  components: { AppLabel, AppButton, AppBackButton, OrganizationHeader },
  mixins: [alertMixin],
  data() {
    return {
      loading: false,
      facilities: [],
      displayedFacilities: [],
      annualFacilities: [],
      monthlyFacilities: [],
      otherFacilities: [],
      selectedFacility: null,
      selectedStatus: null,
      isCheckedAnnual: true,
      isCheckedMonthly: true,
      isCheckedOther: true,
      isSearched: false,
      includeSubmitted: false,
      fromDate: new Date(new Date().setFullYear(new Date().getFullYear() - 1)),
      endDate: new Date(),
      menuFromDate: false,
      menuEndDate: false,
      locale: 'en',
      statusTypes: [
        { id: 1, title: 'Draft' },
        { id: 2, title: 'Submitted' },
        { id: 3, title: 'Approved' },
      ],
      headers: [
        { title: 'Alert', key: 'alertType', width: '2%' },
        { title: 'Title', key: 'title' },
        { title: 'Report Type', key: 'reportType' },
        { title: 'Report ID', key: 'reportId' },
        { title: 'Status', key: 'status' },
        { title: 'Last Activity Date', key: 'lastActivityDate' },
        { title: 'Actions', key: 'actions' },
      ],
    }
  },
  computed: {
    ...mapState(useAuthStore, ['userInfo', 'currentFacility']),
    formattedFromDate: {
      get() {
        return this.formatDate(this.fromDate)
      },
      set(val) {
        this.fromDate = this.parseDateString(val)
      },
    },
    formattedEndDate: {
      get() {
        return this.formatDate(this.endDate)
      },
      set(val) {
        this.endDate = this.parseDateString(val)
      },
    },
  },
  created() {
    this.selectedFacility = this.currentFacility.facilityId
    this.search()
  },
  methods: {
    async getFacilityReportsSummary(selectedFacility) {
      try {
        this.facilities = await ReportsService.getFacilityReports(selectedFacility)
      } catch (error) {
        this.setFailureAlert('Failed to get latest reporting activity for facility = ' + selectedFacility, error)
      }
    },
    formatDate(date) {
      if (!(date instanceof Date)) return ''
      let month = '' + (date.getMonth() + 1),
        day = '' + date.getDate(),
        year = date.getFullYear()
      if (month.length < 2) month = '0' + month
      if (day.length < 2) day = '0' + day
      return [day, month, year].join('/')
    },
    parseDateString(dateStr) {
      const [day, month, year] = dateStr.split('/')
      return new Date(year, month - 1, day)
    },
    async search() {
      try {
        await this.getFacilityReportsSummary(this.selectedFacility)
        this.filter()
        this.isSearched = true
      } catch (error) {
        this.setFailureAlert('Failed to get latest reporting activity for facility = ' + this.selectedFacility, error)
      } finally {
        this.loading = false
      }
    },
    filter() {
      const reportTypes = []
      if (this.isCheckedAnnual) reportTypes.push('Annual')
      if (this.isCheckedMonthly) reportTypes.push('Monthly')
      if (this.isCheckedOther) reportTypes.push('Other')
      this.displayedFacilities = this.facilities.filter((facility) => reportTypes.includes(facility.reportType))

      if (this.selectedStatus) {
        const statusTitle = this.statusTypes.find(({ id }) => id === this.selectedStatus)?.title
        this.displayedFacilities = this.selectedStatus === 3 ? [] : this.facilities.filter(({ status }) => status === statusTitle)
      }
    },
    resetFilters() {
      this.facilities = []
      this.displayedFacilities = []
      this.selectedFacility = null
      this.selectedStatus = null
      this.isCheckedAnnual = true
      this.isCheckedMonthly = true
      this.isCheckedOther = true
      this.isSearched = false
      this.includeSubmitted = false
      this.fromDate = new Date(new Date().setFullYear(new Date().getFullYear() - 1))
      this.endDate = new Date()
      this.menuFromDate = false
      this.menuEndDate = false
      this.selectedFacility = this.currentFacility.facilityId
    },
  },
}
</script>
