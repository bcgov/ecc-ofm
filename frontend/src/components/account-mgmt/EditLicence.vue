<template>
  <v-container fluid class="px-0">
    <v-row no-gutters>
      <v-col cols="12" lg="6">
        <v-row no-gutters>
          <v-col cols="12" sm="5" md="3" lg="4" xl="3" class="pr-2 mt-1">
            <AppLabel>Facility:</AppLabel>
          </v-col>
          <v-col cols="12" sm="6" class="mt-1">
            {{ facilityName }}
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="12" lg="6">
        <v-row no-gutters>
          <v-col cols="12" sm="5" md="3" lg="3" xl="3" class="pr-2 mt-1">
            <AppLabel>Licence Number:</AppLabel>
          </v-col>
          <v-col cols="12" sm="6" class="mt-1">
            <v-text-field id="licence-number" v-model="editLicence.licence" variant="outlined" density="compact" />
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="12" lg="6">
        <v-row no-gutters>
          <v-col cols="12" sm="5" md="3" lg="4" xl="3">
            <AppLabel>CCOF Facility ID:</AppLabel>
          </v-col>
          <v-col cols="12" sm="6">
            <v-text-field id="ccof-facility-id" v-model="editLicence.ccofFacilityId" variant="outlined" density="compact" />
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="12" lg="6">
        <v-row no-gutters>
          <v-col cols="12" sm="5" md="3" lg="3" xl="3">
            <AppLabel>CCOF Organization ID:</AppLabel>
          </v-col>
          <v-col cols="12" sm="6" class="mt-1">
            <v-text-field id="ccof-organization-id" v-model="editLicence.ccofOrganizationId" variant="outlined" density="compact" />
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="12" lg="6">
        <v-row no-gutters>
          <v-col cols="12" sm="5" md="3" lg="4" xl="3">
            <AppLabel>Health Authority:</AppLabel>
          </v-col>
          <v-col cols="12" sm="6">
            <v-select
              id=" health-authority-id"
              v-model="editLicence.healthAuthorityId"
              :items="healthAuthorities"
              item-title="description"
              item-value="id"
              placeholder="Select health authority"
              density="compact"
              variant="outlined"></v-select>
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="12" lg="6">
        <v-row no-gutters>
          <v-col cols="12" sm="5" md="3" lg="3" xl="3">
            <AppLabel>ACCB Provider ID:</AppLabel>
          </v-col>
          <v-col cols="12" sm="6" class="mt-1">
            <v-text-field id="accb-provider-id" v-model="editLicence.accbProviderId" variant="outlined" density="compact" />
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="12" lg="6">
        <v-row no-gutters>
          <v-col cols="12" sm="5" md="3" lg="4" xl="3" class="mt-1">
            <AppLabel>TDAD Funding Agreement Number: </AppLabel>
          </v-col>
          <v-col cols="12" sm="6" class="mt-1">
            <v-text-field id="accb-provider-id" v-model="editLicence.tdadFundingAgreementNumber" variant="outlined" density="compact" />
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import AppLabel from '@/components/ui/AppLabel.vue'
import alertMixin from '@/mixins/alertMixin'
import { mapState } from 'pinia'
import { useAppStore } from '@/stores/app'

export default {
  components: { AppLabel },
  mixins: [alertMixin],
  props: {
    licence: {
      type: Object,
      required: true,
      default: () => {
        return {}
      },
    },
    facilityName: {
      type: String,
      required: true,
      default: '',
    },
  },
  data() {
    return {
      editLicence: null,
    }
  },
  computed: {
    ...mapState(useAppStore, ['getHealthAuthorityNameById', 'healthAuthorities']),
  },
  created() {
    this.editLicence = this.licence
  },
}
</script>
