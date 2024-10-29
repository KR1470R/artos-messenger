import { ICompose } from '@/types/Components.interface'
import './Compose.css'
const Compose: React.FC<ICompose> = ({ rightItems }) => {
	return (
		<div className='compose'>
			<input type='text' className='composeInput' placeholder='Type a message, @name' />
			{rightItems}
		</div>
	)
}
export { Compose }
