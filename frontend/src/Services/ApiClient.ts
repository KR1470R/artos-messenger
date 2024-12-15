import axios from 'axios'
import { TokenService } from './authorization/AccessTokenMemory'
import { handle401Error } from './ErrorHandlingService'

const ApiClient = axios.create({
	baseURL: process.env.REACT_APP_API_URL,
	headers: {
		'Content-Type': 'application/json',
	},
})

ApiClient.interceptors.request.use(
	config => {
		const token = TokenService.getToken()
		if (token) {
			config.headers['Authorization'] = `Bearer ${token}`
		}
		return config
	},
	error => Promise.reject(error),
)

ApiClient.interceptors.response.use(
	response => response,
	async error => {
		if (error.response?.status === 401) {
			return handle401Error(error)
		}
		return Promise.reject(error)
	},
)

export { ApiClient }
