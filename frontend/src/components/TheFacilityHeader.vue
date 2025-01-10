<template>
  <v-container v-if="isAuthenticated && userInfo" class="py-2" fluid>
    <v-row align="end" justify="space-between">
      <v-col cols="12" md="6" class="header-org">
        {{ userInfo.organizationName }}
      </v-col>
      <v-col v-if="showFacility" class="header-facility justify-md-end justify-sm-start" cols="12" md="6">
        Facility: {{ currentFacility?.facilityName }}
        <v-menu id="facilityMenu">
          <template #activator="{ props }">
            <v-btn id="changeFacility" variant="text" v-bind="props">(change)</v-btn>
          </template>
          <v-list>
            <v-list-item
              v-for="facility in userInfo.facilities"
              :key="facility.facilityId"
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
import { mapState, mapWritableState } from 'pinia'
import { useAuthStore } from '@/stores/auth'

export default {
  props: {
    showFacility: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
    ...mapState(useAuthStore, ['isAuthenticated', 'userInfo']),
    ...mapWritableState(useAuthStore, ['currentFacility']),
    borderClass() {
      return this.$vuetify.display.xs || this.$vuetify.display.sm ? 'flex-start' : 'flex-end'
    },
  },
  methods: {
    changeFacility(facility) {
      this.currentFacility = facility
    },
  },
}
</script>
<style scoped>
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
  /* justify-content: flex-end; */
  color: #003366;
  font-weight: 600;
  font-size: 1.3em;
}
</style>
