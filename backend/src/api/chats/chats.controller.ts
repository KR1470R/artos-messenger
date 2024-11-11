import { ExceptionResponseDto, SuccessResponseDto } from '#common/dto';
import { Controller, Delete, Param, Post } from '@nestjs/common';
import {
  ApiOperation,
  ApiOkResponse,
  ApiDefaultResponse,
  ApiTags,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { CreateChatResponseDto } from './dto/responses';
import { ChatsService } from './chats.service';
import { LogginedUserIdHttp } from '#common/decorators';

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
    @Param('target_user_id') targetUserId: number,
  ) {
    const id = await this.chatsService.processCreate(
      logginedUserId,
      targetUserId,
    );

    return { message: 'Chat created successfully.', id };
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
    @Param('chat_id') chatId: number,
  ) {
    await this.chatsService.processDelete(logginedUserId, chatId);

    return { message: 'Chat deleted successfully.' };
  }
}
