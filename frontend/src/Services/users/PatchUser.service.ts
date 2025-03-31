import { IPatchUserRequest, IResponseError } from '@/Types/Services.interface'
import { ApiClient } from '../network/ApiClient'

const patchUserUrl = import.meta.env.VITE_USERS_ME_ROUTE
if (!patchUserUrl) {
	throw new Error('Environment variable VITE_USERS_ME_ROUTE is not defined.')
}

const PatchUser = async (data: IPatchUserRequest): Promise<{ message: string }> => {
	try {
		const response = await ApiClient.patch<{ message: string }>(patchUserUrl, data)
		return response.data
	} catch (error) {
		const err = error as IResponseError
		console.error('Error Patch user:', err.message)
		throw new Error(`Error Patch user: ${err.message}`)
	}
}

export { PatchUser }
