import { E2eeKeys } from '../e2ee-keys.entity';

export default interface IE2EERepository {
  create(
    data: Pick<E2eeKeys, 'user_id' | 'public_key' | 'device_id'>,
  ): Promise<E2eeKeys | undefined>;

  findByUser(userId: number): Promise<E2eeKeys[]>;

  findByUserDevice(
    userId: number,
    deviceId: string,
  ): Promise<E2eeKeys | undefined>;
}
