<template>
  <AppDialog v-model="isDisplayed" title="Unable to submit your request" class="text-wrap" persistent max-width="40%" @close="closeDialog">
    <template #content>
      <div align="center" class="confirm-dialog-text">
        <template v-if="displayType === PREVENT_CHANGE_REQUEST_TYPES.IN_CCOF_PROGRAM">
          <h3 class="mb-3">{{ TITLE_CCOF_TDAD }}</h3>
          {{ MSG_TEXT_CCOF }}
        </template>
        <template v-else-if="displayType === PREVENT_CHANGE_REQUEST_TYPES.IN_TDAD_PROGRAM">
          <h3 class="mb-3">{{ TITLE_CCOF_TDAD }}</h3>
          {{ MSG_TEXT_TDAD }}{{ TDAD_CONTACT_EMAIL }}
        </template>
        <template v-else-if="displayType === PREVENT_CHANGE_REQUEST_TYPES.NO_FACILITIES_IN_OFM">
          <h3 class="mb-3">Your organization does not have any facility in OFM</h3>
          {{ MSG_TEXT_CCOF }}<br>{{ MSG_TEXT_TDAD }}{{ TDAD_CONTACT_EMAIL }}
        </template>
      </div>
    </template>
    <template #button>
      <v-row justify="space-around" class="pt-3">
        <v-col cols="12" sm="1" md="5" class="d-flex justify-center">
          <AppButton id="dialog-cancel" :primary="false" class="mr-10" size="large" width="175px" @click="closeDialog">Cancel</AppButton>
          <AppButton v-if="displayType === PREVENT_CHANGE_REQUEST_TYPES.IN_CCOF_PROGRAM || displayType === PREVENT_CHANGE_REQUEST_TYPES.NO_FACILITIES_IN_OFM"
            id="dialog-continue"
            size="large"
            width="250px"
            :href="CCOF_URL"
            @click="closeDialog">MyCCS Change Form</AppButton>
          <AppButton v-if="displayType === PREVENT_CHANGE_REQUEST_TYPES.IN_TDAD_PROGRAM || displayType === PREVENT_CHANGE_REQUEST_TYPES.NO_FACILITIES_IN_OFM"
            id="dialog-continue"
            size="large"
            width="175px"
            :href="`mailto:${TDAD_CONTACT_EMAIL}`"
            @click="closeDialog">Send Email</AppButton>
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
        return [PREVENT_CHANGE_REQUEST_TYPES.IN_CCOF_PROGRAM,
        PREVENT_CHANGE_REQUEST_TYPES.IN_TDAD_PROGRAM,
        PREVENT_CHANGE_REQUEST_TYPES.NO_FACILITIES_IN_OFM].includes(value)
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
    this.TITLE_CCOF_TDAD = 'This facility is not enrolled in OFM'
    this.MSG_TEXT_CCOF = 'Participants of the CCOF program may change information using the following MyCCS Change Form button.'
    this.MSG_TEXT_TDAD = 'Participants of the TDAD program should contact the ministry at '
    this.CCOF_URL = StaticConfig.CCOF_URL
    this.TDAD_CONTACT_EMAIL = StaticConfig.TDAD_CONTACT_EMAIL
  },
  methods: {
    closeDialog() {
      this.$emit('close')
    },
  },
}
</script>
