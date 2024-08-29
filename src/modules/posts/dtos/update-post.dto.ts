import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsEnum, IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator'

import { PostsStatusEnum } from '../enums/posts-status.enum'

export class UpdatePostDto {
  @ApiProperty({
    example: 'วันนี้วันอะไร',
  })
  @IsNotEmpty()
  @IsString()
  title: string

  @ApiPropertyOptional({
    example: null,
  })
  @IsOptional()
  @IsString()
  description?: string

  @ApiProperty({
    enum: PostsStatusEnum,
  })
  @IsNotEmpty()
  @IsEnum(PostsStatusEnum)
  status: PostsStatusEnum
}
