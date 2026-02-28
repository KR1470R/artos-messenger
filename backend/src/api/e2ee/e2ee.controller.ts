import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { LogginedUserIdHttp } from '#common/decorators';
import { E2eeService } from './e2ee.service';
import {
  ApiBearerAuth,
  ApiDefaultResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import {
  CreateE2eeKeyResponseDto,
  FindManyE2eeKeyResponseDto,
} from './dto/responses';
import { CreateE2EEKeyRequestDto } from './dto/requests';
import { ExceptionResponseDto } from '#common/dto';

@Controller('e2ee')
@ApiBearerAuth('jwt')
export class E2eeController {
  constructor(private readonly e2ee: E2eeService) {}

  @Post('keys')
  @ApiOperation({
    description: 'Create new E2EE key.',
  })
  @ApiOkResponse({
    description: 'E2EE key created successfully.',
    type: CreateE2eeKeyResponseDto,
  })
  @ApiDefaultResponse({
    description: 'Something went wrong.',
    type: ExceptionResponseDto,
  })
  async create(
    @LogginedUserIdHttp() logginedUserId: number,
    @Body() data: CreateE2EEKeyRequestDto,
  ): Promise<CreateE2eeKeyResponseDto | undefined> {
    return this.e2ee.registerKey(logginedUserId, data);
  }

  @Get('keys/:userId')
  @ApiOperation({
    description: 'Get list of created E2EE keys of the user.',
  })
  @ApiOkResponse({
    type: FindManyE2eeKeyResponseDto,
  })
  @ApiDefaultResponse({
    description: 'Something went wrong.',
    type: ExceptionResponseDto,
  })
  async findMany(
    @Param('userId') userId: string,
  ): Promise<FindManyE2eeKeyResponseDto[]> {
    return this.e2ee.getUserKeys(Number(userId));
  }
}
