import { useMessageList } from '@/Hooks/useMessageList'
import { Message } from '@/UI/Message/Message'
import { Toolbar } from '@/UI/Toolbar/Toolbar'
import { ToolbarButton } from '@/UI/ToolbarButton/ToolbarButton'
import moment from 'moment'
import React from 'react'
import { BsArrowLeftShort } from 'react-icons/bs'
import { SlArrowDown } from 'react-icons/sl'
import { Compose } from '../Compose/Compose'

import './MessageList.css'

const MessageList: React.FC<{ onBack?: () => void }> = React.memo(({ onBack }) => {
	const {
		selectedUser,
		messages,
		handleSend,
		user,
		containerRef,
		unreadMessagesLen,
		handleSmoothScroll,
		showScrollButton,
	} = useMessageList()
	let previousDate: string | null = null
	return (
		<div className='messageList'>
			<Toolbar
				title={`Chat with ${selectedUser?.username || '...'}`}
				leftItems={
					onBack
						? [
								<p className='backBut' onClick={onBack}>
									<span className='iconBack'>
										<BsArrowLeftShort />
									</span>
									Back
								</p>,
						  ]
						: []
				}
				rightItems={[
					<ToolbarButton key='info' icon='ion-ios-information-circle-outline' />,
				]}
			/>
			<div className='messageListContainer' ref={containerRef}>
				{messages.map(msg => {
					const currentDate = moment(msg.created_at).format('YYYY-MM-DD')
					const showDate = currentDate !== previousDate
					previousDate = currentDate
					return (
						<Message
							key={msg.id}
							data={msg}
							isMine={msg.initiator_id === user?.id || msg.sender_id === user?.id}
							showDate={showDate}
						/>
					)
				})}
			</div>
			{showScrollButton && (
				<div className='scrollBut' onClick={handleSmoothScroll}>
					{unreadMessagesLen > 0 && (
						<span className='messageLen'>{unreadMessagesLen}</span>
					)}
					<div className='scrollBot'>
						<SlArrowDown />
					</div>
				</div>
			)}
			<Compose onSend={handleSend} />
		</div>
	)
})

export { MessageList }
