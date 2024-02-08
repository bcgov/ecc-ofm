<template>
  <v-container>
    <v-row justify="center">
      <div class="pa-10" :class="'text-h4'" v-text="`Welcome ${userInfo.displayName}`" />
    </v-row>
    <v-row>
      <v-form ref="form" v-model="isValidForm" @submit.prevent>
        <v-card class="impersonate-card">
          <v-row>
            <v-col>
              <v-text-field id="businessBCeId-field" v-model.trim="businessBCeId" outlined required :rules="rules.required" label="Business BCeID" v-on:keydown.enter="setBCeID()" />
            </v-col>
            <v-col cols="4">
              <v-btn @click="setBCeID()" :disabled="!businessBCeId" id="bceid-search">Search</v-btn>
            </v-col>
          </v-row>
        </v-card>
      </v-form>
    </v-row>
  </v-container>
</template>

<script>
import { mapActions, mapState, mapWritableState } from 'pinia'
import { useAuthStore } from '@/stores/auth'
import rules from '@/utils/rules'
import alertMixin from '@/mixins/alertMixin'

export default {
  mixins: [alertMixin],
  data() {
    return {
      rules,
      businessBCeId: undefined,
      isValidForm: true,
      processing: false,
    }
  },
  computed: {
    ...mapState(useAuthStore, ['userInfo']),
    ...mapWritableState(useAuthStore, ['impersonateId', 'isUserInfoLoaded']),
  },
  methods: {
    ...mapActions(useAuthStore, ['getUserInfo']),
    async setBCeID() {
      this.processing = true
      this.isUserInfoLoaded = false
      this.impersonateId = this.businessBCeId
      try {
        await this.getUserInfo()
        this.processing = false
        this.$router.push({ name: 'home' })
      } catch (error) {
        this.processing = false
        this.impersonateId = null
        if (error.response?.status == '404') {
          this.setFailureAlert(`Unable to find BCeID: [ ${this.businessBCeId} ]`)
        } else if (error.response?.status == '409') {
          this.setFailureAlert(`BCeID: [ ${this.businessBCeId} ] is found, but does not have an associated User GUID`)
        } else {
          this.setFailureAlert('An error occurred while trying to load BCeID')
        }
      }
    },
  },
}
</script>

<style scoped>
.impersonate-card {
  width: 350px;
  margin: 10px;
  padding: 10px;
}
</style>
