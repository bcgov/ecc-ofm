'use strict'

function sortByPropertyDesc(property) {
  return function (a, b) {
    if (a[property] < b[property]) return 1
    else if (a[property] > b[property]) return -1
    return 0
  }
}

module.exports = {
  sortByPropertyDesc,
}
