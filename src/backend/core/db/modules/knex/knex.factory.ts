import { Knex } from 'knex';
import { ConfigService } from '@nestjs/config';
import { loadEnv } from '#core/utils';

export type Config = {
  config: {
    [key: string]: Knex.Config;
  };
};

/**
 * This class is a substitute for ConfigService used for knex migration/seed scripts,
 * where nestjs DI is not available, thus the default ConfigService too.
 */
class ConfigServiceSubstitute extends ConfigService {
  constructor() {
    super();
    loadEnv();
  }

  public override getOrThrow(key: string) {
    const value = process.env[key];
    if (!value)
      throw new TypeError(`Configuration key "${key}" does not exist`);
    return value;
  }
}

export default function KnexConfigFactory(
  configService?: ConfigService,
): Config {
  configService = configService || new ConfigServiceSubstitute();
  const connectionParams = {
    host: configService.getOrThrow('DB_HOST'),
    user: configService.getOrThrow('DB_USER'),
    port: Number(configService.getOrThrow('DB_PORT')),
    password: configService.getOrThrow('DB_PASS'),
    database: configService.getOrThrow('DB_NAME'),
  };
  const poolParams = {
    min: Number(configService.getOrThrow('DB_MIN_CONN')),
    max: Number(configService.getOrThrow('DB_MAX_CONN')),
  };

  const config = {
    development: {
      client: 'mysql2',
      connection: connectionParams,
      pool: poolParams,
      migrations: {
        tableName: 'knex_migrations',
        directory: __dirname + '/migrations',
      },
      debug: false,
    },

    production: {
      client: 'mysql2',
      connection: connectionParams,
      pool: poolParams,
      migrations: {
        tableName: 'knex_migrations',
        directory: __dirname + '/migrations',
      },
      debug: false,
    },

    test: {
      client: 'mysql2',
      connection: connectionParams,
      pool: poolParams,
      migrations: {
        tableName: 'knex_migrations',
        directory: __dirname + '/migrations',
      },
      debug: false,
    },
  };

  const env = configService.get('NODE_ENV') || 'development';
  if (env in config) return { config: config[env] };
  throw new Error(`Failed to get Knex config for "${env}"`);
}
