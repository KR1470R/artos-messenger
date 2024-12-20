import { joinChat } from '@/Services/socket'
import { CreateChat } from '@/Services/users/CreateChat.service'
import { GetChat } from '@/Services/users/GetChat.service'
import { GetChats } from '@/Services/users/GetChats.service'
import { GetUsers } from '@/Services/users/GetUsers.service'
import { useChatStore } from '@/Store/useChatStore'
import { IChat, IUserAll } from '@/Types/Services.interface'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'

const useConversationList = () => {
	const [activeTab, setActiveTab] = useState<'messages' | 'users'>('messages')
	const { data: chatsData, isLoading: isChatsLoading } = useQuery<IChat[]>({
		queryKey: ['chats'],
		queryFn: GetChats,
		enabled: activeTab === 'messages',
	})
	const { data: usersData, isLoading: isUsersLoading } = useQuery<IUserAll[]>({
		queryKey: ['users'],
		queryFn: GetUsers,
		enabled: activeTab === 'users',
	})

	const isLoading = activeTab === 'messages' ? isChatsLoading : isUsersLoading
	const getRenderContent = (): IChat[] | IUserAll[] => {
		return activeTab === 'messages' ? chatsData || [] : usersData || []
	}

	const { setSelectedUser, setChatId } = useChatStore()

	const handleItemClickUsers = async (userSelect: { id: number; username: string }) => {
		setSelectedUser(userSelect)

		try {
			const chatId = await CreateChat(userSelect.id)
			setChatId(chatId)
			joinChat(chatId)
		} catch (error: any) {
			console.error('❌ Error creating or joining chat:', error.message)
		}
	}

	const handleItemClickChats = async (chatId: number) => {
		try {
			const fetchedChat = await GetChat(chatId)
			console.log(fetchedChat, chatId)

			if (fetchedChat) {
				setChatId(chatId)
				joinChat(fetchedChat)
			} else {
				console.error('Failed to fetch chat data.')
			}
		} catch (error: any) {
			console.error('Error fetching or joining chat:', error.message)
		}
	}

	return {
		activeTab,
		setActiveTab,
		getRenderContent,
		isLoading,
		handleItemClickUsers,
		handleItemClickChats,
	}
}

export { useConversationList }
