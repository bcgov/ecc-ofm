<template>
  <v-card class="my-4 pa-4 w-100" variant="outlined">
    <v-container fluid class="pa-0">
      <AppLabel>Not for Profit Information</AppLabel>
      <v-card variant="outlined" class="soft-outline px-2 py-6 my-4">
        <AppLabel>Date of Incorporation</AppLabel>
        <AppDateInput
          id="date-to"
          v-model="model.dateOfIncorporation"
          :rules="[...rules.required, rules.MMDDYYYY]"
          :max="todayDate"
          label="Select The Date"
          class="mt-6 mx-6" />
      </v-card>
      <v-card v-if="isReferenceLetterRequired" variant="outlined" class="soft-outline px-2 py-6 my-4 w-100">
        <v-row no-gutters>
          <AppLabel class="mr-4">Upload Documents</AppLabel>
          <v-tooltip
            content-class="tooltip"
            text="A letter from a community representative or agency that has knowledge about the sector and can demonstrate how the society provides services to support the local community."
            max-width="300px">
            <template #activator="{ props }">
              <v-icon size="large" v-bind="props">mdi-information-slab-circle-outline</v-icon>
            </template>
          </v-tooltip>
        </v-row>
        <v-card variant="outlined" class="soft-outline px-2 py-6 my-4 w-100">
          <AppDocumentUpload
            v-model="model.documentsToUpload"
            :uploaded-documents="model.uploadedDocuments"
            :document-type="DOCUMENT_TYPES.COMMUNITY_LETTER"
            :document-label="DOCUMENT_LABELS.COMMUNITY_LETTER"
            entity-name="accounts"
            :loading="loading"
            :rules="[...rules.required]"
            @delete-uploaded-document="deleteUploadedDocument"></AppDocumentUpload>
          <div v-if="!areDocumentsComplete">
            <AppMissingInfoError>
              {{ APPLICATION_ERROR_MESSAGES.DOCUMENT_UPLOAD_COMMUNITY_LETTER }}
            </AppMissingInfoError>
          </div>
        </v-card>
      </v-card>

      <v-card variant="outlined" class="soft-outline px-2 py-6 my-4 w-100">
        <AppLabel>Does your not-for-profit facility have an open membership?</AppLabel>
        <v-radio-group v-model="model.openMembership" :readonly="false" :rules="[...rules.required]">
          <v-row no-gutters>
            <v-col cols="12" sm="2" lg="1">
              <v-radio label="Yes" :value="1"></v-radio>
            </v-col>
            <v-col cols="12" sm="2" lg="1">
              <v-radio label="No" :value="0"></v-radio>
            </v-col>
          </v-row>
        </v-radio-group>
      </v-card>

      <v-card variant="outlined" class="soft-outline px-2 py-6 my-4 w-100">
        <AppLabel>Does your not-for-profit facility have elected, unpaid board members?</AppLabel>
        <v-radio-group v-model="model.boardMembersElected" :readonly="false" :rules="[...rules.required]">
          <v-row no-gutters>
            <v-col cols="12" sm="2" lg="1">
              <v-radio label="Yes" :value="1"></v-radio>
            </v-col>
            <v-col cols="12" sm="2" lg="1">
              <v-radio label="No" :value="0"></v-radio>
            </v-col>
          </v-row>
        </v-radio-group>
      </v-card>

      <v-card variant="outlined" class="soft-outline px-2 py-6 my-4 w-100">
        <AppLabel>Does your not-for-profit facility have board members selected from the entire membership?</AppLabel>
        <v-radio-group v-model="model.boardMembersSelectedMembership" :readonly="false" :rules="[...rules.required]">
          <v-row no-gutters>
            <v-col cols="12" sm="2" lg="1">
              <v-radio label="Yes" :value="1"></v-radio>
            </v-col>
            <v-col cols="12" sm="2" lg="1">
              <v-radio label="No" :value="0"></v-radio>
            </v-col>
          </v-row>
        </v-radio-group>
      </v-card>

      <v-card variant="outlined" class="soft-outline px-2 py-6 my-4 w-100">
        <AppLabel>Are the majority of the elected board members full time BC residents?</AppLabel>
        <v-radio-group v-model="model.boardMembersResidentsOfBC" :readonly="false" :rules="[...rules.required]">
          <v-row no-gutters>
            <v-col cols="12" sm="2" lg="1">
              <v-radio label="Yes" :value="1"></v-radio>
            </v-col>
            <v-col cols="12" sm="2" lg="1">
              <v-radio label="No" :value="0"></v-radio>
            </v-col>
          </v-row>
        </v-radio-group>
      </v-card>
    </v-container>
  </v-card>
</template>

<script>
import AppLabel from '@/components/ui/AppLabel.vue'
import AppDateInput from '@/components/ui/AppDateInput.vue'
import AppMissingInfoError from '@/components/ui/AppMissingInfoError.vue'
import alertMixin from '@/mixins/alertMixin'
import rules from '@/utils/rules'
import AppDocumentUpload from '@/components/ui/AppDocumentUpload.vue'
import moment from 'moment'
import { DOCUMENT_TYPES, DOCUMENT_LABELS, APPLICATION_ERROR_MESSAGES } from '@/utils/constants'
import { isEmpty, cloneDeep } from 'lodash'

export default {
  components: { AppLabel, AppDateInput, AppDocumentUpload, AppMissingInfoError },
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
    this.DOCUMENT_LABELS = DOCUMENT_LABELS
    this.APPLICATION_ERROR_MESSAGES = APPLICATION_ERROR_MESSAGES
    this.model = cloneDeep(this.organization)
  },
  methods: {
    deleteUploadedDocument(documentId) {
      const foundDoc = this.model.uploadedDocuments.findIndex((el) => el.documentId === documentId)
      if (foundDoc > -1) {
        this.model.uploadedDocuments.splice(foundDoc, 1)
        this.$emit('update', this.model)
        this.$emit('deleteDocument', documentId)
      }
    },
  },
}
</script>
