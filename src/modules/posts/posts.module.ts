import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { mongooseModels } from '../../mongoose/mongoose.providers';
import { MONGOOSE_CONNECTION_NAME } from '../../constants';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { CreatePostUseCase } from './use-case/create-post.use-case';

const service = [PostsService];
const useCase = [CreatePostUseCase];

@Module({
  imports: [
    MongooseModule.forFeature(mongooseModels, MONGOOSE_CONNECTION_NAME),
  ],
  controllers: [PostsController],
  providers: [...service, ...useCase],
  exports: [...service, ...useCase],
})
export class PostsModule {}
