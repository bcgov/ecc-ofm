<template>
  <v-row class="sticky py-1 mt-4">
    <v-col cols="5">
      <v-row justify="start">
        <AppButton
          v-if="showBack"
          id="app-back-button"
          :primary="false"
          :loading="loading"
          size="large"
          class="navButton"
          @click="back()">
          <v-icon class="pb-1">mdi-arrow-left</v-icon>
          Back
        </AppButton>
        <AppButton
          v-if="showCancel"
          id="app-cancel-button"
          :primary="false"
          :loading="loading"
          :disabled="disableCancel"
          size="large"
          class="navButton"
          @click="cancel()">
          Cancel
        </AppButton>
      </v-row>
    </v-col>
    <v-col cols="7">
      <v-row justify="end" class="mr-4">
        <AppButton
          v-if="showSave"
          id="app-save-button"
          :primary="false"
          :loading="loading"
          :disabled="disableSave"
          size="large"
          class="navButton"
          @click="save()">
          Save
        </AppButton>
        <AppButton
          v-if="showNext"
          id="app-next-button"
          :loading="loading"
          :disabled="disableNext"
          size="large"
          class="navButton"
          @click="next()">
          Next
          <v-icon class="pb-1">mdi-arrow-right</v-icon>
        </AppButton>
        <AppButton
          v-if="showSubmit"
          id="app-submit-button"
          :loading="loading"
          :disabled="disableSubmit"
          size="large"
          class="navButton"
          @click="submit()">
          Submit
        </AppButton>
      </v-row>
    </v-col>
  </v-row>
</template>

<script>
import AppButton from '@/components/ui/AppButton.vue'

export default {
  name: 'AppNavButtons',
  components: { AppButton },
  props: {
    loading: {
      type: Boolean,
      default: false
    },
    showCancel: {
      type: Boolean,
      default: false
    },
    showBack: {
      type: Boolean,
      default: false
    },
    showNext: {
      type: Boolean,
      default: false
    },
    showSave: {
      type: Boolean,
      default: false
    },
    showSubmit: {
      type: Boolean,
      default: false
    },
    disableCancel: {
      type: Boolean,
      default: false
    },
    disableNext: {
      type: Boolean,
      default: false
    },
    disableSave: {
      type: Boolean,
      default: false
    },
    disableSubmit: {
      type: Boolean,
      default: false
    }
  },
  emits: ['cancel', 'back', 'next', 'save', 'submit'],
  methods: {
    async cancel() {
      this.$emit('cancel')
    },
    async back() {
      this.$emit('back')
    },
    async next() {
      this.$emit('next')
    },
    async save() {
      this.$emit('save')
    },
    async submit() {
      this.$emit('submit')
    }
  }
}
</script>
<style scoped>
.sticky {
  position: sticky;
  bottom: 0;
  background-color: lightgray;
  z-index: 2;
}

.navButton {
  margin-left: 30px;
  width: 120px;
}
</style>
