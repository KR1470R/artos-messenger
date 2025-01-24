import { IMessageProps } from '@/Types/Messages.interface'
import moment from 'moment'
import { IoCheckmark, IoCheckmarkDone } from 'react-icons/io5'
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
		<div className={['message', isMine ? 'mine' : ''].join(' ')} data-id={data.id}>
			{showDate && (
				<div className='timestamp'>
					<div>{displayDate}</div>
				</div>
			)}
			<div className='bubbleContainer'>
				<div className='bubble' title={`${messageDate.format('HH:mm D MMMM, YYYY')}`}>
					<span className='bubbleMessageContent'>{data.content}</span>
					<span className='messageTime'>
						{messageTime}
						{isMine && (
							<span className='messageStatus'>
								{data.is_read ? <IoCheckmarkDone /> : <IoCheckmark />}
							</span>
						)}
					</span>
				</div>
			</div>
		</div>
	)
}

export { Message }
