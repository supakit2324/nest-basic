import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

export class CreateCommentDto {
  @ApiProperty({
    example: 'วัน!',
  })
  @IsString()
  @IsNotEmpty()
  comment: string

  @ApiProperty({
    example: '',
  })
  @IsString()
  @IsNotEmpty()
  postsId: string
}
