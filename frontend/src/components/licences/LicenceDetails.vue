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
      <v-row no-gutters>
        <v-col class="pb-0">
          <h4 class="mb-2 text-decoration-underline">Type(s) of Service</h4>
        </v-col>
      </v-row>
      <v-skeleton-loader :loading="loading" type="table-tbody">
        <v-row no-gutters>
          <v-col class="pt-0">
            <v-expansion-panels v-model="panel" multiple>
              <v-expansion-panel v-for="licenceDetail in licence.licenceDetails" :key="licenceDetail.licenceDetailId" :value="licenceDetail.licenceDetailId">
                <v-expansion-panel-title>
                  <AppLabel>{{ getLicenceTypeNameById(licenceDetail.licenceType) }}</AppLabel>
                </v-expansion-panel-title>
                <v-expansion-panel-text>
                  <v-row no-gutters>
                    <v-col cols="12" lg="3" :class="editable ? 'mb-4' : ''">
                      <v-row no-gutters>
                        <v-col cols="12" sm="5" lg="7">
                          <AppLabel>Licensed Spaces:</AppLabel>
                        </v-col>
                        <v-col cols="12" sm="7" lg="5">{{ licenceDetail?.licenceSpaces }}</v-col>
                      </v-row>
                    </v-col>
                    <v-col cols="12" lg="6" class="px-lg-4">
                      <v-row no-gutters>
                        <v-col cols="12" sm="5" lg="4">
                          <AppLabel>Operational Spaces:</AppLabel>
                        </v-col>
                        <v-col cols="12" sm="7" lg="8">
                          <AppNumberInput
                            v-if="editable"
                            v-model.lazy="licenceDetail.operationalSpaces"
                            :format="SPACES_NUMBER_FORMAT"
                            maxlength="4"
                            max-width="150px"
                            :rules="[...rules.required, rules.max(1000)]"
                            :hide-details="readOnly"
                            :disabled="readOnly"
                            @update:modelValue="update(licenceDetail)" />
                          <span v-else>{{ licenceDetail?.operationalSpaces }}</span>
                        </v-col>
                      </v-row>
                    </v-col>
                    <v-col cols="12" lg="3">
                      <v-row no-gutters>
                        <v-col cols="12" sm="5" lg="4" xl="3">
                          <AppLabel>Enrolled Spaces:</AppLabel>
                        </v-col>
                        <v-col cols="12" sm="7" lg="8" xl="9">
                          <AppNumberInput
                            v-if="editable"
                            v-model.lazy="licenceDetail.enrolledSpaces"
                            :format="SPACES_NUMBER_FORMAT"
                            maxlength="4"
                            max-width="150px"
                            :rules="[...rules.required, rules.max(1000)]"
                            :hide-details="readOnly"
                            :disabled="readOnly"
                            @update:modelValue="update(licenceDetail)" />
                          <span v-else>{{ licenceDetail?.enrolledSpaces }}</span>
                        </v-col>
                      </v-row>
                    </v-col>
                  </v-row>
                  <v-row no-gutters>
                    <v-col cols="12" lg="3">
                      <v-row no-gutters>
                        <v-col cols="12" sm="5" lg="7">
                          <AppLabel>Weeks in Operation:</AppLabel>
                        </v-col>
                        <v-col cols="12" sm="7" lg="5">
                          <AppNumberInput
                            v-if="editable"
                            v-model.lazy="licenceDetail.weeksInOperation"
                            :format="WEEK_NUMBER_FORMAT"
                            maxlength="2"
                            max-width="150px"
                            :rules="[...rules.required, rules.max(52)]"
                            :hide-details="readOnly"
                            :disabled="readOnly"
                            @update:modelValue="update(licenceDetail)" />
                          <span v-else>{{ licenceDetail?.weeksInOperation }}</span>
                        </v-col>
                      </v-row>
                    </v-col>
                    <v-col cols="12" lg="6" class="px-lg-4">
                      <v-row no-gutters>
                        <v-col cols="12" sm="5" lg="4">
                          <AppLabel>Days of Week:</AppLabel>
                        </v-col>
                        <v-col cols="12" sm="7" lg="8">
                          <v-select
                            v-if="editable"
                            v-model.lazy="licenceDetail.weekDays"
                            :items="DAYS_OF_WEEK"
                            :rules="rules.required"
                            :hide-details="readOnly"
                            :disabled="readOnly"
                            variant="outlined"
                            chips
                            multiple
                            @blur="update(licenceDetail)">
                            <template #prepend-item>
                              <v-list-item title="Select All" @click="toggleAllDays(licenceDetail)">
                                <template #prepend>
                                  <v-checkbox-btn
                                    :color="someDaysSelected(licenceDetail?.weekDays) ? '#003366' : undefined"
                                    :indeterminate="someDaysSelected(licenceDetail?.weekDays) && !allDaysSelected(licenceDetail?.weekDays)"
                                    :model-value="someDaysSelected(licenceDetail?.weekDays)"></v-checkbox-btn>
                                </template>
                              </v-list-item>
                              <v-divider class="mt-2"></v-divider>
                            </template>
                          </v-select>
                          <span v-else>{{ getDayNames(licenceDetail?.weekDays) }}</span>
                        </v-col>
                      </v-row>
                    </v-col>
                    <v-col cols="12" lg="3">
                      <v-row no-gutters>
                        <v-col cols="12" sm="5" lg="4" xl="3">
                          <AppLabel>Hours:</AppLabel>
                        </v-col>
                        <v-col cols="12" sm="7" lg="8" xl="9">
                          <v-row no-gutters v-if="editable">
                            <AppTimeInput
                              v-model="licenceDetail.operationFromTime"
                              :rules="rules.required"
                              :disabled="readOnly"
                              :hide-details="readOnly"
                              label="From"
                              min-width="150px"
                              max-width="150px"
                              class="pr-2"
                              @update:modelValue="update(licenceDetail)" />
                            <AppTimeInput
                              v-model="licenceDetail.operationToTime"
                              :rules="[...rules.required, rules.validHourTo(licenceDetail.operationFromTime)]"
                              :disabled="readOnly"
                              :hide-details="readOnly"
                              label="To"
                              min-width="150px"
                              max-width="150px"
                              class="pr-2"
                              @update:modelValue="update(licenceDetail)" />
                          </v-row>
                          <span v-else>{{ licenceDetail?.operationFromTime }} - {{ licenceDetail?.operationToTime }}</span>
                        </v-col>
                      </v-row>
                    </v-col>
                  </v-row>
                  <v-row no-gutters>
                    <v-col cols="12" lg="3">
                      <v-row no-gutters :class="editable ? 'mt-2' : ''">
                        <v-col cols="12" sm="5" lg="7">
                          <AppLabel>Care Type:</AppLabel>
                        </v-col>
                        <v-col cols="12" sm="7" lg="5">{{ licenceDetail?.careType === 1 ? 'Full-Time' : 'Part-Time' }}</v-col>
                      </v-row>
                    </v-col>
                    <v-col cols="12" lg="6" class="px-lg-4">
                      <v-row no-gutters :class="editable ? 'mt-2' : ''">
                        <v-col cols="12" sm="5" lg="4">
                          <AppLabel>Overnight Care:</AppLabel>
                        </v-col>
                        <v-col cols="12" sm="7" lg="8">{{ licenceDetail?.overnightCare ? 'Yes' : 'No' }}</v-col>
                      </v-row>
                    </v-col>
                  </v-row>
                  <v-row no-gutters :class="editable ? 'mt-2' : 'mt-0'">
                    <div>
                      <AppLabel class="mr-1">Requires split classrooms</AppLabel>
                      <v-tooltip
                        content-class="tooltip"
                        max-width="300px"
                        text="A situation where children are divided into different rooms due to physical limitations of the building and child-to-staff ratio requirements. This can affect the staffing ratio compared to keeping the group together in one room."
                        top>
                        <template v-slot:activator="{ props }">
                          <v-icon size="large" v-bind="props">mdi-information-slab-circle-outline</v-icon>
                        </template>
                      </v-tooltip>
                      :
                    </div>
                    <AppYesNoInput v-model="licenceDetail.applyRoomSplitCondition" :disabled="readOnly" class="ml-sm-2" @input="update(licenceDetail)" />
                  </v-row>
                  <v-row>
                    <v-col cols="12" lg="8">
                      <v-textarea
                        v-if="licenceDetail.applyRoomSplitCondition"
                        v-model.trim="licenceDetail.roomSplitDetails"
                        placeholder="Detailed description of request"
                        counter
                        maxlength="1000"
                        variant="outlined"
                        rows="4"
                        :rules="rules.required"
                        :disabled="readOnly"
                        :hide-details="readOnly"
                        @blur="update(licenceDetail)" />
                    </v-col>
                  </v-row>
                </v-expansion-panel-text>
              </v-expansion-panel>
            </v-expansion-panels>
          </v-col>
        </v-row>
      </v-skeleton-loader>
    </v-container>
  </v-form>
</template>

<script>
import { mapState } from 'pinia'

import AppLabel from '@/components/ui/AppLabel.vue'
import AppNumberInput from '@/components/ui/AppNumberInput.vue'
import AppTimeInput from '@/components/ui/AppTimeInput.vue'
import AppYesNoInput from '@/components/ui/AppYesNoInput.vue'
import rules from '@/utils/rules'
import { useAppStore } from '@/stores/app'
import { BLANK_FIELD, DAYS_OF_WEEK } from '@/utils/constants'

export default {
  name: 'LicenceDetails',
  components: { AppLabel, AppNumberInput, AppTimeInput, AppYesNoInput },
  props: {
    loading: {
      type: Boolean,
      default: false,
    },
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
    editable: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['update', 'setDetailsComplete'],
  data() {
    return {
      panel: [],
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

  created() {
    this.BLANK_FIELD = BLANK_FIELD
    this.panel = this.allLicenceDetailsID
    this.DAYS_OF_WEEK = DAYS_OF_WEEK
    this.SPACES_NUMBER_FORMAT = {
      min: 0,
      separator: ',',
      precision: 0,
    }
    this.WEEK_NUMBER_FORMAT = {
      min: 1,
      separator: ',',
      precision: 0,
    }
    this.rules = rules
  },

  async mounted() {
    this.$emit('setDetailsComplete', this.licence?.licenceId, await this.$refs.form?.validate())
  },

  updated() {
    if (this.editable) {
      this.licence?.licenceDetails?.forEach((licenceDetail) => (licenceDetail.weekDays = this.convertStringDaysToArray(licenceDetail.weekDays)))
    }
  },

  methods: {
    getDayNames(days) {
      const dayNames = DAYS_OF_WEEK.map((day) => day.title)
      /* eslint-disable indent */
      return typeof days === 'string'
        ? days
            ?.split(',')
            ?.map((day) => dayNames[Number(day) - 1])
            ?.join(', ')
        : days
      /* eslint-enable indent */
    },

    convertStringDaysToArray(days) {
      return typeof days === 'string' ? days?.split(',')?.map((day) => Number(day)) : days
    },

    someDaysSelected(selectedDays) {
      return selectedDays?.length > 0
    },

    allDaysSelected(selectedDays) {
      return selectedDays?.length === DAYS_OF_WEEK?.length
    },

    async update(licenceDetail) {
      this.$emit('update', licenceDetail)

      //XXX this code needs to be validated twice in order to work properly. It's a mystery as to why that is required but it works for now
      await this.$refs.form?.validate()

      this.$emit('setDetailsComplete', this.licence?.licenceId, await this.$refs.form?.validate())
    },

    toggleAllDays(licenceDetail) {
      if (this.allDaysSelected(licenceDetail?.weekDays)) {
        licenceDetail.weekDays = []
      } else {
        licenceDetail.weekDays = DAYS_OF_WEEK.map((day) => day.value)
      }
    },
  },
}
</script>
