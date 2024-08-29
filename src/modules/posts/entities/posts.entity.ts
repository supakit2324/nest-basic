import { ApiProperty } from '@nestjs/swagger';
import { PostsStatusEnum } from '../enums/posts-status.enum';

export class PostsEntity {
  @ApiProperty({
    example: '',
  })
  objectId?: string;

  @ApiProperty({
    example: {
      userId: 'ASdkawd4',
      username: 'ocha777',
    },
  })
  user?: {
    userId: string;
    username: string;
  };

  @ApiProperty({
    example: 'วันนี้วันอะไร',
  })
  title?: string;

  @ApiProperty({
    example: '',
  })
  description?: string;

  @ApiProperty({
    example: PostsStatusEnum.ACTIVE,
  })
  status?: PostsStatusEnum;

  @ApiProperty({
    example: new Date(),
  })
  createdAt?: Date;

  @ApiProperty({
    example: new Date(),
  })
  updatedAt?: Date;
}
