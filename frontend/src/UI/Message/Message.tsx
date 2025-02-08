import { useContextMenu } from '@/Hooks/useContextMenu'
import { useMessage } from '@/Hooks/useMessage'
import { IMessageProps } from '@/Types/Messages.interface'
import React from 'react'
import { FaEdit, FaRegCopy } from 'react-icons/fa'
import { FaRegTrashCan } from 'react-icons/fa6'
import { IoCheckmark, IoCheckmarkDone } from 'react-icons/io5'
import { ContextMenu } from '../ContextMenu/ContextMenu'
import './Message.css'

const Message: React.FC<IMessageProps> = ({ data, isMine, showDate }) => {
	const { handleCopyMessage, handleDeleteMessages } = useContextMenu(data, isMine)
	const {
		handleContextMenu,
		displayDate,
		isEditing,
		messageDate,
		textareaRef,
		editedContent,
		handleInputChange,
		finishEditing,
		handleKeyDown,
		messageTime,
		contextMenu,
		closeContextMenu,
		startEditing,
	} = useMessage({ data, isMine, showDate })
	const menuItems = [
		{
			type: 'action',
			icon: <FaEdit />,
			text: 'Edit',
			onClick: startEditing,
		},
		{
			type: 'action',
			icon: <FaRegCopy />,
			text: 'Copy Text',
			onClick: handleCopyMessage,
		},
		{
			type: 'divider',
		},
		{
			type: 'action',
			icon: <FaRegTrashCan />,
			text: 'Delete',
			onClick: handleDeleteMessages,
			className: 'menuItemDelete',
		},
	]
	return (
		<>
			<div
				className={['message', isMine ? 'mine' : ''].join(' ')}
				data-id={data.id}
				onContextMenu={handleContextMenu}
			>
				{showDate && (
					<div className='timestamp'>
						<div>{displayDate}</div>
					</div>
				)}
				<div className='bubbleContainer'>
					<div className='bubble' title={messageDate.format('HH:mm D MMMM, YYYY')}>
						{isEditing ? (
							<textarea
								ref={textareaRef}
								className='editTextarea'
								value={editedContent}
								onChange={handleInputChange}
								onBlur={finishEditing}
								onKeyDown={handleKeyDown}
								autoFocus
							/>
						) : (
							<span className='bubbleMessageContent'>{data.content}</span>
						)}
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
			<ContextMenu
				visible={contextMenu.visible}
				x={contextMenu.x}
				y={contextMenu.y}
				onClose={closeContextMenu}
				items={menuItems}
			/>
		</>
	)
}

export { Message }
