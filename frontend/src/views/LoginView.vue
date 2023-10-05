<template>
  <v-container fluid class="full-height">
    <!-- login article -->
    <!-- <article id="login-banner" class="top-banner"> -->
    <v-row align="center" justify="center">
      <v-col align="center">
        <v-card class="login-card">
          <v-card-title class="gov-header">
            <h4 id="login_text">IDIR</h4>
          </v-card-title>
          <v-card-actions>
            <v-row align="center" justify="center">
              <v-btn id="login-button" :href="routes.LOGIN_IDIR" class="ma-2 px-3" dark color="white" style="background-color: #003366" @click="clearStorage">
                Log In
                <v-icon>mdi-login</v-icon>
              </v-btn>
            </v-row>
          </v-card-actions>
        </v-card></v-col
      >
      <v-col align="center">
        <v-card class="login-card">
          <v-card-title class="gov-header">
            <h4 id="login_text">BCeID Log In</h4>
          </v-card-title>
          <v-card-actions>
            <v-row align="center" justify="center">
              <v-btn id="login-button" :href="routes.LOGIN" class="ma-2 px-3" dark color="white" style="background-color: #003366" @click="clearStorage">
                Business BCeID
                <v-icon>mdi-login</v-icon>
              </v-btn>
            </v-row>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
    <!-- </article> -->
  </v-container>
</template>

<script>
import { mapActions, mapState } from 'pinia'
import { Routes } from '@/utils/constants'
import { useAuthStore } from '@/stores/auth'

export default {
  name: 'Login',
  data() {
    return {
      routes: Routes,
    }
  },
  computed: {
    ...mapState(useAuthStore, ['isAuthenticated']),
  },
  methods: {
    ...mapActions(useAuthStore, ['setJwtToken']),
    clearStorage() {
      this.setJwtToken()
    },
  },
}
</script>

<style scoped>
.v-icon {
  padding-left: 10px;
}

.login-card {
  max-width: 400px;
}

.gov-header {
  color: #003366;
}

.v-btn {
  text-transform: none;
}

.top-banner {
  min-height: 500px;
  background-size: cover;
  align-items: center;
  display: flex;
}

.full-height {
  height: 100%;
}
</style>
