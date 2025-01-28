import { IContextMenuProps } from '@/Types/Components.interface'
import React, { useEffect, useRef } from 'react'
import './ContextMenu.css'

const ContextMenu: React.FC<IContextMenuProps> = ({ visible, x, y, onClose, items }) => {
	const menuRef = useRef<HTMLDivElement | null>(null)

	useEffect(() => {
		const handleOutsideClick = (e: MouseEvent) => {
			if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
				onClose()
			}
		}

		if (visible) {
			document.addEventListener('mousedown', handleOutsideClick)
		}

		return () => {
			document.removeEventListener('mousedown', handleOutsideClick)
		}
	}, [visible, onClose])

	if (!visible) return null

	return (
		<div
			ref={menuRef}
			className='contextMenu'
			style={{
				top: `${y}px`,
				left: `${x}px`,
			}}
		>
			<ul>
				{items.map((item, index) => (
					<li
						key={index}
						onClick={() => {
							item.onClick()
							onClose()
						}}
					>
						{item.icon && <span className='menuIcon'>{item.icon}</span>}
						{item.text}
					</li>
				))}
			</ul>
		</div>
	)
}

export { ContextMenu }
