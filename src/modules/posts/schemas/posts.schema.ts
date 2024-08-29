import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { v4 as uuidV4 } from 'uuid';
import { Users } from '../../users/schemas/users.schema';
import { PostsStatusEnum } from '../enums/posts-status.enum';

@Schema({
  collection: 'posts',
  versionKey: false,
  timestamps: true,
})
export class Posts extends Document {
  @Prop({
    type: String,
    unique: true,
    index: true,
    default: () => uuidV4(),
  })
  objectId?: string;

  @Prop({
    type: Object,
    required: true,
  })
  user: Pick<Users, 'userId' | 'username'>;

  @Prop({
    type: String,
    index: true,
    required: true,
  })
  title: string;

  @Prop({
    type: String,
    default: null,
  })
  description?: string;

  @Prop({
    type: String,
    enum: PostsStatusEnum,
    default: PostsStatusEnum.ACTIVE,
  })
  status?: PostsStatusEnum;

  createdAt?: Date;
  updatedAt?: Date;
}
export const postsSchema = SchemaFactory.createForClass(Posts);
