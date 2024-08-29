import { applyDecorators, SetMetadata, UseInterceptors } from '@nestjs/common'

import CustomCacheInterceptor from '../interceptors/custom-cache.interceptor'

export function CommonCacheDecorator(ttl: number) {
  return applyDecorators(
    SetMetadata('ttl', ttl),
    UseInterceptors(CustomCacheInterceptor),
  )
}
