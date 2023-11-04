import { ApiRoutes, AuthRoutes } from '@/utils/constants'

import AuthService from '@/common/authService'
import axios from 'axios'

// Buffer concurrent requests while refresh token is being acquired
let failedQueue = []

function processQueue(error, token = null) {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token)
    }
  })

  failedQueue = []
}

// Create new non-global axios instance and intercept strategy
const apiAxios = axios.create()
const intercept = apiAxios.interceptors.response.use(
  (config) => config,
  (error) => {
    const originalRequest = error.config
    if (error.response.status !== 401) {
      return Promise.reject(error)
    }
    axios.interceptors.response.eject(intercept)
    return new Promise((resolve, reject) => {
      AuthService.refreshAuthToken(localStorage.getItem('jwtToken'))
        .then((response) => {
          if (response.jwtFrontend) {
            localStorage.setItem('jwtToken', response.jwtFrontend)
            apiAxios.defaults.headers.common['Authorization'] = `Bearer ${response.jwtFrontend}`
            originalRequest.headers['Authorization'] = `Bearer ${response.jwtFrontend}`
          }
          processQueue(null, response.jwtFrontend)
          resolve(axios(originalRequest))
        })
        .catch((e) => {
          processQueue(e, null)
          localStorage.removeItem('jwtToken')
          window.location = '/token-expired'
          reject(e)
        })
    })
  },
)

function getCodes(url) {
  return async function getCodesHandler(query) {
    try {
      return await apiAxios.get(url, query)
    } catch (e) {
      console.log(`Failed to get from Nodejs API - ${e}`)
      throw e
    }
  }
}

export default {
  apiAxios: apiAxios,
  intercept: intercept,
  processQueue,
  failedQueue,

  //Adds required headers to the Auth request
  setAuthHeader(token) {
    if (token) {
      apiAxios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    } else {
      delete apiAxios.defaults.headers.common['Authorization']
    }
  },

  async getUserInfo() {
    try {
      return await apiAxios.get(ApiRoutes.USER)
    } catch (e) {
      console.log(`Failed to get from Nodejs getUserInfo API - ${e}`)
      throw e
    }
  },

  async getUserImpersonateInfo(userName) {
    try {
      return await apiAxios.get(`${ApiRoutes.USER}/${userName}`)
    } catch (e) {
      console.log(`Failed to get from Nodejs getUserImpersonateInfo API - ${e}`)
      throw e
    }
  },

  // TODO: consider weather we want to do codes this way when we address code list/description functionality...
  //getAllActiveInstituteProvinceCodes: getCodes(`${Routes.cache.PROVINCES_URL}?active=true`),
  //getAllActiveInstituteCountryCodes: getCodes(`${Routes.cache.COUNTRIES_URL}?active=true`),

  async getConfig() {
    try {
      const response = await apiAxios.get(AuthRoutes.CONFIG)
      return response
    } catch (e) {
      console.log(`Failed to do get from Nodejs getConfig API - ${e}`)
      throw e
    }
  },

  async getLookupInfo() {
    try {
      return await apiAxios.get(ApiRoutes.LOOKUP)
    } catch (e) {
      console.log(`Failed to get from Nodejs getLookups API - ${e}`)
      throw e
    }
  },
}
