import axios from 'axios'

axios.defaults.baseURL = 'http://localhost:3000/docs#'
export const AuthService = {
	async login(username: string, password: string) {
		return axios.post('/v1/auth/sign-in', { username, password })
	},
	async register(username: string, password: string) {
		return axios.post('/v1/auth/sign-in', { username, password })
	},
}
