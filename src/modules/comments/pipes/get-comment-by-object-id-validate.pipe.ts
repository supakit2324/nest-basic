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
export class GetCommentByObjectIdValidatePipe implements PipeTransform {
  private readonly logger = new Logger(GetCommentByObjectIdValidatePipe.name)
  constructor(
    private readonly getCommentByObjectIdUseCase: GetCommentByObjectIdUseCase,
  ) {}

  async transform(value: { objectId: string }): Promise<Comments> {
    const [err, comment] = await tryit(
      this.getCommentByObjectIdUseCase.execute,
    )(value.objectId)
    if (err) {
      this.logger.error(
        `Catch on getCommentByObjectIdUseCase: ${JSON.stringify(
          value.objectId,
        )}, error: ${err.message ?? JSON.stringify(err)}`,
      )
    }

    if (!comment) {
      throw new BadRequestException({
        message: EError.OBJECT_ID_NOT_FOUND,
        data: value.objectId,
      })
    }

    return comment
  }
}
