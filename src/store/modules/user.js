import { getCookie } from '@/utils/auth'
const state = {
  token: getCookie(),
  name: '',
  introduction: ''
}

const mutations = {
  SET_INTRODUCTION: (state, introduction) => {
    state.introduction = introduction
  },
  SET_NAME: (state, name) => {
    state.name = name
  }
}

const actions = {
  // 获取用户信息，该方法会在layout中调用
  // getInfo({ commit, state }) {
  //   const { name, avatar, introduction } = {
  //     roles: ['admin'],
  //     introduction: 'I am a super administrator',
  //     avatar:
  //       'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
  //     name: 'Super Admin'
  //   };
  //   commit('SET_NAME', name);
  //   commit('SET_AVATAR', avatar);
  //   commit('SET_INTRODUCTION', introduction);
  // }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
