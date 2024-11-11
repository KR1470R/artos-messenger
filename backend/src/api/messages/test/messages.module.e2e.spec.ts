import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { io, Socket } from 'socket.io-client';
import { ChatsModule } from '#api/chats/chats.module';
import { MessagesGateway } from '../messages.gateway';
import { MessagesRepository } from '../messages.repository';
import {
  createBaseTestingModule,
  flushMockDirectChatsDb,
  flushMockGroupChatsDb,
  flushMockMessagesDb,
  flushMockUsersDb,
  prepareMockDirectChatsDb,
  prepareMockGroupChatsDb,
  prepareMockUsersDb,
} from '#common/test/utils';
import fastifyCookie from '@fastify/cookie';
import { setTimeout } from 'timers/promises';
import { Knex } from 'knex';
import {
  adminMemberMock,
  userMemberMock,
  directChatMock,
  groupChatMock,
} from '#common/test/mock';
import { random } from '#common/utils';
import {
  CreateMessageRequestDto,
  DeleteMessageRequestDto,
  FindManyMessagesRequestDto,
} from '../dto/requests';
import { WsResponse } from '@nestjs/websockets';
import UpdateMessageRequestDto from '../dto/requests/update-message.request.dto';
import { Messages } from '../messages.entity';
import { JwtWsStrategy } from '#api/auth/strategies';
import { UsersModule } from '#api/users/users.module';
import { AuthModule } from '#api/auth/auth.module';
import { AuthService } from '#api/auth/auth.service';
import { MessagesService } from '../messages.service';

let app: NestFastifyApplication;
let adminToken: string;
let userToken: string;
const sockets = {
  adminSocket: undefined,
  userSocket: undefined,
} as {
  [name in string]: Socket | undefined;
};
let db: Knex;
let messagesRepository: MessagesRepository;
let authService: AuthService;

let directMessageId1: number;
let directMessageId2: number;
let groupMessageId1: number;
let groupMessageId2: number;

const initSocket = (socketLink: string, token: string) => {
  const socket = sockets[socketLink];
  if (socket) socket.disconnect();
  return new Promise<void>((resolve) => {
    sockets[socketLink] = io('ws://localhost:8080/messages', {
      extraHeaders: {
        token,
      },
    });
    sockets[socketLink]!.on('connect', () => {
      resolve();
    });
  });
};

const emitEvent = async <T>(
  socketLink: string,
  event: string,
  payload: object,
): Promise<T> => {
  const res:
    | WsResponse<T>
    | {
        status: string;
        message: string;
      } = await (() =>
    new Promise((resolve) => {
      const socket = sockets[socketLink]!;
      socket.emit(event, payload);
      socket.once(event, resolve);
      socket.once('error', resolve);
    }))();

  if (typeof res === 'object' && 'status' in res) throw new Error(res.message);

  return res as T;
};

const testCreate = async (
  socketLink: string,
  payload: CreateMessageRequestDto,
): Promise<number> => {
  const messageId = await emitEvent<number>(
    socketLink,
    'create_message',
    payload,
  );

  expect(messageId).toBeDefined();
  expect(typeof messageId).toBe('number');

  const targetMessage = await messagesRepository.findOne(messageId);

  expect(targetMessage).toBeDefined();
  expect(targetMessage?.content).toEqual(payload.content);

  return messageId;
};
const testCreateForbidden = async (
  socketLink: string,
  payload: CreateMessageRequestDto,
) => {
  await expect(
    emitEvent(socketLink, 'create_message', payload),
  ).rejects.toThrow();
};
const testUpdate = async (
  socketLink: string,
  payload: UpdateMessageRequestDto,
) => {
  const response = await emitEvent(socketLink, 'update_message', payload);
  expect(response).toEqual('Message updated successfully.');

  const targetMessage = await messagesRepository.findOne(payload.id);
  expect(targetMessage).toBeDefined();
  expect(targetMessage?.content).toEqual(payload.content);
  expect(targetMessage?.is_read).toEqual(payload.is_read ?? 0);
};
const testUpdateForbidden = async (
  socketLink: string,
  payload: UpdateMessageRequestDto,
) => {
  await expect(
    emitEvent(socketLink, 'update_message', payload),
  ).rejects.toThrow();
};
const testDelete = async (
  socketLink: string,
  payload: DeleteMessageRequestDto,
) => {
  await emitEvent(socketLink, 'delete_message', payload);
  const targetMessage = await messagesRepository.findOne(payload.id);

  expect(targetMessage).toBeUndefined();
};
const testDeleteForbidden = async (
  socketLink: string,
  payload: DeleteMessageRequestDto,
) => {
  await expect(
    emitEvent(socketLink, 'delete_message', payload),
  ).rejects.toThrow();
};
const testFindMany = async (
  socketLink: string,
  payload: FindManyMessagesRequestDto,
  expectedIds: number[],
) => {
  const messages = await emitEvent<
    Pick<Messages, 'content' | 'sender_id' | 'id'>[]
  >(socketLink, 'find_many_messages', payload);

  expectedIds.forEach((id) => {
    const targetMessage = messages.find((m) => m.id === id);
    expect(targetMessage).toBeDefined();
  });
};
const testFindManyForbidden = async (
  socketLink: string,
  payload: FindManyMessagesRequestDto,
) => {
  await expect(
    emitEvent(socketLink, 'find_many_messages', payload),
  ).rejects.toThrow();
};
const joinChat = async (socketLink: string, chatId: number) => {
  await emitEvent(socketLink, 'join_chat', {
    chat_id: chatId,
  });
};
const leaveChat = async (socketLink: string, chatId: number, token: string) => {
  await emitEvent(socketLink, 'leave_chat', {
    chat_id: chatId,
  });

  await initSocket(socketLink, token); // Socket should be reconnected after leave for further tests
};

beforeAll(async () => {
  const moduleRef = await createBaseTestingModule({
    imports: [ChatsModule, UsersModule, AuthModule],
    providers: [
      MessagesGateway,
      MessagesService,
      MessagesRepository,
      JwtWsStrategy,
    ],
    exports: [MessagesService, MessagesRepository],
  });

  app = moduleRef.createNestApplication(new FastifyAdapter());
  await app.register(fastifyCookie);
  await app.init();
  await app.getHttpAdapter().getInstance().ready();

  await setTimeout(500);

  messagesRepository = moduleRef.get<MessagesRepository>(MessagesRepository);
  db = moduleRef.get<Knex>('default');
  authService = moduleRef.get<AuthService>(AuthService);

  await flushMockGroupChatsDb(db);
  await flushMockDirectChatsDb(db);
  await flushMockUsersDb(db);
  await flushMockMessagesDb(db);
  await flushMockMessagesDb(db);

  await prepareMockUsersDb(db);
  await prepareMockDirectChatsDb(db);
  await prepareMockGroupChatsDb(db);

  adminToken = (await authService.processSignIn(adminMemberMock.name, '123'))
    .token;
  userToken = (await authService.processSignIn(userMemberMock.name, '123'))
    .token;
  await initSocket('adminSocket', adminToken);
  await initSocket('userSocket', userToken);
});

afterAll(async () => {
  await flushMockGroupChatsDb(db);
  await flushMockDirectChatsDb(db);
  await flushMockUsersDb(db);
  await flushMockMessagesDb(db);

  Object.values(sockets).forEach((socket) => socket?.disconnect());

  await app.close();
});

afterEach(async () => {
  await leaveChat('userSocket', directChatMock.id, userToken);
  await leaveChat('adminSocket', directChatMock.id, adminToken);
  await leaveChat('userSocket', groupChatMock.id, userToken);
  await leaveChat('adminSocket', groupChatMock.id, adminToken);
});

describe('MessagesGateway', () => {
  it('users should be able to create message in a chat he is belong to', async () => {
    const receivedDirect = [] as number[];
    const adminSocket = sockets['adminSocket']!;
    const userSocket = sockets['userSocket']!;

    await joinChat('adminSocket', directChatMock.id);
    await joinChat('userSocket', directChatMock.id);
    adminSocket.on('new_message', (data: any) => {
      receivedDirect.push(data.receiver_id);
    });
    userSocket.on('new_message', (data: any) => {
      receivedDirect.push(data.receiver_id);
    });
    directMessageId1 = await testCreate('adminSocket', {
      chat_id: directChatMock.id,
      content: 'Hi, how are you?',
    });
    expect(receivedDirect).toEqual([adminMemberMock.id, userMemberMock.id]);
    receivedDirect.length = 0;
    directMessageId2 = await testCreate('userSocket', {
      chat_id: directChatMock.id,
      content: 'Hi, I am fine, thanks!',
    });
    expect(receivedDirect).toEqual([adminMemberMock.id, userMemberMock.id]);
    receivedDirect.length = 0;

    const receivedGroup = [] as number[];
    await joinChat('adminSocket', groupChatMock.id);
    await joinChat('userSocket', groupChatMock.id);
    adminSocket.on('new_message', (data: any) => {
      receivedGroup.push(data.receiver_id);
    });
    userSocket.on('new_message', (data: any) => {
      receivedGroup.push(data.receiver_id);
    });
    groupMessageId1 = await testCreate('adminSocket', {
      chat_id: groupChatMock.id,
      content: 'Hello, everyone!',
    });
    expect(receivedGroup).toEqual([adminMemberMock.id, userMemberMock.id]);
    receivedGroup.length = 0;
    groupMessageId2 = await testCreate('userSocket', {
      chat_id: groupChatMock.id,
      content: 'Hello, admin!',
    });
    expect(receivedGroup).toEqual([adminMemberMock.id, userMemberMock.id]);
    receivedDirect.length = 0;
    adminSocket.off('new_message');
    userSocket.off('new_message');
  });
  it('users should not be able to create message in a chat he is not belong to', async () => {
    await testCreateForbidden('userSocket', {
      chat_id: random(100, 300),
      content: 'Should not create me!!',
    });
  });

  it('users should be able to update message in a chat he is belong to', async () => {
    const receivedDirect = [] as number[];
    const adminSocket = sockets['adminSocket']!;
    const userSocket = sockets['userSocket']!;

    await joinChat('adminSocket', directChatMock.id);
    await joinChat('userSocket', directChatMock.id);
    adminSocket.on('updated_message', (data: any) => {
      receivedDirect.push(data.receiver_id);
    });
    userSocket.on('updated_message', (data: any) => {
      receivedDirect.push(data.receiver_id);
    });
    await testUpdate('adminSocket', {
      id: directMessageId1,
      chat_id: directChatMock.id,
      content: "Actually, i don't give a fuck)",
    });
    expect(receivedDirect).toEqual([adminMemberMock.id, userMemberMock.id]);
    receivedDirect.length = 0;

    const receivedGroup = [] as number[];
    await joinChat('adminSocket', groupChatMock.id);
    await joinChat('userSocket', groupChatMock.id);
    adminSocket.on('updated_message', (data: any) => {
      receivedGroup.push(data.receiver_id);
    });
    userSocket.on('updated_message', (data: any) => {
      receivedGroup.push(data.receiver_id);
    });
    await testUpdate('adminSocket', {
      id: groupMessageId1,
      chat_id: groupChatMock.id,
      content: 'Hey, this is updated message',
    });
    expect(receivedGroup).toEqual([adminMemberMock.id, userMemberMock.id]);
    receivedGroup.length = 0;
    adminSocket.off('updated_message');
    userSocket.off('updated_message');
  });
  it('users should not be able to update message in a chat he is not belong to', async () => {
    await testUpdateForbidden('userSocket', {
      id: groupMessageId1,
      chat_id: random(100, 300),
      content: 'Hey, this is updated message',
    });
  });

  it('users should be able to get messages in a chat he is belong to', async () => {
    await testFindMany(
      'adminSocket',
      {
        chat_id: directChatMock.id,
        page_num: 1,
        page_size: 10,
      },
      [directMessageId1, directMessageId2],
    );
    await testFindMany(
      'adminSocket',
      {
        chat_id: groupChatMock.id,
        page_num: 1,
        page_size: 10,
      },
      [groupMessageId1, groupMessageId2],
    );
  });
  it('users should not be able to get messages in a chat he is not belong to', async () => {
    await testFindManyForbidden('userSocket', {
      chat_id: random(100, 300),
      page_num: 1,
      page_size: 10,
    });
  });

  it('users should be able to delete message in a chat he is belong to', async () => {
    const receivedDirect = [] as number[];
    const adminSocket = sockets['adminSocket']!;
    const userSocket = sockets['userSocket']!;

    await joinChat('adminSocket', directChatMock.id);
    await joinChat('userSocket', directChatMock.id);
    adminSocket.on('deleted_message', (data: any) => {
      receivedDirect.push(data.receiver_id);
    });
    userSocket.on('deleted_message', (data: any) => {
      receivedDirect.push(data.receiver_id);
    });
    await testDelete('adminSocket', {
      id: directMessageId1,
      chat_id: directChatMock.id,
    });
    expect(receivedDirect).toEqual([adminMemberMock.id, userMemberMock.id]);
    receivedDirect.length = 0;

    const receivedGroup = [] as number[];
    await joinChat('adminSocket', groupChatMock.id);
    await joinChat('userSocket', groupChatMock.id);
    adminSocket.on('deleted_message', (data: any) => {
      receivedGroup.push(data.receiver_id);
    });
    userSocket.on('deleted_message', (data: any) => {
      receivedGroup.push(data.receiver_id);
    });
    await testDelete('adminSocket', {
      id: groupMessageId1,
      chat_id: groupChatMock.id,
    });
    expect(receivedGroup).toEqual([adminMemberMock.id, userMemberMock.id]);
    receivedGroup.length = 0;
    adminSocket.off('deleted_message');
    userSocket.off('deleted_message');
  });
  it('users should not be able to delete message in a chat he is not belong to', async () => {
    await testDeleteForbidden('userSocket', {
      id: groupMessageId1,
      chat_id: random(100, 300),
    });
  });
});
