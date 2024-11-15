import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '#api/users/users.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtHttpStrategy } from './strategies';
import { JwtAuthHttpGuard } from './guards';

@Module({
  imports: [
    JwtModule.register({
      global: true,
    }),
    UsersModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtHttpStrategy,
    {
      provide: APP_GUARD,
      useClass: JwtAuthHttpGuard,
    },
  ],
})
export class AuthModule {}
