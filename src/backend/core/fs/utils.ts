import * as path from 'node:path';
import { access, mkdir, unlink, rm, readdir, existsSync } from 'node:fs';
import { promisify } from 'node:util';
import { pipeline } from 'node:stream';

function getRootPath() {
  let currentDir = __dirname;

  while (!existsSync(path.join(currentDir, 'package-lock.json'))) {
    const parentDir = path.dirname(currentDir);

    if (currentDir === parentDir) {
      throw new Error('Expected dist/ directory in the root of the project.');
    }

    currentDir = parentDir;
  }

  return currentDir;
}

const pump = promisify(pipeline);
const accessAsync = promisify(access);
const mkdirAsync = promisify(mkdir);
const unlinkAsync = promisify(unlink);
const rmAsync = promisify(rm);
const readdirAsync = promisify(readdir);

export {
  getRootPath,
  pump,
  accessAsync,
  mkdirAsync,
  unlinkAsync,
  rmAsync,
  readdirAsync,
};
