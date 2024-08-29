import { CacheInterceptor } from '@nestjs/cache-manager'
import { CallHandler, ExecutionContext, Injectable } from '@nestjs/common'
import { map, Observable, of } from 'rxjs'

@Injectable()
class CustomCacheInterceptor extends CacheInterceptor {
  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const req = context.switchToHttp().getRequest()
    const res = context.switchToHttp().getResponse()
    const { url } = req

    const ttl = this.reflector.get('ttl', context.getHandler())

    const cacheKey = `nest-js-basic:${encodeURIComponent(url)}`

    const hasCache = await this.cacheManager.get(cacheKey)
    if (hasCache) {
      res.header('X-Cache', 'Hit')
      req.header('X-Cache-TTL', hasCache?.ttl)
      return of(hasCache)
    }
    return next.handle().pipe(
      map(async (response) => {
        await this.cacheManager.set(cacheKey, response, ttl)
        res.header('X-Cache', 'Miss')
        return response
      }),
    )
  }
}

export default CustomCacheInterceptor
