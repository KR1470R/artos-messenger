import { IMessageProps } from '@/Types/Messages.interface'
import moment from 'moment'
import React from 'react'
import './Message.css'

const Message: React.FC<IMessageProps> = ({ data, isMine }) => {
	const messageYear = moment(data.created_at).format('YYYY')
	const messageDate = moment(data.created_at).format('MMMM D')
	const messageTime = moment(data.created_at).format('HH:mm')

	return (
		<div className={['message', isMine ? 'mine' : ''].join(' ')}>
			<div className='timestamp'>
				<div>{messageDate}</div>
			</div>
			<div className='bubbleContainer'>
				<div className='bubble' title={`${messageDate} ${messageYear}, ${messageTime}`}>
					<span className='bubbleMessageContent'>{data.content}</span>
					<span className='messageTime'>{messageTime}</span>
				</div>
			</div>
		</div>
	)
}

export { Message }
