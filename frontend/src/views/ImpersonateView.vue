<template>
  <v-container>
    <v-row justify="center">
      <div class="pa-10" :class="'text-h4'" v-text="`Welcome ${userInfo.displayName}`" />
    </v-row>
    <v-row>
      <v-col cols="12" sm="8" md="6" lg="4">
        <v-form ref="form" v-model="isValidForm" @submit.prevent>
          <v-card class="basic-card">
            <v-card-text>
              <v-row>
                <v-col>
                  <v-text-field id="businessBCeId-field" v-model.trim="businessBCeId" outlined required :rules="rules.required" label="Business BCeID" @keydown.enter="setBCeID()" />
                </v-col>
                <v-col cols="4">
                  <AppButton id="bceid-search" :disabled="!businessBCeId" :loading="processing" @click="setBCeID()">Search</AppButton>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-form>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapActions, mapState, mapWritableState } from 'pinia'

import AppButton from '@/components/ui/AppButton.vue'
import alertMixin from '@/mixins/alertMixin'
import { useAuthStore } from '@/stores/auth'
import rules from '@/utils/rules'

export default {
  components: { AppButton },
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
