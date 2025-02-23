import { IResponseError } from '@/Types/Services.interface'
import { ApiClient } from '../network/ApiClient'

const deleteUserUrl = process.env.REACT_APP_USERS_ME_ROUTE
if (!deleteUserUrl) {
	throw new Error('Environment variable REACT_APP_USERS_ME_ROUTE is not defined.')
}

const DeleteCurrentUser = async () => {
	try {
		const response = await ApiClient.delete(deleteUserUrl)
		console.log(response)
		return response.data
	} catch (error) {
		const err = error as IResponseError
		console.error('Error delete user:', err.message)
		throw new Error('Failed to delete user. Please check API configuration.')
	}
}

export { DeleteCurrentUser }
