import { Injectable, Logger } from '@nestjs/common'
import { tryit } from 'radash'

import { UserStatusEnum } from '../enums/user-status.enum'
import { IUser } from '../interfaces/user.interface'
import { UsersService } from '../users.service'

@Injectable()
export class UpdateUserStatusUseCase {
  private readonly logger = new Logger(UpdateUserStatusUseCase.name)
  constructor(private readonly usersService: UsersService) {}

  execute = async (payload: {
    username: string
    status: UserStatusEnum
  }): Promise<IUser> => {
    const [err, user] = await tryit(this.usersService.updateUserStatus)(payload)

    if (err) {
      this.logger.error(
        `Catch on update user status: ${JSON.stringify(
          payload,
        )}, error: ${err.message ?? JSON.stringify(err)}`,
      )
    }

    return user
  }
}
