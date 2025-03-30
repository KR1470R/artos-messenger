import { IMessageType } from '@/Types/Messages.interface'
import { useCallback, useEffect, useRef, useState } from 'react'

const useScroll = (messages: IMessageType[]) => {
	const [showScrollButton, setShowScrollButton] = useState<boolean>(false)
	const containerRef = useRef<HTMLDivElement | null>(null)
	const isUserAtBottomRef = useRef(true)

	const scrollToBottom = () => {
		if (containerRef.current) {
			containerRef.current.scrollTop = containerRef.current.scrollHeight
		}
	}

	const handleSmoothScroll = () => {
		if (containerRef.current) {
			containerRef.current.style.scrollBehavior = 'smooth'
			scrollToBottom()
			setTimeout(() => {
				if (containerRef.current) {
					containerRef.current.style.scrollBehavior = 'auto'
				}
			}, 400)
		}
	}

	const checkIfUserAtBottom = useCallback(() => {
		if (!containerRef.current) return
		const { scrollTop, scrollHeight, clientHeight } = containerRef.current
		isUserAtBottomRef.current = scrollTop + clientHeight >= scrollHeight - 10
	}, [])

	const handleScroll = useCallback(() => {
		checkIfUserAtBottom()
		if (containerRef.current) {
			const { scrollTop, scrollHeight, clientHeight } = containerRef.current
			scrollHeight - scrollTop - clientHeight > 150
				? setShowScrollButton(true)
				: setShowScrollButton(false)
		}
	}, [checkIfUserAtBottom])

	useEffect(() => {
		const container = containerRef.current
		if (!container) return
		container.addEventListener('scroll', handleScroll)
		return () => {
			container.removeEventListener('scroll', handleScroll)
		}
	}, [handleScroll])

	useEffect(() => {
		if (isUserAtBottomRef.current) {
			scrollToBottom()
		}
	}, [messages])
	return {
		containerRef,
		scrollToBottom,
		handleSmoothScroll,
		showScrollButton,
	}
}
export { useScroll }
