import {
  BadRequestException,
  Injectable,
  Logger,
  PipeTransform,
} from '@nestjs/common'
import { tryit } from 'radash'

import { Comments } from '../schemas/comments.schema'
import { GetCommentByObjectIdUseCase } from '../use-case/get-comment-by-object-id.use-case'

import EError from '../../../enums/error.enum'

@Injectable()
export class GetCommentIdValidatePipe implements PipeTransform {
  private readonly logger = new Logger(GetCommentIdValidatePipe.name)
  constructor(
    private readonly getCommentByObjectIdUseCase: GetCommentByObjectIdUseCase,
  ) {}

  async transform(value: { commentId: string }): Promise<Comments> {
    const { commentId } = value
    const [err, comment] = await tryit(
      this.getCommentByObjectIdUseCase.execute,
    )(commentId)
    if (err) {
      this.logger.error(
        `Catch on getCommentByObjectIdUseCase: ${JSON.stringify(
          commentId,
        )}, error: ${err.message ?? JSON.stringify(err)}`,
      )
    }

    if (!comment) {
      throw new BadRequestException({
        message: EError.COMMENT_ID_NOT_FOUND,
        data: commentId,
      })
    }

    return comment
  }
}
