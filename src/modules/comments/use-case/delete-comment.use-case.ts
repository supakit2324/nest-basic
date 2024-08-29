import { Injectable, Logger } from '@nestjs/common'
import { tryit } from 'radash'

import { CommentsService } from '../comments.service'
import { QueryCommentInterface } from '../interfaces/query-comment.interface'
import { Comments } from '../schemas/comments.schema'

@Injectable()
export class DeleteCommentUseCase {
  private readonly logger = new Logger(DeleteCommentUseCase.name)
  constructor(private readonly commentsService: CommentsService) {}

  execute = async (payload: QueryCommentInterface): Promise<Comments> => {
    const [err, comment] = await tryit(this.commentsService.deleteComment)(
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
