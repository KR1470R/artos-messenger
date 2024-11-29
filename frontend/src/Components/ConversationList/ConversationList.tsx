import { useSideUsers } from '../../Hooks/useSideUsers'
import { Tabs } from '../../UI/Tabs/Tabs'
import { ConversationListItem } from '../ConversationListItem/ConversationListItem'
import { ConversationSearch } from '../ConversationSearch/ConversationSearch'
import { Toolbar } from '../Toolbar/Toolbar'
import { ToolbarButton } from '../ToolbarButton/ToolbarButton'
import './ConversationList.css'

const ConversationList: React.FC = () => {
	const { activeTab, setActiveTab, getRenderContent } = useSideUsers()

	return (
		<div className='conversationList'>
			<Toolbar
				title='Artos-Messenger'
				leftItems={[<ToolbarButton key='cog' icon='ion-ios-cog' />]}
				rightItems={[<ToolbarButton key='add' icon='ion-ios-add-circle-outline' />]}
			/>
			<ConversationSearch />
			<Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
			<div className='content'>
				{getRenderContent().map(item => (
					<ConversationListItem key={item.name} data={item} />
				))}
			</div>
		</div>
	)
}

export { ConversationList }
