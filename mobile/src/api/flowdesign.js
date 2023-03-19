import request from '@/utils/request'

export const GotoOaTest = (info = {}) => {
  return request({
    url: '/api/goto_oatest',
    data: info,
    method: 'post'
  })
}


export const FlowAllList = (info = {}) => {
    return request({
      url: '/api/oa/flow/alllist',
      data: info,
      method: 'post'
    })
}

export const FlowEditFileDelete = info => {
    return request({
      url: '/api/oa/flowedit/deletefile',
      data: info,
      method: 'post'
    })
  }
  
  export const FlowEditFileUpload = info => {
    return request({
      url: '/api/oa/flowedit/uploadfile',
      data: info,
      method: 'post',
      headers: {
        'Content-Type': 'multipart/form-data'
    }
    })
  }

export const FlowDesignsCanList = info => {
    return request({
      url: '/api/oa/flowdesigns/canlist',
      data: info,
      method: 'post'
    })
  }

  export const FlowdesignsLists = info => {
    return request({
      url: '/api/oa/flowdesigns/list',
      data: info,
      method: 'post'
    })
  }



export const FlowdesignsDelete = info => {
    return request({
      url: '/api/oa/flowdesigns/delete',
      data: info,
      method: 'post'
    })
  }


 
export const FlowdesignsGet = info => {
    
    return request({
      url: '/api/oa/flowdesigns/get',
      data: info,
      method: 'post'
    })
  }

  
  export const FlowdesignsAdd = info => {
    return request({
      url: '/api/oa/flowdesigns/add',
      data: info,
      method: 'post'
    })
  }
  
  export const FlowdesignsEdit = info => {
    
    return request({
      url: '/api/oa/flowdesigns/edit',
      data: info,
      method: 'post'
    })
  }
  
  
  
  export const FlowdesignsAddMGet = info => {
    return request({
      url: '/api/oa/flowdesigns/add',
      data: info,
      method: 'get'
    })
  }
  
  export const FlowdesignsEditMGet = info => {
    return request({
      url: '/api/oa/flowdesigns/edit',
      data: info,
      method: 'get'
    })
  }
  
  export const FlowDesignSeniorEdit = info => {
    
    return request({
      url: '/api/oa/flowdesigns/edit_senior',
      data: info,
      method: 'post'
    })
  }


  export const FlowDesignSeniorCopy=info=>{
    
    return request({
      url: '/api/oa/flowdesigns/copy_senior',
      data: info,
      method: 'post'
    })

  }
  
  
  
  export const FlowIfStrTest = info => {
    return request({
      url: '/api/oa/flow/ifstrtest',
      data: info,
      method: 'post'
    })
  }


  


export const FlowDesignsSetCategoryGet= info =>{
    return request({
      url: '/api/oa/flowdesigns/setCategory',
      data: info,
      method: 'get'
    })
  }
  
  export const FlowDesignsSetCategorySet= info =>{
    return request({
      url: '/api/oa/flowdesigns/setCategory',
      data: info,
      method: 'post'
    })
  }
  
  
  
  export const FlowDesignsCanTreeList= info =>{
    return request({
      url: '/api/'+window.oaname+'/flowdesigns/cancreattreelist',
      data: info,
      method: 'post'
    })

    //cantreelist
  }

  export const FlowDesignsCanAdminTreeList= info =>{
    return request({
      url: '/api/'+window.oaname+'/flowdesigns/canadmintreelist',
      data: info,
      method: 'post'
    })

    //cantreelist
  }

  




  export const FlowDesignsAllTreeList= info =>{
    return request({
      url: '/api/'+window.oaname+'/flowdesigns/alltreelist',
      data: info,
      method: 'post'
    })
    //cantreelist
  }
  
  

  export const FlowDesignsCanSonList = (info = {}) => {
    return request({
      url: '/api/oa/flowdesigns/cansonlist',
      data: info,
      method: 'post'
    })
  }