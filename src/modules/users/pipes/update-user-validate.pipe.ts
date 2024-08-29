import {
  BadRequestException,
  Injectable,
  Logger,
  PipeTransform,
} from '@nestjs/common';
import { GetUserByUsernameUseCase } from '../use-case/get-user-by-username.use-case';
import { tryit } from 'radash';
import EError from '../../../enums/error.enum';

@Injectable()
export class UpdateUserValidatePipe implements PipeTransform {
  private readonly logger = new Logger(UpdateUserValidatePipe.name);
  constructor(
    private readonly getUserByUsernameUseCase: GetUserByUsernameUseCase,
  ) {}

  async transform(body: {
    NewUsername: string;
  }): Promise<{ NewUsername: string }> {
    const { NewUsername } = body;
    const [err, user] = await tryit(this.getUserByUsernameUseCase.execute)(
      NewUsername,
    );

    if (err) {
      this.logger.error(
        `Catch on getUserByUsernameUseCase: ${JSON.stringify(
          NewUsername,
        )}, error: ${err.message ?? JSON.stringify(err)}`,
      );
    }

    if (user) {
      throw new BadRequestException({
        message: EError.USERNAME_ALREADY_EXIST,
        data: NewUsername,
      });
    }

    return { ...body };
  }
}
