import { Module } from '@nestjs/common';
import { HealthzModule } from '../healthz/healthz.module';
import { MongooseModule } from '@nestjs/mongoose';
import { mongooseModuleAsyncOptions } from '../../mongoose/mongoose.providers';
import { ConfigModule } from '@nestjs/config';
import configuration from '../../config/configuration';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';
import { PostsModule } from '../posts/posts.module';
import { ThrottlerModule } from "@nestjs/throttler";
import { throttlerAsyncOptions } from "../../rate-limit/throttler.providers";

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
})
export class AppModule {}
