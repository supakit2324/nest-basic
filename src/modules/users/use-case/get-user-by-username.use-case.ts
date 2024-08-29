import { Injectable, Logger } from '@nestjs/common'
import { tryit } from 'radash'

import { IUser } from '../interfaces/user.interface'
import { UsersService } from '../users.service'

@Injectable()
export class GetUserByUsernameUseCase {
  private readonly logger = new Logger(GetUserByUsernameUseCase.name)
  constructor(private readonly usersService: UsersService) {}

  execute = async (username: string): Promise<IUser> => {
    const [err, user] = await tryit(this.usersService.getUserByUsername)(
      username,
    )

    if (err) {
      this.logger.error(
        `Catch on getUserByUsername: ${JSON.stringify(
          username,
        )}, error: ${err.message ?? JSON.stringify(err)}`,
      )
    }

    return user
  }
}
