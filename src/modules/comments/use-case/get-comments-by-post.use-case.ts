import { Injectable, Logger } from '@nestjs/common'
import { tryit } from 'radash'

import { CommentsService } from '../comments.service'
import { Comments } from '../schemas/comments.schema'

@Injectable()
export class GetCommentsByPostUseCase {
  private readonly logger = new Logger(GetCommentsByPostUseCase.name)

  constructor(private readonly commentsService: CommentsService) {}

  execute = async (postId: string): Promise<Comments[]> => {
    const [err, comment] = await tryit(this.commentsService.getCommentsByPosts)(
      postId,
    )
    if (err) {
      this.logger.error(
        `Catch on getCommentsByPosts: ${JSON.stringify(
          postId,
        )}, error: ${err.message ?? JSON.stringify(err)}`,
      )
    }

    return comment
  }
}
