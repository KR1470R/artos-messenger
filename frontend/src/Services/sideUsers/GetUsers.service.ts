import { IUserAll } from '@/Types/Services.interface'
import { ApiClient } from '../ApiClient'

const getUsersUrl = process.env.REACT_APP_USERS_ROUTE
if (!getUsersUrl) {
	throw new Error('Environment variable REACT_APP_USERS_ROUTE is not defined.')
}

const GetUsers = async () => {
	try {
		const response = await ApiClient.get<{ data: IUserAll[] }>(getUsersUrl)
		return response.data.data
	} catch (err: any) {
		console.error('Error fetching users:', err?.response?.data || err.message)
		throw new Error('Get users failed. Please check credentials and API configuration.')
	}
}

export { GetUsers }
