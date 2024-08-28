import { UserRoleEnum } from '../enums/user-role.enum';
import { UserStatusEnum } from '../enums/user-status.enum';

export interface IUser {
  userId?: string;
  username: string;
  password: string;
  roles?: UserRoleEnum[];
  status?: UserStatusEnum;
  _id?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
