import Cookies from 'js-cookie'
import { resetCookies } from '@/utils/auth'
import { resetRouter } from '@/router'
import querystring from 'querystring'
import request from '@/utils/request'
import { ssoUrl, appId } from '../../../config'
import { convertToTree } from '../../utils/index'

const loginOutUrl = ssoUrl + '/auth/logout'
const headerMenuUrl = ssoUrl + '/menu/list_root_user_menus'
const sidebarMenuUrl = ssoUrl + '/menu/list_user_menus'
const LOGIN = ssoUrl + '/auth/login'
const CODE = ssoUrl + '/auth/verifyCode'
const state = {
  siderbarMenuData: [],
  headerMenuData: [],
  sidebar: {
    opened: Cookies.get('sidebarStatus')
      ? !!+Cookies.get('sidebarStatus')
      : true,
    withoutAnimation: false
  },
  device: 'desktop',
  size: Cookies.get('size') || 'medium'
}

const mutations = {
  TOGGLE_SIDEBAR: state => {
    state.sidebar.opened = !state.sidebar.opened
    state.sidebar.withoutAnimation = false
    if (state.sidebar.opened) {
      Cookies.set('sidebarStatus', 1)
    } else {
      Cookies.set('sidebarStatus', 0)
    }
  },
  CLOSE_SIDEBAR: (state, withoutAnimation) => {
    Cookies.set('sidebarStatus', 0)
    state.sidebar.opened = false
    state.sidebar.withoutAnimation = withoutAnimation
  },
  TOGGLE_DEVICE: (state, device) => {
    state.device = device
  },
  SET_SIZE: (state, size) => {
    state.size = size
    Cookies.set('size', size)
  },
  setHeaderMenuData: (state, data) => {
    state.headerMenuData = data
  },
  setSiderbarMenuData: (state, data) => {
    state.siderbarMenuData = data
  }
}

const actions = {
  toggleSideBar({ commit }) {
    commit('TOGGLE_SIDEBAR')
  },
  closeSideBar({ commit }, { withoutAnimation }) {
    commit('CLOSE_SIDEBAR', withoutAnimation)
  },
  toggleDevice({ commit }, device) {
    commit('TOGGLE_DEVICE', device)
  },
  setSize({ commit }, size) {
    commit('SET_SIZE', size)
  },
  getHeaderMenuData({ commit }) {
    return request({
      url: headerMenuUrl,
      method: 'post'
    }).then(response => {
      if (response.data.code === 0) {
        commit('setHeaderMenuData', response.data.data)
      }
    })
  },
  getSidebarMenuData({ commit }) {
    return request({
      url: sidebarMenuUrl,
      method: 'post'
    }).then(response => {
      if (response.data.code === 0) {
        const data = response.data.data.filter(
          item => item.appId === appId && item.type !== 0
        )
        // for (let index = 0; index < data.length; index++) {
        //   const element = data[index]
        //   if (element.type === 0) {
        //     //如果 0 代表目录
        //     element.url = '/manage'
        //   }
        // }
        let result = convertToTree(data, { id: 'id', pid: 'pid' })

        commit('setSiderbarMenuData', result)
      }
    })
  },
  // user login
  login(state, userInfo) {
    return request({
      url: LOGIN,
      method: 'post',
      data: querystring.stringify(userInfo)
    }).then(response => {
      return response
    })
  },
  // user logout
  loginOut({ commit, state, dispatch }, params) {
    return request({
      url: loginOutUrl,
      method: 'get',
      params
    }).then(response => {
      if (response.code === 302) {
        dispatch('tagsView/delAllViews', null, { root: true })
        resetCookies()
        resetRouter()
        // reset visited views and cached views
      }
    })
  },
  // get code
  getCode() {
    return request({
      url: CODE,
      method: 'get'
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
