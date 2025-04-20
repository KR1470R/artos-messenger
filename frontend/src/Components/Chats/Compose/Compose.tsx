import { ICompose } from '@/Types/Components.interface'
import { ToolbarButton } from '@/UI/ToolbarButton/ToolbarButton'
import { useEffect, useRef, useState } from 'react'
import './Compose.css'

const Compose: React.FC<ICompose & { onSend: (message: string) => void }> = ({
	onSend,
}) => {
	const [input, setInput] = useState('')
	const inputRef = useRef<HTMLInputElement>(null)
	const handleSend = () => {
		if (input.trim()) {
			onSend(input)
			setInput('')
		}
	}
	useEffect(() => {
		const handleGlobalKeyDown = (e: KeyboardEvent) => {
			const isInputFocused = document.activeElement === inputRef.current
			if (!isInputFocused && e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey)
				inputRef.current?.focus()
		}
		window.addEventListener('keydown', handleGlobalKeyDown)
		return () => window.removeEventListener('keydown', handleGlobalKeyDown)
	}, [])

	return (
		<div className='compose'>
			<input
				ref={inputRef}
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
