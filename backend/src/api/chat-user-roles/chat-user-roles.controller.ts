import { Controller, Get } from '@nestjs/common';
import { ChatUserRolesService } from './chat-user-roles.service';
import { ExceptionResponseDto } from '#common/dto';
import {
  ApiOperation,
  ApiOkResponse,
  ApiDefaultResponse,
  ApiTags,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { FindManyChatUserRolesResponseDto } from './dto/responses';

@Controller('chat-user-roles')
@ApiTags('chat-user-roles')
@ApiBearerAuth('jwt')
export class ChatUserRolesController {
  constructor(private readonly chatUserRolesService: ChatUserRolesService) {}

  @Get()
  @ApiOperation({
    description: 'Get all chat user roles.',
  })
  @ApiOkResponse({
    description: 'Chat user roles found successfully.',
    type: FindManyChatUserRolesResponseDto,
  })
  @ApiDefaultResponse({
    description: 'Something went wrong.',
    type: ExceptionResponseDto,
  })
  public async findMany() {
    return await this.chatUserRolesService.processFindMany();
  }
}
