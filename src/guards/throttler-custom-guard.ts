import { Injectable } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';

@Injectable()
export class ThrottlerCustomGuard extends ThrottlerGuard {
  protected getTracker(req: Record<string, any>): string {
    return req?.headers['x-original-forwarded-for'];
  }
}
