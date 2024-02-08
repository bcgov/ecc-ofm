<template>
  <v-form ref="form" v-model="isFormComplete">
    <h1>Submit</h1>
    <v-row no-gutters class="mt-4"><strong>Please note that this page is only a placeholder to test the navigation bar and navigation buttons</strong></v-row>
    <v-row class="mt-4">
      <v-col>
        <v-text-field v-model.trim="model.field1" :disabled="readonly" outlined :rules="rules.required" label="Field 1" />
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-text-field v-model.trim="model.field2" :disabled="readonly" outlined :rules="rules.required" label="Field 2" />
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-text-field v-model.trim="model.field3" :disabled="readonly" outlined :rules="rules.required" label="Field 3" />
      </v-col>
    </v-row>
    <v-row no-gutters class="my-6">
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
        nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident,
        sunt in culpa qui officia deserunt mollit anim id est laborum.
      </p>
    </v-row>
    <v-row no-gutters class="my-6">
      <p>Donec iaculis nec quam vel congue. Fusce consequat mattis rhoncus. Sed id ipsum sed purus placerat euismod vel ut erat. Nullam ligula leo, fermentum vel interdum sit amet, tempor at nunc.</p>
    </v-row>
  </v-form>
</template>

<script>
import { useApplicationsStore } from '@/stores/applications'
import { mapState } from 'pinia'
import { APPLICATION_STATUS_CODES } from '@/utils/constants'
import rules from '@/utils/rules'

export default {
  name: 'SubmitApplicationView',
  props: {
    back: {
      type: Boolean,
      default: false,
    },
    submit: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      rules,
      model: {},
      isFormComplete: false,
    }
  },
  computed: {
    ...mapState(useApplicationsStore, ['currentApplication']),
    readonly() {
      return this.currentApplication?.statusCode != APPLICATION_STATUS_CODES.DRAFT
    },
  },
  watch: {
    isFormComplete: {
      handler(value) {
        if (!this.currentApplication) return
        this.currentApplication.isSubmitApplicationComplete = value
      },
    },
    back: {
      handler() {
        this.$router.push({ name: 'staffing', params: { applicationGuid: this.$route.params.applicationGuid } })
      },
    },
    submit: {
      handler() {
        this.$router.push({ name: 'home' })
      },
    },
  },
}
</script>
