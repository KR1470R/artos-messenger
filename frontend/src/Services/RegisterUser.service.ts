import axios from 'axios'
import { IResponse, IUserData } from '../Types/Services.interface'

const registerUrl = process.env.REACT_APP_USERS_REGISTER_ROUTE

if (!registerUrl) {
	throw new Error('Environment variables for API routes are not defined.')
}

const RegisterUser = async (userData: IUserData): Promise<IResponse> => {
	try {
		const { data } = await axios.post<IResponse>(registerUrl, userData, {
			headers: { 'Content-Type': 'application/json' },
		})
		console.log(data)
		return data
	} catch (error: any) {
		console.error('Full error details:', error)
		if (error.response) {
			console.error('Error Response:', error.response.data)
			throw new Error(
				error.response?.data.message || 'Error during registration. Please try again.',
			)
		} else {
			throw new Error('Network error or server is not reachable.')
		}
	}
}

export { RegisterUser }
