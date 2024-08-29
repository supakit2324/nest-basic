import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { CommentsController } from './comments.controller'
import { CommentsService } from './comments.service'
import { CreateCommentUseCase } from './use-case/create-comment.use-case'
import { DeleteCommentUseCase } from './use-case/delete-comment.use-case'
import { GetCommentByObjectIdUseCase } from './use-case/get-comment-by-object-id.use-case'
import { GetCommentsByPostUseCase } from './use-case/get-comments-by-post.use-case'
import { UpdateCommentUseCase } from './use-case/update-comment.use-case'

import { PostsModule } from '../posts/posts.module'

import { MONGOOSE_CONNECTION_NAME } from '../../constants'
import { mongooseModels } from '../../mongoose/mongoose.providers'

const service = [CommentsService]
const useCase = [
  CreateCommentUseCase,
  GetCommentByObjectIdUseCase,
  GetCommentsByPostUseCase,
  UpdateCommentUseCase,
  DeleteCommentUseCase,
]

@Module({
  imports: [
    MongooseModule.forFeature(mongooseModels, MONGOOSE_CONNECTION_NAME),
    PostsModule,
  ],
  controllers: [CommentsController],
  providers: [...service, ...useCase],
  exports: [...service, ...useCase],
})
export class CommentsModule {}
