import { Injectable, Logger } from '@nestjs/common'
import { tryit } from 'radash'

import { IUser } from '../interfaces/user.interface'
import { UsersService } from '../users.service'

@Injectable()
export class UpdateUserUseCase {
  private readonly logger = new Logger(UpdateUserUseCase.name)
  constructor(private readonly usersService: UsersService) {}

  execute = async (payload: {
    user: IUser
    update: { NewUsername: string }
  }): Promise<IUser> => {
    const [err, user] = await tryit(this.usersService.updateUser)(payload)

    if (err) {
      this.logger.error(
        `Catch on update user: ${JSON.stringify(
          payload,
        )}, error: ${err.message ?? JSON.stringify(err)}`,
      )
    }

    return user
  }
}
