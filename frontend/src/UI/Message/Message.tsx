import { IMessageProps } from '@/Types/Messages.interface'
import moment from 'moment'
import './Message.css'

const Message: React.FC<IMessageProps> = ({ data, isMine, showDate }) => {
	const today = moment().startOf('day')
	const messageDate = moment(data.created_at)
	const isToday = messageDate.isSame(today, 'day')
	const isDifferentYear = !messageDate.isSame(today, 'year')
	const displayDate = isToday
		? 'Today'
		: isDifferentYear
		? messageDate.format('D MMMM, YYYY')
		: messageDate.format('D MMMM')

	const messageTime = messageDate.format('HH:mm')

	return (
		<div className={['message', isMine ? 'mine' : ''].join(' ')}>
			{showDate && (
				<div className='timestamp'>
					<div>{displayDate}</div>
				</div>
			)}
			<div className='bubbleContainer'>
				<div className='bubble' title={`${messageDate.format('HH:mm D MMMM, YYYY')}`}>
					<span className='bubbleMessageContent'>{data.content}</span>
					<span className='messageTime'>{messageTime}</span>
				</div>
			</div>
		</div>
	)
}

export { Message }
