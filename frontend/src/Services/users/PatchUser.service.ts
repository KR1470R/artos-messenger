import { IPatchUserRequest } from '@/Types/Services.interface'
import { ApiClient } from '../network/ApiClient'

const patchUserUrl = process.env.REACT_APP_USERS_ME_ROUTE
if (!patchUserUrl) {
	throw new Error('Environment variable REACT_APP_USERS_ME_ROUTE is not defined.')
}

const PatchUser = async (data: IPatchUserRequest): Promise<{ message: string }> => {
	try {
		const response = await ApiClient.patch<{ message: string }>(patchUserUrl, data)
		return response.data
	} catch (error: any) {
		const err = error?.response?.data || error
		console.error('Error Patch user:', JSON.stringify(err)) // покращене логування помилок
		throw new Error('Patch user failed. Please check credentials and API configuration.')
	}
}

export { PatchUser }
