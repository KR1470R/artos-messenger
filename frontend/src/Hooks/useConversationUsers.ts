import { joinChat } from '@/Services/socket'
import { CreateChat } from '@/Services/users/CreateChat.service'
import { GetChats } from '@/Services/users/GetChats.service'
import { GetUsers } from '@/Services/users/GetUsers.service'
import { useAuthStore } from '@/Store/useAuthStore'
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
	const { user } = useAuthStore()

	const handleItemClick = async (userSelect: { id: number; username: string }) => {
		console.log('Selecting user:', userSelect.username)
		setSelectedUser(userSelect)
		try {
			const chatId = await CreateChat(userSelect.id)
			console.log('Chat created with ID:', chatId)
			setChatId(chatId)

			if (!user) return
			joinChat(chatId, user.id)
		} catch (error: any) {
			console.error('Failed to join chat:', error.message)
		}
	}

	return { activeTab, setActiveTab, getRenderContent, isLoading, handleItemClick }
}

export { useConversationList }
