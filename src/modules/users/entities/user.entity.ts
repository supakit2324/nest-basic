import { ApiProperty } from '@nestjs/swagger';
import { UserRoleEnum } from '../enums/user-role.enum';
import { UserStatusEnum } from '../enums/user-status.enum';

export class UserEntity {
  @ApiProperty({
    example: 'QWD1a63w',
  })
  userId?: string;

  @ApiProperty({
    example: 'ocha777',
  })
  username?: string;

  @ApiProperty({
    example: '$2b$10$0mzKguB//3.bYWEiS.4ib.T2HAPWioj2t0IsDSRPjnmAWaF57456AWDW',
  })
  password?: string;

  @ApiProperty({
    enum: [UserRoleEnum],
    example: [UserRoleEnum.USER],
  })
  roles?: UserRoleEnum[];

  @ApiProperty({
    enum: UserStatusEnum,
    example: UserStatusEnum.ACTIVE,
  })
  status?: string;

  @ApiProperty({
    example: new Date(),
  })
  createdAt?: Date;

  @ApiProperty({
    example: new Date(),
  })
  updatedAt?: Date;
}
