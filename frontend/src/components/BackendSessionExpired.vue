<template>
  <div style="display: none">
    <a id="logout_href" :href="link" />
  </div>
</template>

<script>
import { Routes } from '@/utils/constants'
import { useAuthStore } from '@/stores/auth'
import { mapActions } from 'pinia'
export default {
  name: 'BackendSessionExpired',
  data() {
    return {
      link: Routes.SESSION_EXPIRED
    }
  },
  mounted() {
    window.location = document.getElementById('logout_href').href
  },
  methods: {
    ...mapActions(useAuthStore, ['setJwtToken']),
    logout() {
      this.setJwtToken()
    }
  }
}
</script>
