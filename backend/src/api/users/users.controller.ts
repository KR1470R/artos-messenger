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
import { Public } from '#common/decorators';
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

  @Patch('/:id')
  @Public()
  @ApiOperation({
    description: 'Update user information.',
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
    @Param('id') id: number,
    @Body() data: UpdateUserRequestDto,
  ) {
    await this.usersService.processUpdate(id, data);
    return { message: 'User updated successfully.' };
  }

  @Delete('/:id')
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
  public async delete(@Param('id') id: number) {
    await this.usersService.processDelete(id);
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
    return this.usersService.processFindMany(filters);
  }

  @Get('/:id')
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
  public async findOne(@Param('id') id: number) {
    return this.usersService.processFindOne(id);
  }
}
