import { UserRoleEnum } from '../enums/user-role.enum';
import { UserStatusEnum } from '../enums/user-status.enum';

export interface IUser {
  _id?: string;
  userId?: string;
  username: string;
  password: string;
  roles?: UserRoleEnum[];
  status?: UserStatusEnum;
  createdAt?: Date;
  updatedAt?: Date;
}
