import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiDefaultResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { LogginedUserIdHttp } from '#common/decorators';
import { ExceptionResponseDto } from '#common/dto';
import { E2eeService } from './e2ee.service';
import {
  CreateE2EEKeyRequestDto,
  UploadKeyBackupRequestDto,
} from './dto/requests';
import { E2eeKeyResponseDto, KeyBackupResponseDto } from './dto/responses';

@Controller('e2ee')
@ApiTags('e2ee')
@ApiBearerAuth('jwt')
export class E2eeController {
  constructor(private readonly e2eeService: E2eeService) {}

  @Post('keys')
  @ApiOperation({
    description:
      'Register or refresh the ECDH public key for the calling user on a given device.',
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
    description: 'Get all registered public keys for a user (one per device).',
  })
  @ApiOkResponse({ type: E2eeKeyResponseDto, isArray: true })
  @ApiDefaultResponse({ type: ExceptionResponseDto })
  async getUserKeys(
    @Param('userId', new ParseIntPipe()) userId: number,
  ): Promise<E2eeKeyResponseDto[]> {
    return this.e2eeService.getUserKeys(userId);
  }

  @Put('backup')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    description:
      'Upload passphrase-encrypted private key backup. Server stores opaque blob.',
  })
  @ApiNoContentResponse()
  @ApiDefaultResponse({ type: ExceptionResponseDto })
  async uploadBackup(
    @LogginedUserIdHttp() logginedUserId: number,
    @Body() data: UploadKeyBackupRequestDto,
  ): Promise<void> {
    return this.e2eeService.uploadBackup(logginedUserId, data);
  }

  @Get('backup')
  @ApiOperation({
    description:
      'Fetch the passphrase-encrypted private key backup for the calling user.',
  })
  @ApiOkResponse({ type: KeyBackupResponseDto })
  @ApiDefaultResponse({ type: ExceptionResponseDto })
  async getBackup(
    @LogginedUserIdHttp() logginedUserId: number,
  ): Promise<KeyBackupResponseDto> {
    return this.e2eeService.getBackup(logginedUserId);
  }
}
