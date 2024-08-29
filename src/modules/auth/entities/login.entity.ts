import { ApiProperty } from '@nestjs/swagger';

export class LoginEntity {
  @ApiProperty({
    example:
      'eyJhbGciOiJIUzI1NiIsInRasdjoikadWAIhad45sad454356IkpXVCJ9.eyJ1c2VybmFtZSI6Im9jaGE3NzciLCJpYXQiOjE3MjQ4NTkzOTB9.MNJxSIAqnkIOX9Y8gIfpSFho4yIUv70QCMZt880Ey7s',
  })
  accessToken?: string;
}
