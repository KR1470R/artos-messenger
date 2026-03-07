import { E2eeKeys } from '../e2ee-keys.entity';

export default interface IE2EERepository {
  upsert(
    data: Pick<E2eeKeys, 'user_id' | 'device_id' | 'public_key'>,
  ): Promise<E2eeKeys>;

  findByUser(userId: number): Promise<E2eeKeys[]>;

  upsertBackup(
    userId: number,
    encryptedPrivateKey: string,
    kdfParams: string,
  ): Promise<void>;

  findBackup(
    userId: number,
  ): Promise<Pick<E2eeKeys, 'encrypted_private_key' | 'kdf_params'> | null>;
}
