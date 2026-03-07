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

  // Stores the passphrase-encrypted private key for the account.
  // Applied to all device rows — any device can restore from backup.
  public async upsertBackup(
    userId: number,
    encryptedPrivateKey: string,
    kdfParams: string,
  ): Promise<void> {
    await this.db(this.entity).where({ user_id: userId }).update({
      encrypted_private_key: encryptedPrivateKey,
      kdf_params: kdfParams,
    });
  }

  public async findBackup(
    userId: number,
  ): Promise<Pick<E2eeKeys, 'encrypted_private_key' | 'kdf_params'> | null> {
    const row = await this.db(this.entity)
      .where({ user_id: userId })
      .whereNotNull('encrypted_private_key')
      .orderBy('updated_at', 'desc')
      .first();

    if (!row) return null;
    return {
      encrypted_private_key: row.encrypted_private_key,
      kdf_params: row.kdf_params,
    };
  }
}
