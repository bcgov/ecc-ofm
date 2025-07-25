<template>
  <v-container fluid class="pa-0">
    <v-form ref="form" v-model="isValidForm">
      <v-row>
        <v-col v-if="documentLabel || documentType" cols="12" sm="7" class="pb-0">
          <AppLabel>{{ documentLabel ?? documentType }}</AppLabel>
          <v-btn v-if="$slots.exampleText" class="example-button" variant="plain" @click="toggleExampleDialog">View Example</v-btn>
          <p v-if="documentHelpText" class="text-sm text-muted mt-1">{{ documentHelpText }}</p>
        </v-col>
        <v-col cols="12" :sm="documentType ? '5' : '12'" :class="documentType ? 'd-flex flex-column align-end pr-4' : ''">
          <div v-if="!documentType">{{ SUPPORTED_DOCUMENTS_MESSAGE }}</div>
          <AppButton v-if="showAddFileButton" id="add-new-file" :disabled="disabled" :primary="false" size="large" class="add-file-button" @click="addFile">Add File</AppButton>
        </v-col>
      </v-row>
      <div v-if="documents.length > 0" class="mt-6">
        <v-row v-for="item in documents" :key="item.id" no-gutters>
          <v-col cols="12" md="4" class="pr-4">
            <v-file-input
              v-model="item.file"
              label="Select a file"
              prepend-icon="mdi-file-upload"
              :rules="[...fileRules]"
              :accept="fileExtensionAccept"
              :disabled="loading"
              @update:model-value="validateFile(item.id)"></v-file-input>
          </v-col>
          <v-col cols="11" md="7" class="pr-4">
            <v-text-field v-model.trim="item.description" :disabled="loading" placeholder="Enter a description (Optional)" counter maxlength="1000" dense clearable></v-text-field>
          </v-col>
          <v-col v-if="!loading && !readonly" cols="1" class="pt-3">
            <v-icon small @click="deleteFile(item.id)">mdi-delete</v-icon>
          </v-col>
        </v-row>
      </div>
      <div v-if="uploadedDocuments.length > 0" class="mt-6 mx-4 mx-md-8 mx-lg-12">
        <AppLabel v-if="!documentType">Uploaded Documents</AppLabel>
        <v-data-table :headers="headersUploadedDocuments" :items="uploadedDocuments" item-key="documentId" items-per-page="-1" density="compact">
          <template #item.actionButtons="{ item }">
            <v-icon v-if="!loading && !readonly" small @click="$emit('deleteUploadedDocument', item.documentId, documentType)">mdi-delete</v-icon>
          </template>
          <template #bottom><!-- no paging --></template>
        </v-data-table>
      </div>
      <div>
        <v-row>
          <v-col>
            <slot></slot>
          </v-col>
        </v-row>
      </div>
    </v-form>
    <AppDialog v-model="showExampleDialog" :title="exampleTitle" :is-loading="loading" persistent max-width="650px" @close="toggleExampleDialog">
      <template #content>
        <div class="confirm-dialog-text d-flex flex-column">
          <p class="mt-2">
            <strong>Note:&nbsp;</strong>
            <slot name="exampleText">Content placeholder. Content to be provided.</slot>
          </p>
          <br />
          <img v-if="exampleImage" :src="exampleImageSource" />
        </div>
      </template>
      <template #button>
        <v-row class="px-4">
          <v-col cols="12" class="d-flex justify-end">
            <AppButton id="dialog-close" :primary="true" size="large" width="100px" :loading="loading" @click="toggleExampleDialog">Close</AppButton>
          </v-col>
        </v-row>
      </template>
    </AppDialog>
  </v-container>
</template>
<script>
import { uuid } from 'vue-uuid'

import AppButton from '@/components/ui/AppButton.vue'
import AppDialog from '@/components/ui/AppDialog.vue'
import AppLabel from '@/components/ui/AppLabel.vue'
import { SUPPORTED_DOCUMENTS_MESSAGE } from '@/utils/constants'
import { humanFileSize, getFileExtensionWithDot } from '@/utils/file'

export default {
  components: { AppButton, AppDialog, AppLabel },
  props: {
    entityName: {
      type: String,
      required: false,
      default: undefined,
    },
    documentLabel: {
      type: String,
      default: undefined,
    },
    documentType: {
      type: String,
      required: false,
      default: undefined,
    },
    documentHelpText: {
      type: String,
      default: '',
    },
    loading: {
      type: Boolean,
      default: false,
    },
    readonly: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    uploadedDocuments: {
      type: Array,
      default: () => [],
    },
    uploadLimit: {
      type: String,
      default: undefined,
    },
    exampleImage: {
      type: String,
      default: '',
    },
  },
  emits: ['update:modelValue', 'deleteUploadedDocument', 'validateDocumentsToUpload'],
  data() {
    return {
      documents: [],
      isValidForm: false,
      showExampleDialog: false,
    }
  },
  computed: {
    uploadLimitReached() {
      return this.uploadLimit && this.documents?.length + this.uploadedDocuments?.length >= Number(this.uploadLimit)
    },
    showAddFileButton() {
      return !this.loading && !this.readonly && !this.uploadLimitReached
    },
    exampleTitle() {
      return this.documentType ? `${this.documentType} Example` : 'Example'
    },
    exampleImageSource() {
      return new URL(`../../assets/images/${this.exampleImage}`, import.meta.url)
    },
  },
  watch: {
    documents: {
      handler() {
        this.validateDocumentsToUpload()
        const documentsToUpload = this.documents?.filter((document) => document.isValidFile && document.file)
        this.$emit('update:modelValue', documentsToUpload)
      },
      deep: true,
    },
    loading: {
      handler(value) {
        if (value) return
        this.documents = []
      },
    },
  },
  created() {
    this.SUPPORTED_DOCUMENTS_MESSAGE = SUPPORTED_DOCUMENTS_MESSAGE
    this.MAX_FILE_SIZE = 4194304 // 4 MB
    this.fileExtensionAccept = ['.pdf', '.png', '.jpg', '.jpeg', '.heic', '.doc', '.docx', '.xls', '.xlsx']
    this.fileFormats = 'PDF, JPEG, JPG, PNG, HEIC, DOC, DOCX, XLS, and XLSX'
    this.fileRules = [
      (value) => {
        return !value || !value.length || value[0].size < this.MAX_FILE_SIZE || `The maximum file size is ${humanFileSize(this.MAX_FILE_SIZE)} for each document.`
      },
      (value) => {
        return !value || !value.length || this.fileExtensionAccept.includes(getFileExtensionWithDot(value[0].name)?.toLowerCase()) || `Accepted file types are ${this.fileFormats}.`
      },
    ]
    this.headersUploadedDocuments = [
      { title: 'File Name', key: 'fileName', width: '34%' },
      { title: 'Description', key: 'description', width: '60%' },
      { title: '', key: 'actionButtons', sortable: false, width: '6%' },
    ]
    if (!this.disabled && !this.readonly && !this.uploadLimitReached) {
      this.addFile()
    }
  },
  methods: {
    addFile() {
      this.documents.push({ id: uuid.v1(), entityName: this.entityName, isValidFile: true, documentType: this.documentType })
    },

    deleteFile(deletedItemId) {
      const index = this.documents.findIndex((item) => item.id === deletedItemId)
      if (index > -1) {
        this.documents.splice(index, 1)
      }
    },

    validateDocumentsToUpload() {
      this.$emit(
        'validateDocumentsToUpload',
        this.documents?.every((file) => file.isValidFile),
      )
    },

    // Need to add this validation because isValidForm is not responsive when file is updated
    validateFile(updatedItemId) {
      const document = this.documents.find((item) => item.id === updatedItemId)
      const file = document?.file
      if (file) {
        const isLessThanMaxSize = file.size < this.MAX_FILE_SIZE
        const isFileExtensionAccepted = this.fileExtensionAccept.includes(getFileExtensionWithDot(file.name)?.toLowerCase())
        document.isValidFile = isLessThanMaxSize && isFileExtensionAccepted
      } else {
        document.isValidFile = true
      }
    },

    resetDocuments() {
      this.documents = []
    },
    toggleExampleDialog() {
      this.showExampleDialog = !this.showExampleDialog
    },
  },
}
</script>
<style scoped>
.add-file-button {
  font-size: 16px;
}

.example-button {
  color: #003366;
  font-weight: 600;
  margin-top: -3px;
  text-decoration: underline;
}

:deep(.v-field__input) {
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
