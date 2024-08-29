import {
  Body,
  Controller,
  Get,
  Logger,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CreateUserUseCase } from './use-case/create-user.use-case';
import { CreateUserDto } from './dtos/create-user.dto';
import { Users } from './schemas/users.schema';
import { CreateUserTransformPipe } from './pipes/create-user-transform.pipe';
import { tryit } from 'radash';
import CommonResponse from '../../decorators/validate/common-response.decorator';
import { UserEntity } from './entities/user.entity';
import EError from '../../enums/error.enum';
import { User } from '../../decorators/user.decorator';
import { IUser } from './interfaces/user.interface';
import { ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUserByUsernameValidatePipe } from './pipes/get-user-by-username-validate.pipe';
import { Roles } from '../../decorators/roles.decorator';
import { RolesGuard } from '../../guards/roles.guard';
import { UserRoleEnum } from './enums/user-role.enum';

@Controller('users')
export class UsersController {
  private readonly logger = new Logger(UsersController.name);
  constructor(private readonly createUserUseCase: CreateUserUseCase) {}

  @Post()
  @CommonResponse('Users', {
    name: 'create user',
    successType: UserEntity,
    error400: [EError.USERNAME_ALREADY_EXIST],
  })
  async createUser(
    @Body(CreateUserTransformPipe) body: CreateUserDto,
  ): Promise<Users> {
    const { username, password, key } = body;
    const [err, user] = await tryit(this.createUserUseCase.execute)({
      create: {
        username,
        password,
      },
      key,
    });
    if (err) {
      this.logger.error(
        `Catch on createUserUseCase: ${JSON.stringify(
          body,
        )}, error: ${err.message ?? JSON.stringify(err)}`,
      );
    }

    return user;
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
    return user;
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
    return user;
  }
}
