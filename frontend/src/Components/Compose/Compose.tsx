import { ICompose } from '../../Types/Components.interface'
import './Compose.css'
const Compose: React.FC<ICompose> = ({ rightItems }) => {
	return (
		<div className='compose'>
			<input type='text' className='composeInput' placeholder='Write a message...' />
			{rightItems}
		</div>
	)
}
export { Compose }
