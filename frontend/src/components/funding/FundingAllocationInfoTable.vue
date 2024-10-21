<template>
  <v-container fluid class="pa-0">
    <div v-if="$vuetify.display.mdAndUp" class="table">
      <v-row no-gutters>
        <v-col cols="2" class="table-header"><strong>Funding Envelopes</strong></v-col>
        <v-col cols="2" class="funding-envelope-types"><strong>Facility</strong></v-col>
        <v-col cols="2" class="funding-envelope-types"><strong>Operational</strong></v-col>
        <v-col cols="2" class="funding-envelope-types"><strong>Administration</strong></v-col>
        <v-col cols="2" class="funding-envelope-types"><strong>Programming</strong></v-col>
        <v-col cols="2" class="funding-envelope-types"><strong>Human Resources</strong></v-col>
      </v-row>
      <v-row no-gutters>
        <v-col cols="2" class="table-header"><strong>Receive Funds</strong></v-col>
        <v-col cols="2" class="table-cell">Does Not Need Ministry Approval</v-col>
        <v-col cols="2" class="table-cell">Does Not Need Ministry Approval</v-col>
        <v-col cols="2" class="table-cell">Need Ministry Approval</v-col>
        <v-col cols="2" class="table-cell">Does Not Need Ministry Approval</v-col>
        <v-col cols="2" class="table-cell">Need Ministry Approval</v-col>
      </v-row>
      <v-row no-gutters>
        <v-col cols="2" class="table-header"><strong>Sending Funds</strong></v-col>
        <v-col cols="2" class="table-cell">Need Ministry Approval</v-col>
        <v-col cols="2" class="table-cell">Does Not Need Ministry Approval</v-col>
        <v-col cols="2" class="table-cell">Does Not Need Ministry Approval</v-col>
        <v-col cols="2" class="table-cell">Does Not Need Ministry Approval</v-col>
        <v-col cols="2" class="table-cell">Need Ministry Approval</v-col>
      </v-row>
    </div>
    <div v-else class="table">
      <v-row no-gutters>
        <v-col cols="4" class="table-header"><strong>Funding Envelopes</strong></v-col>
        <v-col cols="4" class="table-header"><strong>Receive Funds</strong></v-col>
        <v-col cols="4" class="table-header"><strong>Sending Funds</strong></v-col>
      </v-row>
      <v-row no-gutters>
        <v-col cols="4" class="funding-envelope-types"><strong>Facility</strong></v-col>
        <v-col cols="4" class="table-cell">Does Not Need Ministry Approval</v-col>
        <v-col cols="4" class="table-cell">Need Ministry Approval</v-col>
      </v-row>
      <v-row no-gutters>
        <v-col cols="4" class="funding-envelope-types"><strong>Operational</strong></v-col>
        <v-col cols="4" class="table-cell">Does Not Need Ministry Approval</v-col>
        <v-col cols="4" class="table-cell">Does Not Need Ministry Approval</v-col>
      </v-row>
      <v-row no-gutters>
        <v-col cols="4" class="funding-envelope-types"><strong>Administration</strong></v-col>
        <v-col cols="4" class="table-cell">Need Ministry Approval</v-col>
        <v-col cols="4" class="table-cell">Does Not Need Ministry Approval</v-col>
      </v-row>
      <v-row no-gutters>
        <v-col cols="4" class="funding-envelope-types"><strong>Programming</strong></v-col>
        <v-col cols="4" class="table-cell">Does Not Need Ministry Approval</v-col>
        <v-col cols="4" class="table-cell">Does Not Need Ministry Approval</v-col>
      </v-row>
      <v-row no-gutters>
        <v-col cols="4" class="funding-envelope-types"><strong>Human Resources</strong></v-col>
        <v-col cols="4" class="table-cell">Need Ministry Approval</v-col>
        <v-col cols="4" class="table-cell">Need Ministry Approval</v-col>
      </v-row>
    </div>
  </v-container>
</template>

<script>
export default {
  name: 'FundingAllocationInfoTable',
}
</script>

<style scoped>
.table {
  border: 1px solid;
}

.table-header {
  border: 1px solid;
  padding: 10px !important;
  background-color: lightgray;
}

.funding-envelope-types {
  border: 1px solid;
  padding: 10px !important;
  background-color: #f0f0f0;
}

.table-cell {
  border: 1px solid;
  padding: 10px !important;
}
</style>
