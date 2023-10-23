<template>
  <div style="display: none">
    <a id="logout_href" :href="link" />
  </div>
</template>

<script>
import { AuthRoutes } from '@/utils/constants'
import { useAuthStore } from '@/stores/auth'
import { mapActions } from 'pinia'
export default {
  name: 'BackendSessionExpiredView',
  data() {
    return {
      link: AuthRoutes.SESSION_EXPIRED,
    }
  },
  mounted() {
    window.location = document.getElementById('logout_href').href
  },
  methods: {
    ...mapActions(useAuthStore, ['setJwtToken']),
    logout() {
      this.setJwtToken()
    },
  },
}
</script>
