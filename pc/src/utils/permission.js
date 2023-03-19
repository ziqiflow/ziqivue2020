import store from '@/store'
export default function checkPermission(value) {
  if (value && value instanceof Array && value.length > 0) {
    const roles = store.getters && store.getters.roles
    const permissionRoles = value

    let hasPermission = roles.some(role => {
      return permissionRoles.includes(role)
    })

    if(roles.includes('super_admin')){
      hasPermission=true;
    }

    if (!hasPermission) {
      return false
    }
    return true
  } else {
    console.error(`need roles! Like v-permission="['admin','editor']"`)
    return false
  }
}
