import { ApiClient } from './ApiClient'
import { TokenService } from './authorization/AccessTokenMemory'
import { RefreshToken } from './authorization/RefreshToken.service'
import { disconnectSocket } from './socket'

export const handle401Error = async (error: any): Promise<any> => {
	if (error.response?.status === 401) {
		try {
			const newAccessToken = await RefreshToken()
			TokenService.setToken(newAccessToken)
			error.config.headers['Authorization'] = `Bearer ${newAccessToken}`
			return ApiClient.request(error.config)
		} catch (err) {
			console.error('Failed to refresh token:', err)
			TokenService.clearToken()
			disconnectSocket()
			throw err
		}
	}
	return Promise.reject(error)
}
