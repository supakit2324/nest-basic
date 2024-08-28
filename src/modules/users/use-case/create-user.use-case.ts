import { Injectable, Logger } from '@nestjs/common';
import { UsersService } from '../users.service';
import { Users } from '../schemas/users.schema';
import { tryit } from 'radash';
import { IUser } from '../interfaces/user.interface';

@Injectable()
export class CreateUserUseCase {
  private readonly logger = new Logger(CreateUserUseCase.name);
  constructor(private readonly usersService: UsersService) {}

  execute = async (payload: IUser): Promise<Users> => {
    const [err, user] = await tryit(this.usersService.create)(payload);

    if (err) {
      this.logger.error(
        `Catch on create user: ${JSON.stringify(
          payload,
        )}, error: ${err.message ?? JSON.stringify(err)}`,
      );
    }

    return user;
  };
}
