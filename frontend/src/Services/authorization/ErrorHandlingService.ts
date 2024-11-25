import { TokenService } from '../AccessTokenMemory'
import { ApiClient } from '../ApiClient'
import { socket } from '../socket'
import { RefreshToken } from './RefreshToken.service'

export const handle401Error = async (error: any): Promise<any> => {
	if (error.response?.status === 401) {
		try {
			const newAccessToken = await RefreshToken()
			error.config.headers['Authorization'] = `Bearer ${newAccessToken}`
			return ApiClient.request(error.config)
		} catch (err) {
			console.error('Failed to refresh token:', err)
			TokenService.clearToken()
			socket.disconnect()
			throw err
		}
	} else {
		throw error
	}
}
