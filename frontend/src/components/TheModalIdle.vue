<template>
  <div style="display: none">
    <a id="logout_href" :href="authRoutes.SESSION_EXPIRED" />
  </div>
</template>

<script>
import { AuthRoutes } from '@/utils/constants'
import ApiService from '@/common/apiService';
import { mapState } from 'pinia'
import { useAuthStore } from '@/stores/auth'

export default {
  data() {
    return {
      authRoutes: AuthRoutes
    }
  },
  async mounted() {
    await this.checkAndLogoutUserOnSessionExpiry()
  },
  computed: {
    ...mapState(useAuthStore, ['isAuthenticated'])
  },
  methods: {
    async checkAndLogoutUserOnSessionExpiry() {
      if (this.isAuthenticated) {
        try {
          //TODO uncommented in sprint 1... leave incase we need.
          /*        const response = await ApiService.apiAxios.get(Routes.SESSION_REMAINING_TIME);
                    if (response.data > 0) {
                      const timeOutValue = parseInt(response.data) + 200; // add 200 ms
                      setTimeout(() => {
                        this.checkAndLogoutUserOnSessionExpiry();
                      }, timeOutValue);
                    } else {
                      window.location = document.getElementById('logout_href').href;
                    } */
        } catch (e) {
          window.location = document.getElementById('logout_href').href
        }
      }
    }
  }
}
</script>
