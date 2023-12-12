<template>
  <v-container fluid class="full-height">
    <!-- login article -->
    <!-- <article id="login-banner" class="top-banner"> -->
    <v-row align="center" justify="center">
      <v-col cols="12" align="center" class="pt-0">
        <v-img src="@/assets/images/login-header-img-resized.jpg" max-width="1448" class="align-end">
          <v-col align="center" style="background-color: rgb(28, 115, 158, 0.85)">
            <span class="text-h4 text-white font-weight-bold" style="font-family: BCSans">Early Childhood Care - Operating Funding Model</span>
            <br />
            <span class="text-h6 text-white">Welcome</span>
          </v-col>
        </v-img>
      </v-col>
    </v-row>

    <v-container class="containerWidth1450 pa-0">
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
    <!-- </article> -->
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
.login-card {
  max-width: 400px;
}

.gov-header {
  color: #003366;
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

.containerWidth1450 {
  max-width: 1450px;
}
</style>
