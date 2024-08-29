import { UserRoleEnum } from '../modules/users/enums/user-role.enum'
import { IUser } from '../modules/users/interfaces/user.interface'

class UserUtil {
  public static isSuperAdmin(user: IUser): boolean {
    return user.roles.includes(UserRoleEnum.SUPER_ADMIN)
  }

  public static isAdmin(user: IUser): boolean {
    return user.roles.includes(UserRoleEnum.ADMIN)
  }

  public static matchRoles(
    targetRoles: string[],
    userRoles: string[],
  ): boolean {
    return targetRoles.every((role) => userRoles.includes(role))
  }
}

export default UserUtil
