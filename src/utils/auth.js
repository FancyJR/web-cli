import cookies from 'js-cookie'
import { domain } from '../../config'

export function getCookie(cookieKey) {
  return cookies.get(cookieKey)
}

export function setCookie(cookieKey, token) {
  return cookies.set(cookieKey, token)
}

export function removeCookie(cookieKey) {
  return cookies.remove(cookieKey)
}

/**
 * 删除登录信息cookie
 */
export function resetCookies() {
  cookies.remove('sso_sessionid', {
    path: '',
    domain
  })
  cookies.remove('user_info')
}

/**
 * 存储localStorage
 */
export const setLocalStorage = (TokenKey, content) => {
  if (!TokenKey) return
  window.localStorage.setItem(TokenKey, JSON.stringify(content))
}

/**
 * 获取localStorage
 */
export const getLocalStorage = TokenKey => {
  if (!TokenKey) return
  return JSON.parse(window.localStorage.getItem(TokenKey))
}

/**
 * 删除localStorage
 */
export const removeLocalStorage = TokenKey => {
  if (!TokenKey) return
  window.localStorage.removeItem(TokenKey)
}

/**
 * 获取当前时间戳
 */
export const getNowTime = () => {
  return parseInt(new Date().getTime() / 1000)
}
