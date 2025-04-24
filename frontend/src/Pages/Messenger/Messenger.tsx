import { useIsMobile } from '@/Hooks/useIsMobile'
import { useAuthStore } from '@/Store/useAuthStore'
import { lazy, Suspense } from 'react'
import './Messenger.css'

const Auth = lazy(() => import('../Auth/Auth').then(m => ({ default: m.Auth })))
const MessengerMobile = lazy(() =>
	import('@/Pages/MessengerMobile/MessengerMobile').then(module => ({
		default: module.MessengerMobile,
	})),
)
const MessengerDesktop = lazy(() =>
	import('@/Pages/MessengerDesktop/MessengerDesktop').then(module => ({
		default: module.MessengerDesktop,
	})),
)

const Messenger = () => {
	const user = useAuthStore(state => state.user)
	const isMobile = useIsMobile()

	if (!user) {
		return (
			<Suspense fallback={<div>Loading...</div>}>
				<Auth />
			</Suspense>
		)
	}

	return (
		<Suspense fallback={<div>Loading...</div>}>
			{isMobile ? <MessengerMobile /> : <MessengerDesktop />}
		</Suspense>
	)
}

export { Messenger }
