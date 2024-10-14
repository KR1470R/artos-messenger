import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UnauthorizedException } from '@nestjs/common';

/**
 * Decorator for controllers' methods
 * Extracts loggined user id from verified JWT token payloads.
 */
const LogginedUserId = createParamDecorator(
  (data: string[], ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const id = request?.user?.id;
    if (!id) throw new UnauthorizedException('Invalid token payload!');
    return parseInt(id);
  },
);

export default LogginedUserId;
