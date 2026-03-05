import { E2eeKeys } from '../e2ee-keys.entity';

export default interface IE2EERepository {
  upsert(
    data: Pick<E2eeKeys, 'user_id' | 'device_id' | 'public_key'>,
  ): Promise<E2eeKeys>;

  findByUser(userId: number): Promise<E2eeKeys[]>;
}
