<template>
  <v-container v-if="isAuthenticated" fluid>
    <v-row>
      <v-col class="header-application justify-md-end justify-sm-start">
        {{ referenceNumber }}
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import { mapState } from 'pinia'
import { useAuthStore } from '@/stores/auth'

export default {
  props: {
    referenceNumber: {
      type: String,
      default: '',
    },
  },
  computed: {
    ...mapState(useAuthStore, ['isAuthenticated']),
  },
}
</script>
<style scoped>
.header-application {
  display: flex;
  color: #003366;
  font-weight: 600;
  font-size: 1.3em;
}
</style>
