import { IWarningModal } from '@/Types/Components.interface'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'
import { FC } from 'react'

const WarningModal: FC<IWarningModal> = ({
	open,
	onClose,
	onConfirm,
	message,
	confirmText,
	cancelText,
	title,
}) => {
	return (
		<Dialog
			open={open}
			onClose={onClose}
			sx={{
				'& .MuiPaper-root': {
					maxWidth: '300px',
					backgroundColor: 'var(--main-color)',
					color: 'var(--text-color)',
					textAlign: 'center',
					fontSize: '16px',
					padding: '15px',
				},
			}}
		>
			<DialogTitle
				sx={{
					fontFamily: '`Inter`, sans-serif',
					padding: '10px 0px',
					fontSize: '16px',
				}}
			>
				{title}
			</DialogTitle>
			<DialogContent
				sx={{
					color: 'var(--text-color)',
					padding: '5px 0px',
					fontSize: '14px',
				}}
			>
				<p>{message}</p>
			</DialogContent>
			<DialogActions
				sx={{
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'space-around',
					borderRadius: '10px',
					padding: '10px 0px',
				}}
			>
				<Button
					sx={{
						border: '1px solid var(--button-auth)',
						color: 'var(--button-auth)',
						borderRadius: '15px',
						padding: '5px 13px',
						fontSize: '16px',
						textTransform: 'none',
						'&:hover': {
							border: '1px solid var(--button-auth-hov)',
							color: 'var(--button-auth-hov)',
						},
					}}
					onClick={onClose}
				>
					{cancelText}
				</Button>
				<Button
					sx={{
						border: '1px solid transparent',
						backgroundColor: 'var(--error-color)',
						color: 'var(--stable-light-color)',
						padding: '5px 13px',
						borderRadius: '15px',
						fontSize: '16px',
						textTransform: 'none',
					}}
					onClick={onConfirm}
				>
					{confirmText}
				</Button>
			</DialogActions>
		</Dialog>
	)
}

export { WarningModal }
