import { IMessageProps } from '@/Types/Messages.interface'
import moment from 'moment'
import React from 'react'
import './Message.css'

const Message: React.FC<IMessageProps> = ({ data, isMine }) => {
	const friendlyTimestamp = moment(data.timestamp).format('LLLL')
	console.log('Rendering a message component:', data.content, 'isMine:', isMine)

	return (
		<div
			className={[
				'message',
				isMine ? 'mine' : '',
				data.startsSequence ? 'start' : '',
				data.endsSequence ? 'end' : '',
			].join(' ')}
		>
			{data.showTimestamp && <div className='timestamp'>{friendlyTimestamp}</div>}

			<div className='bubbleContainer'>
				<div className='bubble' title={friendlyTimestamp}>
					{data.content}
				</div>
			</div>
		</div>
	)
}

export { Message }
