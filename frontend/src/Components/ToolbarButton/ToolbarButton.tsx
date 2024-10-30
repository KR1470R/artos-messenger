import { IToolbarButton } from '@/types/Components.interface'
import './ToolbarButton.css'
const ToolbarButton: React.FC<IToolbarButton> = ({ icon }) => {
	return <i className={`toolbarButton ${icon}`} />
}
export { ToolbarButton }
