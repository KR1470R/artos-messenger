import { TokenService } from '@/Services/authorization/AccessTokenMemory'
import { disconnectSocket } from '../socket'

export const handle401Error = async (error: any): Promise<any> => {
	if (error.response?.status === 401) {
		console.error('Unauthorized: Incorrect username or password.')
		TokenService.clearToken()
		disconnectSocket()
		return Promise.reject(error)
	}

	return Promise.reject(error)
}
