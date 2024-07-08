<template>
  <AppHeroImage />
  <v-container class="login-container" fluid v-bind="$attrs">
    <v-row>
      <v-col cols="12" class="pt-5">
        <p>
          <strong>NOTE:</strong>
          The information collected through $10 a Day ChildCareBC Centres is collected under the authority of the
          <i>Freedom of Information and Protection of Privacy Act (FOIPPA)</i>
          and the
          <i>Early Learning and Child Care Act (ELCCA)</i>
          and will be used for the purpose of administering the $10 a Day ChildCareBC program for successfully enrolled applicants. Personal information is protected from unauthorized use and
          disclosure in accordance with FOIPPA. Any questions or concerns about the collection of this information can be directed to the Director, $10 a Day ChildCareBC program, PO Box 9788 Stn Prov
          Govt, Victoria BC V8W 9S5. Phone: in Greater Victoria: 250 356-6501; outside of Greater Victoria, Toll Free: 1 888 338-6622 (option 7).
        </p>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="6">
        <v-divider />
        <v-card flat>
          <v-card-title>
            <h4>Childcare Provider</h4>
          </v-card-title>
          <v-card-text>Log in with your primary Business BCeID</v-card-text>
          <v-card-actions class="mt-auto">
            <AppButton icon="mdi-login" :href="authRoutes.LOGIN" @click="clearStorage" width="250px" id="bceid-login">BCeID Log In</AppButton>
          </v-card-actions>
        </v-card>
      </v-col>

      <v-col cols="12" md="6">
        <v-divider />
        <v-card flat>
          <v-card-title>
            <h4>Don't have a BCeID?</h4>
          </v-card-title>
          <v-card-text>
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
.login-container {
  max-width: 1550px;
}
</style>
