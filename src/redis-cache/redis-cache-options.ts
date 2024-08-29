import { CacheModuleAsyncOptions } from '@nestjs/cache-manager'
import { ConfigModule, ConfigService } from '@nestjs/config'

import { redisStore } from './node-cache-manager-ioredis'

const CacheModuleOptions: CacheModuleAsyncOptions = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: async (configService: ConfigService) => {
    return {
      store: redisStore,
      host: configService.get<string>('redis.host'),
      port: configService.get<number>('redis.port'),
      db: configService.get<number>('redis.db'),
      ttl: configService.get('REDIS_TTL') || 5,
    }
  },
}
export default CacheModuleOptions
