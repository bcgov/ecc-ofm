<template>
  <v-container fluid class="pa-0">
    <v-form ref="form" v-model="isValidForm">
      <div>The maximum file size is 4MB for each document. Accepted file types are jpg, jpeg, heic, png, pdf, docx, doc, xls, and xlsx.</div>
      <AppButton v-if="!loading && !readonly" id="add-new-file" :primary="false" size="large" width="100px" class="addFileButton" @click="addFile">Add File</AppButton>
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
              @update:modelValue="validateFile(item.id)"></v-file-input>
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
        <AppLabel>Uploaded Documents</AppLabel>
        <v-data-table :headers="headersUploadedDocuments" :items="uploadedDocuments" item-key="documentId" items-per-page="-1" density="compact">
          <template #item.actionButtons="{ item }">
            <v-icon v-if="!loading && !readonly" small @click="$emit('deleteUploadedDocument', item.documentId)">mdi-delete</v-icon>
          </template>
          <template v-slot:bottom><!-- no paging --></template>
        </v-data-table>
      </div>
    </v-form>
  </v-container>
</template>
<script>
import AppButton from '@/components/ui/AppButton.vue'
import AppLabel from '@/components/ui/AppLabel.vue'
import { humanFileSize, getFileExtensionWithDot } from '@/utils/file'
import { uuid } from 'vue-uuid'

export default {
  components: { AppButton, AppLabel },
  props: {
    entityName: {
      type: String,
      required: true,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    readonly: {
      type: Boolean,
      default: false,
    },
    uploadedDocuments: {
      type: Array,
      default: () => [],
    },
  },
  emits: ['updateDocuments', 'deleteUploadedDocument'],
  data() {
    return {
      documents: [],
      maxSize: 4194304, // 4 MB
      isValidForm: false,
      fileExtensionAccept: ['.pdf', '.png', '.jpg', '.jpeg', '.heic', '.doc', '.docx', '.xls', '.xlsx'],
      fileFormats: 'PDF, JPEG, JPG, PNG, HEIC, DOC, DOCX, XLS, and XLSX',
      fileRules: [],
      headersUploadedDocuments: [
        { title: 'File Name', key: 'fileName', width: '34%' },
        { title: 'Description', key: 'description', width: '60%' },
        { title: '', key: 'actionButtons', sortable: false, width: '6%' },
      ],
    }
  },
  watch: {
    documents: {
      handler() {
        const areValidFilesUploaded = this.documents.every((file) => file.isValidFile)
        this.$emit('updateDocuments', { documents: this.documents, areValidFilesUploaded: areValidFilesUploaded })
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
    this.fileRules = [
      (value) => {
        return !value || !value.length || value[0].size < this.maxSize || `The maximum file size is ${humanFileSize(this.maxSize)} for each document.`
      },
      (value) => {
        return !value || !value.length || this.fileExtensionAccept.includes(getFileExtensionWithDot(value[0].name)?.toLowerCase()) || `Accepted file types are ${this.fileFormats}.`
      },
    ]
  },
  methods: {
    addFile() {
      this.documents.push({ id: uuid.v1(), entityName: this.entityName, isValidFile: true })
    },
    deleteFile(deletedItemId) {
      const index = this.documents.findIndex((item) => item.id === deletedItemId)
      if (index > -1) {
        this.documents.splice(index, 1)
      }
    },
    // Need to add this validation because isValidForm is not responsive when file is updated
    validateFile(updatedItemId) {
      const document = this.documents.find((item) => item.id === updatedItemId)
      const file = document?.file[0]
      if (file) {
        const isLessThanMaxSize = file.size < this.maxSize
        const isFileExtensionAccepted = this.fileExtensionAccept.includes(getFileExtensionWithDot(file.name)?.toLowerCase())
        document.isValidFile = isLessThanMaxSize && isFileExtensionAccepted
      } else {
        document.isValidFile = true
      }
    },
    resetDocuments() {
      this.documents = []
    },
  },
}
</script>
<style scoped>
.addFileButton {
  margin-top: 8px;
  font-size: 16px;
}
</style>
