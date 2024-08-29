import { Body, Controller, Logger, Post, UseGuards } from '@nestjs/common'
import { ApiBearerAuth } from '@nestjs/swagger'
import { tryit } from 'radash'

import { CreatePostDto } from './dtos/create-post.dto'
import { PostsEntity } from './entities/posts.entity'
import { Posts } from './schemas/posts.schema'
import { CreatePostUseCase } from './use-case/create-post.use-case'

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { IUser } from '../users/interfaces/user.interface'

import CommonResponse from '../../decorators/common-response.decorator'
import { User } from '../../decorators/user.decorator'

@Controller('posts')
export class PostsController {
  private readonly logger = new Logger(PostsController.name)
  constructor(private readonly createPostUseCase: CreatePostUseCase) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @CommonResponse('Posts', {
    name: 'create post',
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
      if (err) {
        this.logger.error(
          `Catch on createPostUseCase: ${JSON.stringify(
            body,
          )}, error: ${err.message ?? JSON.stringify(err)}`,
        )
      }
    }

    return posts
  }
}
