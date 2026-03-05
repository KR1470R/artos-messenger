import { useCallback, useRef } from 'react'
import {
  clearKeysFromStorage,
  decodeContent,
  decryptMessage,
  deriveSharedKey,
  encodeContent,
  encryptMessage,
  exportPublicKey,
  generateKeyPair,
  getDeviceId,
  importPublicKey,
  loadKeysFromStorage,
  saveKeysToStorage,
} from '@/Services/e2ee'
import { fetchUserPublicKeys, registerPublicKey } from '@/Services/e2ee/e2ee.api'

const useE2EE = () => {
  // Per-hook-instance cache — no global singleton, no readiness gate that can hang
  const sharedKeyCache = useRef<Map<number, CryptoKey>>(new Map())

  // ─── Internal: derive or retrieve shared key ──────────────────────────────

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

  // ─── Init: called once after sign-in ─────────────────────────────────────

  const initE2EE = useCallback(async (hasE2EEKey: boolean): Promise<void> => {
    const deviceId = getDeviceId()
    const existingPair = await loadKeysFromStorage()

    if (existingPair) {
      const pubB64 = await exportPublicKey(existingPair.publicKey)
      await registerPublicKey(pubB64, deviceId)
      return
    }

    const pair = await generateKeyPair()
    await saveKeysToStorage(pair)
    const pubB64 = await exportPublicKey(pair.publicKey)
    await registerPublicKey(pubB64, deviceId)
  }, [])

  // ─── Encrypt for a recipient ──────────────────────────────────────────────

  const encryptFor = useCallback(
    async (recipientId: number, plaintext: string): Promise<string | null> => {
      const sharedKey = await getSharedKey(recipientId)
      if (!sharedKey) return null
      const parts = await encryptMessage(plaintext, sharedKey)
      return encodeContent(parts)
    },
    [getSharedKey],
  )

  // ─── Decrypt a message ────────────────────────────────────────────────────
  // partnerId is always the OTHER participant's id regardless of who sent it.
  // This ensures we always derive: deriveSharedKey(myPriv, partnerPub).

  const decryptFrom = useCallback(
    async (senderId: number, content: string, partnerId: number): Promise<string> => {
      if (!content) return content ?? ''
      const parts = decodeContent(content)
      if (!parts) return content // plaintext — pass through

      const sharedKey = await getSharedKey(partnerId)
      if (!sharedKey) return '[🔒 encrypted]'

      try {
        return await decryptMessage(parts, sharedKey)
      } catch {
        return '[🔒 decryption failed]'
      }
    },
    [getSharedKey],
  )

  // ─── Cleanup on logout ────────────────────────────────────────────────────

  const clearE2EE = useCallback(() => {
    sharedKeyCache.current.clear()
    clearKeysFromStorage()
  }, [])

  return { initE2EE, encryptFor, decryptFrom, clearE2EE }
}

export { useE2EE }