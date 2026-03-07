/**
 * e2ee.ts — End-to-end encryption using the Web Crypto API.
 *
 * Scheme:
 *   Key exchange  : ECDH P-256
 *   Message enc   : AES-256-GCM (12-byte random IV per message)
 *
 * Wire format stored in messages.content:
 *   "e2ee:<iv_base64>:<ciphertext_base64>"
 *
 * Plaintext messages (legacy / no key registered) pass through untouched.
 * Private keys are persisted in localStorage as base64 PKCS8.
 */

const subtle = window.crypto.subtle

// ─── Helpers ──────────────────────────────────────────────────────────────────

function bufToBase64(buf: ArrayBuffer): string {
  const bytes = new Uint8Array(buf)
  let binary = ''
  for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i])
  return btoa(binary)
}

function base64ToBuf(b64: string): ArrayBuffer {
  const binary = atob(b64)
  const buf = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) buf[i] = binary.charCodeAt(i)
  return buf.buffer
}

// ─── Key pair ─────────────────────────────────────────────────────────────────

export async function generateKeyPair(): Promise<CryptoKeyPair> {
  return subtle.generateKey({ name: 'ECDH', namedCurve: 'P-256' }, true, [
    'deriveKey',
  ])
}

export async function exportPublicKey(key: CryptoKey): Promise<string> {
  const spki = await subtle.exportKey('spki', key)
  return bufToBase64(spki)
}

export async function exportPrivateKey(key: CryptoKey): Promise<string> {
  const pkcs8 = await subtle.exportKey('pkcs8', key)
  return bufToBase64(pkcs8)
}

export async function importPublicKey(b64: string): Promise<CryptoKey> {
  return subtle.importKey(
    'spki',
    base64ToBuf(b64),
    { name: 'ECDH', namedCurve: 'P-256' },
    true,
    [],
  )
}

export async function importPrivateKey(b64: string): Promise<CryptoKey> {
  return subtle.importKey(
    'pkcs8',
    base64ToBuf(b64),
    { name: 'ECDH', namedCurve: 'P-256' },
    true,
    ['deriveKey'],
  )
}

// ─── Shared secret ────────────────────────────────────────────────────────────

export async function deriveSharedKey(
  myPrivateKey: CryptoKey,
  theirPublicKey: CryptoKey,
): Promise<CryptoKey> {
  return subtle.deriveKey(
    { name: 'ECDH', public: theirPublicKey },
    myPrivateKey,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt'],
  )
}

// ─── Message encryption ───────────────────────────────────────────────────────

interface EncryptedParts {
  iv: string
  ciphertext: string
}

export async function encryptMessage(
  plaintext: string,
  sharedKey: CryptoKey,
): Promise<EncryptedParts> {
  const ivBytes = window.crypto.getRandomValues(new Uint8Array(12))
  const cipherBuf = await subtle.encrypt(
    { name: 'AES-GCM', iv: ivBytes },
    sharedKey,
    new TextEncoder().encode(plaintext),
  )
  return {
    iv: bufToBase64(ivBytes.buffer),
    ciphertext: bufToBase64(cipherBuf),
  }
}

export async function decryptMessage(
  parts: EncryptedParts,
  sharedKey: CryptoKey,
): Promise<string> {
  const plainBuf = await subtle.decrypt(
    { name: 'AES-GCM', iv: base64ToBuf(parts.iv) },
    sharedKey,
    base64ToBuf(parts.ciphertext),
  )
  return new TextDecoder().decode(plainBuf)
}

// ─── Wire format ──────────────────────────────────────────────────────────────

const PREFIX = 'e2ee:'

export function encodeContent(parts: EncryptedParts): string {
  return `${PREFIX}${parts.iv}:${parts.ciphertext}`
}

export function decodeContent(content: string): EncryptedParts | null {
  if (!content || !content.startsWith(PREFIX)) return null
  const rest = content.slice(PREFIX.length)
  const colonIdx = rest.indexOf(':')
  if (colonIdx === -1) return null
  return {
    iv: rest.slice(0, colonIdx),
    ciphertext: rest.slice(colonIdx + 1),
  }
}

// ─── localStorage persistence ─────────────────────────────────────────────────

const LS_PUB = 'e2ee_pub'
const LS_PRIV = 'e2ee_priv'

export async function saveKeysToStorage(pair: CryptoKeyPair): Promise<void> {
  localStorage.setItem(LS_PUB, await exportPublicKey(pair.publicKey))
  localStorage.setItem(LS_PRIV, await exportPrivateKey(pair.privateKey))
}

export async function loadKeysFromStorage(): Promise<CryptoKeyPair | null> {
  const pubB64 = localStorage.getItem(LS_PUB)
  const privB64 = localStorage.getItem(LS_PRIV)
  if (!pubB64 || !privB64) return null
  const [publicKey, privateKey] = await Promise.all([
    importPublicKey(pubB64),
    importPrivateKey(privB64),
  ])
  return { publicKey, privateKey }
}

export function clearKeysFromStorage(): void {
  localStorage.removeItem(LS_PUB)
  localStorage.removeItem(LS_PRIV)
}

export function getDeviceId(): string {
  let id = localStorage.getItem('e2ee_device_id')
  if (!id) {
    id = `${Date.now()}-${Math.random().toString(36).slice(2)}`
    localStorage.setItem('e2ee_device_id', id)
  }
  return id
}

// ─── Passphrase-based private key backup ─────────────────────────────────────
// Uses PBKDF2 to derive a wrapping key from the passphrase, then AES-GCM to
// encrypt/decrypt the raw PKCS8 private key bytes.

export interface KdfParams {
  salt: string      // base64
  iterations: number
}

export interface EncryptedKeyBackup {
  encrypted_private_key: string  // base64 AES-GCM ciphertext (includes 12-byte IV prepended)
  kdf_params: string             // JSON-stringified KdfParams
}

async function deriveWrappingKey(passphrase: string, salt: ArrayBuffer): Promise<CryptoKey> {
  const passphraseKey = await subtle.importKey(
    'raw',
    new TextEncoder().encode(passphrase),
    'PBKDF2',
    false,
    ['deriveKey'],
  )
  return subtle.deriveKey(
    { name: 'PBKDF2', salt, hash: 'SHA-256', iterations: 310_000 },
    passphraseKey,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt'],
  )
}

export async function encryptPrivateKeyWithPassphrase(
  privateKey: CryptoKey,
  passphrase: string,
): Promise<EncryptedKeyBackup> {
  const saltBytes = window.crypto.getRandomValues(new Uint8Array(16))
  const iterations = 310_000
  const wrappingKey = await deriveWrappingKey(passphrase, saltBytes.buffer)

  const pkcs8 = await subtle.exportKey('pkcs8', privateKey)
  const iv = window.crypto.getRandomValues(new Uint8Array(12))
  const ciphertext = await subtle.encrypt({ name: 'AES-GCM', iv }, wrappingKey, pkcs8)

  // Prepend IV to ciphertext so we only store one blob
  const combined = new Uint8Array(iv.byteLength + ciphertext.byteLength)
  combined.set(iv, 0)
  combined.set(new Uint8Array(ciphertext), iv.byteLength)

  const kdfParams: KdfParams = { salt: bufToBase64(saltBytes.buffer), iterations }

  return {
    encrypted_private_key: bufToBase64(combined.buffer),
    kdf_params: JSON.stringify(kdfParams),
  }
}

export async function decryptPrivateKeyWithPassphrase(
  backup: EncryptedKeyBackup,
  passphrase: string,
): Promise<CryptoKey> {
  const kdfParams: KdfParams = JSON.parse(backup.kdf_params)
  const saltBuf = base64ToBuf(kdfParams.salt)
  const wrappingKey = await deriveWrappingKey(passphrase, saltBuf)

  const combined = new Uint8Array(base64ToBuf(backup.encrypted_private_key))
  const iv = combined.slice(0, 12)
  const ciphertext = combined.slice(12)

  const pkcs8 = await subtle.decrypt({ name: 'AES-GCM', iv }, wrappingKey, ciphertext)
  return importPrivateKey(bufToBase64(pkcs8))
}