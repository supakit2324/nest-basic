import { Injectable, Logger } from '@nestjs/common';
import { tryit } from 'radash';
import { JwtSignInterface } from '../interfaces/jwt-sign.interface';
import { IUser } from '../../users/interfaces/user.interface';
import { AuthService } from '../auth.service';

@Injectable()
export class LoginUseCase {
  private readonly logger = new Logger(LoginUseCase.name);

  constructor(private readonly authService: AuthService) {}

  execute = async (payload: { user: IUser }): Promise<JwtSignInterface> => {
    const { user } = payload;

    const [err, token] = await tryit(this.authService.login)({
      user,
    });

    if (err) {
      this.logger.error(
        `Catch on login user: ${JSON.stringify(
          payload,
        )}, error: ${err.message ?? JSON.stringify(err)}`,
      );
    }

    return token;
  };
}
