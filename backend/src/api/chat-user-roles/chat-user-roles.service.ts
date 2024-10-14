import { Injectable } from '@nestjs/common';
import { ChatUserRolesRepository } from './chat-user-roles.repository';

@Injectable()
export class ChatUserRolesService {
  constructor(
    private readonly chatUserRolesRepository: ChatUserRolesRepository,
  ) {}

  public async processFindMany() {
    const data = await this.chatUserRolesRepository.findMany();

    return { data };
  }
}
