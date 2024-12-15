import { joinChat } from '@/Services/socket'
import { CreateChat } from '@/Services/users/CreateChat.service'
import { useAuthStore } from '@/Store/useAuthStore'
import { useChatStore } from '@/Store/useChatStore'
import { useSideUsers } from './useSideUsers'

const useConversationList = () => {
	const { activeTab, setActiveTab, getRenderContent, isLoading } = useSideUsers()
	const { setSelectedUser, setChatId } = useChatStore()
	const { user } = useAuthStore()

	const handleItemClick = async (userSelect: { id: number; username: string }) => {
		console.log('Selecting user:', userSelect.username)
		setSelectedUser(userSelect)
		try {
			const chatId = await CreateChat(userSelect.id)
			console.log('Joining chat with ID:', chatId)
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
