import { mapState } from 'pinia'

import { useAppStore } from '@/stores/app'
import { ROLES } from '@/utils/constants.js'

export default {
  created() {
    //TODO remove here and from constants once refactoring done in TheMenu and maybe auth store...
    this.ROLES = ROLES
  },
  computed: {
    ...mapState(useAppStore, ['userRoles']),
  },
  methods: {
    /**
     * Get role name by id.
     */
    getRoleNameById(id) {
      const role = this.userRoles.find((role) => role.id === id)
      return role ? role.description : null
    },

    /**
     * Get role id by name
     */
    getRoleIdByName(roleName) {
      const role = this.userRoles.find((role) => role.description === roleName)
      return role ? role.description : null
    },
  },
}
