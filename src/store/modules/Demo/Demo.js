import request from '@/utils/request'
import { url } from '../../../../config'

const LIST = `${url}/live/initiator`
const FAILLIST = `${url}/backCategory/selectBackCategoryDetailPage`

const state = {}

const mutations = {}

const actions = {
  // getList
  getList(state, params) {
    return request({
      url: LIST,
      method: 'post',
      data: {
        ...params
      }
    }).then(response => {
      const { data } = response
      return data
    })
  },
  getFailList(state, params) {
    return request({
      url: FAILLIST,
      method: 'get',
      params: {
        ...params
      }
    }).then(response => {
      const { data } = response
      return data
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
