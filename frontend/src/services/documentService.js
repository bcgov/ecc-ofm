import { isEmpty } from 'lodash'

import ApiService from '@/common/apiService'
import { ApiRoutes } from '@/utils/constants'
import { getFileExtensionWithDot, isHeicFile, updateHeicFileNameToJpg } from '@/utils/file'

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

function sortDocuments(documents) {
  documents?.sort((doc1, doc2) => {
    return new Date(doc1.lastUpdatedTime) - new Date(doc2.lastUpdatedTime)
  })
  return documents
}

export default {
  // regardingId (entityId) is the id of the entity link to the document (e.g.: assistanceRequestId, applicationId, facilityId, etc.)
  async getDocuments(regardingId) {
    try {
      if (!regardingId) return
      const response = await ApiService.apiAxios.get(`${ApiRoutes.DOCUMENTS}?regardingId=${regardingId}`)
      return sortDocuments(response?.data)
    } catch (error) {
      console.log(`Failed to get the list of documents by regarding id - ${error}`)
      throw error
    }
  },

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

  async deleteDocument(documentId) {
    try {
      await ApiService.apiAxios.delete(`${ApiRoutes.DOCUMENTS}/${documentId}`)
    } catch (error) {
      console.log(`Failed to delete document - ${error}`)
      throw error
    }
  },
}
