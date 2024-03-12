<template>
  <v-row no-gutters class="mr-2 my-2">
    <v-col cols="12">
      <AppLabel>Eligibility:</AppLabel>
      Participants are eligible if using a designated vehicle to safely transport children:

      <v-row no-gutters>
        <v-col cols="12" class="ml-10 my-2">
          <ul>
            <li>Between school and their offsite child care location;</li>
            <li>
              To and from the child care location and a collective point of access where geographical distance or obstacle (e.g. a body of water) creates an ongoing barrier for families and
              Participants.
            </li>
          </ul>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
  <br />
  <v-row no-gutters class="mr-2 my-2">
    <v-col cols="12">
      <AppLabel>Eligible expenses:</AppLabel>
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

  <div v-for="(model, index) in models" :key="model.supplementaryApplicationId ? model.supplementaryApplicationId : model.id" @input="update(model)" class="">
    <v-row class="pa-7">
      <v-col cols="11">
        <div class="">
          <AppLabel>Vehicle {{ Number(index) + 1 }}</AppLabel>
        </div>
      </v-col>
      <v-col>
        <v-icon small @click="deleteModel(model)">mdi-delete</v-icon>
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
            <v-col cols="6" xl="7" align="center" class="px-2">
              <v-text-field v-model="model.VIN" required variant="outlined" density="compact" :disabled="readonly" maxlength="20"></v-text-field>
            </v-col>
          </v-row>
        </v-col>
        <v-col class="px-4">
          <v-row no-gutters>
            <v-col cols="6" xl="5" class="pt-2">
              <p>Vehicle usage in KM/month at time of Application:</p>
            </v-col>
            <v-col cols="6" xl="7" align="center" class="px-2">
              <v-text-field v-model="model.estimatedMileage" required type="number" variant="outlined" density="compact" :disabled="readonly" maxlength="20"></v-text-field>
            </v-col>
          </v-row>
        </v-col>
        <v-col class="px-4">
          <v-row no-gutters>
            <v-col cols="6" xl="5" class="pt-2">
              <p>Estimated mileage of the year:</p>
            </v-col>
            <v-col cols="6" xl="7" align="center" class="px-2">
              <v-text-field v-model="model.odometer" required type="number" variant="outlined" density="compact" :disabled="readonly" maxlength="20"></v-text-field>
            </v-col>
          </v-row>
        </v-col>
        <v-col class="px-4">
          <v-row no-gutters>
            <v-col cols="6" xl="5" class="pt-2">
              <p>Vehicle financing/Lease cost per month: (If any)</p>
            </v-col>
            <v-col cols="6" xl="7" align="center" class="px-2">
              <AppNumberInput v-model.lazy="model.monthlyLease" :format="monthlyLeaseFormat" required :disabled="readonly" prefix="$" maxlength="12" :rules="[rules.max(5000000)]"></AppNumberInput>
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
          <!-- <v-alert density="compact" v-if="showUploadDocumentsAlert" type="error" class="w-76 mt-1">
              Please upload at least one document. To proceed, invoke 'Add File' button, 'Select a file' to upload. Then 'Save' to complete the process.
            </v-alert> -->
        </div>
      </v-col>
    </v-row>

    <v-divider class="my-4"></v-divider>
  </div>

  <v-row class="d-flex flex-column align-end my-8">
    <AppButton id="add-vehicle" :primary="false" size="large" width="300px" @click="addModel()">+ Add another vehicle</AppButton>
  </v-row>
</template>

<script>
import AppLabel from '@/components/ui/AppLabel.vue'
import rules from '@/utils/rules'
import AppNumberInput from '@/components/ui/AppNumberInput.vue'
import AppButton from '@/components/ui/AppButton.vue'
import AppDocumentUpload from '@/components/ui/AppDocumentUpload.vue'
import { cloneDeep } from 'lodash'

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
  computed: {},
  watch: {
    transportModels: {
      handler(value) {
        this.models = cloneDeep(value)
      },
      deep: true,
    },
  },
  async created() {
    this.models = cloneDeep(this.transportModels)
  },
  methods: {
    update(model) {
      this.$emit('update', model)
    },
    addModel() {
      this.$emit('addModel')
    },
    deleteModel(model) {
      this.$emit('deleteModel', model)
    },
    deleteUploadedDocument(documentId) {
      this.$emit('deleteDocument', documentId)
    },
  },
}
</script>

<style scoped>
.greyBorder {
  border: 1px solid #0000001a;
}
</style>
