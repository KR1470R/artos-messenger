let accessToken: string | null = localStorage.getItem('token')

export const TokenService = {
	getToken: (): string | null => {
		return accessToken
	},

	setToken: (token: string | null) => {
		accessToken = token
		if (token) {
			localStorage.setItem('token', token)
		} else {
			localStorage.removeItem('token')
		}
	},

	clearToken: () => {
		accessToken = null
		localStorage.removeItem('token')
	},
}
