import {
  BadRequestException,
  Injectable,
  Logger,
  PipeTransform,
} from '@nestjs/common'
import { tryit } from 'radash'

import { Posts } from '../schemas/posts.schema'
import { GetPostByObjectIdUseCase } from '../use-case/get-post-by-object-id.use-case'

import EError from '../../../enums/error.enum'

@Injectable()
export class GetPostsByObjectIdValidatePipe implements PipeTransform {
  private readonly logger = new Logger(GetPostsByObjectIdValidatePipe.name)
  constructor(
    private readonly getPostByObjectIdUseCase: GetPostByObjectIdUseCase,
  ) {}

  async transform(value: { objectId: string }): Promise<Posts> {
    const [err, posts] = await tryit(this.getPostByObjectIdUseCase.execute)(
      value.objectId,
    )
    if (err) {
      this.logger.error(
        `Catch on getPostByObjectIdUseCase: ${JSON.stringify(
          value.objectId,
        )}, error: ${err.message ?? JSON.stringify(err)}`,
      )
    }
    if (!posts) {
      throw new BadRequestException({
        message: EError.OBJECT_ID_NOT_FOUND,
        data: value.objectId,
      })
    }

    return posts
  }
}
