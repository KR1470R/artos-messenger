import axios from 'axios'
import { IResponse, IUserData } from '../Types/Services.interface'

const signInUrl = process.env.REACT_APP_AUTH_SIGN_IN_ROUTE

if (!signInUrl) {
	throw new Error('Environment variable REACT_APP_AUTH_SIGN_IN_ROUTE is not defined.')
}

const SignInUser = async (userData: IUserData): Promise<IResponse> => {
	try {
		const response = await axios.post(signInUrl, userData)
		const { token, refreshToken } = response.data

		localStorage.setItem('accessToken', token)
		localStorage.setItem('refreshToken', refreshToken)

		console.log('Access Token after sign-in:', token)
		console.log('Refresh Token after sign-in:', refreshToken)

		return response.data
	} catch (error) {
		if (axios.isAxiosError(error)) {
			throw new Error(error?.response?.data?.message || 'Sign-in failed')
		} else {
			throw new Error('An unexpected error occurred during sign-in')
		}
	}
}

export { SignInUser }
