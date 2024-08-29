import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common'
import { ApiBearerAuth, ApiBody, ApiParam } from '@nestjs/swagger'
import { seconds, SkipThrottle, Throttle } from '@nestjs/throttler'
import { tryit } from 'radash'

import { CreateCommentDto } from './dtos/create-comment.dto'
import { CommentEntity } from './entities/comment.entity'
import { QueryCommentInterface } from './interfaces/query-comment.interface'
import { CreateCommentValidatePipe } from './pipes/create-comment-validate.pipe'
import { GetCommentByObjectIdValidatePipe } from './pipes/get-comment-by-object-id-validate.pipe'
import { GetCommentIdValidatePipe } from './pipes/get-comment-id-validate.pipe'
import { GetCommentsByPostsValidatePipe } from './pipes/get-comments-by-posts-validate.pipe'
import { GetPostsIdValidatePipe } from './pipes/get-posts-id-validate.pipe'
import { Comments } from './schemas/comments.schema'
import { CreateCommentUseCase } from './use-case/create-comment.use-case'
import { DeleteCommentUseCase } from './use-case/delete-comment.use-case'
import { UpdateCommentUseCase } from './use-case/update-comment.use-case'

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { Posts } from '../posts/schemas/posts.schema'
import { IUser } from '../users/interfaces/user.interface'

import CommonResponse from '../../decorators/common-response.decorator'
import { User } from '../../decorators/user.decorator'

@SkipThrottle()
@Controller('comments')
export class CommentsController {
  private readonly logger = new Logger(CommentsController.name)
  constructor(
    private readonly createCommentUseCase: CreateCommentUseCase,
    private readonly updateCommentUseCase: UpdateCommentUseCase,
    private readonly deleteCommentUseCase: DeleteCommentUseCase,
  ) {}

  @SkipThrottle({ default: false })
  @Throttle({ default: { limit: 3, ttl: seconds(1) } })
  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @CommonResponse('Comments', {
    name: 'create comment',
    successType: CommentEntity,
  })
  async create(
    @User() users: IUser,
    @Body(CreateCommentValidatePipe) body: CreateCommentDto,
  ): Promise<Comments> {
    const create = {
      user: {
        userId: users.userId,
        username: users.username,
      },
      posts: {
        objectId: body.postsId,
      },
      comment: body.comment,
    } as Comments

    const [err, comment] = await tryit(this.createCommentUseCase.execute)(
      create,
    )
    if (err) {
      this.logger.error(
        `Catch on createCommentUseCase: ${JSON.stringify(
          create,
        )}, error: ${err.message ?? JSON.stringify(err)}`,
      )
    }

    return comment
  }

  @Get(':objectId/')
  @ApiParam({
    name: 'objectId',
  })
  @CommonResponse('Comments', {
    name: 'get comment by objectId',
    successType: CommentEntity,
  })
  async getByObjectId(
    @Param(GetCommentByObjectIdValidatePipe) comment: Comments,
  ): Promise<Comments> {
    return comment
  }

  @Get(':postsId/posts/')
  @ApiParam({
    name: 'postsId',
  })
  @CommonResponse('Comments', {
    name: 'get comment by posts',
    successType: CommentEntity,
  })
  async GetCommentsByPost(
    @Param(GetCommentsByPostsValidatePipe) comments: Comments,
  ): Promise<Comments> {
    return comments
  }

  @SkipThrottle({ default: false })
  @Throttle({ default: { limit: 3, ttl: seconds(1) } })
  @Put(':postsId/posts/:commentId/')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiParam({
    name: 'postsId',
  })
  @ApiParam({
    name: 'commentId',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        comment: { example: '' },
      },
    },
  })
  @CommonResponse('Comments', {
    name: 'update comment',
    successType: CommentEntity,
  })
  async updateComment(
    @Param(GetPostsIdValidatePipe) posts: Posts,
    @Param(GetCommentIdValidatePipe) comments: Comments,
    @User() users: IUser,
    @Body() body: { comment: string },
  ): Promise<Comments> {
    const query: QueryCommentInterface = {
      userId: users.userId,
      commentId: comments.objectId,
      postId: posts.objectId,
    }

    const [err, comment] = await tryit(this.updateCommentUseCase.execute)({
      query,
      update: body,
    })
    if (err) {
      this.logger.error(
        `Catch on updateCommentUseCase: ${JSON.stringify(
          query,
        )}, error: ${err.message ?? JSON.stringify(err)}`,
      )
    }

    return comment
  }

  @SkipThrottle({ default: false })
  @Throttle({ default: { limit: 3, ttl: seconds(1) } })
  @Delete(':postsId/posts/:commentId/')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiParam({
    name: 'postsId',
  })
  @ApiParam({
    name: 'commentId',
  })
  @CommonResponse('Comments', {
    name: 'delete comment',
    successType: CommentEntity,
  })
  async deleteComment(
    @Param(GetPostsIdValidatePipe) posts: Posts,
    @Param(GetCommentIdValidatePipe) comments: Comments,
    @User() users: IUser,
  ): Promise<boolean> {
    const query: QueryCommentInterface = {
      userId: users.userId,
      commentId: comments.objectId,
      postId: posts.objectId,
    }

    const [err] = await tryit(this.deleteCommentUseCase.execute)(query)
    if (err) {
      this.logger.error(
        `Catch on updateCommentUseCase: ${JSON.stringify(
          query,
        )}, error: ${err.message ?? JSON.stringify(err)}`,
      )
    }

    return true
  }
}
