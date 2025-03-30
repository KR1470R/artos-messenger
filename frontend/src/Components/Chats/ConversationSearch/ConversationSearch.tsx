import './ConversationSearch.css'
const ConversationSearch = () => {
	return (
		<div className='conversationSearch'>
			<input
				type='search'
				className='conversationSearchInput'
				placeholder='Search Messages'
			/>
		</div>
	)
}
export { ConversationSearch }
