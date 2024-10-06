import { configDotenv } from 'dotenv';
import * as path from 'node:path';
import { getRootPath } from '#core/fs/utils';

type EnvTypes = 'production' | 'development' | 'test';

export default function loadEnv(defaultEnvType?: EnvTypes) {
  const env = (process.env.NODE_ENV ?? defaultEnvType) as EnvTypes | undefined;
  const validEnv: EnvTypes[] = ['production', 'development', 'test'];

  if (!env) throw new Error('Please set NODE_ENV variable to run application');
  if (!validEnv.includes(env))
    throw new Error(
      `Invalid NODE_ENV value provuded: "${env}". Expected ${validEnv.join(', ')}`,
    );

  const configPath = path.join(getRootPath(), 'configs', `${env}.env`);
  const config = configDotenv({ path: configPath });
  if (config?.error)
    throw new Error(
      `Cannot start application due to failed in loading env file: ${config.error.message}`,
    );
  process.env.ENV_PATH = configPath;
}
