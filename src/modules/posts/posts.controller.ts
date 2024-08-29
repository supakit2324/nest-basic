import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common'
import { ApiBearerAuth, ApiParam } from '@nestjs/swagger'
import { seconds, SkipThrottle, Throttle } from '@nestjs/throttler'
import { tryit } from 'radash'

import { CreatePostDto } from './dtos/create-post.dto'
import { UpdatePostDto } from './dtos/update-post.dto'
import { PostsPaginationResponseEntity } from './entities/posts-pagination-response.entity'
import { PostsEntity } from './entities/posts.entity'
import { GetPostsByObjectIdValidatePipe } from './pipes/get-posts-by-object-id-validate.pipe'
import { Posts } from './schemas/posts.schema'
import { CreatePostUseCase } from './use-case/create-post.use-case'
import { DeletePostUseCase } from './use-case/delete-post.use-case'
import { GetPostsPaginationUseCase } from './use-case/get-posts-pagination.use-case'
import { UpdatePostUseCase } from './use-case/update-post.use-case'

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { IUser } from '../users/interfaces/user.interface'

import { CacheDuration } from '../../constants'
import { CommonCacheDecorator } from '../../decorators/common-cache.decorator'
import CommonResponse from '../../decorators/common-response.decorator'
import { User } from '../../decorators/user.decorator'
import { QueryPaginationBaseDto } from '../../dtos/query-pagination-base.dto'
import { PaginationResponseInterface } from '../../interfaces/pagination-response.interface'

@SkipThrottle()
@Controller('posts')
export class PostsController {
  private readonly logger = new Logger(PostsController.name)
  constructor(
    private readonly createPostUseCase: CreatePostUseCase,
    private readonly getPostsPaginationUseCase: GetPostsPaginationUseCase,
    private readonly deletePostUseCase: DeletePostUseCase,
    private readonly updatePostUseCase: UpdatePostUseCase,
  ) {}

  @SkipThrottle({ default: false })
  @Throttle({ default: { limit: 3, ttl: seconds(1) } })
  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @CommonResponse('Posts', {
    name: 'create posts',
    successType: PostsEntity,
  })
  async create(
    @User() users: IUser,
    @Body() body: CreatePostDto,
  ): Promise<Posts> {
    const { userId, username } = users
    const [err, posts] = await tryit(this.createPostUseCase.execute)({
      title: body.title,
      description: body.description,
      user: {
        userId,
        username,
      },
    })
    if (err) {
      this.logger.error(
        `Catch on createPostUseCase: ${JSON.stringify(
          body,
        )}, error: ${err.message ?? JSON.stringify(err)}`,
      )
    }

    return posts
  }

  @CommonCacheDecorator(CacheDuration.ONE_MINUTE)
  @Get()
  @CommonResponse('Posts', {
    name: 'posts pagination',
    successType: PostsPaginationResponseEntity,
  })
  async pagination(
    @Query()
    query: QueryPaginationBaseDto,
  ): Promise<PaginationResponseInterface<Posts>> {
    const [err, pagination] = await tryit(
      this.getPostsPaginationUseCase.execute,
    )(query)
    if (err) {
      this.logger.error(
        `Catch on get post pagination: ${JSON.stringify(
          query,
        )}, error: ${err.message ?? JSON.stringify(err)}`,
      )
    }

    return pagination
  }

  @CommonCacheDecorator(CacheDuration.THIRTY_SECONDS)
  @Get(':objectId/')
  @ApiParam({
    name: 'objectId',
  })
  @CommonResponse('Posts', {
    name: 'get posts by object id',
    successType: PostsEntity,
  })
  async getByObjectId(
    @Param(GetPostsByObjectIdValidatePipe) posts: Posts,
  ): Promise<Posts> {
    return posts
  }

  @SkipThrottle({ default: false })
  @Throttle({ default: { limit: 3, ttl: seconds(1) } })
  @Put(':objectId/')
  @ApiParam({
    name: 'objectId',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @CommonResponse('Posts', {
    name: 'update posts by object id',
    successType: PostsEntity,
  })
  async updateByObjectId(
    @Param(GetPostsByObjectIdValidatePipe) posts: Posts,
    @User() users: IUser,
    @Body() body: UpdatePostDto,
  ): Promise<Posts> {
    const update = {
      objectId: posts.objectId,
      user: {
        userId: users.userId,
        username: users.username,
      },
      ...body,
    }

    const [err, updated] = await tryit(this.updatePostUseCase.execute)(
      update as Posts,
    )

    if (err) {
      this.logger.error(
        `Catch on get update posts: ${JSON.stringify(
          update,
        )}, error: ${err.message ?? JSON.stringify(err)}`,
      )
    }

    return updated
  }

  @SkipThrottle({ default: false })
  @Throttle({ default: { limit: 3, ttl: seconds(1) } })
  @Delete(':objectId/')
  @ApiParam({ name: 'objectId' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @CommonResponse('Posts', {
    name: 'delete posts',
    successType: true,
  })
  async delete(
    @Param(GetPostsByObjectIdValidatePipe) posts: Posts,
    @User() users: IUser,
  ): Promise<boolean> {
    const [err] = await tryit(this.deletePostUseCase.execute)({
      objectId: posts.objectId,
      userId: users.userId,
    })

    if (err) {
      this.logger.error(
        `Catch on get delete posts: ${JSON.stringify(
          posts.objectId,
        )}, error: ${err.message ?? JSON.stringify(err)}`,
      )
    }

    return true
  }
}
