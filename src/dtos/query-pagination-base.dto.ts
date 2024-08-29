import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsNotEmpty, IsNumber, IsString, Max, Min } from 'class-validator'

export class QueryPaginationBaseDto {
  @ApiProperty({
    example: 1,
  })
  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  page: number

  @ApiProperty({
    example: 20,
  })
  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  @Max(1000)
  perPage: number

  @ApiProperty({
    example: new Date(),
  })
  @Type(() => String)
  @IsString()
  @IsNotEmpty()
  startDate: string

  @ApiProperty({
    example: new Date(),
  })
  @Type(() => String)
  @IsString()
  @IsNotEmpty()
  endDate: string
}
