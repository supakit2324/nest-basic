import { ThrottlerAsyncOptions } from '@nestjs/throttler';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerStorageRedisService } from 'nestjs-throttler-storage-redis';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerCustomGuard } from "../guards/throttler-custom-guard";

export const throttlerAsyncOptions: ThrottlerAsyncOptions = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => ({
    ttl: 1,
    limit: 100,
    storage: new ThrottlerStorageRedisService({
      port: configService.get<number>('redis.port'),
      host: configService.get<string>('redis.host'),
      db: configService.get<number>('redis.db') || 0,
    }),
  }),
};

export const throttlerServiceProvider = {
  provide: APP_GUARD,
  useClass: ThrottlerCustomGuard,
};
