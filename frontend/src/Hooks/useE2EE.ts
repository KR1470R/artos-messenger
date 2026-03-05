import { useCallback } from 'react'
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

// ─── Module-level singletons ──────────────────────────────────────────────────
// Kept outside React so they survive re-renders, chat switches, and are shared
// across every useE2EE() call site (useMessageList, useRegistration, etc.)

// Shared AES key per partner userId, derived once per session
const sharedKeyCache = new Map<number, CryptoKey>()

// Resolves once initE2EE has written keys to localStorage and registered them.
// Any call to encryptFor/decryptFrom awaits this before proceeding so that
// messages sent immediately after login are never silently sent as plaintext.
let readyResolve: (() => void) | null = null
let readyPromise: Promise<void> = new Promise(res => { readyResolve = res })

function resetReadiness() {
  readyPromise = new Promise(res => { readyResolve = res })
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

const useE2EE = () => {

  // ─── Internal: derive or retrieve shared key ──────────────────────────────

  const getSharedKey = useCallback(
    async (partnerId: number): Promise<CryptoKey | null> => {
      // Wait until initE2EE has finished writing our own keys to localStorage
      await readyPromise

      if (sharedKeyCache.has(partnerId)) {
        return sharedKeyCache.get(partnerId)!
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

      sharedKeyCache.set(partnerId, sharedKey)
      return sharedKey
    },
    [],
  )

  // ─── Init: called once after sign-in ─────────────────────────────────────

  const initE2EE = useCallback(async (hasE2EEKey: boolean): Promise<void> => {
    try {
      const deviceId = getDeviceId()
      const existingPair = await loadKeysFromStorage()

      if (existingPair) {
        // Keys already in localStorage — re-publish this device's public key
        const pubB64 = await exportPublicKey(existingPair.publicKey)
        await registerPublicKey(pubB64, deviceId)
      } else {
        // No local keys — generate a fresh pair and publish it.
        // If hasE2EEKey is true another device has keys; we create our own device
        // pair. Pre-existing encrypted history won't be readable on this device,
        // which is an accepted trade-off without a passphrase-backup scheme.
        const pair = await generateKeyPair()
        await saveKeysToStorage(pair)
        const pubB64 = await exportPublicKey(pair.publicKey)
        await registerPublicKey(pubB64, deviceId)
      }
    } finally {
      // Always unblock encryptFor/decryptFrom, even if registration failed,
      // so the app doesn't hang. Falls back to plaintext gracefully.
      readyResolve?.()
    }
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

  // ─── Decrypt a message from a sender ─────────────────────────────────────

  // The shared key is always derived from the OTHER participant's public key.
  // Whether the message was sent by me or by them, the key is the same:
  //   deriveSharedKey(myPriv, partnerPub)
  // So we need the partner's id, not the sender's id.
  // partnerId = senderId when they sent it; = recipientId when I sent it.
  const decryptFrom = useCallback(
    async (senderId: number, content: string, partnerId: number): Promise<string> => {
      const parts = decodeContent(content)
      if (!parts) return content // not an e2ee message — pass through as-is

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
    sharedKeyCache.clear()
    clearKeysFromStorage()
    // Reset the readiness gate for the next login
    resetReadiness()
  }, [])

  return { initE2EE, encryptFor, decryptFrom, clearE2EE }
}

export { useE2EE }