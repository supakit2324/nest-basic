import {
  Body,
  Controller,
  Get,
  Logger,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common'
import { ApiBearerAuth, ApiBody, ApiParam, ApiQuery } from '@nestjs/swagger'
import { tryit } from 'radash'

import { CreateUserDto } from './dtos/create-user.dto'
import { UserEntity } from './entities/user.entity'
import { UserRoleEnum } from './enums/user-role.enum'
import { UserStatusEnum } from './enums/user-status.enum'
import { IUser } from './interfaces/user.interface'
import { CreateUserTransformPipe } from './pipes/create-user-transform.pipe'
import { GetUserByUsernameValidatePipe } from './pipes/get-user-by-username-validate.pipe'
import { UpdateUserValidatePipe } from './pipes/update-user-validate.pipe'
import { Users } from './schemas/users.schema'
import { CreateUserUseCase } from './use-case/create-user.use-case'
import { UpdateUserStatusUseCase } from './use-case/update-user-status.use.case'
import { UpdateUserUseCase } from './use-case/update-user.use-case'

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'

import CommonResponse from '../../decorators/common-response.decorator'
import { Roles } from '../../decorators/roles.decorator'
import { User } from '../../decorators/user.decorator'
import EError from '../../enums/error.enum'
import { RolesGuard } from '../../guards/roles.guard'

@Controller('users')
export class UsersController {
  private readonly logger = new Logger(UsersController.name)
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase,
    private readonly updateUserStatusUseCase: UpdateUserStatusUseCase,
  ) {}

  @Post()
  @CommonResponse('Users', {
    name: 'create user',
    successType: UserEntity,
    error400: [EError.USERNAME_ALREADY_EXIST],
  })
  async createUser(
    @Body(CreateUserTransformPipe) body: CreateUserDto,
  ): Promise<Users> {
    const { username, password, key } = body
    const [err, user] = await tryit(this.createUserUseCase.execute)({
      create: {
        username,
        password,
      },
      key,
    })
    if (err) {
      this.logger.error(
        `Catch on createUserUseCase: ${JSON.stringify(
          body,
        )}, error: ${err.message ?? JSON.stringify(err)}`,
      )
    }

    return user
  }

  @Get('me')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @CommonResponse('Users', {
    name: 'get me',
    successType: UserEntity,
    error400: [EError.USERNAME_NOT_FOUND],
  })
  async getMe(@User() user: IUser): Promise<UserEntity> {
    return user
  }

  @Roles([UserRoleEnum.ADMIN])
  @Get(':username/exist')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @CommonResponse('Users', {
    name: 'get user already exist by username',
    successType: UserEntity,
    error400: [EError.USERNAME_NOT_FOUND],
  })
  @ApiParam({
    name: 'username',
  })
  async getUserAlreadyExistByUsername(
    @Param('username', GetUserByUsernameValidatePipe) user: IUser,
  ): Promise<UserEntity> {
    return user
  }

  @Put()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @CommonResponse('Users', {
    name: 'update user',
    successType: UserEntity,
    error400: [EError.USERNAME_ALREADY_EXIST],
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        NewUsername: { example: 'ocha777' },
      },
    },
  })
  async updateUser(
    @User() user: IUser,
    @Body(UpdateUserValidatePipe) body: { NewUsername: string },
  ): Promise<IUser> {
    const [err, userUpdated] = await tryit(this.updateUserUseCase.execute)({
      user,
      update: body,
    })
    if (err) {
      this.logger.error(
        `Catch on updateUserUseCase: ${JSON.stringify(
          body,
        )}, error: ${err.message ?? JSON.stringify(err)}`,
      )
    }

    return userUpdated
  }

  @Roles([UserRoleEnum.ADMIN])
  @Put(':username/status')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @CommonResponse('Users', {
    name: 'update user status',
    successType: UserEntity,
    error400: [EError.USERNAME_NOT_FOUND],
  })
  @ApiParam({
    name: 'username',
  })
  @ApiQuery({
    name: 'status',
    enum: UserStatusEnum,
  })
  async updateUserStatus(
    @Param(GetUserByUsernameValidatePipe) user: IUser,
    @Query() query: { status: UserStatusEnum },
  ): Promise<IUser> {
    const [err, userUpdated] = await tryit(
      this.updateUserStatusUseCase.execute,
    )({
      username: user.username,
      status: query.status,
    })
    if (err) {
      this.logger.error(
        `Catch on updateUserStatusUseCase: ${JSON.stringify(
          query,
        )}, error: ${err.message ?? JSON.stringify(err)}`,
      )
    }

    return userUpdated
  }
}
