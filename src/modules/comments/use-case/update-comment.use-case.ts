import { Injectable, Logger } from '@nestjs/common'
import { tryit } from 'radash'

import { CommentsService } from '../comments.service'
import { QueryCommentInterface } from '../interfaces/query-comment.interface'
import { Comments } from '../schemas/comments.schema'

@Injectable()
export class UpdateCommentUseCase {
  private readonly logger = new Logger(UpdateCommentUseCase.name)
  constructor(private readonly commentsService: CommentsService) {}

  execute = async (payload: {
    query: QueryCommentInterface
    update: { comment: string }
  }): Promise<Comments> => {
    const [err, comment] = await tryit(this.commentsService.updateComment)(
      payload,
    )
    if (err) {
      this.logger.error(
        `Catch on deleteComment: ${JSON.stringify(
          payload,
        )}, error: ${err.message ?? JSON.stringify(err)}`,
      )
    }

    return comment
  }
}
