import {
  Body,
  Controller,
  InternalServerErrorException,
  Logger,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUseCase } from './use-case/login.use-case';
import CommonResponse from '../../decorators/validate/common-response.decorator';
import { LoginEntity } from './entities/login.entity';
import EError from '../../enums/error.enum';
import { LoginDto } from './dtos/login.dto';
import { User } from '../../decorators/user.decorator';
import { IUser } from '../users/interfaces/user.interface';
import { JwtSignInterface } from './interfaces/jwt-sign.interface';
import { ApiBody } from '@nestjs/swagger';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { tryit } from 'radash';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);
  constructor(private readonly loginUseCase: LoginUseCase) {}

  @Post()
  @UseGuards(LocalAuthGuard)
  @CommonResponse('Auth', {
    name: 'user login',
    successType: LoginEntity,
    error400: [EError.USERNAME_NOT_FOUND],
  })
  @ApiBody({
    type: LoginDto,
  })
  async login(@User() user: IUser): Promise<JwtSignInterface> {
    const [err, token] = await tryit(this.loginUseCase.execute)({ user });

    if (err) {
      this.logger.error(`Login Error: ${err.message ?? err}`);
      throw new InternalServerErrorException({
        message: err.message ?? err,
      });
    }

    return token;
  }
}
