<template>
  <div style="display: none">
    <a id="logout_href" :href="link" />
  </div>
</template>

<script>
import { mapState } from 'pinia'

import { useAuthStore } from '@/stores/auth'
import { AuthRoutes } from '@/utils/constants'

export default {
  name: 'BackendSessionExpiredView',
  data() {
    return {
      link: '/stuff',
    }
  },
  mounted() {
    const logoutPath = this.isMinistryUser ? AuthRoutes.LOGOUT_IDIR : AuthRoutes.LOGOUT
    window.location = `${logoutPath}?sessionExpired=true`
  },
  computed: {
    ...mapState(useAuthStore, ['isMinistryUser', 'userInfo']),
  },
}
</script>
