import { useCallback, useRef } from 'react'
import {
  clearKeysFromStorage,
  decodeContent,
  decryptMessage,
  decryptPrivateKeyWithPassphrase,
  deriveSharedKey,
  encodeContent,
  encryptMessage,
  encryptPrivateKeyWithPassphrase,
  exportPublicKey,
  generateKeyPair,
  getDeviceId,
  importPublicKey,
  loadKeysFromStorage,
  saveKeysToStorage,
} from '@/Services/e2ee'
import {
  fetchKeyBackup,
  fetchUserPublicKeys,
  registerPublicKey,
  uploadKeyBackup,
} from '@/Services/e2ee/e2ee.api'

const useE2EE = () => {
  const sharedKeyCache = useRef<Map<number, CryptoKey>>(new Map())

  const getSharedKey = useCallback(
    async (partnerId: number): Promise<CryptoKey | null> => {
      if (sharedKeyCache.current.has(partnerId)) {
        return sharedKeyCache.current.get(partnerId)!
      }
      const myPair = await loadKeysFromStorage()
      if (!myPair) return null

      let partnerKeys: Awaited<ReturnType<typeof fetchUserPublicKeys>>
      try {
        partnerKeys = await fetchUserPublicKeys(partnerId)
      } catch {
        return null
      }
      if (!partnerKeys.length) return null

      const theirPublicKey = await importPublicKey(partnerKeys[0].public_key)
      const sharedKey = await deriveSharedKey(myPair.privateKey, theirPublicKey)
      sharedKeyCache.current.set(partnerId, sharedKey)
      return sharedKey
    },
    [],
  )

  // Called after successful registration.
  // Generates keypair, registers public key, encrypts private key with passphrase, uploads backup.
  const initE2EERegister = useCallback(async (passphrase: string): Promise<void> => {
    const deviceId = getDeviceId()
    const pair = await generateKeyPair()
    await saveKeysToStorage(pair)
    const pubB64 = await exportPublicKey(pair.publicKey)
    await registerPublicKey(pubB64, deviceId)
    const backup = await encryptPrivateKeyWithPassphrase(pair.privateKey, passphrase)
    await uploadKeyBackup(backup)
  }, [])

  // Called after successful login.
  // If keys exist in localStorage → just re-register public key.
  // If new device → fetch backup, decrypt with passphrase (throws if wrong — caller handles it),
  //   restore keypair, register new public key.
  const initE2EELogin = useCallback(async (passphrase: string): Promise<void> => {
    const deviceId = getDeviceId()
    const existingPair = await loadKeysFromStorage()

    if (existingPair) {
      const pubB64 = await exportPublicKey(existingPair.publicKey)
      await registerPublicKey(pubB64, deviceId)
      return
    }

    // New device — restore from backup using passphrase
    const backup = await fetchKeyBackup()
    // Throws DOMException if passphrase is wrong — let caller catch and show error
    const privateKey = await decryptPrivateKeyWithPassphrase(backup, passphrase)
    const freshPair = await generateKeyPair()
    const restoredPair = { publicKey: freshPair.publicKey, privateKey }
    await saveKeysToStorage(restoredPair)
    const pubB64 = await exportPublicKey(restoredPair.publicKey)
    await registerPublicKey(pubB64, deviceId)
  }, [])

  const encryptFor = useCallback(
    async (recipientId: number, plaintext: string): Promise<string | null> => {
      const sharedKey = await getSharedKey(recipientId)
      if (!sharedKey) return null
      const parts = await encryptMessage(plaintext, sharedKey)
      return encodeContent(parts)
    },
    [getSharedKey],
  )

  const decryptFrom = useCallback(
    async (senderId: number, content: string, partnerId: number): Promise<string> => {
      if (!content) return content ?? ''
      const parts = decodeContent(content)
      if (!parts) return content
      const sharedKey = await getSharedKey(partnerId)
      if (!sharedKey) return '[encrypted]'
      try {
        return await decryptMessage(parts, sharedKey)
      } catch {
        return '[decryption failed]'
      }
    },
    [getSharedKey],
  )

  const clearE2EE = useCallback(() => {
    sharedKeyCache.current.clear()
    clearKeysFromStorage()
  }, [])

  return { initE2EERegister, initE2EELogin, encryptFor, decryptFrom, clearE2EE }
}

export { useE2EE }