<!-- eslint-disable vue/no-reserved-component-names -->
<template>
  <v-app id="app">
    <div class="app-header">
      <TheHeader />
      <TheSnackBar />
      <TheNavBar v-if="pageTitle && isAuthenticated && showNavBar" :title="pageTitle" />
    </div>

    <v-main class="align-start">
      <TheEnvBar />
      <TheModalIdle v-if="isAuthenticated" class="align-start px-8 mb-0" />
      <TheHeroImage v-if="$route.meta.showHeroImage" />
      <TheFacilityHeader v-if="isActingProvider && !isApplicationPage" :showFacility="$route.meta.showFacility" />
      <router-view class="align-start pt-5 px-8 mb-0" />
    </v-main>
    <TheFooter />
  </v-app>
</template>

<script>
import { mapActions, mapState } from 'pinia'
import TheEnvBar from '@/components/TheEnvBar.vue'
import TheFacilityHeader from '@/components/TheFacilityHeader.vue'
import TheFooter from '@/components/TheFooter.vue'
import TheHeader from '@/components/TheHeader.vue'
import TheHeroImage from '@/components/TheHeroImage.vue'
import TheModalIdle from '@/components/TheModalIdle.vue'
import TheNavBar from '@/components/TheNavBar.vue'
import TheSnackBar from '@/components/TheSnackBar.vue'
import { useAppStore } from '@/stores/app'
import { useAuthStore } from '@/stores/auth'
import { useApplicationsStore } from '@/stores/applications'
import HttpStatus from 'http-status-codes'

export default {
  name: 'App',
  components: {
    TheEnvBar,
    TheHeader,
    TheHeroImage,
    TheSnackBar,
    TheNavBar,
    TheModalIdle,
    TheFooter,
    TheFacilityHeader,
  },

  data() {
    return {
      showToTopBtn: false,
      deactivateMultipleDraggableDialog: null,
    }
  },
  computed: {
    ...mapState(useAuthStore, ['jwtToken', 'isAuthenticated', 'userInfo', 'isActingProvider']),
    ...mapState(useAppStore, ['pageTitle', 'showNavBar']),
    ...mapState(useApplicationsStore, ['currentApplication']),
    mobile() {
      return this.$vuetify.display.mobile
    },
    isApplicationPage() {
      return this.$route.path?.includes('/applications/')
    },
  },
  async created() {
    //this.setLoading(true);
    this.getJwtToken()
      .then(() => Promise.all([this.getLookupInfo()]))
      .catch((e) => {
        if (!e.response || e.response.status !== HttpStatus.UNAUTHORIZED) {
          // this.logout()
          console.log(e)
          this.$router.replace({
            name: 'error',
            query: { message: `500_${e.data || 'ServerError'}` },
          })
        }
      })
      .finally(() => {
        // this.setLoading(false);
      })
    // this.setLoading(false);
  },
  methods: {
    ...mapActions(useAppStore, ['getConfig', 'getLookupInfo']),
    ...mapActions(useAuthStore, ['getJwtToken']),
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

<style scoped>
.app-header {
  /* background-color: #036;
  border-bottom: 2px solid #fcba19;
  padding: 0 65px 0 65px;
  color: #fff;
  display: flex;
  height: 65px;
  top: 0px;
  position: fixed;
  width: 100%; */
  /* position: fixed; */
  width: 100%;
  z-index: 1002;
}
</style>
