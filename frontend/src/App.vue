<!-- eslint-disable vue/no-reserved-component-names -->
<template>
  <v-app id="app">
    <div class="header">
      <TheHeader @menu-toggled="handleMenuToggled" />
      <TheSnackBar />
      <TheNavBar v-if="pageTitle && isAuthenticated && showNavBar" :title="pageTitle" />
      <TheEnvBar />
    </div>

    <v-main class="align-start">
      <TheModalIdle v-if="isAuthenticated" class="align-start px-8 mb-0" />
      <v-navigation-drawer class="site-menu" :width="200" :model-value="showMenu" :scrim="false" v-if="isAuthenticated">
        <TheMenu />
      </v-navigation-drawer>
      <router-view class="align-start pt-8 px-8 mb-0" />
    </v-main>
    <TheFooter />
  </v-app>
</template>

<script>
import { mapActions, mapState } from 'pinia'
import TheEnvBar from '@/components/TheEnvBar.vue'
import TheHeader from '@/components/TheHeader.vue'
import TheFooter from '@/components/TheFooter.vue'
import TheMenu from './components/TheMenu.vue'
import TheModalIdle from '@/components/TheModalIdle.vue'
import TheNavBar from '@/components/TheNavBar.vue'
import TheSnackBar from '@/components/TheSnackBar.vue'
import { useAppStore } from '@/stores/app'
import { useAuthStore } from '@/stores/auth'

export default {
  name: 'App',
  components: {
    TheEnvBar,
    TheHeader,
    TheSnackBar,
    TheNavBar,
    TheModalIdle,
    TheFooter,
    TheMenu,
  },

  data() {
    return {
      showMenu: true,
      showToTopBtn: false,
      deactivateMultipleDraggableDialog: null,
    }
  },
  computed: {
    ...mapState(useAuthStore, ['jwtToken', 'isAuthenticated', 'userInfo', 'isAuthorizedWebsocketUser']),
    ...mapState(useAppStore, ['pageTitle', 'showNavBar']),
    mobile() {
      return this.$vuetify.display.mobile
    },
  },
  watch: {
    /*
    isAuthenticated() {
      this.handleWebSocket()
    },
    */
    isAuthorizedWebsocketUser() {
      this.handleWebSocket()
    },
    mobile() {
      // Reset the menu state on mobile change
      this.showMenu = false
    },
  },
  mounted() {
    this.handleWebSocket()
  },
  async created() {
    //this.setLoading(true);
    this.getJwtToken()
    //TODO commented out during sprint 1, might need in later sprint if we need an endpoint for config info...
    /*.then(() => Promise.all([this.getConfig()]))
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
      this.setLoading(false);
    })
    this.setLoading(false); */
  },
  methods: {
    ...mapActions(useAppStore, ['getConfig']),
    ...mapActions(useAuthStore, ['getJwtToken']),
    handleMenuToggled() {
      this.showMenu = !this.showMenu
    },
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
.site-menu {
  margin-top: 2px;
}

.envBanner {
  font-size: 0.8rem;
}

.header {
  /* background-color: #036;
  border-bottom: 2px solid #fcba19;
  padding: 0 65px 0 65px;
  color: #fff;
  display: flex;
  height: 65px;
  top: 0px;
  position: fixed;
  width: 100%; */
  position: fixed;
  width: 100%;
  z-index: 1002;
}

#toTopBtn {
  opacity: 0.5;
}

#toTopBtn:hover {
  opacity: 1;
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

.theme--light.application {
  background: #f1f1f1;
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
