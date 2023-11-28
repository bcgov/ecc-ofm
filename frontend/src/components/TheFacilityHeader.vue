<template>
  <v-container class="pa-2 ma-0 facility-container" v-if="isAuthenticated && userInfo">
    <v-row align="end" justify="space-between">
      <v-col cols="6" class="header-org">
        {{ userInfo.organizationName }}
      </v-col>
      <v-col v-if="!isChangeFacilityRouteExemption()" class="header-facility" cols="6">
        Facility: {{ currentFacility?.facilityName }}
        <v-menu id="facilityMenu">
          <template v-slot:activator="{ props }">
            <v-btn color="primary" id="changeFacility" variant="text" v-bind="props">(change)</v-btn>
          </template>
          <v-list>
            <v-list-item v-for="facility in userInfo.facilities" :key="facility.facilityId"
              @click="changeFacility(facility)">
              <v-list-item-title>{{ facility.facilityName }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import { useRoute } from 'vue-router'
import { mapState, mapWritableState } from 'pinia'
import { useAuthStore } from '@/stores/auth'
import { CHANGE_FACILITY_ROUTE_EXEMPTIONS } from '@/utils/constants'

export default {
  computed: {
    ...mapState(useAuthStore, ['isAuthenticated', 'userInfo']),
    ...mapWritableState(useAuthStore, ['currentFacility']),
  },
  methods: {
    changeFacility(facility) {
      this.currentFacility = facility
    },
    isChangeFacilityRouteExemption() {
      return CHANGE_FACILITY_ROUTE_EXEMPTIONS.includes(useRoute().name)
    },
  },
}
</script>
<style scoped>
.facility-container {
  max-width: 100%;
}

.header-org {
  display: flex;
  align-items: flex-end;
  justify-content: flex-start;
  color: #003366;
  font-weight: 600;
  font-size: 1.5em;
}

.header-facility {
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
  color: #003366;
  font-weight: 600;
  font-size: 1.3em;
}
</style>
