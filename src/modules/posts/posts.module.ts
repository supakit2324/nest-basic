import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { PostsController } from './posts.controller'
import { PostsService } from './posts.service'
import { CreatePostUseCase } from './use-case/create-post.use-case'

import { MONGOOSE_CONNECTION_NAME } from '../../constants'
import { mongooseModels } from '../../mongoose/mongoose.providers'

const service = [PostsService]
const useCase = [CreatePostUseCase]

@Module({
  imports: [
    MongooseModule.forFeature(mongooseModels, MONGOOSE_CONNECTION_NAME),
  ],
  controllers: [PostsController],
  providers: [...service, ...useCase],
  exports: [...service, ...useCase],
})
export class PostsModule {}
