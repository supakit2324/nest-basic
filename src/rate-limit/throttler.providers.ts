import { ConfigModule, ConfigService } from '@nestjs/config'
import { APP_GUARD } from '@nestjs/core'
import { ThrottlerAsyncOptions } from '@nestjs/throttler'
import { ThrottlerStorageRedisService } from 'nestjs-throttler-storage-redis'

import { ThrottlerCustomGuard } from '../guards/throttler-custom-guard'

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
    throttlers: [
      {
        ttl: 1,
        limit: 100,
      },
    ],
  }),
}

export const throttlerServiceProvider = {
  provide: APP_GUARD,
  useClass: ThrottlerCustomGuard,
}
