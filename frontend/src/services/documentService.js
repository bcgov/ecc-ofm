import { getFileExtensionWithDot, isHeicFile, updateHeicFileNameToJpg } from '@/utils/file'

import { ApiRoutes } from '@/utils/constants'
import ApiService from '@/common/apiService'
import { isEmpty } from 'lodash'

function mapDocumentFileObjectForBack(documents) {
  let formData = new FormData()
  let fileMapping = []
  documents?.forEach((document, index) => {
    if (document.file?.length > 0) {
      const file = document.file[0]
      let fileName = file?.name
      fileName = isHeicFile(fileName) ? updateHeicFileNameToJpg(fileName) : fileName
      fileMapping.push({
        ofm_subject: fileName,
        ofm_extension: getFileExtensionWithDot(fileName),
        ofm_file_size: file?.size,
        ofm_description: document.description ?? '',
        entity_name_set: document.entityName,
        regardingid: document.entityId,
      })
      formData.append(`file${index}`, file)
    }
  })
  formData.append('fileMapping', JSON.stringify(fileMapping))
  return formData
}

export default {
  async createDocuments(documents) {
    if (!isEmpty(documents)) {
      try {
        const payload = mapDocumentFileObjectForBack(documents)
        const response = await ApiService.apiAxios.post(ApiRoutes.DOCUMENTS, payload)
        return response?.data
      } catch (error) {
        console.log(`Failed to create documents - ${error}`)
        throw error
      }
    }
  },

  async createDocumentsForAssistanceRequest(documents, assistanceRequestId) {
    try {
      documents.forEach((document) => {
        document.entityId = assistanceRequestId
      })
      await this.createDocuments(documents)
    } catch (error) {
      this.setFailureAlert('Failed to add documents to your assistance request')
    }
  },
}
