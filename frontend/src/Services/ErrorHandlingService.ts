import { ApiClient } from './ApiClient'
import { TokenService } from './authorization/AccessTokenMemory'
import { RefreshToken } from './authorization/RefreshToken.service'
import { disconnectSocket } from './socket'

let isRefreshing = false
let failedQueue: {
	resolve: (value?: unknown) => void
	reject: (reason?: any) => void
}[] = []

const processQueue = (error: any, token: string | null = null) => {
	while (failedQueue.length > 0) {
		const { resolve, reject } = failedQueue.shift()!
		if (token) {
			resolve(token)
		} else {
			reject(error)
		}
	}
}

export const handle401Error = async (error: any): Promise<any> => {
	if (error.response?.status === 401) {
		console.error(
			'Authorization failed: Invalid token or token is missing, also possible incorrect authorization data.',
		)
		if (!isRefreshing) {
			isRefreshing = true
			try {
				const newAccessToken = await RefreshToken()
				TokenService.setToken(newAccessToken)
				processQueue(null, newAccessToken)
				isRefreshing = false
				error.config.headers['Authorization'] = `Bearer ${newAccessToken}`
				return ApiClient.request(error.config)
			} catch (err) {
				processQueue(err, null)
				isRefreshing = false
				TokenService.clearToken()
				disconnectSocket()
				console.error('Token refresh failed: User must re-login.')
				throw err
			}
		}
		return new Promise((resolve, reject) => {
			failedQueue.push({ resolve, reject })
		})
	}
	return Promise.reject(error)
}
