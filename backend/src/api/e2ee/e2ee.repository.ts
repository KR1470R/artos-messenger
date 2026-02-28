import { Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { InjectConnection } from 'nest-knexjs';
import { E2eeKeys } from './e2ee-keys.entity';
import { IE2EERepository } from './interfaces';

@Injectable()
export class E2eeRepository implements IE2EERepository {
  private readonly entity = 'e2ee_keys';

  constructor(@InjectConnection() private readonly db: Knex) {}

  public async create(
    data: Pick<E2eeKeys, 'user_id' | 'public_key' | 'device_id'>,
  ) {
    const existing = await this.db(this.entity)
      .select('id')
      .where({ user_id: data.user_id, device_id: data.device_id })
      .first();

    if (existing) {
      await this.db(this.entity).where({ id: existing.id }).update({
        public_key: data.public_key,
        updated_at: this.db.fn.now(),
      });

      return this.findByUserDevice(data.user_id, data.device_id);
    }

    await this.db(this.entity).insert({
      user_id: data.user_id,
      device_id: data.device_id,
      public_key: data.public_key,
    });

    return this.findByUserDevice(data.user_id, data.device_id);
  }

  public async findByUser(userId: number) {
    return this.db(this.entity)
      .where({ user_id: userId })
      .orderBy('updated_at', 'desc');
  }

  public async findByUserDevice(userId: number, deviceId: string) {
    return this.db(this.entity)
      .where({ user_id: userId, device_id: deviceId })
      .first();
  }
}
