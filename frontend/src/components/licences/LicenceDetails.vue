<template>
  <v-form ref="form">
    <v-container fluid class="pt-0" id="top">
      <v-row no-gutters>
        <v-col cols="12" lg="6">
          <v-row no-gutters class="mr-2 my-2">
            <v-col cols="12" sm="6" class="pr-2 mt-1">
              <AppLabel>CCOF Facility ID:</AppLabel>
            </v-col>
            <v-col cols="12" sm="6" class="mt-1">{{ licence?.ccofFacilityId ? licence?.ccofFacilityId : BLANK_FIELD }}</v-col>
          </v-row>
        </v-col>
        <v-col cols="12" lg="6">
          <v-row no-gutters class="mr-2 my-2">
            <v-col cols="12" sm="6" class="pr-2 mt-1">
              <AppLabel>CCOF Organization ID:</AppLabel>
            </v-col>
            <v-col cols="12" sm="6" class="mt-1">{{ licence?.ccofOrganizationId ? licence?.ccofOrganizationId : BLANK_FIELD }}</v-col>
          </v-row>
        </v-col>
        <v-col cols="12" lg="6">
          <v-row no-gutters class="mr-2 my-2">
            <v-col cols="12" sm="6" class="pr-2 mt-1">
              <AppLabel>Health Authority:</AppLabel>
            </v-col>
            <v-col cols="12" sm="6" class="mt-1">{{ healthAuthority ? healthAuthority : BLANK_FIELD }}</v-col>
          </v-row>
        </v-col>
        <v-col cols="12" lg="6">
          <v-row no-gutters class="mr-2 my-2">
            <v-col cols="12" sm="6" class="pr-2 mt-1">
              <AppLabel>ACCB Provider ID:</AppLabel>
            </v-col>
            <v-col cols="12" sm="6" class="mt-1">
              {{ licence?.accbProviderId ? licence?.accbProviderId : BLANK_FIELD }}
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="12" lg="6">
          <v-row no-gutters class="mr-2 my-2">
            <v-col cols="12" sm="6" class="pr-2 mt-1">
              <AppLabel>TDAD Funding Agreement Number:</AppLabel>
            </v-col>
            <v-col cols="12" sm="6" class="mt-1">
              {{ licence?.tdadFundingAgreementNumber ? licence?.tdadFundingAgreementNumber : BLANK_FIELD }}
            </v-col>
          </v-row>
        </v-col>
      </v-row>
      <v-row>
        <v-col class="pb-0">
          <h4 class="mb-2 text-decoration-underline">Category Details</h4>
        </v-col>
      </v-row>
      <v-row>
        <v-col class="pt-0">
          <v-expansion-panels v-model="panel" multiple>
            <v-expansion-panel v-for="licenceDetail in licence.licenceDetails" :key="licenceDetail.licenceDetailId" :value="licenceDetail.licenceDetailId">
              <v-expansion-panel-title>
                <AppLabel>{{ getLicenceTypeNameById(licenceDetail.licenceType) }}</AppLabel>
              </v-expansion-panel-title>
              <v-expansion-panel-text>
                <v-row no-gutters>
                  <v-col cols="12" md="6" lg="4" xl="3">
                    <v-row no-gutters class="mr-2 my-2">
                      <v-col cols="12" sm="6" xl="6" class="pr-2">
                        <AppLabel>Licensed Spaces:</AppLabel>
                      </v-col>
                      <v-col cols="12" sm="6" xl="6">{{ licenceDetail?.licenceSpaces }}</v-col>
                    </v-row>
                  </v-col>
                  <v-col cols="12" md="6" lg="5" xl="6">
                    <v-row no-gutters class="mr-2 my-2">
                      <v-col cols="12" sm="6" xl="4" class="pr-2">
                        <AppLabel>Weeks in Operation:</AppLabel>
                      </v-col>
                      <v-col cols="12" sm="6" xl="8">{{ licenceDetail?.weeksInOperation }}</v-col>
                    </v-row>
                  </v-col>
                  <v-col cols="12" md="6" lg="3" xl="3">
                    <v-row no-gutters class="mr-2 my-2">
                      <v-col cols="12" sm="6" xl="5" class="pr-2">
                        <AppLabel>Care Type:</AppLabel>
                      </v-col>
                      <v-col cols="12" sm="6" xl="7">{{ licenceDetail?.careType === 1 ? 'Full-Time' : 'Part-Time' }}</v-col>
                    </v-row>
                  </v-col>
                  <v-col cols="12" md="6" lg="4" xl="3">
                    <v-row no-gutters class="mr-2 my-2">
                      <v-col cols="12" sm="6" xl="6" class="pr-2">
                        <AppLabel>Operational Spaces:</AppLabel>
                      </v-col>
                      <v-col cols="12" sm="6" xl="6">{{ licenceDetail?.operationalSpaces }}</v-col>
                    </v-row>
                  </v-col>
                  <v-col cols="12" md="6" lg="5" xl="6">
                    <v-row no-gutters class="mr-2 my-2">
                      <v-col cols="12" sm="6" xl="4" class="pr-2">
                        <AppLabel>Days of Week:</AppLabel>
                      </v-col>
                      <v-col cols="12" sm="6" xl="8">{{ convertDaysToString(licenceDetail?.weekDays) }}</v-col>
                    </v-row>
                  </v-col>
                  <v-col cols="12" md="6" lg="3" xl="3">
                    <v-row no-gutters class="mr-2 my-2">
                      <v-col cols="12" sm="6" xl="5" class="pr-2">
                        <AppLabel>Overnight Care:</AppLabel>
                      </v-col>
                      <v-col cols="12" sm="6" xl="7">{{ licenceDetail?.overnightCare ? 'Yes' : 'No' }}</v-col>
                    </v-row>
                  </v-col>
                  <v-col cols="12" md="6" lg="4" xl="3">
                    <v-row no-gutters class="mr-2 my-2">
                      <v-col cols="12" sm="6" xl="6" class="pr-2">
                        <AppLabel>Enrolled Spaces:</AppLabel>
                      </v-col>
                      <v-col cols="12" sm="6" xl="6">{{ licenceDetail?.enrolledSpaces }}</v-col>
                    </v-row>
                  </v-col>
                  <v-col cols="12" md="6" lg="5" xl="6">
                    <v-row no-gutters class="mr-2 my-2">
                      <v-col cols="12" sm="6" xl="4" class="pr-2">
                        <AppLabel>Hours:</AppLabel>
                      </v-col>
                      <v-col cols="12" sm="6" xl="8">{{ licenceDetail?.operationFromTime }} - {{ licenceDetail?.operationToTime }}</v-col>
                    </v-row>
                  </v-col>
                  <v-col />
                  <v-col cols="12" md="6" lg="6" xl="6">
                    <v-row no-gutters class="mr-2 my-2">
                      <v-col cols="12" sm="auto" lg="auto" xl="auto">
                        <AppLabel>
                          Requires split classrooms
                          <v-tooltip content-class="tooltip" text="This is a placeholder message" top>
                            <template v-slot:activator="{ props }">
                              <v-icon size="large" v-bind="props">mdi-information-slab-circle-outline</v-icon>
                            </template>
                          </v-tooltip>
                          :
                        </AppLabel>
                      </v-col>
                      <v-col cols="12" sm="4" lg="3" xl="3" class="pl-4">
                        <AppYesNoInput v-model="licenceDetail.applyRoomSplitCondition" :disabled="readOnly" @input="update(licenceDetail)"></AppYesNoInput>
                      </v-col>
                    </v-row>
                  </v-col>
                  <v-col cols="12" md="6" lg="3" xl="4"></v-col>
                  <v-col v-if="licenceDetail.applyRoomSplitCondition" cols="12" class="pt-0">
                    <v-row no-gutters>
                      <v-col cols="12" sm="9" lg="9" xl="9" class="pt-0">
                        <v-textarea
                          v-model="licenceDetail.roomSplitDetails"
                          placeholder="Detailed description of request"
                          counter
                          maxlength="1000"
                          variant="outlined"
                          rows="4"
                          :rules="rules.required"
                          :readonly="readOnly"
                          @blur="update(licenceDetail)"></v-textarea>
                      </v-col>
                    </v-row>
                  </v-col>
                </v-row>
              </v-expansion-panel-text>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>

<script>
import AppLabel from '@/components/ui/AppLabel.vue'
import AppYesNoInput from '@/components/ui/AppYesNoInput.vue'
import rules from '@/utils/rules'
import { mapState } from 'pinia'
import { useAppStore } from '@/stores/app'

export default {
  components: { AppLabel, AppYesNoInput },
  props: {
    licence: {
      type: Object,
      required: true,
      default: () => {
        return {}
      },
    },
    readOnly: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['update', 'setDetailsComplete'],
  data() {
    return {
      panel: [],
      rules,
      isFormComplete: false,
    }
  },
  computed: {
    ...mapState(useAppStore, ['getLicenceTypeNameById', 'getHealthAuthorityNameById']),

    allLicenceDetailsID() {
      return this.licence?.licenceDetails?.map((licenceDetail) => licenceDetail.licenceDetailId)
    },

    healthAuthority() {
      return this.getHealthAuthorityNameById(this.licence?.healthAuthorityId)
    },
  },
  async created() {
    this.BLANK_FIELD = '- - - -'
    this.panel = this.allLicenceDetailsID
  },
  async mounted() {
    this.$emit('setDetailsComplete', this.licence?.licenceId, await this.$refs.form?.validate())
  },
  methods: {
    convertDaysToString(days) {
      const daysOfWeek = { 1: 'Monday', 2: 'Tuesday', 3: 'Wednesday', 4: 'Thursday', 5: 'Friday', 6: 'Saturday', 7: 'Sunday' }
      const operationalDays = days?.split(',')
      return operationalDays?.map((day) => daysOfWeek[day])?.join(', ')
    },
    async update(licenceDetail) {
      this.$emit('update', licenceDetail)

      //XXX this code needs to be validated twice in order to work properly. It's a mystery as to why that is required but it works for now
      const done = await this.$refs.form?.validate()

      this.$emit('setDetailsComplete', this.licence?.licenceId, await this.$refs.form?.validate())
    },
  },
}
</script>
