import {
  BadRequestException,
  Injectable,
  Logger,
  PipeTransform,
} from '@nestjs/common'
import { tryit } from 'radash'

import { Comments } from '../schemas/comments.schema'
import { GetCommentsByPostUseCase } from '../use-case/get-comments-by-post.use-case'

import EError from '../../../enums/error.enum'

@Injectable()
export class GetCommentsByPostsValidatePipe implements PipeTransform {
  private readonly logger = new Logger(GetCommentsByPostsValidatePipe.name)
  constructor(
    private readonly getCommentsByPostUseCase: GetCommentsByPostUseCase,
  ) {}

  async transform(value: { postsId: string }): Promise<Comments[]> {
    const [err, comments] = await tryit(this.getCommentsByPostUseCase.execute)(
      value.postsId,
    )
    if (err) {
      this.logger.error(
        `Catch on getCommentsByPostUseCase: ${JSON.stringify(
          value.postsId,
        )}, error: ${err.message ?? JSON.stringify(err)}`,
      )
    }

    if (!comments) {
      throw new BadRequestException({
        message: EError.POSTS_ID_NOT_FOUND,
        data: value.postsId,
      })
    }

    return comments
  }
}
