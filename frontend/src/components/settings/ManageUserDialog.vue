<template>
  <v-container>
    <AppDialog v-model="isDisplayed" :title="dialogTitle" :isLoading="isLoading" persistent min-width="350px" max-width="50%" @close="closeManageUserDialog">
      <template #content>
        <v-form ref="userForm" v-model="isFormComplete">
          <v-row v-if="isAddingUser">
            <v-col cols="12" class="pl-0 d-flex align-center justify-center">Note: users must have an active Business BCeID to gain access to the portal.</v-col>
          </v-row>
          <v-row no-gutters class="mt-5">
            <v-col cols="12" md="3">
              <AppLabel for="bceid">BCeID:</AppLabel>
            </v-col>
            <v-col v-if="isAddingUser" cols="12" md="9">
              <v-text-field
                id="bceid"
                v-model="user.userName"
                placeholder="BCeID"
                variant="outlined"
                density="compact"
                :rules="rules.required"
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
              <v-text-field id="firstName" v-model="user.firstName" placeholder="First Name" variant="outlined" density="compact" :rules="rules.required" :disabled="isLoading"></v-text-field>
            </v-col>
          </v-row>
          <v-row no-gutters>
            <v-col cols="12" md="3">
              <AppLabel for="lastName">Last Name:</AppLabel>
            </v-col>
            <v-col cols="12" md="9">
              <v-text-field id="lastName" v-model="user.lastName" placeholder="Last Name" variant="outlined" density="compact" :rules="rules.required" :disabled="isLoading"></v-text-field>
            </v-col>
          </v-row>
          <v-row no-gutters>
            <v-col cols="12" md="3">
              <AppLabel for="phone">Phone:</AppLabel>
            </v-col>
            <v-col cols="12" md="9">
              <v-text-field id="phone" v-model="user.phone" placeholder="###-###-####" :rules="[rules.phone]" variant="outlined" density="compact" :disabled="isLoading"></v-text-field>
            </v-col>
          </v-row>
          <v-row no-gutters>
            <v-col cols="12" md="3">
              <AppLabel for="email">Email:</AppLabel>
            </v-col>
            <v-col cols="12" md="9">
              <v-text-field id="email" v-model="user.email" placeholder="user@domain.com" :rules="rules.email" variant="outlined" density="compact" :disabled="isLoading"></v-text-field>
            </v-col>
          </v-row>
          <v-row no-gutters>
            <v-col cols="12" md="3">
              <AppLabel for="role">Role:</AppLabel>
            </v-col>
            <v-col cols="12" md="9">
              <v-select
                id="role"
                :items="userRoles"
                v-model="user.role"
                item-title="description"
                item-value="id"
                label="Select Role"
                :rules="rules.required"
                :disabled="isLoading"
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
                :items="facilitiesToAdminister"
                v-model="facilitiesModel"
                item-title="facilityName"
                item-value="facilityId"
                multiple
                label="Select one or more facilities"
                :rules="rules.required"
                :disabled="isLoading"
                density="compact"
                variant="outlined"></v-select>
            </v-col>
          </v-row>
          <v-row v-else-if="wasNewUserAdded" no-gutters>
            <v-col cols="12" class="pl-0 d-flex align-center justify-center">{{ getAddUserSuccessMsg() }}</v-col>
          </v-row>
        </v-form>
      </template>
      <template #button>
        <v-row justify="space-around">
          <v-col cols="12" md="6" class="d-flex justify-center">
            <AppButton id="cancel-reply-request" :primary="false" size="large" width="200px" @click="closeManageUserDialog()" :loading="isLoading">Cancel</AppButton>
          </v-col>
          <v-col cols="12" md="6" class="d-flex justify-center">
            <AppButton v-if="!wasNewUserAdded || isUpdatingUser" id="submit-reply-request" size="large" width="200px" @click="saveUser()" :loading="isLoading">{{ isAddingUser ? 'Add' : 'Update' }}</AppButton>
            <AppButton v-if="wasNewUserAdded && !isUpdatingUser" id="submit-reply-request" size="large" width="200px" @click="userOperationType = 'updating'" :loading="isLoading">Next</AppButton>
          </v-col>
        </v-row>
      </template>
    </AppDialog>
  </v-container>
</template>

<script>
import { mapState } from 'pinia'
import ApiService from '@/common/apiService'
import alertMixin from '@/mixins/alertMixin'
import { useAppStore } from '@/stores/app'
import { useAuthStore } from '@/stores/auth'
import AppButton from '@/components/ui/AppButton.vue'
import AppDialog from '@/components/ui/AppDialog.vue'
import AppLabel from '@/components/ui/AppLabel.vue'
import rules from '@/utils/rules'
import { ApiRoutes } from '@/utils/constants'

const ADD_USER_SUCCESS_MSG = 'User account created. Click "Next" to assign a facility to the new user.'

export default {
  name: 'ManageUserDialog',
  components: { AppButton, AppDialog, AppLabel },
  mixins: [alertMixin],
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    user: {
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
      facilitiesModel: [],
      facilitiesToAdminister: [],
      facilitiesUser: [],
      userOperationType: '', // Can be 'adding', 'updating'
      wasNewUserAdded: false,
    }
  },
  computed: {
    ...mapState(useAppStore, ['userRoles']),
    ...mapState(useAuthStore, ['userInfo']),
    isAddingUser() {
      return this.userOperationType === 'adding';
    },
    isUpdatingUser() {
      return this.userOperationType === 'updating';
    },
    dialogTitle() {
      return this.isAddingUser ? 'Add new user' : 'Edit user'
    },
  },
  watch: {
    show: {
      handler(value) {
        this.isDisplayed = value
      },
    },
    user: {
      handler(value) {
        this.userOperationType = Object.keys(this.user).length === 0 ? 'adding' : 'updating';
        this.facilitiesModel = value.facilities
        console.log('user = ', JSON.stringify(value, null, 2))
        console.log('users facilities = ', JSON.stringify(this.facilitiesUser, null, 2))
      },
    },
  },
  async created() {
    this.facilitiesToAdminister = await this.getUserFacilities(this.userInfo.contactId, true)
    //console.log('facilities to administer = ', this.facilitiesToAdminister)
  },
  methods: {
    /**
     * Close the dialog.
     */
    closeManageUserDialog() {
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
      this.$refs.userForm?.validate()
      if (this.isFormComplete) {
        try {
          this.isLoading = true
          if (this.isAddingUser) {
            await this.createUser()
          } else if (this.isUpdatingUser) {
            //console.log('IS UPDATING!!!!')
            if (this.hasUserFacilityAccessChanged(this.facilitiesModel, this.user.facilities)) {
              console.log('facilities updated!!!!')
              this.user.facilities = await this.getUpdatedFacilityAccess(this.facilitiesModel, this.user.facilities)
              //console.log('updateUser X = ', JSON.stringify(this.user, null, 2))
            } else {
              console.log('facilities NOT updated!!!!')
            }
            await this.updateUser(this.user)
            this.closeManageUserDialog()
          }
        } finally {
          this.isLoading = false
        }
      }
    },

    /**
     * Returns true if users facility access has changed, false otherwise.
     */
    hasUserFacilityAccessChanged(facilitiesModel, userFacilities) {
      if (facilitiesModel.length !== userFacilities.length) {
        return true;
      } else {
        for (let facilityId of facilitiesModel) {
          if (!userFacilities.includes(facilityId)) {
            return true;
          }
        }
      }
      return false;
    },

    /**
     * Get updated user facility access.
     */
    async getUpdatedFacilityAccess(facilitiesModel, userFacilities) {

      //TODO this is going to get refactored before committing for code QA...

      facilitiesModel = this.facilitiesToAdminister.filter(facility => this.facilitiesModel.includes(facility.facilityId))
      console.log('facilitiesModel = ', JSON.stringify(facilitiesModel, null, 2))
      const facilitiesToAdd = facilitiesModel.filter(facilityModel => {
        return !userFacilities.some(userFacility => {
          return userFacility.facilityId === facilityModel.facilityId;
        });
      });
      console.log('facilitiesToAdd = ', JSON.stringify(facilitiesToAdd, null, 2))
      const facilitiesToRemove = userFacilities.filter(userFacility =>
        !facilitiesModel.some(model => model.facilityId === userFacility.facilityId)
      );
      console.log('facilitiesToRemove = ', JSON.stringify(facilitiesToRemove, null, 2))


      const userFacilitiesWithbceidFacilityId = await this.getUserFacilities(this.user.contactId, false)

      // Update ofmPortalAccess for matching facilities
      facilitiesToRemove?.forEach(facilityToRemove => {
        let userFacility = userFacilitiesWithbceidFacilityId.find(facility => facility.facilityId === facilityToRemove.facilityId)
        facilityToRemove.bceidFacilityId = userFacility.bceidFacilityId
        facilityToRemove.ofmPortalAccess = false
      })
      // Update ofmPortalAccess for matching facilities
      facilitiesToAdd?.forEach(facilityToAdd => {
        let userFacility = userFacilitiesWithbceidFacilityId.find(facility => facility.facilityId === facilityToAdd.facilityId)
        //console.log('userFacility ******** = ', JSON.stringify(userFacility, null, 2))
        facilityToAdd.bceidFacilityId = userFacility.bceidFacilityId
        facilityToAdd.ofmPortalAccess = true
      })
      let y = [...facilitiesToAdd, ...facilitiesToRemove]
      //console.log('y = ', JSON.stringify(y, null, 2))
      return y
    },

    /**
     * Create a new user and emit success/fail event.
     */
    async createUser() {
      try {
        this.user.organizationId = this.userInfo.organizationId
        const response = await ApiService.apiAxios.post(ApiRoutes.USER + '/create', this.user)
        this.wasNewUserAdded = true
        this.setSuccessAlert(ADD_USER_SUCCESS_MSG)
      } catch (error) {
        this.setFailureAlert('User account creation failed.', error)
      }
    },

    /**
     * Update user and emit success/fail event.
     */
    async updateUser(user) {
      try {
        console.log('updateUser = ', JSON.stringify(user, null, 2))
        const response = await ApiService.apiAxios.post(ApiRoutes.USER + '/update', this.user)
        this.$emit('update-success-event', true)
      } catch (error) {
        this.$emit('update-success-event', false, error)
      }
    },

    async getUserFacilities(contactId, onlyWithPortalAccess) {
      try {
        const res = await ApiService.apiAxios.get(ApiRoutes.USER_FACILITIES + '/' + onlyWithPortalAccess + '/' + contactId)
        return this.sortFacilities(res.data)
      } catch (error) {
        this.setFailureAlert('Failed to get the list of facilities by contact id: ' + this.userInfo.contactId, error)
      }
    },

    /**
     * Sort facilities by name and address.
     */
    sortFacilities(facilities) {
      try {
        return facilities.sort((a, b) => {
          const nameComparison = a.facilityName.localeCompare(b.facilityName)
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
     * Get the add user success message constant.
     */
    getAddUserSuccessMsg() {
      return ADD_USER_SUCCESS_MSG
    },
  },
}
</script>
