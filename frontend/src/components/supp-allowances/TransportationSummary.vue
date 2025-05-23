<template>
  <v-container fluid class="pa-2 pb-0">
    <div class="mt-4">
      <h4 class="text-decoration-underline">Transport</h4>
    </div>

    <v-card v-for="model in draftTransportModels" :key="model.supplementaryApplicationId ? model.supplementaryApplicationId : model.id" class="pb-0 my-8">
      <v-row class="pa-7">
        <v-col cols="11">
          <div class="">
            <AppLabel>Vehicle</AppLabel>
          </div>
        </v-col>
      </v-row>
      <v-divider class="mt-3"></v-divider>

      <AppAlertBanner v-if="model.isNextTerm" type="info">This Allowance application is for next year</AppAlertBanner>

      <v-row v-if="isModelComplete(model)" no-gutters class="mt-2 py-2">
        <v-col cols="12" lg="7" class="px-4">
          <v-col class="px-4">
            <v-row no-gutters>
              <v-col cols="6" xl="5" class="pt-2">
                <p>Vehicle Identification Number:</p>
              </v-col>
              <v-col cols="6" xl="7" class="pt-2 text-center">
                <p>{{ model.VIN }}</p>
              </v-col>
            </v-row>
          </v-col>
          <v-col class="px-4">
            <v-row no-gutters>
              <v-col cols="6" xl="5" class="pt-2">
                <p>Vehicle mileage at time of application (odometer reading):</p>
              </v-col>
              <v-col cols="6" xl="7" class="pt-2 text-center">
                <p>{{ model.odometer }} km</p>
              </v-col>
            </v-row>
          </v-col>
          <v-col class="px-4">
            <v-row no-gutters>
              <v-col cols="6" xl="5" class="pt-2">
                <p>Estimated Yearly KM:</p>
              </v-col>
              <v-col cols="6" xl="7" class="pt-2 text-center">
                <p>{{ model.estimatedMileage }} km</p>
              </v-col>
            </v-row>
          </v-col>
          <v-col class="px-4">
            <v-row no-gutters>
              <v-col cols="6" xl="5" class="pt-2">
                <p>Vehicle financing/Lease cost per month: (If any)</p>
              </v-col>
              <v-col cols="6" xl="7" class="pt-2 text-center">
                <p>${{ model.monthlyLease }}</p>
              </v-col>
            </v-row>
          </v-col>

          <v-col class="px-4">
            <v-row no-gutters>
              <v-col cols="6" xl="5" class="pt-2">
                <p>Retroactive Date Selected:</p>
              </v-col>
              <v-col v-if="model.retroactiveDate" cols="6" xl="7" class="pt-2 text-center">
                <p>{{ format.formatDateToLocale(model.retroactiveDate) }}</p>
              </v-col>
              <v-col v-else cols="6" xl="7" class="pt-2 text-center">
                <p>No date selected</p>
              </v-col>
            </v-row>
          </v-col>
        </v-col>

        <v-col cols="12" lg="5" class="pt-0 w-75">
          <div class="pa-6 greyBorder">
            <AppLabel>Uploaded documents:</AppLabel>
            <div class="mt-6">
              <p v-for="doc in model.uploadedDocuments" :key="doc.documentId">
                {{ doc.fileName }}
              </p>
            </div>
          </div>
        </v-col>
      </v-row>

      <v-row v-else>
        <v-col cols="12" class="px-4">
          <AppMissingInfoError :to="{ name: 'supp-allowances-form', params: { applicationGuid: $route.params.applicationGuid }, query: { nextTerm: model.isNextTerm } }">
            <template v-if="!model.VIN || !model.odometer || !model.estimatedMileage">
              {{ APPLICATION_ERROR_MESSAGES.SUPP_TRANSPORT }}
              <br />
              <br />
            </template>
            <template v-if="areDocumentsMissing(model)">
              {{ APPLICATION_ERROR_MESSAGES.DOCUMENT_UPLOAD }}
              <br />
              <br />
            </template>
            <template v-if="hasDuplicateVIN(model, allTransportModels)">
              {{ APPLICATION_ERROR_MESSAGES.SUPP_DUPLICATE_VIN }}
              <br />
              <br />
            </template>
          </AppMissingInfoError>
        </v-col>
      </v-row>
    </v-card>
  </v-container>
</template>

<script>
import AppAlertBanner from '@/components/ui/AppAlertBanner.vue'
import AppMissingInfoError from '@/components/ui/AppMissingInfoError.vue'
import AppLabel from '@/components/ui/AppLabel.vue'
import { APPLICATION_ERROR_MESSAGES } from '@/utils/constants'
import { hasDuplicateVIN } from '@/utils/common'
import format from '@/utils/format'

export default {
  components: { AppAlertBanner, AppMissingInfoError, AppLabel },
  props: {
    draftTransportModels: {
      type: Array,
      default: () => {
        return []
      },
      required: true,
    },
    allTransportModels: {
      type: Array,
      default: () => {
        return []
      },
      required: true,
    },
  },
  created() {
    this.APPLICATION_ERROR_MESSAGES = APPLICATION_ERROR_MESSAGES
    this.format = format
    this.hasDuplicateVIN = hasDuplicateVIN
  },
  methods: {
    areDocumentsMissing(model) {
      if (model.monthlyLease == 0) {
        return model.uploadedDocuments?.length < 1
      }
      return model.uploadedDocuments?.length < 2
    },
    isModelComplete(model) {
      return model.VIN && model.odometer && model.estimatedMileage && !this.areDocumentsMissing(model) && !hasDuplicateVIN(model, this.allTransportModels)
    },
  },
}
</script>

<style scoped>
.greyBorder {
  border: 1px solid #0000001a;
}
</style>
