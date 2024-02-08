<template>
  <v-container fluid class="px-0">
    <h4 class="mb-2">Licence {{ licence.licence }}</h4>
    <v-row no-gutters>
      <v-col cols="12" lg="6">
        <v-row no-gutters class="mr-2 my-2">
          <v-col cols="12" sm="6" class="pr-2 mt-1">
            <AppLabel>CCOF Facility ID:</AppLabel>
          </v-col>
          <v-col cols="12" sm="6" class="mt-1">{{ licence?.ccofFacilityId ? licence?.ccofFacilityId : '- - - -' }}</v-col>
        </v-row>
      </v-col>
      <v-col cols="12" lg="6">
        <v-row no-gutters class="mr-2 my-2">
          <v-col cols="12" sm="6" class="pr-2 mt-1">
            <AppLabel>CCOF Organization ID:</AppLabel>
          </v-col>
          <v-col cols="12" sm="6" class="mt-1">{{ licence?.ccofOrganizationId ? licence?.ccofOrganizationId : '- - - -' }}</v-col>
        </v-row>
      </v-col>
      <v-col cols="12" lg="6">
        <v-row no-gutters class="mr-2 my-2">
          <v-col cols="12" sm="6" class="pr-2 mt-1">
            <AppLabel>Health Authority:</AppLabel>
          </v-col>
          <v-col cols="12" sm="6" class="mt-1">
            {{ getHealthAuthorityNameById(licence?.healthAuthorityId) ? getHealthAuthorityNameById(licence?.healthAuthorityId) : '- - - -' }}
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="12" lg="6">
        <v-row no-gutters class="mr-2 my-2">
          <v-col cols="12" sm="6" class="pr-2 mt-1">
            <AppLabel>ACCB Provider ID:</AppLabel>
          </v-col>
          <v-col cols="12" sm="6" class="mt-1">
            {{ licence?.accbProviderId ? licence?.accbProviderId : '- - - -' }}
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
  computed: {
    ...mapState(useAppStore, ['getHealthAuthorityNameById']),
  },
}
</script>
