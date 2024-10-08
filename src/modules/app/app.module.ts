import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { MongooseModule } from '@nestjs/mongoose'
import { ThrottlerModule } from '@nestjs/throttler'

import { AuthModule } from '../auth/auth.module'
import { CommentsModule } from '../comments/comments.module'
import { HealthzModule } from '../healthz/healthz.module'
import { PostsModule } from '../posts/posts.module'
import { UsersModule } from '../users/users.module'

import configuration from '../../config/configuration'
import { mongooseModuleAsyncOptions } from '../../mongoose/mongoose.providers'
import {
  throttlerAsyncOptions,
  throttlerServiceProvider,
} from '../../rate-limit/throttler.providers'

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    MongooseModule.forRootAsync(mongooseModuleAsyncOptions),
    ThrottlerModule.forRootAsync(throttlerAsyncOptions),
    AuthModule,
    CommentsModule,
    HealthzModule,
    PostsModule,
    UsersModule,
  ],
  providers: [throttlerServiceProvider],
})
export class AppModule {}
