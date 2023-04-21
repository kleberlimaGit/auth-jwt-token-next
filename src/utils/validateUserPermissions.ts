interface User {
    permissions: string[] | null
    roles: string[] | null
}

interface ValidateUserPermissionsParams{
    user: User
    permissions?: string[] | null
    roles?:string[] | null
}

export function validateUserPermissions({user,permissions = [],roles = []}:ValidateUserPermissionsParams){
    if(permissions !== null && permissions.length > 0){
        // --every-- so retorna true se todas as condiçoes dentro das chaves forem atendidas
        const hasAllPermission = permissions.every(permission => {
            return user?.permissions?.includes(permission)
        })

        if(!hasAllPermission){
            return false
        }
      }

      if(roles !== null && roles.length > 0){
        // --every-- so retorna true se todas as condiçoes dentro das chaves forem atendidas
        const hasAllPermission = roles?.some(role => {
            return user?.roles?.includes(role)
        })

        if(!hasAllPermission){
            return false
        }
      }

      return true
}