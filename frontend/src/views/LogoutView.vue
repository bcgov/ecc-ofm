<template>
  <v-container fluid>
    <AppSimpleCard>
      <template #title>Logged Out</template>
      <template #text>
        You have Logged out.
        <br />
        <a id="login-button" :href="loginPath" @click="clearStorage">Log In</a>
        again if you wish to continue.
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
  name: 'LogoutView',
  components: { AppSimpleCard },
  created() {
    this.setJwtToken()
  },
  computed: {
    loginPath() {
      return this.$route.query.internal ? AuthRoutes.LOGIN_IDIR : AuthRoutes.LOGIN
    },
  },
  methods: {
    ...mapActions(useAuthStore, ['setJwtToken']),
    clearStorage() {
      this.setJwtToken()
    },
  },
}
</script>
