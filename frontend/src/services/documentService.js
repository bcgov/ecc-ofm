import { getFileExtensionWithDot, isHeicFile, updateHeicFileNameToJpg } from '@/utils/file'

import { ApiRoutes } from '@/utils/constants'
import ApiService from '@/common/apiService'
import { isEmpty } from 'lodash'

function mapDocumentFileObjectForBack(documents) {
  let formData = new FormData()
  let fileMapping = []
  documents?.forEach((document, index) => {
    if (isEmpty(document.file)) return
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
  })
  if (!isEmpty(fileMapping)) {
    formData.append('fileMapping', JSON.stringify(fileMapping))
  }
  return formData
}

function addEntityIdToDocument(documents, entityId) {
  documents?.forEach((document) => {
    document.entityId = entityId
  })
  return documents
}

export default {
  async createDocuments(documents, entityId) {
    const updatedDocuments = addEntityIdToDocument(documents, entityId)
    const payload = mapDocumentFileObjectForBack(updatedDocuments)
    if (!payload.has('fileMapping')) return
    try {
      const response = await ApiService.apiAxios.post(ApiRoutes.DOCUMENTS, payload)
      return response?.data
    } catch (error) {
      console.log(`Failed to create documents - ${error}`)
      throw error
    }
  },
}
