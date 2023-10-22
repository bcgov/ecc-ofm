<template>
    <v-container>
        <v-row justify="center">
            <div class="pa-10" :class="'text-h4'" v-text="`Welcome ${userInfo.displayName}`" />
        </v-row>
        <v-row>
            <v-form ref="form" v-model="isValidForm" @submit.prevent>
                <v-card>
                    <v-row>
                        <v-col>
                            <v-text-field outlined required v-model="businessBCeId" id="businessBCeId-field"
                                :rules="rules.required" label="Business BCeID" v-on:keydown.enter="setBCeID();" />
                        </v-col>
                        <v-col cols="4">
                            <v-btn @click="setBCeID()" :disabled="!businessBCeId">Search</v-btn>
                        </v-col>
                    </v-row>
                </v-card>
            </v-form>
        </v-row>
    </v-container>
</template>

<script>
import { mapState, mapActions } from 'pinia';
import { useAuthStore } from '@/stores/auth'
import { PATHS } from '@/utils/constants'
import rules from '@/utils/rules';
import alertMixin from '@/mixins/alertMixin';


export default {
    mixins: [alertMixin],
    data() {
        return {
            rules,
            businessBCeId: undefined,
            isValidForm: true,
            processing: false,
        };
    },
    computed: {
        ...mapState(useAuthStore, ['userInfo']),
    },
    methods: {
        ...mapActions(useAuthStore, ['getUserInfo', 'setIsUserInfoLoaded', 'setImpersonateId']),
        async setBCeID() {
            this.processing = true
            this.setIsUserInfoLoaded(false)
            this.setImpersonateId(this.businessBCeId)
            try {
                await this.getUserInfo()
                this.processing = false
                this.$router.push(PATHS.ROOT.HOME)
            } catch (error) {
                this.processing = false
                this.setImpersonateId(null)
                if (error.response?.status == '404') {
                    this.setFailureAlert(`Unable to find BCeID: [ ${this.businessBCeId} ]`)
                } else if (error.response?.status == '409') {
                    this.setFailureAlert(`BCeID: [ ${this.businessBCeId} ] is found, but does not have an associated User GUID`);
                } else {
                    this.setFailureAlert('An error occurred while trying to load BCeID')
                }
            }
        }
    }
};
</script>
  
<style scoped>
.v-card {
    width: 350px;
    margin: 10px;
    padding: 10px;
}
</style>
  