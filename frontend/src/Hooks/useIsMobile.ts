import { useEffect, useState } from 'react'

const useIsMobile = () => {
	const [isMobile, setIsMobile] = useState(false)

	useEffect(() => {
		const update = () => setIsMobile(window.innerWidth < 768)
		update()
		window.addEventListener('resize', update)
		return () => window.removeEventListener('resize', update)
	}, [])
	return isMobile
}
export { useIsMobile }
