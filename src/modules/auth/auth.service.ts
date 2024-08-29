import { Injectable, Logger, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService, JwtSignOptions } from '@nestjs/jwt'
import bcrypt from 'bcrypt'
import { tryit } from 'radash'

import { JwtSignInterface } from './interfaces/jwt-sign.interface'

import { UserStatusEnum } from '../users/enums/user-status.enum'
import { IUser } from '../users/interfaces/user.interface'
import { GetUserByUsernameUseCase } from '../users/use-case/get-user-by-username.use-case'

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name)

  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly getUserByUsernameUseCase: GetUserByUsernameUseCase,
  ) {}

  async validateUser(username: string, password: string): Promise<IUser> {
    const [errUser, user] = await tryit(this.getUserByUsernameUseCase.execute)(
      username,
    )

    if (errUser) {
      this.logger.error(`validateUser : ${errUser.message ?? errUser}`)
      throw new UnauthorizedException()
    }

    if (!user) {
      this.logger.error(`user not found`)
      throw new UnauthorizedException()
    }

    if (user.status !== UserStatusEnum.ACTIVE) {
      this.logger.error(`user in active`)
      throw new UnauthorizedException()
    }

    const isMatchPassword = await this.comparePassword(password, user.password)

    if (!isMatchPassword) {
      this.logger.error(`password not matched`)
      throw new UnauthorizedException()
    }

    return user
  }

  async comparePassword(original: string, hashed: string): Promise<boolean> {
    return bcrypt.compare(original, hashed)
  }

  login = async (payload: { user: IUser }): Promise<JwtSignInterface> => {
    const { user } = payload

    const jwtOptions: JwtSignOptions = {
      secret: this.configService.get('authentication.secret'),
    }

    return {
      accessToken: this.jwtService.sign(
        { username: user.username },
        jwtOptions,
      ),
    }
  }
}
