<!-- eslint-disable vue/no-reserved-component-names -->
<template>
  <v-app id="app">
    <TheHeader />
    <TheSnackBar />
    <TheNavBar v-if="pageTitle && isAuthenticated && showNavBar" :title="pageTitle" />
    <v-main fluid class="align-start">
      <!-- <div style="background-color: pink; height: 20px">DEV</div> -->
      <TheEnvBar />
      <TheModalIdle v-if="isAuthenticated" class="align-start px-8 mb-0" />
      <router-view class="align-start px-8 mb-0" />
    </v-main>
    <TheFooter />
  </v-app>
</template>

<script>
import { mapActions, mapState } from 'pinia'
import TheEnvBar from '@/components/TheEnvBar.vue'
import TheHeader from '@/components/TheHeader.vue'
import TheFooter from '@/components/TheFooter.vue'
import TheModalIdle from '@/components/TheModalIdle.vue'
import TheNavBar from '@/components/TheNavBar.vue'
import TheSnackBar from '@/components/TheSnackBar.vue'
import { useAppStore } from '@/stores/app'
import { useAuthStore } from '@/stores/auth'
import HttpStatus from 'http-status-codes'

export default {
  name: 'App',
  components: {
    TheEnvBar,
    TheHeader,
    TheSnackBar,
    TheNavBar,
    TheModalIdle,
    TheFooter,
  },
  data() {
    return {
      showToTopBtn: false,
      deactivateMultipleDraggableDialog: null,
    }
  },
  computed: {
    ...mapState(useAuthStore, ['jwtToken', 'isAuthenticated', 'userInfo', 'isAuthorizedWebsocketUser']),
    ...mapState(useAppStore, ['pageTitle']),
  },
  watch: {
    isAuthenticated() {
      this.handleWebSocket()
    },
    isAuthorizedWebsocketUser() {
      this.handleWebSocket()
    },
  },
  mounted() {
    this.handleWebSocket()
  },
  async created() {
    //this.setLoading(true);
    this.getJwtToken()
      .then(() => Promise.all([this.getConfig()]))
      .catch((e) => {
        if (!e.response || e.response.status !== HttpStatus.UNAUTHORIZED) {
          this.logout()
          this.$router.replace({
            name: 'error',
            query: { message: `500_${e.data || 'ServerError'}` },
          })
        }
      })
      .finally(() => {
        //this.setLoading(false);
      })
    //this.setLoading(false);
  },
  methods: {
    ...mapActions(useAppStore, ['getConfig']),
    ...mapActions(useAuthStore, ['getJwtToken']),
    handleWebSocket() {
      if (this.isAuthenticated && this.isAuthorizedWebsocketUser) {
        this.$webSocketsConnect()
      } else {
        this.$webSocketsDisconnect()
      }
    },
    onScroll(e) {
      if (typeof window === 'undefined') return
      const top = window.pageYOffset || e.target.scrollTop || 0
      this.showToTopBtn = top > 20
    },
    toTop() {
      this.$vuetify.goTo(0)
    },
  },
}
</script>

<style>
#toTopBtn {
  opacity: 0.5;
}
#toTopBtn:hover {
  opacity: 1;
}

html {
  font-family: 'BCSans', Verdana, Arial, sans-serif !important;
}

.v-alert.bootstrap-success {
  color: #234720 !important;
  background-color: #d9e7d8 !important;
  border-color: #accbaa !important;
}

.v-alert.bootstrap-info {
  color: #4e6478;
  background-color: #eaf2fa !important;
  border-color: #b8d4ee !important;
}

.v-alert.bootstrap-warning {
  color: #81692c;
  background-color: #fef4dd !important;
  border-color: #fbdb8b !important;
}

.v-alert.bootstrap-error {
  color: #712024;
  background-color: #f7d8da !important;
  border-color: #eeaaad !important;
}

.v-alert .v-icon {
  padding-left: 0;
}
.full-height {
  height: 100%;
}

a {
  color: #1976d2;
}

a:hover {
  cursor: pointer;
}

.envBanner {
  font-size: 0.8rem;
}

.theme--light.application {
  background: #f1f1f1;
}

h1 {
  font-size: 1.25rem;
}

.v-toolbar__title {
  font-size: 1rem;
}

.v-btn {
  text-transform: none !important;
}

.v-alert .v-icon {
  padding-left: 0;
}

.v-alert.bootstrap-success {
  color: #234720;
  background-color: #d9e7d8 !important;
  border-color: #accbaa !important;
}

.v-alert.bootstrap-info {
  color: #4e6478;
  background-color: #eaf2fa !important;
  border-color: #b8d4ee !important;
}

.v-alert.bootstrap-warning {
  color: #81692c;
  background-color: #fef4dd !important;
  border-color: #fbdb8b !important;
}

.v-alert.bootstrap-error {
  color: #712024;
  background-color: #f7d8da !important;
  border-color: #eeaaad !important;
}

.theme--light.v-btn.v-btn--disabled:not(.v-btn--text):not(.v-btn--outlined) {
  background-color: rgba(0, 0, 0, 0.12) !important;
}
</style>
