import { CacheModule } from '@nestjs/cache-manager'
import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { PostsController } from './posts.controller'
import { PostsService } from './posts.service'
import { CreatePostUseCase } from './use-case/create-post.use-case'
import { DeletePostUseCase } from './use-case/delete-post.use-case'
import { GetPostByObjectIdUseCase } from './use-case/get-post-by-object-id.use-case'
import { GetPostsPaginationUseCase } from './use-case/get-posts-pagination.use-case'
import { UpdatePostUseCase } from './use-case/update-post.use-case'

import { MONGOOSE_CONNECTION_NAME } from '../../constants'
import { mongooseModels } from '../../mongoose/mongoose.providers'
import CacheModuleOptions from '../../redis-cache/redis-cache-options'

const service = [PostsService]
const useCase = [
  CreatePostUseCase,
  DeletePostUseCase,
  GetPostsPaginationUseCase,
  GetPostByObjectIdUseCase,
  UpdatePostUseCase,
]

@Module({
  imports: [
    CacheModule.registerAsync(CacheModuleOptions),
    MongooseModule.forFeature(mongooseModels, MONGOOSE_CONNECTION_NAME),
  ],
  controllers: [PostsController],
  providers: [...service, ...useCase],
  exports: [...service, ...useCase],
})
export class PostsModule {}
