import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { CreateUserUseCase } from './use-case/create-user.use-case'
import { GetUserByUsernameUseCase } from './use-case/get-user-by-username.use-case'
import { UpdateUserStatusUseCase } from './use-case/update-user-status.use.case'
import { UpdateUserUseCase } from './use-case/update-user.use-case'
import { UsersController } from './users.controller'
import { UsersService } from './users.service'

import { MONGOOSE_CONNECTION_NAME } from '../../constants'
import { mongooseModels } from '../../mongoose/mongoose.providers'

const service = [UsersService]
const useCase = [
  GetUserByUsernameUseCase,
  CreateUserUseCase,
  UpdateUserUseCase,
  UpdateUserStatusUseCase,
]

@Module({
  imports: [
    MongooseModule.forFeature(mongooseModels, MONGOOSE_CONNECTION_NAME),
  ],
  controllers: [UsersController],
  providers: [...service, ...useCase],
  exports: [...service, ...useCase],
})
export class UsersModule {}
