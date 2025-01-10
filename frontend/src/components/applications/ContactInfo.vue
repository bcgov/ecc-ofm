<template>
  <v-card class="my-2 pa-2" :variant="vCardVariant">
    <v-skeleton-loader :loading="loading" type="table-tbody">
      <v-container fluid class="pa-0">
        <v-row no-gutters>
          <v-col cols="12" md="6" xl="4">
            <v-row no-gutters class="ma-2">
              <v-col cols="12" sm="6" lg="5" xl="4">
                <AppLabel>First Name:</AppLabel>
              </v-col>
              <v-col cols="12" sm="6" lg="7" xl="8">{{ contact?.firstName }}</v-col>
            </v-row>
          </v-col>
          <v-col cols="12" md="6" xl="4">
            <v-row no-gutters class="ma-2">
              <v-col cols="12" sm="6" lg="5" xl="4">
                <AppLabel>Last Name:</AppLabel>
              </v-col>
              <v-col cols="12" sm="6" lg="7" xl="8">{{ contact?.lastName }}</v-col>
            </v-row>
          </v-col>
          <v-col cols="12" md="6" xl="4">
            <v-row no-gutters class="ma-2">
              <v-col cols="12" sm="6" lg="5" xl="4">
                <AppLabel>Role:</AppLabel>
              </v-col>
              <v-col cols="12" sm="6" lg="7" xl="8">
                {{ contact?.role?.roleName }}
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="12" md="6" xl="4">
            <v-row no-gutters class="ma-2">
              <v-col cols="12" sm="6" lg="5" xl="4">
                <AppLabel>Email:</AppLabel>
              </v-col>
              <v-col cols="12" sm="6" lg="7" xl="8">
                {{ contact?.email }}
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="12" md="6" xl="4">
            <v-row no-gutters class="ma-2">
              <v-col cols="12" sm="6" lg="5" xl="4">
                <AppLabel>Phone Number:</AppLabel>
              </v-col>
              <v-col cols="12" sm="6" lg="7" xl="8">
                {{ contact?.phone }}
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="12" md="6" xl="4">
            <v-row no-gutters class="ma-2">
              <v-col cols="12" sm="6" lg="5" xl="4">
                <AppLabel>Business BCeID:</AppLabel>
              </v-col>
              <v-col cols="12" sm="6" lg="7" xl="8">
                {{ contact?.userName }}
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-container>
    </v-skeleton-loader>
  </v-card>
</template>

<script>
import AppLabel from '@/components/ui/AppLabel.vue'

export default {
  components: { AppLabel },
  props: {
    contact: {
      type: Object,
      required: true,
      default: () => {
        return {}
      }
    },
    loading: {
      type: Boolean,
      default: false
    },
    vCardVariant: {
      type: String,
      default: 'outlined'
    }
  }
}
</script>
