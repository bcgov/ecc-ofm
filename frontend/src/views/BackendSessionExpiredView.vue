<script>
import { mapState } from 'pinia'

import { useAuthStore } from '@/stores/auth'
import { AuthRoutes } from '@/utils/constants'

export default {
  name: 'BackendSessionExpiredView',
  computed: {
    ...mapState(useAuthStore, ['isMinistryUser']),
  },
  mounted() {
    const logoutPath = this.isMinistryUser ? AuthRoutes.LOGOUT_IDIR : AuthRoutes.LOGOUT
    window.location = `${logoutPath}?sessionExpired=true`
  },
}
</script>
