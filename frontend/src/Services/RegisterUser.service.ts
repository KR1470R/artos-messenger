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
		return data
	} catch (error: any) {
		throw new Error(
			error.response?.data.message || 'Error during registration. Please try again.',
		)
	}
}

export { RegisterUser }
