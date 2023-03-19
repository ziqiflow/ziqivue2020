import request from '@/utils/request'

if (!window.oaname) {
  window.oaname = 'oa'
}

export const GetTestUserInfo = info => {
  return request({
    url: '/api/employeetest/getinfo',
    data: info,
    method: 'post',
    canTest: true
  })
}

export const FlowAdminGetConf = info => {
  return request({
    url: '/api/' + window.oaname + '/flow/admin/getconf',
    data: info,
    method: 'post'
  })
}

export const FlowAdminSearchForm = info => {
  return request({
    url: '/api/' + window.oaname + '/flow/admin/searchform',
    data: info,
    method: 'post'
  })
}

export const FlowAdminSearchFormExport = info => {
  return request({
    url: '/api/' + window.oaname + '/flow/admin/searchformExport',
    data: info,
    method: 'post',
    responseType: 'arraybuffer'
  })
}

export const FlowMessageHasRead = info => {
  return request({
    url: '/api/' + window.oaname + '/flow/message/hasread',
    data: info,
    method: 'post',
    canTest: true
  })
}

export const FlowFileDelete = info => {
  return request({
    url: '/api/' + window.oaname + '/flow/deletefile',
    data: info,
    method: 'post',
    canTest: true
  })
}

export const FlowFileUpload = info => {
  return request({
    url: '/api/' + window.oaname + '/flow/uploadfile',
    data: info,
    timeout: 1000 * 60 * 30, 
    method: 'post',
    canTest: true,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}
export const FlowCreat = info => {
  return request({
    url: '/api/' + window.oaname + '/flow/creat',
    data: info,
    method: 'post', canTest: true
  })
}

export const FlowCreatPreviewMode = info => {
  return request({
    url: '/api/' + window.oaname + '/flow/creatpreviewmode',
    data: info,
    method: 'post',
    canTest: true
  })
}


export const FlowDeal = info => {
  return request({
    url: '/api/' + window.oaname + '/flow/deal',
    data: info,
    method: 'post',
    canTest: true
  })
}

export const FlowReSendMessage = info => {
  return request({
    url: '/api/' + window.oaname + '/flow/resendmessage',
    data: info,
    method: 'post',
    canTest: true
  })
}

export const FlowDealPreviewMode = info => {
  return request({
    url: '/api/' + window.oaname + '/flow/dealpreviewmode',
    data: info,
    method: 'post',
    canTest: true
  })
}

export const FlowNeedCreat = info => {
  return request({
    url: '/api/' + window.oaname + '/flow/needcreat',
    data: info,
    method: 'post',
    canTest: true
  })
}

export const FlowWaiting = info => {
  return request({
    url: '/api/' + window.oaname + '/flow/list/waiting',
    data: info,
    method: 'post',
    canTest: true
  })
}

export const FlowFinish = info => {
  return request({
    url: '/api/' + window.oaname + '/flow/list/finish',
    data: info,
    method: 'post',
    canTest: true
  })
}

export const FlowICreat = info => {
  return request({
    url: '/api/' + window.oaname + '/flow/list/icreat',
    data: info,
    method: 'post',
    canTest: true
  })
}

export const FlowMessage = info => {
  return request({
    url: '/api/' + window.oaname + '/flow/list/message',
    data: info,
    method: 'post',
    canTest: true
  })
}

export const FlowCc = info => {
  return request({
    url: '/api/' + window.oaname + '/flow/list/cc',
    data: info,
    method: 'post',
    canTest: true
  })
}

export const FlowDealByMsgid = info => {
  return request({
    url: '/api/' + window.oaname + '/flow/deal/bymsgid',
    data: info,
    method: 'post',
    canTest: true
  })
}

export const FlowGetbyCreat = info => {
  
  return request({
    url: '/api/' + window.oaname + '/flow/getbycreat',
    data: info,
    method: 'post'
  })
}

export const FlowTempFormSave = info => {
  return request({
    url: '/api/' + window.oaname + '/flow/tempform/save',
    data: info,
    method: 'post'
  })
}

export const FlowMessageCheckStatus = info => {
  return request({
    url: '/api/' + window.oaname + '/flow/checkmsgstatus',
    data: info,
    method: 'post'
  })
}

export const FlowMessageCheckStatusExport = info => {
  return request({
    url: '/api/' + window.oaname + '/flow/checkmsgstatus/export',
    data: info,
    method: 'post',
    responseType: 'arraybuffer'
  })
}

export const FlowDetail = info => {
  // alert(info);
  return request({
    url: '/api/' + window.oaname + '/flow/detail',
    data: info,
    method: 'post',
    canTest: true
  })
}

export const FlowDetailLogsMsgs = info => {
  // alert(info);
  return request({
    url: '/api/' + window.oaname + '/flow/detail_logs_msgs',
    data: info,
    method: 'post',
    canTest: true
  })
}

// export const Flow = info => {
//   return request({
//     url: '/api/'+window.oaname+'/flow/creat',
//     data: info,
//     method: 'post'
//   })
// }FlowMessageNumber

// FlowNumber
export const FlowNumber = info => {
  
  return request({
    url: '/api/' + window.oaname + '/flow/list/number',
    data: info,
    method: 'post',
    canTest: true
  })
}

export const FlowSetRead = info => {
  return request({
    url: '/api/' + window.oaname + '/flow/setread',
    data: info,
    method: 'post',
    canTest: true
  })
}

export const FlowAlertDone = info => {
  return request({
    url: '/api/' + window.oaname + '/flow/alertdone',
    data: info,
    method: 'post',
    canTest: true
  })
}

export const FlowTimeoutLogPost = info => {
  return request({
    url: '/api/' + window.oaname + '/flow/timeout/log',
    data: info,
    method: 'post',
    canTest: true
  })
}
export const FlowTimeoutLogGet = info => {
  return request({
    url: '/api/' + window.oaname + '/flow/timeout/log',
    data: info,
    method: 'get',
    canTest: true
  })
}

export const FlowTimeoutLogExport = info => {
  return request({
    url: '/api/' + window.oaname + '/flow/timeout/log/export',
    data: info,
    method: 'post',
    canTest: true,
    responseType: 'arraybuffer'
  })
}

export const FlowTimeoutSummaryPost = info => {
  return request({
    url: '/api/' + window.oaname + '/flow/timeout/summary',
    data: info,
    method: 'post',
    canTest: true
  })
}
export const FlowTimeoutSummaryGet = info => {
  return request({
    url: '/api/' + window.oaname + '/flow/timeout/summary',
    data: info,
    method: 'get',
    canTest: true
  })
}

export const FlowTimeoutSummaryExport = info => {
  return request({
    url: '/api/' + window.oaname + '/flow/timeout/summary/export',
    data: info,
    method: 'post',
    canTest: true,
    responseType: 'arraybuffer'
  })
}

export const FlowSetAllRead = info => {
  return request({
    url: '/api/' + window.oaname + '/flow/setallread',
    data: info,
    method: 'post',
    canTest: true
  })
}

// flowOi_id
export const FlowCanCancelList = info => {
  return request({
    url: '/api/' + window.oaname + '/flow/list/cancancel',
    data: info,
    method: 'post',
    canTest: true
  })
}

export const FlowMsgCancel = info => {
  return request({
    url: '/api/' + window.oaname + '/flow/cancel',
    data: info,
    method: 'post',
    canTest: true
  })
}

export const FlowALLCancel = info => {
  return request({
    url: '/api/' + window.oaname + '/flow/allcancel',
    data: info,
    method: 'post',
    canTest: true
  })
}

export const FlowRevokeList = info => {
  return request({
    url: '/api/' + window.oaname + '/flow/revokelist',
    data: info,
    method: 'post',
    canTest: true
  })
}

export const FlowRevokeTo = info => {
  return request({
    url: '/api/' + window.oaname + '/flow/revoketo',
    data: info,
    method: 'post',
    canTest: true
  })
}

