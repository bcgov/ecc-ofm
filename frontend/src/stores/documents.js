import { ApiRoutes } from '@/utils/constants'
import ApiService from '@/common/apiService'
import { defineStore } from 'pinia'
import { isEmpty } from 'lodash'

function getFileExtension(fileName) {
  if (fileName) return fileName.slice(fileName.lastIndexOf('.')).toLowerCase()
  return ''
}

function mapDocumentFileObjectForBack(documents) {
  let payload = new FormData()
  let fileMapping = []
  documents?.forEach((document, index) => {
    fileMapping.push({
      ofm_subject: document.file[0]?.name,
      ofm_extension: getFileExtension(document.file[0]?.name),
      ofm_file_size: document.file[0]?.size,
      ofm_description: document.description,
      entity_name_set: document.entityName,
      regardingid: document.entityId,
    })
    payload.append(`document[${index}]`, document.file[0])
  })
  payload.append('fileMapping', JSON.stringify(fileMapping))
  return payload
}

export const useDocumentsStore = defineStore('documents', {
  namespaced: true,
  actions: {
    async createDocuments(documents) {
      if (!isEmpty(documents)) {
        try {
          console.log('BEFORE')
          console.log(documents)
          const payload = mapDocumentFileObjectForBack(documents)
          console.log('AFTER')
          console.log(...payload)
          const response = await ApiService.apiAxios.post(ApiRoutes.DOCUMENTS, payload)
          return response?.data
        } catch (error) {
          console.log(`Failed to create documents - ${error}`)
          throw error
        }
      }
    },
  },
})
