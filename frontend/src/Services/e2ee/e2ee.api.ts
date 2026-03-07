import { ApiClient } from '@/Services/network/ApiClient'
import { EncryptedKeyBackup } from './e2ee'

// ApiClient already has baseURL = VITE_API_URL — use relative paths only.

export interface E2eeKeyRecord {
  id: number
  user_id: number
  device_id: string
  public_key: string
  created_at: string
  updated_at: string
}

export const registerPublicKey = async (
  publicKey: string,
  deviceId: string,
): Promise<E2eeKeyRecord> => {
  const res = await ApiClient.post<E2eeKeyRecord>('/e2ee/keys', {
    public_key: publicKey,
    device_id: deviceId,
  })
  return res.data
}

export const fetchUserPublicKeys = async (userId: number): Promise<E2eeKeyRecord[]> => {
  const res = await ApiClient.get<E2eeKeyRecord[]>(`/e2ee/keys/${userId}`)
  return res.data
}

export const uploadKeyBackup = async (backup: EncryptedKeyBackup): Promise<void> => {
  await ApiClient.put('/e2ee/backup', backup)
}

export const fetchKeyBackup = async (): Promise<EncryptedKeyBackup> => {
  const res = await ApiClient.get<EncryptedKeyBackup>('/e2ee/backup')
  return res.data
}