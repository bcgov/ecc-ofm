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
    console.log('isMinistryUser', this.isMinistryUser)
    console.log('href', document.getElementById('logout_href').href)
    console.log('link', this.link)
    const logoutPath = this.isMinistryUser ? AuthRoutes.LOGOUT_IDIR : AuthRoutes.LOGOUT

    window.location = `${logoutPath}?sessionExpired=true`
  },
  computed: {
    ...mapState(useAuthStore, ['isMinistryUser']),
  },
}
</script>
