<template>
  <v-skeleton-loader :loading="loading" type="table-tbody">
    <v-card class="my-4 pa-4 w-100" variant="outlined">
      <v-container fluid class="pa-0">
        <AppLabel>Not for Profit Information</AppLabel>
        <v-card variant="outlined" class="card-outline px-2 py-6 my-4">
          <v-row no-gutters>
            <v-col>
              <AppLabel>Date of Incorporation</AppLabel>
            </v-col>
          </v-row>
          <AppDateInput id="date-to" v-model="model.dateOfIncorporation" :rules="[...rules.required, rules.MMDDYYYY]" :max="todayDate" :disabled="false" label="Select The Date" class="mt-6 mx-6" />
        </v-card>
        <v-card v-if="isReferenceLetterRequired" variant="outlined" class="card-outline px-2 py-6 my-4 w-100">
          <v-row no-gutters>
            <v-col>
              <AppLabel>Upload Documents</AppLabel>
            </v-col>
          </v-row>
          <v-card variant="outlined" class="card-outline px-2 py-6 my-4 w-75">
            <v-row>
              <v-col class="">
                <AppLabel>Letter of Reference for Community Support</AppLabel>
              </v-col>
              <v-col>
                <v-tooltip
                  content-class="tooltip"
                  text="A letter from a community representative or agency that has knowledge about the sector and can demonstrate how the society provides services to support the local community."
                  max-width="300px">
                  <template #activator="{ props }">
                    <v-icon size="large" v-bind="props">mdi-information-slab-circle-outline</v-icon>
                  </template>
                </v-tooltip>
              </v-col>
            </v-row>
            <AppDocumentUpload
              v-model="model.documentsToUpload"
              :uploaded-documents="model.uploadedDocuments"
              :document-type="DOCUMENT_TYPES.COMMUNITY_LETTER"
              entity-name="accounts"
              :disabled="false"
              :loading="loading"
              :rules="[...rules.required]"
              @delete-uploaded-document="deleteUploadedDocument"></AppDocumentUpload>
            <div v-if="!areDocumentsComplete">
              <v-row class="my-5">
                <v-icon size="large" class="alert-icon pb-1 ml-5">mdi-alert-circle</v-icon>
                <p class="text-error ml-2">You must upload a Community Support Letter</p>
              </v-row>
            </div>
          </v-card>
        </v-card>
        <v-card variant="outlined" class="card-outline px-2 py-6 my-4 w-100">
          <v-row no-gutters>
            <v-col class="">
              <AppLabel>Does your facility's not-for-profit have an open membership?</AppLabel>
            </v-col>
          </v-row>
          <v-row no-gutters>
            <v-col>
              <v-radio-group v-model="model.openMembership" :readonly="false" :rules="[...rules.required]" hide-details>
                <v-row no-gutters>
                  <v-col cols="12" sm="2" md="1">
                    <v-radio label="Yes" :value="1"></v-radio>
                  </v-col>
                  <v-col cols="12" sm="2" md="1">
                    <v-radio label="No" :value="0"></v-radio>
                  </v-col>
                </v-row>
              </v-radio-group>
            </v-col>
          </v-row>
        </v-card>

        <v-card variant="outlined" class="card-outline px-2 py-6 my-4 w-100">
          <v-row no-gutters>
            <v-col class="">
              <AppLabel>Does your facility's not-for-profit have elected, unpaid board members?</AppLabel>
            </v-col>
          </v-row>
          <v-row no-gutters>
            <v-col>
              <v-radio-group v-model="model.boardMembersElected" :readonly="false" :rules="[...rules.required]" hide-details>
                <v-row no-gutters>
                  <v-col cols="12" sm="2" md="1">
                    <v-radio label="Yes" :value="1"></v-radio>
                  </v-col>
                  <v-col cols="12" sm="2" md="1">
                    <v-radio label="No" :value="0"></v-radio>
                  </v-col>
                </v-row>
              </v-radio-group>
            </v-col>
          </v-row>
        </v-card>
        <v-card variant="outlined" class="card-outline px-2 py-6 my-4 w-100">
          <v-row no-gutters>
            <v-col class="">
              <AppLabel>Does your facility's not-for-profit have board members selected from the entire membership?</AppLabel>
            </v-col>
          </v-row>
          <v-row no-gutters>
            <v-col>
              <v-radio-group v-model="model.boardMembersSelectedMembership" :readonly="false" :rules="[...rules.required]" hide-details>
                <v-row no-gutters>
                  <v-col cols="12" sm="2" md="1">
                    <v-radio label="Yes" :value="1"></v-radio>
                  </v-col>
                  <v-col cols="12" sm="2" md="1">
                    <v-radio label="No" :value="0"></v-radio>
                  </v-col>
                </v-row>
              </v-radio-group>
            </v-col>
          </v-row>
        </v-card>
        <v-card variant="outlined" class="card-outline px-2 py-6 my-4 w-100">
          <v-row no-gutters>
            <v-col class="">
              <AppLabel>Are the majority of the elected board members full time BC residents?</AppLabel>
            </v-col>
          </v-row>
          <v-row no-gutters>
            <v-col>
              <v-radio-group v-model="model.boardMembersResidentsOfBC" :readonly="false" :rules="[...rules.required]" hide-details>
                <v-row no-gutters>
                  <v-col cols="12" sm="2" md="1">
                    <v-radio label="Yes" :value="1"></v-radio>
                  </v-col>
                  <v-col cols="12" sm="2" md="1">
                    <v-radio label="No" :value="0"></v-radio>
                  </v-col>
                </v-row>
              </v-radio-group>
            </v-col>
          </v-row>
        </v-card>
      </v-container>
    </v-card>
  </v-skeleton-loader>
</template>

<script>
import AppLabel from '@/components/ui/AppLabel.vue'
import AppDateInput from '@/components/ui/AppDateInput.vue'
import alertMixin from '@/mixins/alertMixin'
import rules from '@/utils/rules'
import AppDocumentUpload from '@/components/ui/AppDocumentUpload.vue'
import moment from 'moment'
import { DOCUMENT_TYPES } from '@/utils/constants'
import { isEmpty, cloneDeep } from 'lodash'

export default {
  components: { AppLabel, AppDateInput, AppDocumentUpload },
  mixins: [alertMixin],
  props: {
    organization: {
      type: Object,
      required: true,
      default: () => {
        return {}
      },
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['update', 'deleteDocument', 'documentsComplete'],
  data() {
    return {
      choice: undefined,
      selectedDate: undefined,
      model: undefined,
      todayDate: new Date().toISOString().slice(0, 10),
    }
  },
  computed: {
    isReferenceLetterRequired() {
      const pastDate = moment().subtract(4, 'years').startOf('day')
      const modelDate = moment(this.model?.dateOfIncorporation).startOf('day')
      return pastDate < modelDate
    },
    areDocumentsComplete() {
      if (this.isReferenceLetterRequired) {
        return !isEmpty(this.model.documentsToUpload) || !isEmpty(this.model.uploadedDocuments)
      }
      return true
    },
  },
  watch: {
    model: {
      handler(value) {
        this.$emit('update', value)
        this.$emit('documentsComplete', this.areDocumentsComplete)
      },
      deep: true,
    },
  },
  async created() {
    this.rules = rules
    this.DOCUMENT_TYPES = DOCUMENT_TYPES
    this.model = cloneDeep(this.organization)
  },
  methods: {
    deleteUploadedDocument(documentId) {
      const foundDoc = this.model.uploadedDocuments.find((el) => el.documentId === documentId)
      this.model.uploadedDocuments.splice(this.model.uploadedDocuments.indexOf(foundDoc), 1)
      this.$emit('update', this.model)
      this.$emit('deleteDocument', documentId)
    },
  },
}
</script>

<style scoped>
.card-outline {
  border: 1px solid #dee2e6 !important;
}
</style>
