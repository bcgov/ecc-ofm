<template>
  <v-container fluid>
    <AppSimpleCard>
      <template #title>Session Expired</template>
      <template #text>
        Your secure session has ended as a result of inactivity.
        <br />
        <a id="login-button" :href="authRoutes.LOGIN" @click="clearStorage">Log In</a>
        again to continue.
      </template>
    </AppSimpleCard>
  </v-container>
</template>

<script>
import { mapActions } from 'pinia'
import { AuthRoutes } from '@/utils/constants'
import { useAuthStore } from '@/stores/auth'
import AppSimpleCard from '@/components/ui/AppSimpleCard.vue'

export default {
  name: 'SessionExpiredView',
  components: { AppSimpleCard },
  data() {
    return {
      authRoutes: AuthRoutes,
    }
  },
  mounted() {
    this.setJwtToken()
  },
  methods: {
    ...mapActions(useAuthStore, ['setJwtToken']),
    clearStorage() {
      this.setJwtToken()
    },
  },
}
</script>
