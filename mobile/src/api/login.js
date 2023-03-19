import request from '@/utils/request'
import { getToken } from '@/utils/auth'


export function ChangeUser(info) {
  return request({
    url: '/api/'+window.oaname+'/employee/testlogin',
    method: 'post',
    data:info,
    canTest:true
  })
}

export function ChangeToReplaceEmployee(info) {
  return request({
    url: '/api/replace_emp/employee/login',
    method: 'post',
    data:info,
  })
}


export function loginGetPublicKey(userName) {
  const data = {
    userName
  }
  return request({
    url: '/api/employee/login/getpkey',
    method: 'post',
    data
  })
}

export function loginByUsername(userName, password) {
  const data = {
    userName,
    password
  }
  return request({
    url: '/api/employee/login',
    method: 'post',
   
    data
  })
}

export function getReplaceUserInfo() {
    return request({
      url: '/api/replace_emp/employee/getinfo?'+window.env.replace_emp.postTokenKey+'='+ getToken(window.env.replace_emp.CookieTokenKey),
      method: 'get',
      // params: { _employeetoken: token }
    })
}


export function getUserInfo(token) {

    return request({
      url: '/api/employee/getinfo?'+window.env.prod.postTokenKey+'='+token,
      method: 'get',
      // params: { _employeetoken: token }
    })

}

export function logout() {
  return request({
    url: '/api/employee/logout',
    method: 'post'
  })
}

