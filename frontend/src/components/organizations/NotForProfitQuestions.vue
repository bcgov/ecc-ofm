<template>
  <v-card class="pa-4" variant="outlined">
    <v-skeleton-loader :loading="loading" type="table-tbody">
      <v-container fluid class="pa-0">
        <v-row>
          <v-col class="">
            <AppLabel>Does your organization have an inclusion policy?</AppLabel>
          </v-col>
          <v-col cols="12" sm="12" lg="9" xl="7">
            <v-radio-group v-model="choice" :readonly="false" hide-details>
              <v-row no-gutters>
                <v-col cols="12" sm="2" md="1">
                  <v-radio label="Yes" :value="true"></v-radio>
                </v-col>
                <v-col cols="12" sm="2" md="1">
                  <v-radio label="No" :value="false"></v-radio>
                </v-col>
              </v-row>
            </v-radio-group>
          </v-col>
        </v-row>
      </v-container>
    </v-skeleton-loader>
  </v-card>
</template>

<script>
import AppLabel from '@/components/ui/AppLabel.vue'
import AppButtonRadioGroup from '@/components/ui/AppButtonRadioGroup.vue'
import AppYesNoInput from '@/components/ui/AppYesNoInput.vue'

export default {
  components: { AppLabel, AppButtonRadioGroup, AppYesNoInput },
  props: {
    // facility: {
    //   type: Object,
    //   required: true,
    //   default: () => {
    //     return {}
    //   },
    // },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      choice: undefined,
    }
  },
  computed: {
    // isApplicationPage() {
    //   return this.$route.path?.includes('/applications/')
    // },
  },
}
</script>
