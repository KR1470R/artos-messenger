import { IToolbarButton } from '../../Types/Components.interface'
import './ToolbarButton.css'

const ToolbarButton: React.FC<IToolbarButton> = ({ icon, onClick }) => {
	return (
		<i
			className={`toolbarButton ${icon}`}
			onClick={onClick}
			role='button'
			tabIndex={0}
			onKeyDown={e => e.key === 'Enter' && onClick?.()}
		/>
	)
}

export { ToolbarButton }
