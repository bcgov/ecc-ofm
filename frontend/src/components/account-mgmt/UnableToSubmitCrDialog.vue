<template>
  <AppDialog v-model="isDisplayed" title="Unable to submit your request" class="text-wrap" persistent :max-width="$vuetify.display.mdAndDown ? '80%' : '50%'" @close="closeDialog">
    <template #content>
      <div class="confirm-dialog-text text-center">
        <template v-if="displayType === PREVENT_CHANGE_REQUEST_TYPES.IN_TDAD_PROGRAM || PREVENT_CHANGE_REQUEST_TYPES.IN_CCOF_PROGRAM">
          <h3 class="mb-3">This facility is not enrolled in the $10 a Day - Operating Funding Model</h3>
          Please contact the $10 a Day Program through {{ OFM_CONTACT_EMAIL }}
        </template>
        <template v-else-if="displayType === PREVENT_CHANGE_REQUEST_TYPES.NO_FACILITIES_IN_OFM">
          <h3 class="mb-3">Your organization does not have any facilites enrolled in the $10 a Day - Operating Funding Model</h3>
          Participants of the $10 a Day Program should contact the team through emailing {{ OFM_CONTACT_EMAIL }}
        </template>
      </div>
    </template>
    <template #button>
      <v-row>
        <v-col class="d-flex justify-center">
          <AppButton id="dialog-cancel" :primary="false" size="large" width="250px" @click="closeDialog">Cancel</AppButton>
        </v-col>
        <v-col class="d-flex justify-center">
          <AppButton id="send-email-button" size="large" width="250px" :href="`mailto:${OFM_CONTACT_EMAIL}`" @click="closeDialog">Send Email</AppButton>
        </v-col>
      </v-row>
    </template>
  </AppDialog>
</template>

<script>
import AppButton from '@/components/ui/AppButton.vue'
import AppDialog from '@/components/ui/AppDialog.vue'
import StaticConfig from '@/common/staticConfig'
import { PREVENT_CHANGE_REQUEST_TYPES } from '@/utils/constants'

export default {
  name: 'UnableToSubmitCrDialog',
  components: { AppButton, AppDialog },
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    displayType: {
      type: String,
      validator: function (value) {
        return [PREVENT_CHANGE_REQUEST_TYPES.IN_CCOF_PROGRAM, PREVENT_CHANGE_REQUEST_TYPES.IN_TDAD_PROGRAM, PREVENT_CHANGE_REQUEST_TYPES.NO_FACILITIES_IN_OFM].includes(value)
      },
      default: null,
    },
  },
  emits: ['close'],
  data() {
    return {
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
  created() {
    this.PREVENT_CHANGE_REQUEST_TYPES = PREVENT_CHANGE_REQUEST_TYPES
    this.TITLE_CCOF_TDAD = this.OFM_CONTACT_EMAIL = StaticConfig.TDAD_CONTACT_EMAIL
  },
  methods: {
    closeDialog() {
      this.$emit('close')
    },
  },
}
</script>
