<template>
  <v-row no-gutters class="mr-2 my-2">
    <v-col cols="12">
      <AppLabel>Eligibility:</AppLabel>
      Participants are eligible if using a designated vehicle to safely transport children:

      <v-row no-gutters>
        <v-col cols="12" class="mr-2 my-2">
          Between school and their offsite child care location;
          <br />
          To and from the child care location and a collective point of access where geographical distance or obstacle (e.g. a body of water) creates an ongoing barrier for families and Participants.
        </v-col>
      </v-row>
    </v-col>
  </v-row>
  <br />
  <v-row no-gutters class="mr-2 my-2">
    <v-col cols="12">
      <AppLabel>Eligible expenses:</AppLabel>
      <br />
      Mileage of the Participant's designated vehicle will be reimbursed at the B.C. government standard mileage rate for private vehicles. This includes
      <strong>funding for the Participant's routine vehicle costs, including financing costs, fuel, insurance, depreciation, and routine maintenance.</strong>
      The Participant's actual lease or financing costs for the designed vehicle used to transport children for the purpose stated in the Eligibility section above. The Participant is required to
      submit supporting information and documentation relating to the actual mileage and lease/purchase costs of the designated vehicle to the Province.
    </v-col>
  </v-row>
  <br />
  <br />
  <v-row no-gutters class="mr-2 my-2">
    <v-col cols="12">
      <AppLabel>Ineligible expenses include:</AppLabel>
      Travel related to operations (e.g., grocery store), driver wages, other transportation, tickets or traffic fines, licensing costs.
    </v-col>
  </v-row>
  <v-divider class="my-5"></v-divider>

  <div v-for="(model, index) in models" :key="model.supplementaryApplicationId ? model.supplementaryApplicationId : model.id" @input="update(model)">
    <v-row class="pa-7">
      <v-col cols="1">
        <AppLabel>Vehicle {{ Number(index) + 1 }}</AppLabel>
      </v-col>
      <v-col>
        <v-icon large @click="deleteModel(model, index)" class="mt-n2">mdi-delete-forever</v-icon>
      </v-col>
    </v-row>
    <v-divider class="my-3"></v-divider>
    <v-row no-gutters class="mt-2 pt-2">
      <v-col cols="12" lg="6" class="px-4">
        <v-col class="px-4">
          <v-row no-gutters>
            <v-col cols="6" xl="5" class="pt-2">
              <p>VIN:</p>
            </v-col>
            <v-col cols="6" xl="7" class="pt-2 text-center">
              <v-text-field v-model="model.VIN" required variant="outlined" density="compact" :rules="rules.required" :disabled="readonly" maxlength="17"></v-text-field>
            </v-col>
          </v-row>
        </v-col>
        <v-col class="px-4">
          <v-row no-gutters>
            <v-col cols="6" xl="5" class="pt-2">
              <p>Vehicle mileage at time of application (odometer reading):</p>
            </v-col>
            <v-col cols="6" xl="7" class="pt-2 text-center">
              <v-text-field
                v-model="model.odometer"
                required
                type="number"
                suffix="km"
                variant="outlined"
                density="compact"
                :rules="[rules.max(999999), ...rules.required]"
                :disabled="readonly"></v-text-field>
            </v-col>
          </v-row>
        </v-col>
        <v-col class="px-4">
          <v-row no-gutters>
            <v-col cols="6" xl="5" class="pt-2">
              <p>Estimated Yearly KM:</p>
            </v-col>
            <v-col cols="6" xl="7" class="pt-2 text-center">
              <v-text-field
                v-model="model.estimatedMileage"
                required
                type="number"
                suffix="km"
                variant="outlined"
                density="compact"
                :rules="[rules.max(999999), ...rules.required]"
                :disabled="readonly"></v-text-field>
            </v-col>
          </v-row>
        </v-col>
        <v-col class="px-4">
          <v-row no-gutters>
            <v-col cols="6" xl="5" class="pt-2">
              <p>Vehicle financing/Lease cost per month: (If any)</p>
            </v-col>
            <v-col cols="6" xl="7" class="pt-2 text-center">
              <AppNumberInput v-model.lazy="model.monthlyLease" :format="monthlyLeaseFormat" :disabled="readonly" prefix="$" maxlength="6"></AppNumberInput>
            </v-col>
          </v-row>
        </v-col>
      </v-col>
      <v-col cols="12" lg="6" class="pt-0 w-75">
        <div class="pa-6 greyBorder">
          <AppLabel>Upload supporting documents:</AppLabel>
          <ul class="ml-7">
            <li>Picture of your odometer at the time of this application.</li>
            <li>Your lease / finance payment schedule</li>
          </ul>
          <AppDocumentUpload
            id="application-document-upload"
            :key="model.supplementaryApplicationId ? model.supplementaryApplicationId : model.id"
            v-model="model.documentsToUpload"
            entityName="ofm_allowances"
            :readonly="readonly"
            :uploadedDocuments="model.uploadedDocuments"
            @deleteUploadedDocument="deleteUploadedDocument" />

          <div v-if="areDocumentsMissing(model)">
            <v-row class="my-5">
              <v-icon size="large" class="alert-icon pb-1 ml-5">mdi-alert-circle</v-icon>
              <p class="text-error ml-2">You must upload all Supporting Documents</p>
            </v-row>
          </div>
        </div>
      </v-col>
    </v-row>

    <v-divider class="my-4"></v-divider>
  </div>

  <v-row class="d-flex flex-column align-end my-8">
    <AppButton v-if="isAddButtonEnabled" id="add-vehicle" :primary="false" size="large" width="300px" @click="addModel()">+ Add another vehicle</AppButton>
  </v-row>
</template>

<script>
import AppLabel from '@/components/ui/AppLabel.vue'
import rules from '@/utils/rules'
import AppNumberInput from '@/components/ui/AppNumberInput.vue'
import AppButton from '@/components/ui/AppButton.vue'
import AppDocumentUpload from '@/components/ui/AppDocumentUpload.vue'
import { cloneDeep } from 'lodash'
import { uuid } from 'vue-uuid'
import { SUPPLEMENTARY_TYPES } from '@/utils/constants'

export default {
  components: { AppLabel, AppNumberInput, AppButton, AppDocumentUpload },
  props: {
    transportModels: {
      type: Array,
      required: true,
      default: () => {
        return []
      },
    },
  },
  emits: ['update', 'addModel', 'deleteModel', 'deleteDocument'],
  data() {
    return {
      panel: [],
      models: [],
      rules,
      readonly: false, //update later when we have submitted forms
      monthlyLeaseFormat: {
        nullValue: '0.00',
        min: 0,
        decimal: '.',
        separator: ',',
        precision: 2,
      },
    }
  },
  computed: {
    isAddButtonEnabled() {
      return this.models?.length < this.MAX_TRANSPORT_APPLICATIONS
    },
  },
  async created() {
    this.models = cloneDeep(this.transportModels)
    this.MAX_TRANSPORT_APPLICATIONS = 10
  },
  methods: {
    update(model) {
      this.$emit('update', model)
    },
    addModel() {
      const transportModel = {
        monthlyLease: 0.0,
        estimatedMileage: null,
        odometer: null,
        VIN: null,
        supplementaryApplicationId: undefined,
        supplementaryType: SUPPLEMENTARY_TYPES.TRANSPORT,
        uploadedDocuments: [],
        documentsToUpload: [],
        id: uuid.v1(),
      }

      this.models.push(transportModel)
      this.$emit('addModel', transportModel)
    },
    deleteModel(model, index) {
      this.models.splice(index, 1)
      this.$emit('deleteModel', model)
    },
    deleteUploadedDocument(documentId) {
      for (const model of this.models) {
        if (!model.uploadedDocuments) {
          continue
        }
        const foundDoc = model.uploadedDocuments.find((el) => el.documentId === documentId)
        if (!foundDoc) {
          continue
        }
        model.uploadedDocuments.splice(model.uploadedDocuments.indexOf(foundDoc), 1)
        this.$emit('update', model)
        break
      }
      this.$emit('deleteDocument', documentId)
    },
    areDocumentsMissing(model) {
      if (model.monthlyLease == 0) {
        return model.documentsToUpload?.length === 0 && model.uploadedDocuments?.length === 0
      }
      return model.documentsToUpload?.length + model.uploadedDocuments?.length < 2
    },
  },
}
</script>

<style scoped>
.greyBorder {
  border: 1px solid #0000001a;
}
</style>
