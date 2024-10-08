import { Injectable, Logger } from '@nestjs/common'
import { tryit } from 'radash'

import { UserRoleEnum } from '../enums/user-role.enum'
import { IUser } from '../interfaces/user.interface'
import { Users } from '../schemas/users.schema'
import { UsersService } from '../users.service'

@Injectable()
export class CreateUserUseCase {
  private readonly logger = new Logger(CreateUserUseCase.name)
  constructor(private readonly usersService: UsersService) {}

  execute = async (payload: {
    create: IUser
    key?: string
  }): Promise<Users> => {
    const { create, key } = payload

    if (key === process.env.CREATE_ADMIN_KEY) {
      create.roles = [...Object.values(UserRoleEnum)]
    }

    const [err, user] = await tryit(this.usersService.create)(create)

    if (err) {
      this.logger.error(
        `Catch on create user: ${JSON.stringify(
          payload,
        )}, error: ${err.message ?? JSON.stringify(err)}`,
      )
    }

    return user
  }
}
