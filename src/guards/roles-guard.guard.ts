import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());

    // for public routes
    if (!roles) return true;

    const request = context.switchToHttp().getRequest();
    const user = request.user;
    console.log(roles, user.role);

    // if there is no protect is called in-case
    if (!user) return false;

    return roles.includes(user.role);
  }
}
