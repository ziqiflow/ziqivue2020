import request from '@/utils/request'




export const GetDbSet = (info) => {
  return request({
    url: '/api/dbctrl2/getdbset',
    method: 'post',
    data: info
  })
}

export const SearchData=(info,url='/api/dbctrl2/searchdata')=>{

  return request({
    url: url,
    method: 'post',
    data: info
  })

}