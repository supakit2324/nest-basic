import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { AuthService } from './auth.service';
import { LoginUseCase } from './use-case/login.use-case';
import { JwtService } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';

const service = [AuthService];
const useCase = [LoginUseCase];

@Module({
  imports: [UsersModule],
  controllers: [AuthController],
  providers: [...service, ...useCase, JwtService, JwtStrategy, LocalStrategy],
  exports: [...service, ...useCase, JwtStrategy, LocalStrategy],
})
export class AuthModule {}
