import { Module } from '@nestjs/common';
import { E2eeService } from './e2ee.service';
import { E2eeController } from './e2ee.controller';
import { E2EEKeysRepositoryToken } from './constants';
import { E2eeRepository } from './e2ee.repository';

@Module({
  providers: [
    E2eeService,
    {
      provide: E2EEKeysRepositoryToken,
      useClass: E2eeRepository,
    },
  ],
  controllers: [E2eeController],
  exports: [E2eeService],
})
export class E2eeModule {}
