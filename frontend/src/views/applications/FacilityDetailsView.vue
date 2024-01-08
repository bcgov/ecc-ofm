<template>
  <v-form ref="form" v-model="isFormComplete">
    <div>
      <h4 class="my-4">
        Your facility:
        <span class="facility-name ml-6">{{ currentApplication?.facilityName }}</span>
      </h4>
    </div>
    <h4>Facility information</h4>
    <FacilityInfo :facilityId="currentApplication?.facilityId" />
    <v-row no-gutters class="my-4"><strong>Please note that this page is only a placeholder to test the navigation bar and navigation buttons</strong></v-row>
    <v-row class="mt-4">
      <v-col>
        <v-text-field v-model="model.field1" :disabled="readonly" outlined :rules="rules.required" label="Field 1" />
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-text-field v-model="model.field2" :disabled="readonly" outlined :rules="rules.required" label="Field 2" />
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-text-field v-model="model.field3" :disabled="readonly" outlined :rules="rules.required" label="Field 3" />
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
import FacilityInfo from '@/components/facilities/FacilityInfo.vue'

export default {
  name: 'FacilityDetailsView',
  components: { FacilityInfo },
  props: {
    back: {
      type: Boolean,
      default: false,
    },
    next: {
      type: Boolean,
      default: false,
    },
    save: {
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
        this.currentApplication.isFacilityDetailsComplete = value
      },
    },
    back: {
      handler() {
        this.$router.push({ name: 'applications-history' })
      },
    },
    save: {
      handler() {
        this.$refs.form?.validate()
      },
    },
    next: {
      handler() {
        this.$router.push({ name: 'licences', params: { applicationGuid: this.$route.params.applicationGuid } })
      },
    },
  },
}
</script>
<style scoped>
.facility-name {
  color: #003366;
  font-size: 1.3em;
  text-decoration: underline;
}
</style>
