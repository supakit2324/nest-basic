import { Body, Controller, Logger, Post, UseGuards } from '@nestjs/common';
import { CreatePostUseCase } from './use-case/create-post.use-case';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import CommonResponse from '../../decorators/validate/common-response.decorator';
import { PostsEntity } from './entities/posts.entity';
import { User } from '../../decorators/user.decorator';
import { IUser } from '../users/interfaces/user.interface';
import { CreatePostDto } from './dtos/create-post.dto';
import { Posts } from './schemas/posts.schema';
import { tryit } from 'radash';

@Controller('posts')
export class PostsController {
  private readonly logger = new Logger(PostsController.name);
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
    const { userId, username } = users;
    const [err, posts] = await tryit(this.createPostUseCase.execute)({
      title: body.title,
      description: body.description,
      user: {
        userId,
        username,
      },
    });
    if (err) {
      if (err) {
        this.logger.error(
          `Catch on createPostUseCase: ${JSON.stringify(
            body,
          )}, error: ${err.message ?? JSON.stringify(err)}`,
        );
      }
    }

    return posts;
  }
}
