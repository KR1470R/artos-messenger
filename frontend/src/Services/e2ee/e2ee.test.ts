import {
  generateKeyPair,
  exportPublicKey,
  exportPrivateKey,
  importPublicKey,
  importPrivateKey,
  deriveSharedKey,
  encryptMessage,
  decryptMessage,
  encodeContent,
  decodeContent,
  saveKeysToStorage,
  loadKeysFromStorage,
  clearKeysFromStorage,
  getDeviceId,
  encryptPrivateKeyWithPassphrase,
  decryptPrivateKeyWithPassphrase,
} from './index';

describe('generateKeyPair', () => {
  it('returns a valid CryptoKeyPair with publicKey and privateKey', async () => {
    const pair = await generateKeyPair();

    expect(pair.publicKey).toBeDefined();
    expect(pair.privateKey).toBeDefined();
    expect(pair.publicKey.type).toBe('public');
    expect(pair.privateKey.type).toBe('private');
    expect(pair.publicKey.algorithm).toMatchObject({ name: 'ECDH' });
    expect(pair.privateKey.algorithm).toMatchObject({ name: 'ECDH' });
  });
});

describe('exportPublicKey / importPublicKey', () => {
  it('exports public key as base64 SPKI and imports it back', async () => {
    const pair = await generateKeyPair();
    const exported = await exportPublicKey(pair.publicKey);

    expect(typeof exported).toBe('string');
    expect(exported.length).toBeGreaterThan(0);

    const imported = await importPublicKey(exported);
    expect(imported.type).toBe('public');
    expect(imported.algorithm).toMatchObject({ name: 'ECDH' });
  });

  it('imported public key is functionally equivalent to the original', async () => {
    const alicePair = await generateKeyPair();
    const bobPair = await generateKeyPair();

    const exported = await exportPublicKey(alicePair.publicKey);
    const imported = await importPublicKey(exported);

    const sharedKey1 = await deriveSharedKey(bobPair.privateKey, alicePair.publicKey);
    const sharedKey2 = await deriveSharedKey(bobPair.privateKey, imported);

    const encrypted = await encryptMessage('test message', sharedKey1);
    const decrypted = await decryptMessage(encrypted, sharedKey2);

    expect(decrypted).toBe('test message');
  });
});

describe('exportPrivateKey / importPrivateKey', () => {
  it('exports private key as base64 PKCS8 and imports it back', async () => {
    const pair = await generateKeyPair();
    const exported = await exportPrivateKey(pair.privateKey);

    expect(typeof exported).toBe('string');
    expect(exported.length).toBeGreaterThan(0);

    const imported = await importPrivateKey(exported);
    expect(imported.type).toBe('private');
    expect(imported.algorithm).toMatchObject({ name: 'ECDH' });
  });
});

describe('deriveSharedKey', () => {
  it('Alice and Bob derive a functionally identical shared key', async () => {
    const alicePair = await generateKeyPair();
    const bobPair = await generateKeyPair();

    const aliceShared = await deriveSharedKey(alicePair.privateKey, bobPair.publicKey);
    const bobShared = await deriveSharedKey(bobPair.privateKey, alicePair.publicKey);

    const encrypted = await encryptMessage('hello from alice', aliceShared);
    const decrypted = await decryptMessage(encrypted, bobShared);

    expect(decrypted).toBe('hello from alice');
  });

  it('shared key derived from a third party cannot decrypt the message', async () => {
    const alicePair = await generateKeyPair();
    const bobPair = await generateKeyPair();
    const evePair = await generateKeyPair();

    const aliceShared = await deriveSharedKey(alicePair.privateKey, bobPair.publicKey);
    const eveShared = await deriveSharedKey(evePair.privateKey, bobPair.publicKey);

    const encrypted = await encryptMessage('secret', aliceShared);

    await expect(decryptMessage(encrypted, eveShared)).rejects.toThrow();
  });

  it('returns an AES-GCM key with 256-bit length', async () => {
    const alicePair = await generateKeyPair();
    const bobPair = await generateKeyPair();

    const sharedKey = await deriveSharedKey(alicePair.privateKey, bobPair.publicKey);

    expect(sharedKey.algorithm).toMatchObject({ name: 'AES-GCM', length: 256 });
    expect(sharedKey.usages).toContain('encrypt');
    expect(sharedKey.usages).toContain('decrypt');
  });
});

describe('encryptMessage / decryptMessage', () => {
  let sharedKey: CryptoKey;

  beforeAll(async () => {
    const alicePair = await generateKeyPair();
    const bobPair = await generateKeyPair();
    sharedKey = await deriveSharedKey(alicePair.privateKey, bobPair.publicKey);
  });

  it('returns an object with iv and ciphertext fields in base64', async () => {
    const result = await encryptMessage('test', sharedKey);

    expect(result).toHaveProperty('iv');
    expect(result).toHaveProperty('ciphertext');
    expect(typeof result.iv).toBe('string');
    expect(typeof result.ciphertext).toBe('string');
    expect(result.iv.length).toBeGreaterThan(0);
    expect(result.ciphertext.length).toBeGreaterThan(0);
  });

  it('ciphertext differs from the original plaintext', async () => {
    const plaintext = 'secret message';
    const result = await encryptMessage(plaintext, sharedKey);

    expect(result.ciphertext).not.toBe(plaintext);
    expect(result.ciphertext).not.toContain(plaintext);
  });

  it('decryption restores the original string exactly', async () => {
    const plaintext = 'Hello, Bob! 🔐';
    const encrypted = await encryptMessage(plaintext, sharedKey);
    const decrypted = await decryptMessage(encrypted, sharedKey);

    expect(decrypted).toBe(plaintext);
  });

  it('two encrypt calls with the same plaintext produce different IVs', async () => {
    const result1 = await encryptMessage('same message', sharedKey);
    const result2 = await encryptMessage('same message', sharedKey);

    expect(result1.iv).not.toBe(result2.iv);
  });

  it('two encrypt calls with the same plaintext produce different ciphertexts', async () => {
    const result1 = await encryptMessage('same message', sharedKey);
    const result2 = await encryptMessage('same message', sharedKey);

    expect(result1.ciphertext).not.toBe(result2.ciphertext);
  });

  it('encrypts and decrypts an empty string correctly', async () => {
    const encrypted = await encryptMessage('', sharedKey);
    const decrypted = await decryptMessage(encrypted, sharedKey);

    expect(decrypted).toBe('');
  });

  it('encrypts and decrypts a long text (10 000 characters) correctly', async () => {
    const plaintext = 'A'.repeat(10_000);
    const encrypted = await encryptMessage(plaintext, sharedKey);
    const decrypted = await decryptMessage(encrypted, sharedKey);

    expect(decrypted).toBe(plaintext);
  });
});

describe('encodeContent / decodeContent', () => {
  it('encodeContent produces a string with the e2ee: prefix', () => {
    const encoded = encodeContent({ iv: 'aGVsbG8=', ciphertext: 'd29ybGQ=' });

    expect(encoded).toBe('e2ee:aGVsbG8=:d29ybGQ=');
  });

  it('decodeContent correctly parses an encoded string', () => {
    const decoded = decodeContent('e2ee:aGVsbG8=:d29ybGQ=');

    expect(decoded).not.toBeNull();
    expect(decoded!.iv).toBe('aGVsbG8=');
    expect(decoded!.ciphertext).toBe('d29ybGQ=');
  });

  it('decodeContent returns null for strings without the e2ee: prefix', () => {
    expect(decodeContent('plain text')).toBeNull();
    expect(decodeContent('')).toBeNull();
    expect(decodeContent('base64string==')).toBeNull();
  });

  it('decodeContent returns null when the second separator is missing', () => {
    expect(decodeContent('e2ee:onlyiv')).toBeNull();
  });

  it('encodeContent and decodeContent are inverse operations', async () => {
    const alicePair = await generateKeyPair();
    const bobPair = await generateKeyPair();
    const sharedKey = await deriveSharedKey(alicePair.privateKey, bobPair.publicKey);

    const parts = await encryptMessage('round-trip test', sharedKey);
    const decoded = decodeContent(encodeContent(parts));

    expect(decoded).toEqual(parts);
  });
});

describe('saveKeysToStorage / loadKeysFromStorage / clearKeysFromStorage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('loadKeysFromStorage returns null when no keys are stored', async () => {
    const result = await loadKeysFromStorage();
    expect(result).toBeNull();
  });

  it('saveKeysToStorage persists keys and loadKeysFromStorage restores them', async () => {
    const pair = await generateKeyPair();
    await saveKeysToStorage(pair);

    const loaded = await loadKeysFromStorage();

    expect(loaded).not.toBeNull();
    expect(loaded!.publicKey.type).toBe('public');
    expect(loaded!.privateKey.type).toBe('private');
  });

  it('restored key pair is functionally equivalent to the original', async () => {
    const alicePair = await generateKeyPair();
    const bobPair = await generateKeyPair();
    await saveKeysToStorage(alicePair);

    const loaded = await loadKeysFromStorage();
    const sharedKey = await deriveSharedKey(loaded!.privateKey, bobPair.publicKey);

    const plaintext = 'restore test';
    const encrypted = await encryptMessage(plaintext, sharedKey);
    const decrypted = await decryptMessage(encrypted, sharedKey);

    expect(decrypted).toBe(plaintext);
  });

  it('clearKeysFromStorage removes keys — loadKeysFromStorage returns null', async () => {
    const pair = await generateKeyPair();
    await saveKeysToStorage(pair);
    clearKeysFromStorage();

    const result = await loadKeysFromStorage();
    expect(result).toBeNull();
  });
});

describe('getDeviceId', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('generates and stores a deviceId on first call', () => {
    const id = getDeviceId();

    expect(typeof id).toBe('string');
    expect(id.length).toBeGreaterThan(0);
    expect(localStorage.getItem('e2ee_device_id')).toBe(id);
  });

  it('returns the same deviceId on subsequent calls', () => {
    const id1 = getDeviceId();
    const id2 = getDeviceId();

    expect(id1).toBe(id2);
  });
});

describe('encryptPrivateKeyWithPassphrase / decryptPrivateKeyWithPassphrase', () => {
  const passphrase = 'my_secret_passphrase_123';
  let privateKey: CryptoKey;

  beforeAll(async () => {
    const pair = await generateKeyPair();
    privateKey = pair.privateKey;
  });

  it('returns a structure with encrypted_private_key and kdf_params', async () => {
    const backup = await encryptPrivateKeyWithPassphrase(privateKey, passphrase);

    expect(backup).toHaveProperty('encrypted_private_key');
    expect(backup).toHaveProperty('kdf_params');
    expect(typeof backup.encrypted_private_key).toBe('string');
    expect(typeof backup.kdf_params).toBe('string');
  });

  it('kdf_params contains salt and iterations=310000', async () => {
    const backup = await encryptPrivateKeyWithPassphrase(privateKey, passphrase);
    const kdfParams = JSON.parse(backup.kdf_params);

    expect(kdfParams).toHaveProperty('salt');
    expect(kdfParams.iterations).toBe(310_000);
  });

  it('two encrypt calls produce different encrypted_private_key values', async () => {
    const backup1 = await encryptPrivateKeyWithPassphrase(privateKey, passphrase);
    const backup2 = await encryptPrivateKeyWithPassphrase(privateKey, passphrase);

    expect(backup1.encrypted_private_key).not.toBe(backup2.encrypted_private_key);
  });

  it('decryption with the correct passphrase restores the private key', async () => {
    const backup = await encryptPrivateKeyWithPassphrase(privateKey, passphrase);
    const restored = await decryptPrivateKeyWithPassphrase(backup, passphrase);

    expect(restored.type).toBe('private');
    expect(restored.algorithm).toMatchObject({ name: 'ECDH' });
  });

  it('restored private key is functionally equivalent to the original', async () => {
    const alicePair = await generateKeyPair();
    const backup = await encryptPrivateKeyWithPassphrase(alicePair.privateKey, passphrase);
    const restored = await decryptPrivateKeyWithPassphrase(backup, passphrase);

    const bobPair = await generateKeyPair();
    const sharedOriginal = await deriveSharedKey(alicePair.privateKey, bobPair.publicKey);
    const sharedRestored = await deriveSharedKey(restored, bobPair.publicKey);

    const encrypted = await encryptMessage('backup restore test', sharedOriginal);
    const decrypted = await decryptMessage(encrypted, sharedRestored);

    expect(decrypted).toBe('backup restore test');
  });

  it('decryption with a wrong passphrase throws an exception', async () => {
    const backup = await encryptPrivateKeyWithPassphrase(privateKey, passphrase);

    await expect(
      decryptPrivateKeyWithPassphrase(backup, 'wrong_passphrase')
    ).rejects.toThrow();
  });
});