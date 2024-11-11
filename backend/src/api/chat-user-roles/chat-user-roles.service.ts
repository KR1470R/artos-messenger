import { Inject, Injectable } from '@nestjs/common';
import { ChatUserRolesRepositoryToken } from './constants';
import { IChatUserRolesRepository } from './interfaces';

@Injectable()
export class ChatUserRolesService {
  constructor(
    @Inject(ChatUserRolesRepositoryToken)
    private readonly chatUserRolesRepository: IChatUserRolesRepository,
  ) {}

  public async processFindMany() {
    const data = await this.chatUserRolesRepository.findMany();

    return { data };
  }
}
