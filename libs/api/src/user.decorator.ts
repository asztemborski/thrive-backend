import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export type UserPayload = {
  id: string;
  email: string;
  username: string;
};

export const User = createParamDecorator((_: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  return JSON.parse(request.headers['x-user']) as UserPayload;
});
