import { IResponseAuth, IResponseError, IUserData } from '@/Types/Services.interface'
import { ApiClient } from '../network/ApiClient'
import { GetCurrentUser } from '../users/GetCurrentUser.service'
import { TokenService } from './AccessTokenMemory'
import { useAuthStore } from '@/Store/useAuthStore'

const signInUrl = import.meta.env.VITE_AUTH_SIGN_IN_ROUTE

if (!signInUrl) {
  throw new Error('Environment variable VITE_AUTH_SIGN_IN_ROUTE is not defined.')
}

const SignInUser = async (userData: IUserData): Promise<void> => {
  try {
    const response = await ApiClient.post<IResponseAuth & { hasE2EEKey: boolean }>(
      signInUrl,
      userData,
    )
    const { token, hasE2EEKey } = response.data
    TokenService.setToken(token)
    useAuthStore.getState().setHasE2EEKey(hasE2EEKey)

    await GetCurrentUser()
  } catch (error) {
    const err = error as IResponseError
    throw new Error(`Sign-in failed, please check credentials. ${err.message}`)
  }
}

export { SignInUser }
