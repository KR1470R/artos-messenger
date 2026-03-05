import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiDefaultResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { LogginedUserIdHttp } from '#common/decorators';
import { ExceptionResponseDto } from '#common/dto';
import { E2eeService } from './e2ee.service';
import { CreateE2EEKeyRequestDto } from './dto/requests';
import { E2eeKeyResponseDto } from './dto/responses';

@Controller('e2ee')
@ApiTags('e2ee')
@ApiBearerAuth('jwt')
export class E2eeController {
  constructor(private readonly e2eeService: E2eeService) {}

  @Post('keys')
  @ApiOperation({
    description:
      'Register or refresh the ECDH public key for the calling user on a given device. ' +
      'Upserts on (user_id, device_id) — safe to call on every login.',
  })
  @ApiOkResponse({ type: E2eeKeyResponseDto })
  @ApiDefaultResponse({ type: ExceptionResponseDto })
  async registerKey(
    @LogginedUserIdHttp() logginedUserId: number,
    @Body() data: CreateE2EEKeyRequestDto,
  ): Promise<E2eeKeyResponseDto> {
    return this.e2eeService.registerKey(logginedUserId, data);
  }

  @Get('keys/:userId')
  @ApiOperation({
    description:
      'Get all registered public keys for a user (one per device, ordered newest first). ' +
      'Any authenticated user can fetch keys in order to start an encrypted conversation.',
  })
  @ApiOkResponse({ type: E2eeKeyResponseDto, isArray: true })
  @ApiDefaultResponse({ type: ExceptionResponseDto })
  async getUserKeys(
    @Param('userId', new ParseIntPipe()) userId: number,
  ): Promise<E2eeKeyResponseDto[]> {
    return this.e2eeService.getUserKeys(userId);
  }
}
