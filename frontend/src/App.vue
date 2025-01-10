<!-- eslint-disable vue/no-reserved-component-names -->
<template>
  <v-app id="app">
    <div class="app-header">
      <TheHeader />
      <TheSnackBar />
      <TheEnvBar />
    </div>

    <v-main class="align-start">
      <router-view class="align-start pt-5 px-8 mb-0" />
    </v-main>
    <TheFooter />
  </v-app>
</template>

<script>
import { mapActions } from 'pinia'
import TheEnvBar from '@/components/TheEnvBar.vue'
import TheFooter from '@/components/TheFooter.vue'
import TheHeader from '@/components/TheHeader.vue'
import TheSnackBar from '@/components/TheSnackBar.vue'
import { useAppStore } from '@/stores/app'
import { useAuthStore } from '@/stores/auth'

export default {
  name: 'App',
  components: {
    TheEnvBar,
    TheHeader,
    TheSnackBar,
    TheFooter
  },
  methods: {
    ...mapActions(useAppStore, ['getLookupInfo']),
    ...mapActions(useAuthStore, ['getJwtToken'])
  }
}
</script>

<style scoped>
.app-header {
  width: 100%;
  z-index: 1002;
}
</style>
