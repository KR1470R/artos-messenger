import { Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { InjectConnection } from 'nest-knexjs';
import { E2eeKeys } from './e2ee-keys.entity';
import IE2EERepository from './interfaces/e2ee.repository.interface';

@Injectable()
export class E2eeRepository implements IE2EERepository {
  public readonly entity = 'e2ee_keys';

  constructor(@InjectConnection() private readonly db: Knex) {}

  public async upsert(
    data: Pick<E2eeKeys, 'user_id' | 'device_id' | 'public_key'>,
  ): Promise<E2eeKeys> {
    await this.db(this.entity)
      .insert(data)
      .onConflict(['user_id', 'device_id'])
      .merge({ public_key: data.public_key });

    return this.db(this.entity)
      .where({ user_id: data.user_id, device_id: data.device_id })
      .first() as Promise<E2eeKeys>;
  }

  public async findByUser(userId: number): Promise<E2eeKeys[]> {
    return this.db(this.entity)
      .where({ user_id: userId })
      .orderBy('updated_at', 'desc');
  }
}
