import { Injectable, Logger } from '@nestjs/common'
import { tryit } from 'radash'

import { CommentsService } from '../comments.service'
import { Comments } from '../schemas/comments.schema'

@Injectable()
export class CreateCommentUseCase {
  private readonly logger = new Logger(CreateCommentUseCase.name)
  constructor(public readonly commentsService: CommentsService) {}

  execute = async (payload: Comments): Promise<Comments> => {
    const [err, comment] = await tryit(this.commentsService.create)(payload)
    if (err) {
      this.logger.error(
        `Catch on create comment: ${JSON.stringify(
          payload,
        )}, error: ${err.message ?? JSON.stringify(err)}`,
      )
    }

    return comment
  }
}
