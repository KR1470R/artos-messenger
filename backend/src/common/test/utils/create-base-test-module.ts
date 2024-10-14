import { ModuleMetadata } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { loadEnv } from '#core/utils';
import { DbModule } from '#core/db/db.module';

/**
 * Create base testing module imitating the real application
 */
export default async function createBaseTestingModule(
  dependencies: ModuleMetadata,
) {
  loadEnv();

  return await Test.createTestingModule({
    imports: [
      ...(dependencies.imports ? dependencies.imports : []),

      // Core modules
      DbModule,
    ],
    providers: [...(dependencies.providers ? dependencies.providers : [])],
    controllers: [
      ...(dependencies.controllers ? dependencies.controllers : []),
    ],
  }).compile();
}
