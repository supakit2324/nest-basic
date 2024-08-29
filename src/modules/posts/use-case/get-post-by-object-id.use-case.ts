import { Injectable, Logger } from '@nestjs/common'
import { tryit } from 'radash'

import { PostsService } from '../posts.service'
import { Posts } from '../schemas/posts.schema'

@Injectable()
export class GetPostByObjectIdUseCase {
  private readonly logger = new Logger(GetPostByObjectIdUseCase.name)
  constructor(private readonly postsService: PostsService) {}

  execute = async (objectId: string): Promise<Posts> => {
    const [err, posts] = await tryit(this.postsService.getByObjectId)(objectId)
    if (err) {
      this.logger.error(
        `Catch on getByObjectId: ${JSON.stringify(
          objectId,
        )}, error: ${err.message ?? JSON.stringify(err)}`,
      )
    }

    return posts
  }
}
