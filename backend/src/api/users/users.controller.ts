import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { LogginedUserId, Public } from '#common/decorators';
import { ExceptionResponseDto, SuccessResponseDto } from '#common/dto';
import {
  ApiOperation,
  ApiOkResponse,
  ApiDefaultResponse,
  ApiTags,
  ApiBearerAuth,
} from '@nestjs/swagger';
import {
  CreateUserRequestDto,
  FindManyUsersRequestDto,
  UpdateUserRequestDto,
} from './dto/requests';
import {
  CreateUserResponseDto,
  FindManyUsersResponseDto,
  UserShortResponseDto,
} from './dto/responses';

@Controller('users')
@ApiTags('users')
@ApiBearerAuth('jwt')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/register')
  @Public()
  @ApiOperation({
    description: 'Register a new user.',
  })
  @ApiOkResponse({
    description: 'User created successfully.',
    type: CreateUserResponseDto,
  })
  @ApiDefaultResponse({
    description: 'Something went wrong.',
    type: ExceptionResponseDto,
  })
  public async create(@Body() data: CreateUserRequestDto) {
    const id = await this.usersService.processCreate(data);

    return { message: 'User created successfully.', id };
  }

  @Patch('/me')
  @ApiOperation({
    description: 'Update loggined user information.',
  })
  @ApiOkResponse({
    description: 'User updated successfully.',
    type: SuccessResponseDto,
  })
  @ApiDefaultResponse({
    description: 'Something went wrong.',
    type: ExceptionResponseDto,
  })
  public async update(
    @LogginedUserId() logginedUserId: number,
    @Body() data: UpdateUserRequestDto,
  ) {
    await this.usersService.processUpdate(logginedUserId, data);

    return { message: 'User updated successfully.' };
  }

  @Delete('/me')
  @ApiOperation({
    description: 'Delete user account.',
  })
  @ApiOkResponse({
    description: 'User deleted successfully.',
    type: SuccessResponseDto,
  })
  @ApiDefaultResponse({
    description: 'Something went wrong.',
    type: ExceptionResponseDto,
  })
  public async delete(@LogginedUserId() logginedUserId: number) {
    await this.usersService.processDelete(logginedUserId);

    return { message: 'User deleted successfully.' };
  }

  @Get()
  @ApiOperation({
    description: 'Find many users.',
  })
  @ApiOkResponse({
    description: 'Users found successfully.',
    type: FindManyUsersResponseDto,
  })
  @ApiDefaultResponse({
    description: 'Something went wrong.',
    type: ExceptionResponseDto,
  })
  public async findMany(@Query() filters: FindManyUsersRequestDto) {
    return await this.usersService.processFindMany(filters);
  }

  @Get('/me')
  @ApiOperation({
    description: 'Find loggined user.',
  })
  @ApiOkResponse({
    description: 'User found successfully.',
    type: UserShortResponseDto,
  })
  @ApiDefaultResponse({
    description: 'Something went wrong.',
    type: ExceptionResponseDto,
  })
  public async findMe(@LogginedUserId() logginedUserId: number) {
    return await this.usersService.processFindOne(logginedUserId);
  }

  @Get('/:user_id')
  @ApiOperation({
    description: 'Find user by id.',
  })
  @ApiOkResponse({
    description: 'User found successfully.',
    type: UserShortResponseDto,
  })
  @ApiDefaultResponse({
    description: 'Something went wrong.',
    type: ExceptionResponseDto,
  })
  public async findOne(@Param('user_id') userId: number) {
    return await this.usersService.processFindOne(userId);
  }
}
