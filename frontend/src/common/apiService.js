import axios from 'axios'

import AuthService from '@/common/authService'

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
  }
)

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
  }
}
