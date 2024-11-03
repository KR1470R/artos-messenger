import moment from 'moment'
import React from 'react'
import './Message.css'
import { IMessage } from '@/types/Messages.interface'

const Message: React.FC<IMessage> = ({
	data,
	isMine,
	startsSequence,
	endsSequence,
	showTimestamp,
}) => {
	const friendlyTimestamp = moment(data.timestamp).format('LLLL')
	return (
		<div
			className={[
				'message',
				`${isMine ? 'mine' : ''}`,
				`${startsSequence ? 'start' : ''}`,
				`${endsSequence ? 'end' : ''}`,
			].join(' ')}
		>
			{showTimestamp && <div className='timestamp'>{friendlyTimestamp}</div>}

			<div className='bubbleContainer'>
				<div className='bubble' title={friendlyTimestamp}>
					{data.message}
				</div>
			</div>
		</div>
	)
}
export { Message }
