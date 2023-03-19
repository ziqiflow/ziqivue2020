import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'

// create an axios instance
const service = axios.create({
  baseURL: window.baseURL, 
  timeout: 30000, // request timeout
  transformResponse: [function (data) {
    
    if(!!data&&data.constructor==String){
      // Do whatever you want to transform the data
      var JSONBigInt = require('json-bigint-string');
      //console.log(JSONBigInt.parse(data));
      return JSONBigInt.parse(data);
    }
    return data;
  }],
})

// request interceptor
service.interceptors.request.use(
  config => {
    // Do something before request is sent
    if (store.getters.token) {
      
      //config.headers['X-Token'] = getToken()
      console.log('config',config);


      if(window.envname=='test'&&!!config.canTest){
        config.headers[window.env.test.HeaderTokenKey] = getToken(window.env.test.CookieTokenKey);        
      }else{
        config.headers[window.env.prod.HeaderTokenKey] = getToken()        
      }

      if (!config.data) {
        config.data = {}
      }

   
      for(let key in window.env){
        let e=window.env[key];

      // add to headers
        let token = getToken(e.CookieTokenKey);
        if (!!token) {
          config.headers[e.HeaderTokenKey] = token;
          if (!!config.data && config.data.constructor.name == 'FormData') {
            config.data.append(e.postTokenKey, token)
          } else {
            config.data[e.postTokenKey] = token;
          }
        }
    }

    if (!!config.data && config.data.constructor.name == 'FormData') {
      config.data.append('_href', window.location.href)
    } else {
      config.data._href = window.location.href
    }
     


    }
    return config
  },
  error => {
    // Do something with request error
    console.log(error) // for debug
    Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(

  response => response,

  error => {
    console.log('err' + error) // for debug
    console.log(error);
    window.error_test=error;

    Message({
      message: !!error.response.data.message?error.response.data.message:error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
