'use strict'

import { SUPPLEMENTARY_APPLICATION_STATUS_CODES } from '@/utils/constants'

export function isApplicationLocked(applicationStatusCode) {
  if (!applicationStatusCode) {
    return false
  }
  return !(applicationStatusCode === SUPPLEMENTARY_APPLICATION_STATUS_CODES.DRAFT || applicationStatusCode === SUPPLEMENTARY_APPLICATION_STATUS_CODES.ACTION_REQUIRED)
}

// Check the list of models for multiples of the same VIN.
// We need length > 1 to enforce that there are VINS that exactly match which breaks our validation rule
export function hasDuplicateVIN(model, transportModels) {
  return transportModels.filter((m) => m.VIN === model.VIN).length > 1
}

export function convertStringToArray(item, separator = ',') {
  return typeof item === 'string' ? item?.split(separator) : item
}

export function convertArrayToString(item, separator = ', ') {
  return Array.isArray(item) ? item?.join(separator) : item
}

export function sanitizeWholeNumberInput(input) {
  return input?.replace(/[^0-9]/g, '')
}

/**
 * @param {string} base64Data - The base64 encoded file data (without data URL prefix)
 * @param {string} fileName - The name of the file including extension
 * @returns {string} A data URL string that can be used in href or src attributes
 */
function createDataURL(base64Data, fileName) {
  const extension = fileName.split('.').pop().toLowerCase()
  const mimeTypes = {
    // Documents
    pdf: 'application/pdf',
    doc: 'application/msword',
    docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    xls: 'application/vnd.ms-excel',
    xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ppt: 'application/vnd.ms-powerpoint',
    pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    txt: 'text/plain',
    csv: 'text/csv',

    // Images
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    gif: 'image/gif',
    webp: 'image/webp',
    svg: 'image/svg+xml',
    bmp: 'image/bmp',

    // Archives
    zip: 'application/zip',
  }

  const mimeType = mimeTypes[extension] || 'application/octet-stream'
  return `data:${mimeType};base64,${base64Data}`
}

export function createFileDownloadLink(file, fileName) {
  const link = document.createElement('a')
  link.href = createDataURL(file, fileName)
  link.target = '_blank'
  link.download = fileName

  // Simulate a click on the element <a>
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
