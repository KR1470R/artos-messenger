import axios from 'axios'

axios.defaults.baseURL = 'http://localhost:3000'
export const AuthService = {
	async login(username: string, password: string) {
		try {
			const response = await axios.post('/v1/auth/sign-in', { username, password })
			const { token } = response.data
			localStorage.setItem('accessToken', token)
			return token
		} catch (error) {
			console.error('Login error:', error)
			throw error
		}
	},
	async refreshToken() {
		try {
			const response = await axios.post('/v1/auth/refresh-token')
			const { token } = response.data
			localStorage.setItem('accessToken', token)
			return token
		} catch (error) {
			console.error('Login error:', error)
			throw error
		}
	},
	async register(username: string, password: string) {
		return axios.post('/v1/users/register', { username, password })
	},
}
