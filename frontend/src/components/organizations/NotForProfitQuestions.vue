<template>
  <v-card class="my-4 pa-4" variant="outlined">
    <v-skeleton-loader :loading="loading" type="table-tbody">
      <v-container fluid class="pa-0">
        <AppLabel>Not for Profit Information</AppLabel>
        <v-card variant="outlined" class="card-outline px-2 py-6 my-4 w-100">
          <v-row no-gutters>
            <v-col class="">
              <AppLabel>Date of Incorporation</AppLabel>
            </v-col>
          </v-row>
          <AppDateInput
            id="date-to"
            v-model="model.dateOfIncorporation"
            :rules="[...rules.required, rules.MMDDYYYY]"
            :disabled="false"
            :hide-details="loading"
            label="Select The Date"
            class="mt-6 mx-6" />
        </v-card>

        <v-card v-if="isReferenceLetterRequired" variant="outlined" class="card-outline px-2 py-6 my-4 w-100">
          <v-row no-gutters>
            <v-col class="">
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
                  <template v-slot:activator="{ props }">
                    <v-icon size="large" v-bind="props">mdi-information-slab-circle-outline</v-icon>
                  </template>
                </v-tooltip>
              </v-col>
            </v-row>
            <AppDocumentUpload
              v-model="documentsToUpload"
              :uploadedDocuments="uploadedDocuments"
              :entityName="DOCUMENT_TYPES.COMMUNITY_LETTER"
              :disabled="false"
              :loading="loading"
              :rules="[...rules.required, rules.phone]"></AppDocumentUpload>
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
    </v-skeleton-loader>
  </v-card>
</template>

<script>
import AppLabel from '@/components/ui/AppLabel.vue'
import AppDateInput from '@/components/ui/AppDateInput.vue'
import rules from '@/utils/rules'
import AppDocumentUpload from '@/components/ui/AppDocumentUpload.vue'
import moment from 'moment'
import DocumentService from '@/services/documentService'
import { DOCUMENT_TYPES } from '@/utils/constants'

export default {
  components: { AppLabel, AppDateInput, AppDocumentUpload },
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
  emits: ['update'],
  data() {
    return {
      choice: undefined,
      selectedDate: undefined,
      model: undefined,
      documentsToUpload: [],
      uploadedDocuments: [],
    }
  },
  computed: {
    isReferenceLetterRequired() {
      const pastDate = moment().subtract(4, 'years').startOf('day')

      const modelDate = moment(this.model?.dateOfIncorporation).startOf('day')

      return pastDate < modelDate
    },
  },
  watch: {
    model: {
      handler(value) {
        this.$emit('update', value)
      },
      deep: true,
    },
  },
  async created() {
    this.rules = rules
    this.model = { ...this.organization }
    this.DOCUMENT_TYPES = DOCUMENT_TYPES
    await this.getCommunitySupportDocs()
  },
  methods: {
    async getCommunitySupportDocs() {
      try {
        this.uploadedDocuments = await DocumentService.getDocuments(this.organization.organizationId).filter((doc) => doc.documentType === DOCUMENT_TYPES.COMMUNITY_LETTER)
      } catch (error) {
        this.setFailureAlert("Failed to get organization's Inclusion Policy Document(s)", error)
        return
      }
    },
  },
}
</script>

<style scoped>
.card-outline {
  border: 1px solid #dee2e6 !important;
}
</style>
