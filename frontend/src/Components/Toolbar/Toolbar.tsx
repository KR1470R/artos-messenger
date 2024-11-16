import { IToolBar } from '../../Types/Components.interface'
import React from 'react'
import './Toolbar.css'
const Toolbar: React.FC<IToolBar> = ({ title, leftItems, rightItems }) => {
	return (
		<div className='toolbar'>
			<div className='leftItems'>{leftItems}</div>
			<h1 className='toolbarTitle'>{title}</h1>
			<div className='rightItems'>{rightItems}</div>
		</div>
	)
}
export { Toolbar }
