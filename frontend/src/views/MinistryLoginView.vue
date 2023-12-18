<template>
  <v-container fluid>
    <v-row>
      <v-col class="xs-12 lg-6 xl-2">
        <v-divider></v-divider>
        <v-card flat class="d-flex flex-column justify-center align-center">
          <v-card-title class="gov-header">
            <h4 id="login_text">Ministry</h4>
          </v-card-title>
          <v-card-text id="login_descriptor">Log in with your IDIR account</v-card-text>
          <v-card-actions>
            <v-row>
              <AppButton icon="mdi-login" :href="authRoutes.LOGIN_IDIR" @click="clearStorage" width="250px" id="idir-login">IDIR Log In</AppButton>
            </v-row>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapActions, mapState } from 'pinia'
import { AuthRoutes } from '@/utils/constants'
import { useAuthStore } from '@/stores/auth'
import AppButton from '@/components/ui/AppButton.vue'

export default {
  name: 'MinistryLoginView',
  components: { AppButton },
  data() {
    return {
      authRoutes: AuthRoutes,
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
.gov-header {
  color: #003366;
}
</style>
