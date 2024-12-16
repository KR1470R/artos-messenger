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

	// Логування даних
	useEffect(() => {
		if (isError) {
			console.error('Failed to fetch chats')
		}
		if (isSuccess) {
			console.log('Chats data: ', data) // Логування чатових даних
		}
	}, [isSuccess, isError])

	const getRenderMessages = (): IChat[] => {
		return data || []
	}

	return { getRenderMessages, isLoading }
}

export { useSideChats }
