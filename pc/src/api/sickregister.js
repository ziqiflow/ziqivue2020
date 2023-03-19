import request from '@/utils/request'

export const setDoctorSchedule = info => {
  return request({
    url: '/api/sickregister/setdoctorschedule',
    data: info,
    method: 'post'
  })
}

export const readDoctorSchedule = info => {
  return request({
    url: '/api/sickregister/readdoctorschedule',
    data: info,
    method: 'post'
  })
}
