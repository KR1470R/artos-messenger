import { connectSocket } from '@/Services/socket'
import { GetChats } from '@/Services/users/GetChats.service'
import { IChat } from '@/Types/Services.interface'
import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'

const useSideChats = () => {
	const { data, isSuccess, isError, isLoading } = useQuery<IChat[], Error>({
		queryKey: ['chats'],
		queryFn: GetChats,
		refetchOnWindowFocus: false,
	})
	useEffect(() => {
		if (isSuccess) {
			connectSocket()
		}
		if (isError) {
			console.error('Failed to fetch chats')
		}
	}, [isSuccess, isError])

	const getRenderMessages = (): IChat[] => {
		return data || []
	}

	return { getRenderMessages, isLoading }
}

export { useSideChats }
