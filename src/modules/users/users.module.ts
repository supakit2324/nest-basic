import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { mongooseModels } from '../../mongoose/mongoose.providers';
import { MONGOOSE_CONNECTION_NAME } from '../../constants';
import { GetUserByUsernameUseCase } from './use-case/get-user-by-username.use-case';
import { CreateUserUseCase } from './use-case/create-user.use-case';

const service = [UsersService];
const useCase = [GetUserByUsernameUseCase, CreateUserUseCase];

@Module({
  imports: [
    MongooseModule.forFeature(mongooseModels, MONGOOSE_CONNECTION_NAME),
  ],
  controllers: [UsersController],
  providers: [...service, ...useCase],
  exports: [...service, ...useCase],
})
export class UsersModule {}
