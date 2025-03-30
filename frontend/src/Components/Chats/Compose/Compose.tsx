import { ICompose } from '@/Types/Components.interface'
import { ToolbarButton } from '@/UI/ToolbarButton/ToolbarButton'
import { useState } from 'react'
import './Compose.css'

const Compose: React.FC<ICompose & { onSend: (message: string) => void }> = ({
	onSend,
}) => {
	const [input, setInput] = useState('')

	const handleSend = () => {
		if (input.trim()) {
			onSend(input)
			setInput('')
		}
	}

	return (
		<div className='compose'>
			<input
				type='text'
				className='composeInput'
				placeholder='Write a message...'
				value={input}
				onChange={e => setInput(e.target.value)}
				onKeyUp={e => e.key === 'Enter' && handleSend()}
			/>
			<span onKeyDown={e => e.key === 'Enter' && handleSend}>
				<ToolbarButton key='send' icon='ion-ios-send' onClick={handleSend} />
			</span>
		</div>
	)
}

export { Compose }
