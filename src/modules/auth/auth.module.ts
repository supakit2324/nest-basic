import { Module } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'

import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { JwtStrategy } from './strategies/jwt.strategy'
import { LocalStrategy } from './strategies/local.strategy'
import { LoginUseCase } from './use-case/login.use-case'

import { UsersModule } from '../users/users.module'

const service = [AuthService]
const useCase = [LoginUseCase]

@Module({
  imports: [UsersModule],
  controllers: [AuthController],
  providers: [...service, ...useCase, JwtService, JwtStrategy, LocalStrategy],
  exports: [...service, ...useCase, JwtStrategy, LocalStrategy],
})
export class AuthModule {}
