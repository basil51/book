import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class HttpLoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const req = context.switchToHttp().getRequest<{
      method: string;
      originalUrl?: string;
      url: string;
      requestId?: string;
    }>();
    const res = context.switchToHttp().getResponse<{ statusCode?: number }>();
    const method = req.method;
    const path = req.originalUrl ?? req.url;
    const requestId = req.requestId ?? '-';
    const start = Date.now();

    return next.handle().pipe(
      tap({
        next: () => {
          const status = res.statusCode ?? 0;
          const ms = Date.now() - start;
          this.logger.log(`${method} ${path} ${status} ${ms}ms [${requestId}]`);
        },
      }),
    );
  }
}
