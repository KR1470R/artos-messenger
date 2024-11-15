import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UnauthorizedException } from '@nestjs/common';

/**
 * Decorator for ws gateways' methods
 * Extracts loggined user id from verified JWT token payloads.
 */
const LogginedUserIdWs = createParamDecorator(
  (data: string[], ctx: ExecutionContext) => {
    const request = ctx.switchToWs().getClient();
    const id = request?.user?.id;
    if (!id) throw new UnauthorizedException('Invalid token payload!');
    return parseInt(id);
  },
);

export default LogginedUserIdWs;
