import { Injectable, Logger } from '@nestjs/common'
import { tryit } from 'radash'

import { CommentsService } from '../comments.service'
import { Comments } from '../schemas/comments.schema'

@Injectable()
export class GetCommentByObjectIdUseCase {
  private readonly logger = new Logger(GetCommentByObjectIdUseCase.name)

  constructor(private readonly commentsService: CommentsService) {}

  execute = async (objectId: string): Promise<Comments> => {
    const [err, comment] = await tryit(this.commentsService.getByObjectId)(
      objectId,
    )
    if (err) {
      this.logger.error(
        `Catch on getByObjectId: ${JSON.stringify(
          objectId,
        )}, error: ${err.message ?? JSON.stringify(err)}`,
      )
    }

    return comment
  }
}
