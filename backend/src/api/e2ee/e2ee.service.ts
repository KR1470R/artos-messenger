import { BadRequestException, Injectable } from '@nestjs/common';
import { E2eeRepository } from './e2ee.repository';
import { CreateE2EEKeyRequestDto } from './dto/requests';

function isBase64(s: string): boolean {
  return /^[A-Za-z0-9+/]+={0,2}$/.test(s) && s.length % 4 === 0;
}

@Injectable()
export class E2eeService {
  constructor(private readonly repo: E2eeRepository) {}

  async registerKey(userId: number, data: CreateE2EEKeyRequestDto) {
    const dev = data.device_id?.trim() || 'default';
    const key = data.public_key.trim();

    if (!isBase64(key)) {
      throw new BadRequestException('publicKey must be base64');
    }

    if (key.length < 40) {
      throw new BadRequestException('publicKey too short');
    }

    return this.repo.create({
      user_id: userId,
      device_id: dev,
      public_key: key,
    });
  }

  async getUserKeys(userId: number) {
    return this.repo.findByUser(userId);
  }
}
