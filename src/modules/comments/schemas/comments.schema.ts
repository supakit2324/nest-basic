import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'
import { v4 as uuidV4 } from 'uuid'

import { Posts } from '../../posts/schemas/posts.schema'
import { Users } from '../../users/schemas/users.schema'

@Schema({
  collection: 'comments',
  versionKey: false,
  timestamps: true,
})
export class Comments extends Document {
  @Prop({
    type: String,
    unique: true,
    index: true,
    default: () => uuidV4(),
  })
  objectId?: string

  @Prop({
    type: Object,
    required: true,
  })
  user: Pick<Users, 'userId' | 'username'>

  @Prop({
    type: Object,
    required: true,
  })
  posts: Pick<Posts, 'objectId'>

  @Prop({
    type: String,
    required: true,
  })
  comment: string

  createdAt?: Date
  updatedAt?: Date
}
export const commentsSchema = SchemaFactory.createForClass(Comments)
