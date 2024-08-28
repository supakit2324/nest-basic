import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { nanoid } from 'nanoid';
import { UserRoleEnum } from '../enums/user-role.enum';
import { UserStatusEnum } from '../enums/user-status.enum';

@Schema({
  collection: 'users',
  versionKey: false,
  timestamps: true,
})
export class Users extends Document {
  @Prop({
    type: String,
    unique: true,
    index: true,
    default: () => nanoid(13),
  })
  userId?: string;

  @Prop({
    type: String,
    unique: true,
    index: true,
    required: true,
  })
  username: string;

  @Prop({
    type: String,
    required: true,
  })
  password: string;

  @Prop({
    type: [String],
    enum: UserRoleEnum,
    default: UserRoleEnum.USER,
  })
  roles?: string[];

  @Prop({
    type: String,
    enum: UserStatusEnum,
    default: UserStatusEnum.ACTIVE,
  })
  status?: string;

  _id?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
export const usersSchema = SchemaFactory.createForClass(Users);
