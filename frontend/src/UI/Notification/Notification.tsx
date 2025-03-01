import { INotificationProps } from '@/Types/Components.interface'
import {
	CheckCircle,
	Close,
	ErrorOutline,
	ExpandLess,
	ExpandMore,
} from '@mui/icons-material'
import { IconButton, Snackbar } from '@mui/material'
import { useCallback, useEffect, useRef, useState } from 'react'
import './Notification.css'

const Notification = ({ message, type, open, onClose }: INotificationProps) => {
	const [expanded, setExpanded] = useState(false)
	const [visible, setVisible] = useState(false)
	const timerRef = useRef<NodeJS.Timeout | null>(null)
	const handleMouseEnter = () => clearTimeout(timerRef.current!)
	const handleMouseLeave = () => startTimer()
	const startTimer = useCallback(() => {
		clearTimeout(timerRef.current!)
		timerRef.current = setTimeout(() => {
			setVisible(false)
			setTimeout(onClose, 500)
		}, 3000)
	}, [onClose])
	useEffect(() => {
		if (open) {
			setVisible(true)
			startTimer()
		} else setVisible(false)
		return () => clearTimeout(timerRef.current!)
	}, [open, startTimer])

	return (
		<Snackbar
			open={visible}
			onClose={onClose}
			autoHideDuration={null}
			anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
			className={`notification-container ${visible ? 'show' : 'hide'}`}
		>
			<div
				className={`notification ${type === 'success' ? 'success' : 'error'}`}
				onMouseEnter={handleMouseEnter}
				onMouseLeave={handleMouseLeave}
			>
				<div className='icon'>
					{type === 'success' ? (
						<CheckCircle className='success-icon' />
					) : (
						<ErrorOutline className='error-icon' />
					)}
				</div>
				<div className={`message ${expanded ? 'expanded' : ''}`}>
					{expanded
						? message
						: `${message.slice(0, 30)}${message.length > 30 ? '...' : ''}`}
				</div>
				<div className='actions'>
					{message.length > 30 && (
						<IconButton size='small' onClick={() => setExpanded(!expanded)}>
							{expanded ? <ExpandLess /> : <ExpandMore />}
						</IconButton>
					)}
					<IconButton size='small' onClick={onClose}>
						<Close />
					</IconButton>
				</div>
			</div>
		</Snackbar>
	)
}

export { Notification }
