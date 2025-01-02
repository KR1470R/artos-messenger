import { useState } from 'react'
import './ErrorMessages.css'

const ErrorMessages = ({ errorsState }: { errorsState: string[] }) => {
	const [isExpanded, setIsExpanded] = useState(false)

	const handleToggle = () => {
		setIsExpanded(prev => !prev)
	}

	const maxLength = 31
	const errorsText = errorsState.join(' ')
	const isTruncated = errorsText.length > maxLength

	return (
		<span className='errorText authErr'>
			<span className='errorContent'>
				{isExpanded || !isTruncated
					? errorsState.map((error, index) => (
							<span key={index} className='errorItem'>
								{error}
							</span>
					  ))
					: `${errorsText.slice(0, maxLength)}`}
			</span>

			{isTruncated && (
				<span className='showMore' onClick={handleToggle}>
					<span>.</span>
					<span>.</span>
					<span>.</span>
				</span>
			)}
		</span>
	)
}

export { ErrorMessages }
