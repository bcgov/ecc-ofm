<template>
  <v-container fluid>
    <AppSimpleCard>
      <template #title>Session Expired</template>
      <template #text>
        Your secure session has ended as a result of inactivity.
        <br />
        <a id="login-button" :href="loginPath" @click="clearStorage">Log In</a>
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
  computed: {
    loginPath() {
      return this.$route.query.internal ? AuthRoutes.LOGIN_IDIR : AuthRoutes.LOGIN
    }
  },
  mounted() {
    this.setJwtToken()
  },
  methods: {
    ...mapActions(useAuthStore, ['setJwtToken']),
    clearStorage() {
      this.setJwtToken()
    }
  }
}
</script>
