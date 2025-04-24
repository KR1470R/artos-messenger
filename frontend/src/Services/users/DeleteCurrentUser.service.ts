import { IResponseError } from '@/Types/Services.interface'
import { ApiClient } from '../network/ApiClient'

const deleteUserUrl = import.meta.env.VITE_USERS_ME_ROUTE
if (!deleteUserUrl) {
	throw new Error('Environment variable VITE_USERS_ME_ROUTE is not defined.')
}

const DeleteCurrentUser = async () => {
	try {
		const response = await ApiClient.delete(deleteUserUrl)
		return response.data
	} catch (error) {
		const err = error as IResponseError
		console.error('Error delete user:', err.message)
		throw new Error(`Error delete user: ${err.message}`)
	}
}

export { DeleteCurrentUser }
