import {
  BadRequestException,
  Injectable,
  Logger,
  PipeTransform,
} from '@nestjs/common'
import { tryit } from 'radash'

import { Posts } from '../../posts/schemas/posts.schema'
import { GetPostByObjectIdUseCase } from '../../posts/use-case/get-post-by-object-id.use-case'

import EError from '../../../enums/error.enum'

@Injectable()
export class GetPostsIdValidatePipe implements PipeTransform {
  private readonly logger = new Logger(GetPostsIdValidatePipe.name)
  constructor(
    private readonly getPostByObjectIdUseCase: GetPostByObjectIdUseCase,
  ) {}

  async transform(value: { postsId: string }): Promise<Posts> {
    const { postsId } = value
    const [err, posts] = await tryit(this.getPostByObjectIdUseCase.execute)(
      postsId,
    )
    if (err) {
      this.logger.error(
        `Catch on getPostByObjectIdUseCase: ${JSON.stringify(
          postsId,
        )}, error: ${err.message ?? JSON.stringify(err)}`,
      )
    }
    if (!posts) {
      throw new BadRequestException({
        message: EError.POSTS_ID_NOT_FOUND,
        data: postsId,
      })
    }

    return posts
  }
}
