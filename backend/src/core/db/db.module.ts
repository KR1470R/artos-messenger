import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { KnexModule } from 'nest-knexjs';
import KnexConfigFactory from './modules/knex/knex.factory';

@Module({
  imports: [
    KnexModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: KnexConfigFactory,
      inject: [ConfigService],
    }),
  ],
})
export class DbModule {}
