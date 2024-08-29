import {
  BadRequestException,
  Injectable,
  Logger,
  PipeTransform,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import bcrypt from 'bcrypt'
import { tryit } from 'radash'

import { CreateUserDto } from '../dtos/create-user.dto'
import { GetUserByUsernameUseCase } from '../use-case/get-user-by-username.use-case'

import EError from '../../../enums/error.enum'

@Injectable()
export class CreateUserTransformPipe implements PipeTransform {
  private readonly logger = new Logger(CreateUserTransformPipe.name)
  constructor(
    private readonly configService: ConfigService,
    private readonly getUserByUsernameUseCase: GetUserByUsernameUseCase,
  ) {}

  async transform(body: CreateUserDto): Promise<CreateUserDto> {
    const { username, password } = body
    const [err, user] = await tryit(this.getUserByUsernameUseCase.execute)(
      username,
    )

    if (err) {
      this.logger.error(
        `Catch on getUserByUsernameUseCase: ${JSON.stringify(
          username,
        )}, error: ${err.message ?? JSON.stringify(err)}`,
      )
    }

    if (user) {
      throw new BadRequestException({
        message: EError.USERNAME_ALREADY_EXIST,
        data: username,
      })
    }

    const hashSize = this.configService.get<number>('authentication.hashSize')
    const hashedPassword = await bcrypt.hash(password, hashSize)

    return { ...body, password: hashedPassword }
  }
}
