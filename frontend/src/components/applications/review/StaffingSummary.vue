<template>
  <v-container fluid class="pa-2 pb-0">
    <AppMissingInfoError v-if="!isStaffingComplete" :to="{ name: 'staffing', params: { applicationGuid: $route.params.applicationGuid } }">
      {{ APPLICATION_ERROR_MESSAGES.STAFFING }}
    </AppMissingInfoError>
    <v-card v-else class="pa-4" variant="outlined">
      <v-row no-gutters>
        <v-col cols="6">
          <AppLabel>Employee Category</AppLabel>
        </v-col>
        <v-col cols="3" align="center" class="px-2">
          <AppLabel>Full-Time Position</AppLabel>
        </v-col>
        <v-col cols="3" align="center" class="px-2">
          <AppLabel>Part-Time Position</AppLabel>
        </v-col>
      </v-row>
      <v-row no-gutters class="mt-2">
        <v-col cols="6">
          <p>Infant/Toddler Early Childhood Educator</p>
        </v-col>
        <v-col cols="3" align="center" class="px-2">
          {{ currentApplication?.staffingInfantECEducatorFullTime }}
        </v-col>
        <v-col cols="3" align="center" class="px-2">
          {{ currentApplication?.staffingInfantECEducatorPartTime }}
        </v-col>
      </v-row>
      <v-row no-gutters class="mt-1">
        <v-col cols="6">
          <p>Early Childhood Educator</p>
        </v-col>
        <v-col cols="3" align="center" class="px-2">
          {{ currentApplication?.staffingECEducatorFullTime }}
        </v-col>
        <v-col cols="3" align="center" class="px-2">
          {{ currentApplication?.staffingECEducatorPartTime }}
        </v-col>
      </v-row>
      <v-row no-gutters class="mt-1">
        <v-col cols="6">
          <p>Early Childhood Educator Assistant</p>
        </v-col>
        <v-col cols="3" align="center" class="px-2">
          {{ currentApplication?.staffingECEducatorAssistantFullTime }}
        </v-col>
        <v-col cols="3" align="center" class="px-2">
          {{ currentApplication?.staffingECEducatorAssistantPartTime }}
        </v-col>
      </v-row>
      <v-row no-gutters class="mt-1">
        <v-col cols="6">
          <p>Responsible Adult</p>
        </v-col>
        <v-col cols="3" align="center" class="px-2">
          {{ currentApplication?.staffingResponsibleAdultFullTime }}
        </v-col>
        <v-col cols="3" align="center" class="px-2">
          {{ currentApplication?.staffingResponsibleAdultPartTime }}
        </v-col>
      </v-row>
      <v-row no-gutters class="mt-1">
        <v-col cols="6">
          <AppLabel>Total</AppLabel>
        </v-col>
        <v-col cols="3" class="px-2">
          <p align="center">
            <strong>{{ totalFullTimePosition }}</strong>
          </p>
        </v-col>
        <v-col cols="3" class="px-2">
          <p align="center">
            <strong>{{ totalPartTimePosition }}</strong>
          </p>
        </v-col>
      </v-row>
    </v-card>
  </v-container>
</template>

<script>
import AppLabel from '@/components/ui/AppLabel.vue'
import AppMissingInfoError from '@/components/ui/AppMissingInfoError.vue'
import { useApplicationsStore } from '@/stores/applications'
import { mapState } from 'pinia'
import { APPLICATION_ERROR_MESSAGES } from '@/utils/constants'

export default {
  components: { AppLabel, AppMissingInfoError },
  computed: {
    ...mapState(useApplicationsStore, ['currentApplication', 'isStaffingComplete']),
    totalFullTimePosition() {
      return (
        this.currentApplication?.staffingInfantECEducatorFullTime +
        this.currentApplication?.staffingECEducatorFullTime +
        this.currentApplication?.staffingECEducatorAssistantFullTime +
        this.currentApplication?.staffingResponsibleAdultFullTime
      )
    },
    totalPartTimePosition() {
      return (
        this.currentApplication?.staffingInfantECEducatorPartTime +
        this.currentApplication?.staffingECEducatorPartTime +
        this.currentApplication?.staffingECEducatorAssistantPartTime +
        this.currentApplication?.staffingResponsibleAdultPartTime
      )
    },
  },
  created() {
    this.APPLICATION_ERROR_MESSAGES = APPLICATION_ERROR_MESSAGES
  },
}
</script>
