import { Injectable, Logger } from '@nestjs/common'
import { tryit } from 'radash'

import { PostsService } from '../posts.service'
import { Posts } from '../schemas/posts.schema'

@Injectable()
export class DeletePostUseCase {
  private readonly logger = new Logger(DeletePostUseCase.name)
  constructor(private readonly postsService: PostsService) {}

  execute = async (payload: {
    objectId: string
    userId: string
  }): Promise<Posts> => {
    const [err, posts] = await tryit(this.postsService.delete)(payload)
    if (err) {
      this.logger.error(
        `Catch on delete posts: ${JSON.stringify(
          payload,
        )}, error: ${err.message ?? JSON.stringify(err)}`,
      )
    }

    return posts
  }
}
