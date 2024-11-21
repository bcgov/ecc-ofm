/**
 * Converting bytes to human readable values (KB, MB, GB, TB, PB, EB, ZB, YB)
 * @param {*} bytes
 * @param {*} decimals
 */
export function humanFileSize(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}

export function getFileExtension(fileName) {
  if (fileName) return fileName.slice(fileName.lastIndexOf('.') + 1).toLowerCase()
  return ''
}

export function getFileExtensionWithDot(fileName) {
  if (fileName) return fileName.slice(fileName.lastIndexOf('.')).toLowerCase()
  return ''
}

export function getFileNameWithMaxNameLength(fileName, nameLength = 30, extensionLength = 10) {
  const nameIndex = fileName.lastIndexOf('.') >>> 0
  const name = fileName.slice(0, nameIndex > nameLength ? nameLength : nameIndex)
  const extension = getFileExtensionWithDot(fileName).substring(0, extensionLength)

  return name + extension
}

export function isHeicFile(fileName) {
  const fileExtension = getFileExtension(fileName)
  return fileExtension === 'heic'
}

export function updateHeicFileNameToJpg(filename) {
  const regex = /\.heic(?![\s\S]*\.heic)/i //looks for last occurrence of .heic case-insensitive
  return filename?.replace(regex, '.jpg')
}

/**
 * Quick and dirty way to determine image type based on base64 encoding.
 * @param image The base64 encoded image
 */
export function deriveImageType(image) {
  const key = image.charAt(0)
  switch (key) {
    case '/':
      return 'jpg'
    case 'i':
      return 'png'
    case 'R':
      return 'gif'
    case 'U':
      return 'webp'
    default:
      return '*'
  }
}
