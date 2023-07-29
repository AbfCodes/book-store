/* eslint-disable prettier/prettier */
import {
  createParamDecorator,
  ExecutionContext,
  SetMetadata,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { Request } from 'express';

export const GetUser = createParamDecorator(
  (_data, ctx: ExecutionContext): User => {
    const req: Request = ctx.switchToHttp().getRequest();

    delete (req.user as any).password;
    return req.user as User;
    // return <User>req.user;
  },
);

export const Roles = (...roles: string[]) => SetMetadata('roles', roles);
