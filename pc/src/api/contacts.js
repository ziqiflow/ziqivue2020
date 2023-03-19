import request from '@/utils/request'

export const GetDataFormDingtalk = (type) => {
  // alert(type);
  return request({
    url: '/api/employee/contact/getdataformdingtalk',
    method: 'post',
    data: { type }
  })
}

export const getDeptData = () => {
  return request({
    url: '/api/dept/contact/getlists',
    method: 'post'
    //   data:{type}
  })
}

export const getUserByDeptData = () => {
  
  let date= new Date();
  // console.log('/api/employee/contact/getusersbydept.js?date='+date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate());
  return request({
    url: '/api/employee/contact/getusersbydept?date='+date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate(),
    method: 'post',
    timeout: 60000,
    //   data:{type}
  })
}

// export const getUserByRoleData = () => {
//   let date= new Date();
//   return request({
//     url: '/api/employee/contact/getusersbyrole.js?date='+date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate(),
//     method: 'post'
//     //   data:{type}
//   })
// }

export const GetRoleTree = () => {
  let date= new Date();
  return request({
    url: '/api/employee/contact/getroletree?date='+date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate(),
    method: 'post'
    //   data:{type}
  })
}

export const FlowDesignsTestContact = (data) => {
  return request({
    url: '/api/oa/flowdesigns/testconcactset',
    method: 'post',
    data: data
  })
}



export const SyncFromDingtalkByUserid = (data) => {
  return request({
    url: '/api/employee/contact/syncdataformdingtalkbyuserid',
    method: 'post',
    data: data
  })
}

export const UserDeptRoleStoreDataRest = (data) => {
  return request({
    url: '/api/employee/contact/userdeptrolestoredatarest',
    method: 'post',
    data: data
  })
}

