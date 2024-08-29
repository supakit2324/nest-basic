import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { tryit } from 'radash';
import { GetUserByUsernameUseCase } from '../../users/use-case/get-user-by-username.use-case';
import { UserStatusEnum } from '../../users/enums/user-status.enum';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(JwtStrategy.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly getUserByUsernameUseCase: GetUserByUsernameUseCase,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('authentication.secret'),
    });
  }

  async validate(jwtPayload: any, done: any): Promise<void> {
    const { username } = jwtPayload;
    const [error, user] = await tryit(this.getUserByUsernameUseCase.execute)(
      username,
    );

    if (error) {
      throw new InternalServerErrorException();
    }
    if (!user) {
      throw new UnauthorizedException();
    }

    if (user?.status !== UserStatusEnum.ACTIVE) {
      throw new UnauthorizedException();
    }

    done(null, user);
  }
}
