<template>
  <v-container fluid class="pa-2 pb-0">
    <div class="mt-4">
      <h4 class="text-decoration-underline">Transport</h4>
    </div>

    <div v-for="(model, index) in transportModels" :key="model.supplementaryApplicationId ? model.supplementaryApplicationId : model.id" @input="update(model)">
      <v-row class="pa-7">
        <v-col cols="11">
          <div class="">
            <AppLabel>Vehicle {{ Number(index) + 1 }}</AppLabel>
          </div>
        </v-col>
      </v-row>
      <v-divider class="my-3"></v-divider>
      <v-row v-if="model.VIN && model.odometer && model.estimatedMileage && model.uploadedDocuments?.length > 0" no-gutters class="mt-2 pt-2">
        <v-col cols="12" lg="7" class="px-4">
          <v-col class="px-4">
            <v-row no-gutters>
              <v-col cols="6" xl="5" class="pt-2">
                <p>VIN:</p>
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
          <AppMissingInfoError :to="{ name: 'supp-allowances-form', params: { applicationGuid: $route.params.applicationGuid } }">
            <slot v-if="!model.VIN || !model.odometer || !model.estimatedMileage">
              {{ APPLICATION_ERROR_MESSAGES.TRANSPORT }}
              <br />
              <br />
            </slot>
            <slot v-if="model.uploadedDocuments?.length === 0">
              {{ APPLICATION_ERROR_MESSAGES.DOCUMENT_UPLOAD }}
            </slot>
          </AppMissingInfoError>
        </v-col>
      </v-row>

      <v-divider class="my-4"></v-divider>
    </div>
  </v-container>
</template>

<script>
import AppMissingInfoError from '@/components/ui/AppMissingInfoError.vue'
import AppLabel from '@/components/ui/AppLabel.vue'
import { APPLICATION_ERROR_MESSAGES } from '@/utils/constants'

export default {
  components: { AppMissingInfoError, AppLabel },
  props: {
    transportModels: {
      type: Array,
      default: () => {
        return []
      },
    },
  },
  computed: {},
  created() {
    this.APPLICATION_ERROR_MESSAGES = APPLICATION_ERROR_MESSAGES
  },
  methods: {},
}
</script>

<style scoped>
.greyBorder {
  border: 1px solid #0000001a;
}
</style>
