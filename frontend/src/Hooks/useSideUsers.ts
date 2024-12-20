import { connectSocket } from '@/Services/socket'
import { GetUsers } from '@/Services/users/GetUsers.service'
import { IUserAll } from '@/Types/Services.interface'
import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'

const useSideUsers = () => {
	const { data, isSuccess, isError, isLoading } = useQuery<IUserAll[], Error>({
		queryKey: ['users'],
		queryFn: GetUsers,
		refetchOnWindowFocus: false,
	})

	const [activeTab, setActiveTab] = useState<'messages' | 'users'>('messages')

	useEffect(() => {
		if (isSuccess) {
			connectSocket()
		}
		if (isError) {
			console.error('Failed to fetch users')
		}
	}, [isSuccess, isError])

	const getRenderContent = () => {
		return data || []
	}

	return { activeTab, setActiveTab, getRenderContent, isLoading }
}

export { useSideUsers }
