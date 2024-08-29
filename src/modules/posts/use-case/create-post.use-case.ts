import { Injectable, Logger } from '@nestjs/common'
import { tryit } from 'radash'

import { CreatePostsInterface } from '../interfaces/create-posts.interface'
import { PostsService } from '../posts.service'
import { Posts } from '../schemas/posts.schema'

@Injectable()
export class CreatePostUseCase {
  private readonly logger = new Logger(CreatePostUseCase.name)
  constructor(private readonly postsService: PostsService) {}

  execute = async (payload: CreatePostsInterface): Promise<Posts> => {
    const [err, posts] = await tryit(this.postsService.create)(payload as Posts)

    if (err) {
      this.logger.error(
        `Catch on create posts: ${JSON.stringify(
          payload,
        )}, error: ${err.message ?? JSON.stringify(err)}`,
      )
    }

    return posts
  }
}
