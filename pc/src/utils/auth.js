import Cookies from 'js-cookie'
import JSEncrypt from 'jsencrypt'
import { Base64 } from 'js-base64';

import httpBuildQuery from 'http-build-query';
import md5 from 'md5';

const TokenKey = 'Admin-Token'//window.CookieTokenKey;//'Admin-Token'



export function filesignToken(uid){
  
  let agent=window.navigator.userAgent;
  let data={agent,uid:uid,time:Date.parse(new Date())/1000};
  data.sign=md5(httpBuildQuery(data)+'&token='+getToken());
  // console.log(getToken());
  return httpBuildQuery(data);
}


export function getToken(key=null) {
  return Cookies.get(!!key?key:window.env.prod.CookieTokenKey)
}

export function setToken(token,key=null) {
  return Cookies.set(!!key?key:window.env.prod.CookieTokenKey, token)
}

export function removeToken(key=null) {
  return Cookies.remove(!!key?key:window.env.prod.CookieTokenKey)
}

export function encryptionPassword(pkey,password){
  



  // console.log(JSEncrypt);
  let encrypt= new JSEncrypt({default_key_size:2048})
  // console.log(encrypt);
  encrypt.setPublicKey(Base64.decode(pkey));
  let temp=encrypt.encrypt(password);

  return temp;
}
