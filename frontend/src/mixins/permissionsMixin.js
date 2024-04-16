import { mapActions } from 'pinia'

import { useAuthStore } from '@/stores/auth'
import { PERMISSIONS } from '@/utils/constants/permissions.js'

export default {
  created() {
    this.PERMISSIONS = PERMISSIONS
  },
  methods: {
    ...mapActions(useAuthStore, ['hasPermission']),
  },
}
