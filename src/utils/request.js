import axios from 'axios'
import { Message } from 'element-ui'
import { resetCookies } from '@/utils/auth'
import { resetRouter } from '@/router'
import Router from '@/router/index'
import store from '@/store'

const url = ''
axios.defaults.withCredentials = true
const service = axios.create({
  baseURL: url
})
service.interceptors.request.use(
  config => {
    // do something before request is sent
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

service.interceptors.response.use(
  response => {
    const res = response.data
    if (
      res.code === 0 ||
      res.returnCode === '0' ||
      res.code === '0' ||
      res.code === 200 ||
      res.code === 105
    ) {
      return response
    }
    if (res.code === 302) {
      resetCookies()
      resetRouter()
      store.dispatch('tagsView/delAllViews', null, { root: true })
      return Router.push('/login')
    }
    if (res.code === 401) {
      resetCookies()
      return Router.push('/login')
    }
    if (res.code === -1) {
      Message({
        message: res.msg,
        type: 'error'
      })
      return res
    }
    if (res.code === 1 || res.code === 104) {
      Message({
        message: res.msg || res.message,
        type: 'error'
      })
      return res
    }
    if (res.code === 500 || res.code === 400 || res.code === 103) {
      Message({
        message: res.message,
        type: 'error'
      })
    }
  },
  error => {
    const errorMsg = (error.response && error.response.data.msg) || '未知错误'
    const code = parseInt(error.response && error.response.status)
    if (code !== 302) {
      Message({
        message: errorMsg,
        type: 'error'
      })
    }
    if (code === 302 || code === 401) {
      Message({
        message: errorMsg,
        type: 'error'
      })
      resetCookies()
      return Router.push('/login')
    }

    return Promise.reject(error.response)
  }
)

export default service
