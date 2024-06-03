<template>
  <v-container fluid>
    <v-row align="center" justify="center">
      <v-col xs="8" sm="7" md="5" lg="4" xl="3">
        <v-card class="basic-card">
          <v-card-title>
            <h4>Session Expired</h4>
          </v-card-title>
          <v-card-text>
            <p>
              Your secure session has ended as a result of inactivity.
              <br />
              <a id="login-button" :href="authRoutes.LOGIN" @click="clearStorage">Log In</a>
              again to continue.
            </p>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapActions } from 'pinia'
import { AuthRoutes } from '@/utils/constants'
import { useAuthStore } from '@/stores/auth'

export default {
  name: 'SessionExpired',

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
