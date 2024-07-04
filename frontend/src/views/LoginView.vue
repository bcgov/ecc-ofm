<template>
  <AppHeroImage />
  <v-container fluid v-bind="$attrs">
    <v-container class="containerWidth1450 pa-0">
      <p class="pt-4">
        <strong>NOTE:</strong>
        The information collected through Early Childhood Care - Operating Funding Model is collected under the authority of the
        <i>Freedom of Information and Protection of Privacy Act</i>
        (FOIPPA) and the
        <i>Child Care BC Act</i>
        (SBC 2001, c. 4) and will be used for the purpose of administering the $10 a Day ChildCareBC program for succesfully enrolled applicants.. Personal information is protected from unauthorized
        use and disclosure in accordance with FOIPPA. Any questions or concerns about the collection of this information can be directed to the Director, Child Care Operating Funding Program, PO Box
        9965 Stn Prov Govt, Victoria BC V8W 9R4, Phone: in Greater Victoria: 250 356-6501, outside of Greater Victoria, Toll Free: 1 888 338-6622 (option 2).
      </p>
      <br />
      <v-row>
        <v-col class="xs-12 lg-4 xl-2">
          <v-divider></v-divider>
          <!-- Add height="100%" to div directly below to have the buttons line up with each other on desktop.-->
          <v-card flat class="d-flex flex-column">
            <v-card-title class="gov-header">
              <h4 id="login_text">Childcare Provider</h4>
            </v-card-title>
            <v-card-text id="login_descriptor">Log in with your primary Business BCeID</v-card-text>
            <v-spacer></v-spacer>
            <v-card-actions class="mt-auto">
              <AppButton icon="mdi-login" :href="authRoutes.LOGIN" @click="clearStorage" width="250px" id="bceid-login">BCeID Log In</AppButton>
            </v-card-actions>
          </v-card>
        </v-col>

        <v-col class="xs-12 lg-6 xl-2">
          <v-divider></v-divider>
          <v-card flat class="d-flex flex-column">
            <v-card-title class="gov-header">
              <h4 id="login_text">Don't have a BCeID?</h4>
            </v-card-title>
            <v-card-text id="login_descriptor">
              BCeID is a user ID and password. You can use it to log into many participating government services.
              <br />
              <br />
              If you have logged into other B.C. government services before, you may already have an account.
              <br />
              <br />
              You must register for a Business BCeID before you can log in - it only takes a few minutes.
            </v-card-text>
            <v-card-actions>
              <AppButton icon="mdi-login" href="//www.bceid.ca/register/business/getting_started/getting_started.aspx" @click="clearStorage" width="300px">Register for a BCeID</AppButton>
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
import AppHeroImage from '@/components/ui/AppHeroImage.vue'

export default {
  name: 'LoginView',
  components: { AppButton, AppHeroImage },
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

.containerWidth1450 {
  max-width: 1450px;
}
</style>
