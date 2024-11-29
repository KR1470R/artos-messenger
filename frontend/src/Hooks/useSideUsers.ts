import { IConversation } from '../Types/Messages.interface'
import axios from 'axios'
import { useEffect, useState } from 'react'

const useSideUsers = () => {
	const [activeTab, setActiveTab] = useState<'messages' | 'users'>('messages')
	const [conversations, setConversations] = useState<IConversation[]>([])
	const [users, setUsers] = useState<IConversation[]>([])

	useEffect(() => {
		if (activeTab === 'messages') {
			getConversations()
		} else if (activeTab === 'users') {
			getUsers()
		}
	}, [activeTab])

	const getConversations = async () => {
		try {
			const response = await axios.get('https://randomuser.me/api/?results=10')
			const newConversations = response.data.results.map((result: any) => ({
				photo: result.picture.large,
				name: `${result.name.first} ${result.name.last}`,
				text: 'Hello world! This is a long message that needs to be truncated.',
			}))
			setConversations(newConversations)
		} catch (error) {
			console.error('Error fetching conversations', error)
		}
	}

	const getUsers = async () => {
		try {
			const response = await axios.get('https://randomuser.me/api/?results=10')
			const newUsers = response.data.results.map((result: any) => ({
				photo: result.picture.large,
				name: `${result.name.first} ${result.name.last}`,
				text: 'User description or status goes here.',
			}))
			setUsers(newUsers)
		} catch (error) {
			console.error('Error fetching users', error)
		}
	}

	const getRenderContent = () => {
		return activeTab === 'messages' ? conversations : users
	}

	return { activeTab, setActiveTab, getRenderContent }
}

export { useSideUsers }