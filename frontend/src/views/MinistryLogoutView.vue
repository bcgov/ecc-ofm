<template>
  <v-container fluid>
    <v-row align="center" justify="center">
      <v-col xs="8" sm="7" md="5" lg="4" xl="3">
        <v-card class="basic-card">
          <v-card-title>
            <h4>Logged Out</h4>
          </v-card-title>
          <v-card-text>
            <p>
              You have Logged out.
              <br />
              <a id="login-button" :href="authRoutes.LOGIN_IDIR" @click="clearStorage">Log In</a>
              again if you wish to continue.
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
  name: 'LogoutView',

  data() {
    return {
      authRoutes: AuthRoutes,
    }
  },
  created() {
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
