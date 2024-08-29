import { CacheModule } from '@nestjs/cache-manager'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { MongooseModule } from '@nestjs/mongoose'
import { ThrottlerModule } from '@nestjs/throttler'

import { AuthModule } from '../auth/auth.module'
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
    HealthzModule,
    UsersModule,
    PostsModule,
  ],
  providers: [throttlerServiceProvider],
})
export class AppModule {}
