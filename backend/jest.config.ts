import { pathsToModuleNameMapper } from 'ts-jest';
import { compilerOptions } from './tsconfig.json';

module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: 'src',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: ['**/*.(t|j)s'],
  coverageDirectory: '../coverage',
  testEnvironment: 'node',
  moduleNameMapper: pathsToModuleNameMapper(
    Object.fromEntries(
      Object.entries(compilerOptions.paths).map(([k, v]) => {
        return [k, v.map((p) => p.replace('src', '<rootDir>'))];
      }),
    ),
  ),
  coverageReporters: [
    // 'text', 'text-summary'
  ],
  verbose: true,
  clearMocks: true,
  maxWorkers: 1,
};
