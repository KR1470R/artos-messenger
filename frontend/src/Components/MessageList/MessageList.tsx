import { IMessageType } from '@/Types/Messages.interface'
import moment from 'moment'
import { useCallback, useEffect, useState } from 'react'
import { Compose } from '../Compose/Compose'
import { Message } from '../Message/Message'
import { Toolbar } from '../Toolbar/Toolbar'
import { ToolbarButton } from '../ToolbarButton/ToolbarButton'
import './MessageList.css'

const MY_USER_ID = 'apple'

const MessageList = () => {
	const [messages, setMessages] = useState<IMessageType[]>([])

	const getMessages = useCallback(() => {
		const tempMessages: IMessageType[] = [
			{
				id: 1,
				author: 'apple',
				message:
					'Hello world! This is a long message that will hopefully get wrapped by our message bubble component! We will see how well it works.',
				timestamp: new Date().getTime(),
			},
			{
				id: 2,
				author: 'orange',
				message:
					'It looks like it wraps exactly as it is supposed to. Lets see what a reply looks like!',
				timestamp: new Date().getTime(),
			},
			{
				id: 3,
				author: 'orange',
				message:
					'Hello world! This is a long message that will hopefully get wrapped by our message bubble component! We will see how well it works.',
				timestamp: new Date().getTime(),
			},
			{
				id: 4,
				author: 'apple',
				message:
					'It looks like it wraps exactly as it is supposed to. Lets see what a reply looks like!',
				timestamp: new Date().getTime(),
			},
			{
				id: 5,
				author: 'apple',
				message:
					'Hello world! This is a long message that will hopefully get wrapped by our message bubble component! We will see how well it works.',
				timestamp: new Date().getTime(),
			},
			{
				id: 6,
				author: 'apple',
				message:
					'It looks like it wraps exactly as it is supposed to. Lets see what a reply looks like!',
				timestamp: new Date().getTime(),
			},
			{
				id: 7,
				author: 'orange',
				message:
					'Hello world! This is a long message that will hopefully get wrapped by our message bubble component! We will see how well it works.',
				timestamp: new Date().getTime(),
			},
			{
				id: 8,
				author: 'orange',
				message:
					'It looks like it wraps exactly as it is supposed to. Lets see what a reply looks like!',
				timestamp: new Date().getTime(),
			},
			{
				id: 9,
				author: 'apple',
				message:
					'Hello world! This is a long message that will hopefully get wrapped by our message bubble component! We will see how well it works.',
				timestamp: new Date().getTime(),
			},
			{
				id: 10,
				author: 'orange',
				message:
					'It looks like it wraps exactly as it is supposed to. Lets see what a reply looks like!',
				timestamp: new Date().getTime(),
			},
		]
		setMessages(prevMessages => [...prevMessages, ...tempMessages])
	}, [])

	useEffect(() => {
		getMessages()
	}, [getMessages])

	const renderMessages = () => {
		let tempMessages: JSX.Element[] = []

		for (let i = 0; i < messages.length; i++) {
			const previous = messages[i - 1]
			const current = messages[i]
			const next = messages[i + 1]
			const isMine = current.author === MY_USER_ID
			const currentMoment = moment(current.timestamp)
			let startsSequence = true
			let endsSequence = true
			let showTimestamp = true

			if (previous) {
				const previousMoment = moment(previous.timestamp)
				const previousDuration = moment.duration(currentMoment.diff(previousMoment))
				const prevBySameAuthor = previous.author === current.author

				if (prevBySameAuthor && previousDuration.as('hours') < 1) {
					startsSequence = false
				}

				if (previousDuration.as('hours') < 1) {
					showTimestamp = false
				}
			}

			if (next) {
				const nextMoment = moment(next.timestamp)
				const nextDuration = moment.duration(nextMoment.diff(currentMoment))
				const nextBySameAuthor = next.author === current.author

				if (nextBySameAuthor && nextDuration.as('hours') < 1) {
					endsSequence = false
				}
			}

			tempMessages.push(
				<Message
					key={current.id}
					isMine={isMine}
					startsSequence={startsSequence}
					endsSequence={endsSequence}
					showTimestamp={showTimestamp}
					data={current}
				/>,
			)
		}

		return tempMessages
	}

	return (
		<div className='messageList'>
			<Toolbar
				title='Conversation Title'
				leftItems={[]}
				rightItems={[
					<ToolbarButton key='info' icon='ion-ios-information-circle-outline' />,
				]}
			/>

			<div className='messageListContainer'>{renderMessages()}</div>

			<Compose rightItems={[<ToolbarButton key='send' icon='ion-ios-send' />]} />
		</div>
	)
}

export { MessageList }
