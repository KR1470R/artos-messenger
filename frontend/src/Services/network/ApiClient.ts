import { TokenService } from '@/Services/authorization/AccessTokenMemory'
import axios from 'axios'
import { handle401Error } from './errorHandlingService'

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
	error => {
		console.error('Request error:', error)
		return Promise.reject(error)
	},
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
