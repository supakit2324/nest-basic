import { ApiProperty } from '@nestjs/swagger'

export class CommentEntity {
  @ApiProperty({
    example: '',
  })
  objectId?: string

  @ApiProperty({
    example: {
      userId: 'ASdkawd4',
      username: 'ocha777',
    },
  })
  user?: {
    userId: string
    username: string
  }

  @ApiProperty({
    example: {
      objectId: 'ASdkawd4',
    },
  })
  posts?: {
    objectId: string
  }

  @ApiProperty({
    example: '',
  })
  comment?: string

  @ApiProperty({
    example: new Date(),
  })
  createdAt?: Date

  @ApiProperty({
    example: new Date(),
  })
  updatedAt?: Date
}
