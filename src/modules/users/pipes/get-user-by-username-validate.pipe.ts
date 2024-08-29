import {
  BadRequestException,
  Injectable,
  Logger,
  PipeTransform,
} from '@nestjs/common'
import { tryit } from 'radash'

import { IUser } from '../interfaces/user.interface'
import { GetUserByUsernameUseCase } from '../use-case/get-user-by-username.use-case'

import EError from '../../../enums/error.enum'

@Injectable()
export class GetUserByUsernameValidatePipe implements PipeTransform {
  private readonly logger = new Logger(GetUserByUsernameValidatePipe.name)
  constructor(
    private readonly getUserByUsernameUseCase: GetUserByUsernameUseCase,
  ) {}

  async transform(value: { username: string }): Promise<IUser> {
    const [err, user] = await tryit(this.getUserByUsernameUseCase.execute)(
      value.username,
    )

    if (err) {
      this.logger.error(
        `Catch on getUserByUsernameUseCase: ${JSON.stringify(
          value.username,
        )}, error: ${err.message ?? JSON.stringify(err)}`,
      )
    }

    if (!user) {
      throw new BadRequestException({
        message: EError.USERNAME_NOT_FOUND,
        data: value.username,
      })
    }

    return user
  }
}
