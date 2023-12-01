import { ApiRoutes } from '@/utils/constants'
import ApiService from '@/common/apiService'
import { getFileExtensionWithDot } from '@/utils/file'
import { isEmpty } from 'lodash'

function mapDocumentFileObjectForBack(documents) {
  let formData = new FormData()
  let fileMapping = []
  documents?.forEach((document, index) => {
    fileMapping.push({
      ofm_subject: document.file[0]?.name,
      ofm_extension: getFileExtensionWithDot(document.file[0]?.name),
      ofm_file_size: document.file[0]?.size,
      ofm_description: document.description,
      entity_name_set: document.entityName,
      regardingid: document.entityId,
    })
    formData.append(`file${index}`, document.file[0])
  })
  formData.append('fileMapping', JSON.stringify(fileMapping))
  return formData
}

export default {
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
}
