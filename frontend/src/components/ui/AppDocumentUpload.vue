<template>
  <v-container fluid class="pa-0">
    <v-form ref="form" v-model="isValidForm">
      <div>The maximum file size is 4MB for each document. Accepted file types are jpg, jpeg, heic, png, pdf, docx, doc, xls, and xlsx.</div>
      <div v-if="documents.length > 0" class="mt-6">
        <v-row v-for="(item, index) in documents" :key="index" no-gutters>
          <v-col cols="12" md="5" class="pr-4">
            <v-file-input v-model="item.file" label="Select a file" prepend-icon="mdi-file-upload" :rules="[...fileRules]" :accept="fileAccept"></v-file-input>
          </v-col>
          <v-col cols="11" md="6" class="pr-4">
            <v-text-field v-model="item.description" placeholder="Enter a description (Optional)" dense clearable></v-text-field>
          </v-col>
          <v-col cols="1" class="pt-3">
            <v-icon small @click="deleteFile(index)">mdi-delete</v-icon>
          </v-col>
        </v-row>
      </div>
      <AppButton id="add-new-file" @click="addFile">
        <v-icon>mdi-plus</v-icon>
        Add
      </AppButton>
    </v-form>
  </v-container>
</template>
<script>
import AppButton from '@/components/ui/AppButton.vue'
import { humanFileSize, getFileExtension } from '@/utils/file'

export default {
  components: { AppButton },
  props: {
    entityName: {
      type: String,
      required: true,
    },
  },
  emits: ['updateDocuments'],
  data() {
    return {
      documents: [],
      maxSize: 4194304,
      isLoading: false,
      isProcessing: false,
      model: {},
      isValidForm: false,
      currentrow: null,
      fileAccept: ['image/png', 'image/jpeg', 'image/jpg', '.pdf', '.png', '.jpg', '.jpeg', '.heic', '.doc', '.docx', '.xls', '.xlsx'],
      fileExtensionAccept: ['pdf', 'png', 'jpg', 'jpeg', 'heic', 'doc', 'docx', 'xls', 'xlsx'],
      fileFormats: 'PDF, JPEG, JPG, PNG, HEIC, DOC, DOCX, XLS and XLSX',
      fileInputError: [],
      fileMap: new Map(),
      fileRules: [],
      editedIndex: -1,
      defaultItem: {
        entityName: this.entityName,
      },
      isFileUploaded: true,
    }
  },
  watch: {
    documents: {
      handler() {
        this.$emit('updateDocuments', { documents: this.documents, areValidFilesUploaded: this.isValidForm })
      },
      deep: true,
    },
  },
  created() {
    this.fileRules = [
      (value) => {
        return !value || !value.length || value[0].name.length < 255 || 'File name can be max 255 characters.'
      },
      (value) => {
        return !value || !value.length || value[0].size < this.maxSize || `The maximum file size is ${humanFileSize(this.maxSize)} for each document.`
      },
      (value) => {
        return !value || !value.length || this.fileExtensionAccept.includes(getFileExtension(value[0].name)?.toLowerCase()) || `Accepted file types are ${this.fileFormats}.`
      },
    ]
  },
  methods: {
    addFile() {
      const addObj = Object.assign({}, this.defaultItem)
      this.documents.push(addObj)
    },
    deleteFile(index) {
      this.documents.splice(index, 1)
    },
  },
}
</script>
