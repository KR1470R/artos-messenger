import { useMutation } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { getAccessToken } from '../Services/AccessTokenMemory'
import { RegisterUser } from '../Services/RegisterUser.service'
import { SignInUser } from '../Services/SignInUser.service'
import { socket } from '../Services/socket'
import { useAuthStore } from '../Store/useAuthStore'
import { IResponse } from '../Types/Services.interface'

const useRegistration = () => {
	const [data, setData] = useState<{
		username: string
		password: string
		avatar_url?: string
	}>({
		username: '',
		password: '',
	})

	const [type, setType] = useState('login')
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
			} else {
				await registerAsync(data)
			}
		} catch (err) {
			console.error('Error during submission:', err)
		}
	}

	useEffect(() => {
		const authenticateSocket = async () => {
			const token = getAccessToken()
			if (token) {
				socket.emit('authenticate', token)
			} else {
			}
		}
		authenticateSocket()
	}, [])

	return { handleSubmit, isAuthType, setData, data, setType }
}

export { useRegistration }
