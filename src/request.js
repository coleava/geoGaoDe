import axios from 'axios'

import AppContent from './AppContent'

class Request {
  constructor() {
    this.client = axios.create()
    this.client.interceptors.request.use((cfg) => {
      cfg.baseURL = AppContent.httpService

    //   if (this._token) {
    //     cfg.headers = _.assign(cfg.headers, { Authorization: `Bearer ${this._token}` })
    //   }
      return cfg
    })

    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        // if (error.response && error.response.status === 401) {
        //   Cookies.remove('token')
        //   window.location = AppContent.instance.homePage
        // }
        return Promise.reject(error)
      }
    )
  }
}

export default new Request();
