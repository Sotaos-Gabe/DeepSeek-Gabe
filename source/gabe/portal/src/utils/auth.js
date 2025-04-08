import Cookies from 'js-cookie'

const TokenKey = 'yaovia-token'
const RefreshTokenKey = 'yaovia-refresh-token'
const TokenExpireKey = 'yaovia-token-expire'
export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function getRefreshToken() {
  return Cookies.get(RefreshTokenKey)
}

export function setRefreshToken(token) {
  return Cookies.set(RefreshTokenKey, token)
}

export function removeRefreshToken() {
  return Cookies.remove(RefreshTokenKey)
}

export function getTokenExpire() {
  return Cookies.get(TokenExpireKey)
}

export function setTokenExpire(tokenExpire) {
  return Cookies.set(TokenExpireKey, tokenExpire)
}

export function removeTokenExpire() {
  return Cookies.remove(TokenExpireKey)
}
