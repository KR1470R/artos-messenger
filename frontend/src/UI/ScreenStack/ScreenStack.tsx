import { IScreenStackProps } from '@/Types/Components.interface'
import { AnimatePresence, motion, PanInfo } from 'framer-motion'
import React, { useState } from 'react'
import './ScreenStack.css'

const ScreenStack: React.FC<IScreenStackProps> = ({ children, activeIndex, onBack }) => {
	const childrenArray = React.Children.toArray(children)
	const mainScreen = childrenArray[0]
	const secondaryScreen = childrenArray[1]

	const [isSwipingLeft, setIsSwipingLeft] = useState(false)

	const handleDrag = (event: PointerEvent, info: PanInfo) => {
		if (activeIndex === 1 && info.offset.x < 0) {
			setIsSwipingLeft(true)
		} else {
			setIsSwipingLeft(false)
		}
	}

	const handleDragEnd = (event: PointerEvent, info: PanInfo) => {
		const screenWidth = window.innerWidth
		const swipeThreshold = screenWidth * 0.2

		if (info.offset.x > swipeThreshold && info.velocity.x > 0 && onBack) {
			onBack()
		}
		setIsSwipingLeft(false)
	}

	const dragEnabled = activeIndex === 1
	const dragConstraintsValue =
		dragEnabled && !isSwipingLeft ? { left: 0, right: 0 } : { left: 0, right: 0 }
	const dragXValue = dragEnabled && !isSwipingLeft ? 0 : undefined

	return (
		<div className='screen-stack'>
			{mainScreen && <div className='main-screen'>{mainScreen}</div>}
			<AnimatePresence mode='popLayout' initial={false}>
				{activeIndex === 1 && secondaryScreen && (
					<motion.div
						key='secondary-screen'
						className='secondary-screen'
						initial={{ x: '100%' }}
						animate={{ x: 0 }}
						exit={{ x: '100%' }}
						transition={{ duration: 0.3, ease: 'easeInOut' }}
						drag={dragEnabled && !isSwipingLeft ? 'x' : false}
						dragListener={dragEnabled}
						dragConstraints={dragConstraintsValue}
						dragElastic={0.2}
						onDrag={handleDrag}
						onDragEnd={handleDragEnd}
						style={{ x: dragXValue }}
					>
						{secondaryScreen}
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	)
}

export { ScreenStack }
