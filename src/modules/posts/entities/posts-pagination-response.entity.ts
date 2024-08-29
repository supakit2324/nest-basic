import { ApiProperty } from '@nestjs/swagger'

import { PostsEntity } from './posts.entity'

import { PaginationResponseBaseEntity } from '../../../entities/pagination-response-base.entity'

export class PostsPaginationResponseEntity extends PaginationResponseBaseEntity {
  @ApiProperty({
    type: [PostsEntity],
  })
  records?: PostsEntity[]
}
