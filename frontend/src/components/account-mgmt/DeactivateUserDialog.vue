<template>
  <AppDialog v-model="isDisplayed" title="Confirm" :isLoading="isLoading" persistent max-width="50%" @close="closeDialog">
    <template #content>
      <div align="center">Are you sure you want to deactivate this BCeID: {{ user?.userName }}?</div>
    </template>
    <template #button>
      <v-row justify="space-around">
        <v-col cols="12" md="6" class="d-flex justify-center">
          <AppButton id="dialog-go-back" :primary="false" size="large" width="250px" :loading="isLoading" @click="closeDialog">Go back</AppButton>
        </v-col>
        <v-col cols="12" md="6" class="d-flex justify-center">
          <AppButton id="dialog-deactivate-user" size="large" width="250px" :loading="isLoading" @click="deactivateUser">Deactivate user</AppButton>
        </v-col>
      </v-row>
    </template>
  </AppDialog>
</template>

<script>
import ApiService from '@/common/apiService'
import { ApiRoutes } from '@/utils/constants'
import AppButton from '@/components/ui/AppButton.vue'
import AppDialog from '@/components/ui/AppDialog.vue'
import alertMixin from '@/mixins/alertMixin'

export default {
  name: 'DeactivateUserDialog',
  components: { AppButton, AppDialog },
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
  emits: ['close', 'deactivate'],
  data() {
    return {
      isLoading: false,
      isDisplayed: false,
    }
  },
  watch: {
    show: {
      handler(value) {
        this.isDisplayed = value
      },
    },
  },
  methods: {
    closeDialog() {
      this.$emit('close')
    },

    async deactivateUser() {
      try {
        this.isLoading = true
        const payload = {
          contactId: this.user?.contactId,
          role: null,
          facilities: this.user?.facilities?.map((facility) => {
            return {
              bceidFacilityId: facility.bceidFacilityId,
              ofmPortalAccess: false,
            }
          }),
        }
        // TODO (jgstorey) Make this a service function
        await ApiService.apiAxios.post(ApiRoutes.USER + '/update', payload)
        this.$emit('deactivate')
        this.setSuccessAlert(`User with BCeID ${this.user?.userName} is deactivated successfully`)
      } catch (error) {
        this.setFailureAlert('Failed to deactivate user', error)
      } finally {
        this.isLoading = false
        this.closeDialog()
      }
    },
  },
}
</script>
