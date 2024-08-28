import { Module } from '@nestjs/common';
import { HealthzModule } from '../healthz/healthz.module';
import { MongooseModule } from '@nestjs/mongoose';
import { mongooseModuleAsyncOptions } from '../../mongoose/mongoose.providers';
import { ConfigModule } from '@nestjs/config';
import configuration from '../../config/configuration';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    MongooseModule.forRootAsync(mongooseModuleAsyncOptions),
    HealthzModule,
    UsersModule,
  ],
})
export class AppModule {}
