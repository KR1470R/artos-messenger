/* eslint-disable @typescript-eslint/ban-ts-comment */
import * as request from 'supertest';
import { AuthService } from '../auth.service';
import { AuthController } from '../auth.controller';
import { Test } from '@nestjs/testing';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import fastifyCookie from '@fastify/cookie';
import { setTimeout } from 'timers/promises';

let app: NestFastifyApplication;

const mockedToken = { token: '123' };

beforeAll(async () => {
  const moduleRef = await Test.createTestingModule({
    controllers: [AuthController],
    providers: [
      {
        provide: AuthService,
        useValue: {
          processSignIn: jest.fn().mockResolvedValue(mockedToken),
          processRefreshToken: jest.fn().mockResolvedValue(mockedToken),
        },
      },
    ],
  }).compile();
  app = moduleRef.createNestApplication(new FastifyAdapter());
  await app.register(fastifyCookie);
  await app.init();
  await app.getHttpAdapter().getInstance().ready();

  await setTimeout(500); // take a time to load server
});

afterAll(async () => {
  jest.clearAllMocks();
  await app.close();
});

describe('Auth module', () => {
  test('should process login', async () => {
    const password = 'strong password';
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    await request(app.getHttpServer())
      .post('/auth/sign-in')
      .send({ email: 'test@gmail.com', password })
      .expect(200)
      .expect(mockedToken);
  });

  test('should process refresh token', async () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    await request(app.getHttpServer())
      .post('/auth/refresh-token')
      .set('Cookie', 'jid=123')
      .expect(200)
      .expect(mockedToken);
  });
});
