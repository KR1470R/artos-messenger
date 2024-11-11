import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { io, Socket } from 'socket.io-client';
import { ChatsModule } from '#api/chats/chats.module';
import { MessagesGateway } from '../messages.gateway';
import { MessagesRepository } from '../messages.repository';
import { MessagesService } from '../messages.service';
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
  directChatMock,
  groupChatMock,
  userMemberMock,
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

let app: NestFastifyApplication;
let socket: Socket;
let db: Knex;
let messagesService: MessagesService;

let directMessageId1: number;
let directMessageId2: number;
let groupMessageId1: number;
let groupMessageId2: number;

const initSocket = () => {
  return new Promise<void>((resolve) => {
    socket = io('ws://localhost:8080/messages');
    socket.on('connect', resolve);
  });
};

const emitEvent = async <T>(event: string, payload: object): Promise<T> => {
  const res:
    | WsResponse<T>
    | {
        status: string;
        message: string;
      } = await (() =>
    new Promise((resolve) => {
      socket.emit(event, payload);
      socket.once(event, resolve);
      socket.once('error', resolve);
    }))();

  if (typeof res === 'object' && 'status' in res) throw new Error(res.message);

  return res as T;
};

const testCreate = async (
  payload: CreateMessageRequestDto,
): Promise<number> => {
  const messageId = await emitEvent<number>('create_message', payload);

  expect(messageId).toBeDefined();
  expect(typeof messageId).toBe('number');

  const allMessages = await messagesService.processFindMany({
    chat_id: payload.chat_id,
    sender_id: payload.sender_id,
  });

  const targetMessage = allMessages.find((m) => m.id === messageId);

  expect(targetMessage).toBeDefined();
  expect(targetMessage?.content).toEqual(payload.content);

  return messageId;
};
const testCreateForbidden = async (payload: CreateMessageRequestDto) => {
  await expect(emitEvent('create_message', payload)).rejects.toThrow();
};
const testUpdate = async (payload: UpdateMessageRequestDto) => {
  const response = await emitEvent('update_message', payload);
  expect(response).toEqual('Message updated successfully.');

  const allMessages = await messagesService.processFindMany({
    chat_id: payload.chat_id,
    sender_id: payload.sender_id,
  });

  const targetMessage = allMessages.find((m) => m.id === payload.id);

  expect(targetMessage).toBeDefined();
  expect(targetMessage?.content).toEqual(payload.content);
  expect(targetMessage?.is_read).toEqual(payload.is_read);
};
const testUpdateForbidden = async (payload: UpdateMessageRequestDto) => {
  await expect(emitEvent('update_message', payload)).rejects.toThrow();
};
const testDelete = async (payload: DeleteMessageRequestDto) => {
  await emitEvent('delete_message', payload);
  const allMessages = await messagesService.processFindMany({
    chat_id: payload.chat_id,
    sender_id: payload.sender_id,
  });

  const targetMessage = allMessages.find((m) => m.id === payload.id);

  expect(targetMessage).toBeUndefined();
};
const testDeleteForbidden = async (payload: DeleteMessageRequestDto) => {
  await expect(emitEvent('delete_message', payload)).rejects.toThrow();
};
const testFindMany = async (
  payload: FindManyMessagesRequestDto,
  expectedIds: number[],
) => {
  const messages = await emitEvent<
    Pick<Messages, 'content' | 'sender_id' | 'id'>[]
  >('find_many_messages', payload);

  expectedIds.forEach((id) => {
    const targetMessage = messages.find((m) => m.id === id);
    expect(targetMessage).toBeDefined();
  });
};
const testFindManyForbidden = async (payload: FindManyMessagesRequestDto) => {
  await expect(emitEvent('find_many_messages', payload)).rejects.toThrow();
};

beforeAll(async () => {
  const moduleRef = await createBaseTestingModule({
    imports: [ChatsModule],
    providers: [MessagesGateway, MessagesService, MessagesRepository],
    exports: [MessagesService, MessagesRepository],
  });

  app = moduleRef.createNestApplication(new FastifyAdapter());
  await app.register(fastifyCookie);
  await app.init();
  await app.getHttpAdapter().getInstance().ready();

  await setTimeout(500);

  await initSocket();

  messagesService = moduleRef.get<MessagesService>(MessagesService);
  db = moduleRef.get<Knex>('default');

  await flushMockGroupChatsDb(db);
  await flushMockDirectChatsDb(db);
  await flushMockUsersDb(db);
  await flushMockMessagesDb(db);
  await flushMockMessagesDb(db);

  await prepareMockUsersDb(db);
  await prepareMockDirectChatsDb(db);
  await prepareMockGroupChatsDb(db);
});

afterAll(async () => {
  await flushMockGroupChatsDb(db);
  await flushMockDirectChatsDb(db);
  await flushMockUsersDb(db);
  await flushMockMessagesDb(db);

  socket.disconnect();
  await app.close();
});

describe('MessagesGateway', () => {
  it('users should be able to create message in a chat he is belong to', async () => {
    const receivedDirect = [] as number[];
    await emitEvent('join_chat', {
      chat_id: directChatMock.id,
      user_id: adminMemberMock.id,
    });
    await emitEvent('join_chat', {
      chat_id: directChatMock.id,
      user_id: userMemberMock.id,
    });
    socket.on('new_message', (data: any) => {
      console.log('new message', data);
      receivedDirect.push(data.receiver_id);
    });
    directMessageId1 = await testCreate({
      chat_id: directChatMock.id,
      sender_id: adminMemberMock.id,
      content: 'Hi, how are you?',
    });
    expect(receivedDirect).toEqual([adminMemberMock.id, userMemberMock.id]);
    receivedDirect.length = 0;
    directMessageId2 = await testCreate({
      chat_id: directChatMock.id,
      sender_id: userMemberMock.id,
      content: 'Hi, I am fine, thanks!',
    });
    expect(receivedDirect).toEqual([adminMemberMock.id, userMemberMock.id]);
    receivedDirect.length = 0;
    await emitEvent('leave_chat', {
      chat_id: directChatMock.id,
      user_id: userMemberMock.id,
    });
    await emitEvent('leave_chat', {
      chat_id: directChatMock.id,
      user_id: adminMemberMock.id,
    });

    const receivedGroup = [] as number[];
    await emitEvent('join_chat', {
      chat_id: groupChatMock.id,
      user_id: adminMemberMock.id,
    });
    await emitEvent('join_chat', {
      chat_id: groupChatMock.id,
      user_id: userMemberMock.id,
    });
    socket.on('new_message', (data: any) => {
      receivedGroup.push(data.receiver_id);
    });
    groupMessageId1 = await testCreate({
      chat_id: groupChatMock.id,
      sender_id: adminMemberMock.id,
      content: 'Hello, everyone!',
    });
    expect(receivedGroup).toEqual([adminMemberMock.id, userMemberMock.id]);
    receivedGroup.length = 0;
    groupMessageId2 = await testCreate({
      chat_id: groupChatMock.id,
      sender_id: userMemberMock.id,
      content: 'Hello, admin!',
    });
    expect(receivedGroup).toEqual([adminMemberMock.id, userMemberMock.id]);
    receivedDirect.length = 0;
    await emitEvent('leave_chat', {
      chat_id: groupChatMock.id,
      user_id: userMemberMock.id,
    });
    await emitEvent('leave_chat', {
      chat_id: groupChatMock.id,
      user_id: adminMemberMock.id,
    });
    socket.off('new_message');
  });
  it('users should not be able to create message in a chat he is not belong to', async () => {
    await testCreateForbidden({
      chat_id: random(100, 300),
      sender_id: random(100, 300),
      content: 'Should not create me!!',
    });
  });

  it('users should be able to update message in a chat he is belong to', async () => {
    await testUpdate({
      id: directMessageId1,
      chat_id: directChatMock.id,
      sender_id: adminMemberMock.id,
      content: "Actually, i don't give a fuck)",
    });
    await testUpdate({
      id: groupMessageId1,
      chat_id: groupChatMock.id,
      sender_id: adminMemberMock.id,
      content: 'Hey, this is updated message',
    });
  });
  it('users should not be able to update message in a chat he is not belong to', async () => {
    await testUpdateForbidden({
      id: groupMessageId1,
      chat_id: random(100, 300),
      sender_id: random(100, 300),
      content: 'Hey, this is updated message',
    });
  });

  it('users should be able to get messages in a chat he is belong to', async () => {
    await testFindMany(
      {
        chat_id: directChatMock.id,
        sender_id: adminMemberMock.id,
        page_num: 1,
        page_size: 10,
      },
      [directMessageId1, directMessageId2],
    );
    await testFindMany(
      {
        chat_id: groupChatMock.id,
        sender_id: adminMemberMock.id,
        page_num: 1,
        page_size: 10,
      },
      [groupMessageId1, groupMessageId2],
    );
  });
  it('users should not be able to get messages in a chat he is not belong to', async () => {
    await testFindManyForbidden({
      chat_id: random(100, 300),
      sender_id: random(100, 300),
      page_num: 1,
      page_size: 10,
    });
  });

  it('users should be able to delete message in a chat he is belong to', async () => {
    await testDelete({
      id: directMessageId1,
      chat_id: directChatMock.id,
      sender_id: adminMemberMock.id,
    });
    await testDelete({
      id: groupMessageId1,
      chat_id: groupChatMock.id,
      sender_id: adminMemberMock.id,
    });
  });
  it('users should not be able to delete message in a chat he is not belong to', async () => {
    await testDeleteForbidden({
      id: groupMessageId1,
      chat_id: random(100, 300),
      sender_id: random(100, 300),
    });
  });
});
