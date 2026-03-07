export class E2eeKeys {
  id: number;
  user_id: number;
  device_id: string;
  public_key: string;
  // Passphrase-encrypted PKCS8 private key (null until user sets a passphrase)
  encrypted_private_key: string | null;
  // JSON { salt: string, iterations: number } for PBKDF2 key derivation
  kdf_params: string | null;
  created_at: string;
  updated_at: string;
}
