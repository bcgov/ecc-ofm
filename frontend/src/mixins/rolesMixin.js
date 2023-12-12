import { mapState } from 'pinia'

import { useAppStore } from '@/stores/app'
import { ROLES } from '@/utils/constants.js'

export default {
  created() {
    this.ROLES = ROLES
  },
}
