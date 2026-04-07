import 'module-alias/register';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import { randomUUID } from 'node:crypto';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { HttpLoggingInterceptor } from './common/interceptors/http-logging.interceptor';
import { NextFunction, Request, Response } from 'express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);
  const baseDomain = configService.get<string>(
    'BASE_DOMAIN',
    'sparkco.localhost',
  );
  const nodeEnv = configService.get<string>('NODE_ENV') ?? 'development';
  const isProduction = nodeEnv === 'production';

  app.use(helmet());

  const requestIdHeader = 'x-request-id';
  app.use((req: Request, res: Response, next: NextFunction) => {
    const raw = req.headers[requestIdHeader];
    const fromClient =
      typeof raw === 'string' && raw.trim().length > 0 ? raw.trim() : null;
    const id = fromClient ?? randomUUID();
    req.requestId = id;
    res.setHeader('X-Request-Id', id);
    next();
  });

  app.useGlobalFilters(new AllExceptionsFilter(isProduction));
  app.useGlobalInterceptors(new HttpLoggingInterceptor());

  if (nodeEnv === 'production') {
    const requiredVars = [
      'DATABASE_HOST',
      'DATABASE_USER',
      'DATABASE_PASSWORD',
      'DATABASE_NAME',
      'JWT_SECRET',
    ];
    const missing = requiredVars.filter(
      (key) => !configService.get<string>(key),
    );
    if (missing.length > 0) {
      throw new Error(
        `Missing required env vars in production: ${missing.join(', ')}`,
      );
    }

    const jwtSecret = configService.get<string>('JWT_SECRET');
    if (jwtSecret === 'your_super_secret_key') {
      throw new Error('JWT_SECRET must be set to a secure value in production');
    }

    const dbPassword = configService.get<string>('DATABASE_PASSWORD');
    if (dbPassword === 'postgres') {
      throw new Error(
        'DATABASE_PASSWORD must be set to a secure value in production',
      );
    }
  }

  // Enable CORS - allow requests from frontend domain (set FRONTEND_ORIGIN for HTTPS in production)
  const frontendOrigin =
    configService.get<string>('FRONTEND_ORIGIN') ?? `http://book.${baseDomain}`;
  app.enableCors({
    origin: frontendOrigin,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // Automatically transform and validate all incoming DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // strip properties that don't have decorators
      forbidNonWhitelisted: true, // throw error on unknown props
      transform: true, // auto-transform payloads to DTO instances
    }),
  );

  await app.listen(process.env.PORT ?? 4001);
}
void bootstrap();
