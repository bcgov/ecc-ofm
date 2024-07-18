<template>
  <v-container>
    <AppDialog v-model="isDisplayed" :title="dialogTitle" :isLoading="isLoading" persistent max-width="50%" @close="closeManageUserDialog">
      <template #content>
        <v-form ref="userForm" v-model="isFormComplete">
          <v-row v-if="isAddingUser">
            <v-col cols="12" class="pl-0 d-flex align-center justify-center">Note: users must have an active Business BCeID to gain access to the portal.</v-col>
          </v-row>
          <v-row no-gutters class="mt-5">
            <v-col cols="12" md="3">
              <AppLabel for="bceid">BCeID:</AppLabel>
            </v-col>
            <v-col v-if="isAddingUser && !wasNewUserAdded" cols="12" md="9">
              <v-text-field
                id="bceid"
                v-model.trim="user.userName"
                @blur="checkBCeIDExists(user.userName)"
                placeholder="BCeID"
                variant="outlined"
                density="compact"
                :rules="rules.required"
                :error-messages="errorMessages"
                :disabled="isLoading"></v-text-field>
            </v-col>
            <v-col v-else cols="12" md="9" class="mb-5">
              <span>{{ user.userName }}</span>
            </v-col>
          </v-row>
          <v-row no-gutters>
            <v-col cols="12" md="3">
              <AppLabel for="firstName">First Name:</AppLabel>
            </v-col>
            <v-col cols="12" md="9">
              <v-text-field id="firstName" v-model.trim="user.firstName" placeholder="First Name" variant="outlined" density="compact" :rules="rules.required" :disabled="isLoading"></v-text-field>
            </v-col>
          </v-row>
          <v-row no-gutters>
            <v-col cols="12" md="3">
              <AppLabel for="lastName">Last Name:</AppLabel>
            </v-col>
            <v-col cols="12" md="9">
              <v-text-field id="lastName" v-model.trim="user.lastName" placeholder="Last Name" variant="outlined" density="compact" :rules="rules.required" :disabled="isLoading"></v-text-field>
            </v-col>
          </v-row>
          <v-row no-gutters>
            <v-col cols="12" md="3">
              <AppLabel for="phone">Phone:</AppLabel>
            </v-col>
            <v-col cols="12" md="9">
              <v-text-field id="phone" v-model.trim="user.phone" placeholder="###-###-####" :rules="[rules.phone]" variant="outlined" density="compact" :disabled="isLoading"></v-text-field>
            </v-col>
          </v-row>
          <v-row no-gutters>
            <v-col cols="12" md="3">
              <AppLabel for="email">Email:</AppLabel>
            </v-col>
            <v-col cols="12" md="9">
              <v-text-field
                id="email"
                v-model.trim="user.email"
                placeholder="user@domain.com"
                :rules="[rules.email, ...rules.required]"
                variant="outlined"
                density="compact"
                :disabled="isLoading"></v-text-field>
            </v-col>
          </v-row>
          <v-row no-gutters class="mt-2">
            <v-col cols="12" md="3">
              <AppLabel for="role">Role:</AppLabel>
            </v-col>
            <v-col cols="12" md="9">
              <v-select
                id="role"
                :items="validRoles"
                v-model="user.role.roleId"
                item-title="roleName"
                item-value="roleId"
                label="Select Role"
                :rules="rules.required"
                :disabled="isLoading || isSameUser"
                density="compact"
                variant="outlined"></v-select>
            </v-col>
          </v-row>
          <v-row v-if="isUpdatingUser" no-gutters>
            <v-col cols="12" md="3">
              <AppLabel>Facility:</AppLabel>
            </v-col>
            <v-col cols="12" md="9">
              <v-select
                chips
                :items="facilitiesToAdminister"
                v-model="selectedFacilityIds"
                item-title="facilityName"
                item-value="facilityId"
                multiple
                label="Select one or more facilities"
                :rules="rules.required"
                :disabled="isLoading || isSameUser"
                density="compact"
                variant="outlined">
                <template v-slot:prepend-item>
                  <v-list-item title="Select All" @click="toggleFacilitiesToAdminister">
                    <template v-slot:prepend>
                      <v-checkbox-btn
                        :color="someFacilitiesSelected ? '#003366' : undefined"
                        :indeterminate="someFacilitiesSelected && !allFacilitiesSelected"
                        :model-value="someFacilitiesSelected"></v-checkbox-btn>
                    </template>
                  </v-list-item>
                  <v-divider class="mt-2"></v-divider>
                </template>
              </v-select>
            </v-col>
          </v-row>
          <v-row v-else-if="wasNewUserAdded" no-gutters>
            <v-col cols="12" class="pl-0 d-flex align-center justify-center">{{ ADD_USER_SUCCESS_MSG }}</v-col>
          </v-row>
        </v-form>
      </template>
      <template #button>
        <v-row justify="space-around">
          <v-col cols="12" md="6" class="d-flex justify-center">
            <AppButton id="cancel-reply-request" :primary="false" size="large" width="200px" @click="closeManageUserDialog()" :loading="isLoading">Cancel</AppButton>
          </v-col>
          <v-col cols="12" md="6" class="d-flex justify-center">
            <AppButton v-if="!wasNewUserAdded || isUpdatingUser" id="submit-reply-request" size="large" width="200px" @click="saveUser()" :loading="isLoading">
              {{ isAddingUser ? 'Add' : 'Update' }}
            </AppButton>
            <AppButton v-if="wasNewUserAdded && !isUpdatingUser" id="submit-reply-request" size="large" width="200px" @click="userOperationType = 'update'" :loading="isLoading">Next</AppButton>
          </v-col>
        </v-row>
      </template>
    </AppDialog>
    <DuplicateUserDialog :show="showDuplicateUserDialog" @close="toggleDuplicateUserDialog()" @proceed-confirmed="closeDialogAndSaveUser()" />
  </v-container>
</template>

<script>
import { mapState } from 'pinia'

import DuplicateUserDialog from '@/components/account-mgmt/DuplicateUserDialog.vue'
import AppButton from '@/components/ui/AppButton.vue'
import AppDialog from '@/components/ui/AppDialog.vue'
import AppLabel from '@/components/ui/AppLabel.vue'
import alertMixin from '@/mixins/alertMixin'
import OrganizationService from '@/services/organizationService'
import UserService from '@/services/userService'
import { useAppStore } from '@/stores/app'
import { useAuthStore } from '@/stores/auth'
import { ROLES } from '@/utils/constants'
import rules from '@/utils/rules'

export default {
  name: 'ManageUserDialog',
  components: { AppButton, AppDialog, AppLabel, DuplicateUserDialog },
  mixins: [alertMixin],
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    updatingUser: {
      type: Object,
      required: true,
      default: () => {
        return {}
      },
    },
  },
  emits: ['close', 'close-refresh', 'update-success-event'],
  data() {
    return {
      isFormComplete: false,
      rules,
      isDisplayed: false,
      isLoading: false,
      user: {},
      selectedFacilityIds: [],
      facilitiesToAdminister: [],
      facilitiesUser: [],
      userOperationType: '', // Can be 'add', 'update'
      wasNewUserAdded: false,
      errorMessages: [],
      showDuplicateUserDialog: false,
      continueSaveConfirmed: false,
    }
  },
  computed: {
    ...mapState(useAppStore, ['roles']),
    ...mapState(useAuthStore, ['userInfo']),
    validRoles() {
      // Impersonate is a pseudo-role and should never be assigned to a portal user
      return this.roles.filter((role) => role.roleName !== ROLES.IMPERSONATE)
    },
    isAddingUser() {
      return this.userOperationType === 'add'
    },
    isUpdatingUser() {
      return this.userOperationType === 'update'
    },
    dialogTitle() {
      return this.isAddingUser ? 'Add new user' : 'Edit user'
    },
    isSameUser() {
      return this.user.userName === this.userInfo.userName
    },
    allFacilitiesSelected() {
      return this.selectedFacilityIds?.length === this.facilitiesToAdminister?.length
    },
    someFacilitiesSelected() {
      return this.selectedFacilityIds?.length > 0
    },
  },
  watch: {
    show: {
      handler(value) {
        this.isDisplayed = value
      },
    },
    updatingUser: {
      handler(value) {
        this.userOperationType = Object.keys(value).length === 0 ? 'add' : 'update'
        this.selectedFacilityIds = value.facilities
        this.user = value
        if (!this.user.role) this.user.role = {}
      },
    },
  },
  async created() {
    this.ADD_USER_SUCCESS_MSG = 'User account created. Click "Next" to assign a facility to the new user.'
    this.facilitiesToAdminister = this.sortFacilities([...this.userInfo.facilities])
  },
  methods: {
    /**
     * Close the dialog.
     */
    closeManageUserDialog() {
      this.errorMessages = []
      this.$refs.userForm?.reset()
      if (this.wasNewUserAdded) {
        this.wasNewUserAdded = false
        this.$emit('close-refresh')
      } else {
        this.$emit('close')
      }
    },

    /**
     * Create or update user.
     */
    async saveUser() {
      try {
        this.isLoading = true
        await this.checkBCeIDExists(this.user?.userName)
        this.$refs.userForm?.validate()
        if (!this.isFormComplete) {
          return
        }
        if (this.isAddingUser) {
          await this.createUser()
        } else if (this.isUpdatingUser) {
          if (this.hasUserFacilityAccessChanged(this.selectedFacilityIds, this.user.facilities)) {
            this.user.facilities = await this.getUpdatedFacilityAccess(this.user, this.selectedFacilityIds)
          }
          await this.updateUser()
          this.closeManageUserDialog()
        }
      } finally {
        this.isLoading = false
      }
    },

    /**
     * Close the duplicate user dialog and save the user.
     */
    async closeDialogAndSaveUser() {
      this.continueSaveConfirmed = true
      this.toggleDuplicateUserDialog()
      this.saveUser()
    },

    /**
     * Create a new user and emit success/fail event.
     */
    async createUser() {
      try {
        // Check if user already exists, if so, prompt to confirm they wish to continue
        const userExists = await this.doesUserExist(this.user.firstName, this.user.lastName, this.user.email)
        if (!this.continueSaveConfirmed && userExists) {
          this.toggleDuplicateUserDialog()
          return
        }
        this.user.organizationId = this.userInfo.organizationId

        this.user = await UserService.createUser(this.user)
        this.user.facilities = {}
        this.wasNewUserAdded = true
        this.setSuccessAlert(this.ADD_USER_SUCCESS_MSG)
      } catch (error) {
        this.setFailureAlert('User account creation failed.', error)
      }
    },

    /**
     * Update user and emit success/fail event.
     */
    async updateUser() {
      try {
        await UserService.updateUser(this.user)
        this.$emit('update-success-event', true)
      } catch (error) {
        this.$emit('update-success-event', false, error)
      }
    },

    /**
     * Get the list of facilities by contact id.
     */
    async getUserFacilities(contactId) {
      try {
        const res = await UserService.getUserFacilities(contactId)
        return this.sortFacilities(res)
      } catch (error) {
        this.setFailureAlert('Failed to get the list of facilities by contact id: ' + this.userInfo.contactId, error)
      }
    },

    /**
     * Sort facilities by name and address.
     */
    sortFacilities(facilities) {
      try {
        return facilities?.sort((a, b) => {
          const nameComparison = a.facilityName?.localeCompare(b.facilityName)
          if (nameComparison !== 0) {
            return nameComparison
          }
          return a.address.localeCompare(b.address)
        })
      } catch (error) {
        this.setFailureAlert('Failed to sort facilities', error)
      }
    },

    /**
     * Returns true if users facility access has changed, false otherwise.
     */
    hasUserFacilityAccessChanged(selectedFacilityIds, userFacilities) {
      if (selectedFacilityIds?.length !== userFacilities?.length) {
        return true
      }
      return selectedFacilityIds?.some((facilityId) => !userFacilities?.includes(facilityId))
    },

    /**
     * Get updated user facility access.
     */
    async getUpdatedFacilityAccess(user, selectedFacilityIds) {
      let facilitiesToAdd = []
      let facilitiesToRemove = []
      // Get facility objects selected by facilityIds
      const selectedFacilities = this.getSelectedFacilitiesByIds(selectedFacilityIds)
      // Get users current facilities
      const userFacilities = await this.getUserFacilities(user.contactId)
      // If user has no facilities, all selectedFacilities are to be added
      if (Object.keys(user.facilities).length === 0) {
        facilitiesToAdd = selectedFacilities
      } else {
        // Determine any new facilities to add/remove by comparing selectedFacilities to userFacilities
        facilitiesToAdd = this.getFacilitiesToAdd(selectedFacilities, user.facilities)
        facilitiesToRemove = this.getFacilitiesToRemove(selectedFacilities, userFacilities)
        // Update facilities to remove with bceidFacilityId and ofmPortalAccess (true)
        this.updateFacilitiesAccess(facilitiesToRemove, userFacilities, false)
      }
      // Update facilities to add with bceidFacilityId and ofmPortalAccess (false)
      this.updateFacilitiesAccess(facilitiesToAdd, userFacilities, true)
      return [...facilitiesToAdd, ...facilitiesToRemove]
    },

    /**
     * Filter facilities to administer.
     */
    getSelectedFacilitiesByIds(selectedFacilityIds) {
      return this.facilitiesToAdminister?.filter((facility) => selectedFacilityIds?.includes(facility.facilityId))
    },

    /**
     * Get facilities to add.
     */
    getFacilitiesToAdd(selectedFacilities, userFacilities) {
      return selectedFacilities?.filter((selectedFacility) => !userFacilities?.some((userFacility) => userFacility.facilityId === selectedFacility.facilityId))
    },

    /**
     * Get facilities to remove.
     */
    getFacilitiesToRemove(selectedFacility, userFacilities) {
      return userFacilities?.filter((userFacility) => !selectedFacility?.some((selectedFacility) => selectedFacility.facilityId === userFacility.facilityId))
    },

    /**
     * Update facilities to add/remove access (i.e. ofmPortalAccess = true/false), and update bceidFacilityId value from userFacilities
     */
    updateFacilitiesAccess(facilitiesToAddOrRemove, userFacilities, accessStatus) {
      facilitiesToAddOrRemove?.forEach((facilityToAddOrRemove) => {
        const userFacility = userFacilities.find((fac) => fac.facilityId === facilityToAddOrRemove.facilityId)
        if (userFacility) {
          facilityToAddOrRemove.bceidFacilityId = userFacility.bceidFacilityId
          facilityToAddOrRemove.ofmPortalAccess = accessStatus
        }
      })
    },
    toggleFacilitiesToAdminister() {
      if (this.allFacilitiesSelected) {
        this.selectedFacilityIds = []
      } else {
        this.selectedFacilityIds = this.facilitiesToAdminister?.map((facility) => facility.facilityId)
      }
    },

    /**
     * Check if BCeID exists in provider organization, if so raise error message.
     */
    async checkBCeIDExists(userName) {
      try {
        if (this.user.userName) {
          const res = await UserService.userExists(userName)
          this.errorMessages = res.exists ? ['A user with this BCeID already exists.'] : []
        }
      } catch (error) {
        this.setFailureAlert('Failed to check if BCeID already exists in provider organization: ' + userName, error)
      }
    },

    /**
     * Check if user already exists in provider organization by first name, last name, and email.
     */
    async doesUserExist(firstName, lastName, email) {
      try {
        const res = await OrganizationService.getOrganizationUsers(this.userInfo.organizationId, firstName, lastName, email)
        return Array.isArray(res) && res.length >= 1
      } catch (error) {
        this.setFailureAlert('Failed to check if user already exists in provider organization', error)
      }
    },

    /**
     * Toggle the duplicate user dialog.
     */
    toggleDuplicateUserDialog() {
      this.showDuplicateUserDialog = !this.showDuplicateUserDialog
    },
  },
}
</script>
