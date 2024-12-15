import { ExceptionResponseDto, SuccessResponseDto } from '#common/dto';
import {
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiOkResponse,
  ApiDefaultResponse,
  ApiTags,
  ApiBearerAuth,
} from '@nestjs/swagger';
import {
  ChatFullResponseDto,
  CreateChatResponseDto,
  FindManyChatsResponseDto,
} from './dto/responses';
import { ChatsService } from './chats.service';
import { LogginedUserIdHttp } from '#common/decorators';
import { FilterChatsQueryDto } from './dto/requests';

@Controller('chats')
@ApiTags('chats')
@ApiBearerAuth('jwt')
export class ChatsController {
  constructor(private readonly chatsService: ChatsService) {}

  @Post(':target_user_id')
  @ApiOperation({
    description: 'Create new chat with user.',
  })
  @ApiOkResponse({
    description: 'Chat created successfully.',
    type: CreateChatResponseDto,
  })
  @ApiDefaultResponse({
    description: 'Something went wrong.',
    type: ExceptionResponseDto,
  })
  public async create(
    @LogginedUserIdHttp() logginedUserId: number,
    @Param('target_user_id', new ParseIntPipe()) targetUserId: number,
  ) {
    const id = await this.chatsService.processCreate(
      logginedUserId,
      targetUserId,
    );

    return { message: 'Chat created successfully.', id };
  }

  @Get()
  @ApiOperation({
    description: 'Get list of chats where user persists.',
  })
  @ApiOkResponse({
    type: FindManyChatsResponseDto,
  })
  @ApiDefaultResponse({
    description: 'Something went wrong.',
    type: ExceptionResponseDto,
  })
  public async findMany(
    @LogginedUserIdHttp() logginedUserId: number,
    @Query() query?: FilterChatsQueryDto,
  ): Promise<FindManyChatsResponseDto> {
    return await this.chatsService.processFindMany(logginedUserId, query);
  }

  @Get(':chat_id')
  @ApiOperation({
    description: 'Get chat and its members.',
  })
  @ApiOkResponse({
    type: ChatFullResponseDto,
  })
  @ApiDefaultResponse({
    description: 'Something went wrong.',
    type: ExceptionResponseDto,
  })
  public async findOne(
    @LogginedUserIdHttp() logginedUserId: number,
    @Param('chat_id', new ParseIntPipe()) chatId: number,
  ): Promise<ChatFullResponseDto> {
    return await this.chatsService.processFindOne(logginedUserId, chatId);
  }

  @Delete(':chat_id')
  @ApiOperation({
    description: 'Create new chat with user.',
  })
  @ApiOkResponse({
    description: 'Chat deleted successfully.',
    type: SuccessResponseDto,
  })
  @ApiDefaultResponse({
    description: 'Something went wrong.',
    type: ExceptionResponseDto,
  })
  public async delete(
    @LogginedUserIdHttp() logginedUserId: number,
    @Param('chat_id', new ParseIntPipe()) chatId: number,
  ) {
    await this.chatsService.processDelete(logginedUserId, chatId);

    return { message: 'Chat deleted successfully.' };
  }
}
