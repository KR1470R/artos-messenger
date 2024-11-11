import { Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { JwtPayloadDto } from '../types';
import { UsersService } from '#api/users/users.service';

@Injectable()
export class JwtWsStrategy extends PassportStrategy(Strategy, 'jwt-ws') {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    super({
      jwtFromRequest: (req) => req?.handshake?.headers?.token,
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow('JWT_TOKEN_SECRET'),
    });
  }

  async validate(payload: JwtPayloadDto) {
    await this.usersService.processFindOne(payload.id);
    return { id: payload.id, username: payload.username };
  }
}
