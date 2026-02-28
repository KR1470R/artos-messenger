export class E2eeKeys {
  id: number;
  user_id: number;
  device_id: string;
  // base64 encoded 32-byte public key (tweetnacl)
  public_key: string;
  created_at: string;
  updated_at: string;
}
