import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Users } from './schemas/users.schema';
import { MONGOOSE_CONNECTION_NAME } from '../../constants';
import { IUser } from './interfaces/user.interface';
import { Model } from 'mongoose';
import { UserStatusEnum } from './enums/user-status.enum';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(Users.name, MONGOOSE_CONNECTION_NAME)
    private readonly usersModel: Model<Users>,
  ) {}

  create = async (payload: IUser): Promise<Users> => {
    return this.usersModel.create(payload);
  };

  getUserByUsername = async (username: string): Promise<IUser> => {
    return this.usersModel.findOne({ username });
  };

  updateUser = async (payload: {
    user: IUser;
    update: { NewUsername: string };
  }): Promise<IUser> => {
    const { user, update } = payload;
    return this.usersModel.findOneAndUpdate(
      { username: user.username },
      { username: update.NewUsername },
      { new: true },
    );
  };

  updateUserStatus = async (payload: {
    username: string;
    status: UserStatusEnum;
  }): Promise<IUser> => {
    const { username, status } = payload;
    return this.usersModel.findOneAndUpdate(
      { username },
      { status },
      { new: true },
    );
  };
}
