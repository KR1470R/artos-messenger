import { IUser } from '@/Types/User.interface'
import { useMutation } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { TokenService } from '../Services/AccessTokenMemory'
import { RegisterUser } from '../Services/RegisterUser.service'
import { SignInUser } from '../Services/SignInUser.service'
import { connectSocket, socket } from '../Services/socket'
import { useAuthStore } from '../Store/useAuthStore'
import { IResponse } from '../Types/Services.interface'

const useRegistration = () => {
	const [data, setData] = useState<IUser>({
		username: '',
		password: '',
	})

	const [type, setType] = useState<'login' | 'register'>('login')
	const isAuthType = type === 'login'
	const login = useAuthStore(state => state.login)

	const { mutateAsync: registerAsync } = useMutation<
		IResponse,
		Error,
		{ username: string; password: string }
	>({
		mutationKey: ['register'],
		mutationFn: RegisterUser,
		onError: err => {
			console.error('Error during registration:', err)
		},
		onSuccess: async () => {
			try {
				await SignInUser({ username: data.username, password: data.password })
				login(data.username)
				connectSocket()
			} catch (err) {
				console.error('Sign-in failed after registration:', err)
			}
		},
	})

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()

		if (!isAuthType && !data.avatar_url) {
			alert('Please provide an avatar URL.')
			return
		}

		try {
			if (isAuthType) {
				await SignInUser(data)
				login(data.username)
				connectSocket()
			} else {
				await registerAsync(data)
			}
		} catch (err) {
			console.error('Error during submission:', err)
		}
	}

	useEffect(() => {
		const token = TokenService.getToken()
		if (token) {
			socket.io.opts.extraHeaders = { Authorization: `Bearer ${token}` }
			socket.connect()
		} else {
			console.error('No token found. Socket connection is not established.')
		}

		return () => {
			socket.disconnect()
		}
	}, [])

	return { handleSubmit, isAuthType, setData, data, setType }
}

export { useRegistration }
