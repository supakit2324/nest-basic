import { Body, Controller, Logger, Post } from '@nestjs/common';
import { CreateUserUseCase } from './use-case/create-user.use-case';
import { CreateUserDto } from './dtos/create-user.dto';
import { Users } from './schemas/users.schema';
import { CreateUserTransformPipe } from './pipes/create-user-transform.pipe';
import { tryit } from 'radash';
import CommonResponse from '../../decorators/validate/common-response.decorator';
import { UserEntity } from './entities/user.entity';
import EError from '../../enums/error.enum';

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
    const [err, user] = await tryit(this.createUserUseCase.execute)(body);
    if (err) {
      this.logger.error(
        `Catch on createUserUseCase: ${JSON.stringify(
          body,
        )}, error: ${err.message ?? JSON.stringify(err)}`,
      );
    }

    return user;
  }
}
