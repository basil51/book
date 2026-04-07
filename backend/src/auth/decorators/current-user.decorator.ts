// src/auth/decorators/current-user.decorator.ts
import { AppModule, PermissionAction } from '@my-app/shared';
import {
  createParamDecorator,
  ExecutionContext,
  SetMetadata,
} from '@nestjs/common';
import { Request } from 'express';
import { User } from '../../entities/user.entity';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): User => {
    const request = ctx.switchToHttp().getRequest<Request & { user: User }>();
    return request.user;
  },
);

export const RequirePermission = (
  module: AppModule,
  action: PermissionAction,
) => SetMetadata('permission', { module, action });
