import { MongooseModuleAsyncOptions } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MONGOOSE_CONNECTION_NAME } from '../constants';
import { Users, usersSchema } from '../modules/users/schemas/users.schema';
import { Posts, postsSchema } from '../modules/posts/schemas/posts.schema';

export const mongooseModels = [
  {
    name: Users.name,
    schema: usersSchema,
  },
  {
    name: Posts.name,
    schema: postsSchema,
  },
];

export const mongooseModuleAsyncOptions: MongooseModuleAsyncOptions = {
  imports: [ConfigModule],
  inject: [ConfigService],
  connectionName: MONGOOSE_CONNECTION_NAME,
  useFactory: async (configService: ConfigService) => {
    return {
      uri: configService.get<string>('database.host'),
      ...configService.get<any>('database.options'),
    };
  },
};
