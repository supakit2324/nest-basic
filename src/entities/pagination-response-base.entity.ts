import { ApiProperty } from '@nestjs/swagger'

export class PaginationResponseBaseEntity {
  @ApiProperty({
    example: 1,
  })
  page?: number

  @ApiProperty({
    example: 20,
  })
  perPage?: number

  @ApiProperty({
    example: 1,
  })
  count?: number
}
