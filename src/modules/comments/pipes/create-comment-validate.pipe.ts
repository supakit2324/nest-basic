import {
  BadRequestException,
  Injectable,
  Logger,
  PipeTransform,
} from '@nestjs/common'
import { tryit } from 'radash'

import { CreateCommentDto } from '../dtos/create-comment.dto'

import { GetPostByObjectIdUseCase } from '../../posts/use-case/get-post-by-object-id.use-case'

import EError from '../../../enums/error.enum'

@Injectable()
export class CreateCommentValidatePipe implements PipeTransform {
  private readonly logger = new Logger(CreateCommentValidatePipe.name)
  constructor(
    private readonly getPostByObjectIdUseCase: GetPostByObjectIdUseCase,
  ) {}

  async transform(body: CreateCommentDto): Promise<CreateCommentDto> {
    const [err, post] = await tryit(this.getPostByObjectIdUseCase.execute)(
      body.postsId,
    )
    if (err) {
      this.logger.error(
        `Catch on getPostByObjectIdUseCase: ${JSON.stringify(
          body.postsId,
        )}, error: ${err.message ?? JSON.stringify(err)}`,
      )
    }

    if (!post) {
      throw new BadRequestException({
        message: EError.OBJECT_ID_NOT_FOUND,
        data: body.postsId,
      })
    }

    return body
  }
}
