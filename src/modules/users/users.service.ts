import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Users } from './schemas/users.schema';
import { MONGOOSE_CONNECTION_NAME } from '../../constants';
import { IUser } from './interfaces/user.interface';
import { Model } from 'mongoose';

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
}
