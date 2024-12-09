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
import { GroupsService } from './groups.service';
import { ExceptionResponseDto, SuccessResponseDto } from '#common/dto';
import {
  ApiOperation,
  ApiOkResponse,
  ApiDefaultResponse,
  ApiTags,
  ApiBearerAuth,
} from '@nestjs/swagger';
import {
  CreateGroupResponseDto,
  FindManyGroupsResponseDto,
  GroupShortResponseDto,
} from './dto/responses';
import {
  AddMemberRequestDto,
  CreateGroupRequestDto,
  FindManyGroupsRequestDto,
  UpdateMemberRequestDto,
} from './dto/requests';
import { LogginedUserIdHttp } from '#common/decorators';

@Controller('groups')
@ApiTags('groups')
@ApiBearerAuth('jwt')
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  @Post()
  @ApiOperation({
    description:
      'Create new group. Note, invited users will be added as members with role - user.',
  })
  @ApiOkResponse({
    description: 'Group created successfully.',
    type: CreateGroupResponseDto,
  })
  @ApiDefaultResponse({
    description: 'Something went wrong.',
    type: ExceptionResponseDto,
  })
  public async create(
    @LogginedUserIdHttp() logginedUserId: number,
    @Body() data: CreateGroupRequestDto,
  ) {
    const id = await this.groupsService.processCreate(logginedUserId, data);
    return { message: 'Group created successfully.', id };
  }

  @Patch('/:group_id')
  @ApiOperation({
    description: 'Update group information.',
  })
  @ApiOkResponse({
    description: 'Group updated successfully.',
    type: SuccessResponseDto,
  })
  @ApiDefaultResponse({
    description: 'Something went wrong.',
    type: ExceptionResponseDto,
  })
  public async update(
    @LogginedUserIdHttp() logginedUserId: number,
    @Param('group_id') groupId: number,
    @Body() data: CreateGroupRequestDto,
  ) {
    await this.groupsService.processUpdate(logginedUserId, groupId, data);
    return { message: 'Group updated successfully.', id: groupId };
  }

  @Post('/:group_id/members/:user_id')
  @ApiOperation({
    description: 'Add member to group.',
  })
  @ApiOkResponse({
    description: 'Member added successfully.',
    type: SuccessResponseDto,
  })
  @ApiDefaultResponse({
    description: 'Something went wrong.',
    type: ExceptionResponseDto,
  })
  public async addMember(
    @LogginedUserIdHttp() logginedUserId: number,
    @Param('group_id') groupId: number,
    @Param('user_id') userId: number,
    @Body() data: AddMemberRequestDto,
  ) {
    await this.groupsService.processAddMember(
      logginedUserId,
      groupId,
      userId,
      data,
    );
    return { message: 'Member added successfully.' };
  }

  @Patch('/:group_id/members/:user_id')
  @ApiOperation({
    description: 'Update member in group.',
  })
  @ApiOkResponse({
    description: 'Member updated successfully.',
    type: SuccessResponseDto,
  })
  @ApiDefaultResponse({
    description: 'Something went wrong.',
    type: ExceptionResponseDto,
  })
  public async updateMember(
    @LogginedUserIdHttp() logginedUserId: number,
    @Param('group_id') groupId: number,
    @Param('user_id') userId: number,
    @Body() data: UpdateMemberRequestDto,
  ) {
    await this.groupsService.processUpdateMember(
      logginedUserId,
      groupId,
      userId,
      data,
    );
    return { message: 'Member updated successfully.' };
  }

  @Delete('/:group_id/members/:user_id')
  @ApiOperation({
    description: 'Delete member from group.',
  })
  @ApiOkResponse({
    description: 'Member deleted successfully.',
    type: SuccessResponseDto,
  })
  @ApiDefaultResponse({
    description: 'Something went wrong.',
    type: ExceptionResponseDto,
  })
  public async deleteMember(
    @LogginedUserIdHttp() logginedUserId: number,
    @Param('group_id') groupId: number,
    @Param('user_id') userId: number,
  ) {
    await this.groupsService.processDeleteMember(
      logginedUserId,
      groupId,
      userId,
    );
    return { message: 'Member deleted successfully.' };
  }

  @Delete('/:group_id')
  @ApiOperation({
    description: 'Delete group.',
  })
  @ApiOkResponse({
    description: 'Group deleted successfully.',
    type: SuccessResponseDto,
  })
  @ApiDefaultResponse({
    description: 'Something went wrong.',
    type: ExceptionResponseDto,
  })
  public async delete(
    @LogginedUserIdHttp() logginedUserId: number,
    @Param('group_id') groupId: number,
  ) {
    await this.groupsService.processDelete(logginedUserId, groupId);
    return { message: 'Group deleted successfully.' };
  }

  @Get('/:group_id')
  @ApiOperation({
    description: 'Find group by id.',
  })
  @ApiOkResponse({
    description: 'Group found successfully.',
    type: GroupShortResponseDto,
  })
  @ApiDefaultResponse({
    description: 'Something went wrong.',
    type: ExceptionResponseDto,
  })
  public async findOne(
    @LogginedUserIdHttp() logginedUserId: number,
    @Param('group_id') groupId: number,
  ) {
    return await this.groupsService.processFindOne(logginedUserId, groupId);
  }

  @Get()
  @ApiOperation({
    description: 'Find many groups.',
  })
  @ApiOkResponse({
    description: 'Groups found successfully.',
    type: FindManyGroupsResponseDto,
  })
  @ApiDefaultResponse({
    description: 'Something went wrong.',
    type: ExceptionResponseDto,
  })
  public async findMany(
    @LogginedUserIdHttp() logginedUserId: number,
    @Query() filters: FindManyGroupsRequestDto,
  ) {
    const data = await this.groupsService.processFindMany(
      logginedUserId,
      filters,
    );

    return { data };
  }
}
