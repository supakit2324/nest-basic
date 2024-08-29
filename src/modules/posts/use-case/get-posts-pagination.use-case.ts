import { Injectable, Logger } from '@nestjs/common'
import { tryit } from 'radash'

import { PostsService } from '../posts.service'
import { Posts } from '../schemas/posts.schema'

import { PaginationResponseInterface } from '../../../interfaces/pagination-response.interface'
import { QueryPaginationInterface } from '../../../interfaces/query-pagination.interface'

@Injectable()
export class GetPostsPaginationUseCase {
  private readonly logger = new Logger(GetPostsPaginationUseCase.name)
  constructor(private readonly postsService: PostsService) {}

  execute = async (
    payload: QueryPaginationInterface,
  ): Promise<PaginationResponseInterface<Posts>> => {
    const query = {
      page: Number(payload.page),
      perPage: Number(payload.perPage),
    }

    const [err, pagination] = await tryit(this.postsService.pagination)({
      ...payload,
      ...query,
    })
    if (err) {
      this.logger.error(
        `Catch on post pagination: ${JSON.stringify(
          payload,
        )}, error: ${err.message ?? JSON.stringify(err)}`,
      )
    }

    return pagination
  }
}
