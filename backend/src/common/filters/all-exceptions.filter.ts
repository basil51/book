import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { STATUS_CODES } from 'node:http';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  constructor(private readonly isProduction: boolean) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const requestId = request.requestId ?? 'unknown';
    const path = request.originalUrl ?? request.url;

    if (exception instanceof HttpException) {
      const { status, error, message } = this.normalizeHttpException(exception);
      const payload = {
        statusCode: status,
        error,
        message,
        path,
        timestamp: new Date().toISOString(),
        requestId,
      };

      if (status >= 500) {
        this.logger.error(
          `${request.method} ${path} ${status} [${requestId}] — ${Array.isArray(message) ? message.join('; ') : message}`,
        );
      } else {
        this.logger.warn(
          `${request.method} ${path} ${status} [${requestId}] — ${Array.isArray(message) ? message.join('; ') : message}`,
        );
      }

      response.status(status).json(payload);
      return;
    }

    const errMsg =
      exception instanceof Error ? exception.message : String(exception);
    const stack = exception instanceof Error ? exception.stack : undefined;
    this.logger.error(
      `${request.method} ${path} ${HttpStatus.INTERNAL_SERVER_ERROR} [${requestId}] — ${errMsg}`,
      stack,
    );

    const message = this.isProduction ? 'Internal server error' : errMsg;

    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      error: STATUS_CODES[HttpStatus.INTERNAL_SERVER_ERROR] ?? 'Error',
      message,
      path,
      timestamp: new Date().toISOString(),
      requestId,
    });
  }

  private normalizeHttpException(exception: HttpException): {
    status: number;
    error: string;
    message: string | string[];
  } {
    const status = exception.getStatus();
    const body = exception.getResponse();

    if (typeof body === 'string') {
      return {
        status,
        error: STATUS_CODES[status] ?? 'Error',
        message: body,
      };
    }

    const o = body as Record<string, unknown>;
    let message: string | string[];
    if (Array.isArray(o.message)) {
      message = o.message as string[];
    } else if (typeof o.message === 'string') {
      message = o.message;
    } else {
      message = exception.message;
    }

    const error =
      typeof o.error === 'string' ? o.error : (STATUS_CODES[status] ?? 'Error');

    return { status, error, message };
  }
}
