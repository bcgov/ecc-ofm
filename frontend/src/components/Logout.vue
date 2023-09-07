<template>
  <v-container fluid class="full-height">
    <!-- login article -->
    <article name="logout-banner">
      <v-row align="center" justify="center">
        <v-col xs="10" sm="10" md="8" lg="4" xl="3">
          <v-card class="session-expired-card">
            <v-card-title class="gov-header">
              <h4 id="logout_text">Logged Out</h4>
            </v-card-title>
            <v-card-text id="logout_descriptor">
              <v-row style="margin: 0.3rem"> You have Logged out. </v-row>
              <a
                id="login-button"
                :href="routes.LOGIN"
                class="ma-1"
                dark
                color="#003366"
                @click="clearStorage"
                >Log In</a
              ><span>again if you wish to continue.</span>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </article>
  </v-container>
</template>

<script>
import { mapActions } from 'pinia'
import { Routes } from '../utils/constants'
import { useAuthStore } from '@/stores/auth'

export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Logout',

  data() {
    return {
      routes: Routes
    }
  },
  created() {
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

<style scoped>
.full-height {
  height: 100%;
}
.session-expired-card {
  margin-top: 15rem;
  width: 100%;
  background: #d9e7d8;
}
</style>
