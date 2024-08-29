import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

export class CreateUserDto {
  @ApiProperty({
    description: 'username',
    example: 'ocha',
  })
  @IsNotEmpty()
  @IsString()
  username: string

  @ApiProperty({
    description: 'password',
    example: '1234',
  })
  @IsNotEmpty()
  @IsString()
  password: string

  key?: string
}
