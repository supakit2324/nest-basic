import { ConfigModule, ConfigService } from '@nestjs/config'
import { MongooseModuleAsyncOptions } from '@nestjs/mongoose'

import { MONGOOSE_CONNECTION_NAME } from '../constants'
import {
  Comments,
  commentsSchema,
} from '../modules/comments/schemas/comments.schema'
import { Posts, postsSchema } from '../modules/posts/schemas/posts.schema'
import { Users, usersSchema } from '../modules/users/schemas/users.schema'

export const mongooseModels = [
  {
    name: Users.name,
    schema: usersSchema,
  },
  {
    name: Posts.name,
    schema: postsSchema,
  },
  {
    name: Comments.name,
    schema: commentsSchema,
  },
]

export const mongooseModuleAsyncOptions: MongooseModuleAsyncOptions = {
  imports: [ConfigModule],
  inject: [ConfigService],
  connectionName: MONGOOSE_CONNECTION_NAME,
  useFactory: async (configService: ConfigService) => {
    return {
      uri: configService.get<string>('database.host'),
      ...configService.get<any>('database.options'),
    }
  },
}
