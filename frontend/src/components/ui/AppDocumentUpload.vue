<template>
  <v-container fluid class="pa-0">
    <v-form ref="form" v-model="isValidForm">
      <div>The maximum file size is 4MB for each document. Accepted file types are jpg, jpeg, heic, png, pdf, docx, doc, xls, and xlsx.</div>
      <div v-if="documents.length > 0" class="mt-6">
        <v-row v-for="item in documents" :key="item.id" no-gutters>
          <v-col cols="12" md="5" class="pr-4">
            <v-file-input
              v-model="item.file"
              label="Select a file"
              prepend-icon="mdi-file-upload"
              :rules="[...fileRules]"
              :accept="fileExtensionAccept"
              :disabled="loading"
              @update:modelValue="validateUploadedFile(item.id)"></v-file-input>
          </v-col>
          <v-col cols="11" md="6" class="pr-4">
            <v-text-field v-model="item.description" :disabled="loading" placeholder="Enter a description (Optional)" counter maxlength="1000" dense clearable></v-text-field>
          </v-col>
          <v-col v-if="!loading" cols="1" class="pt-3">
            <v-icon small @click="deleteFile(item.id)">mdi-delete</v-icon>
          </v-col>
        </v-row>
      </div>
      <AppButton v-if="!loading" id="add-new-file" @click="addFile">
        <v-icon>mdi-plus</v-icon>
        Add
      </AppButton>
    </v-form>
  </v-container>
</template>
<script>
import AppButton from '@/components/ui/AppButton.vue'
import { humanFileSize, getFileExtensionWithDot } from '@/utils/file'
import { uuid } from 'vue-uuid'

export default {
  components: { AppButton },
  props: {
    entityName: {
      type: String,
      required: true,
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['updateDocuments'],
  data() {
    return {
      documents: [],
      maxSize: 4194304, // 4 MB
      isValidForm: false,
      fileExtensionAccept: ['.pdf', '.png', '.jpg', '.jpeg', '.heic', '.doc', '.docx', '.xls', '.xlsx'],
      fileFormats: 'PDF, JPEG, JPG, PNG, HEIC, DOC, DOCX, XLS and XLSX',
      fileRules: [],
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
    validateUploadedFile(updatedItemId) {
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
  },
}
</script>
