import { ApiProperty } from '@nestjs/swagger'

export class LoginDto {
  @ApiProperty({
    example: 'ocha777',
  })
  username: string

  @ApiProperty({
    example: '123',
  })
  password: string
}
