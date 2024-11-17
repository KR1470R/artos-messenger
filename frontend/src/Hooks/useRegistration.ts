import { useMutation } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
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
		{ username: string; password: string; avatar_url?: string }
	>({
		mutationKey: ['register'],
		mutationFn: RegisterUser,
		onError: (err: any) => {
			const errorMessage = err.response?.data?.message || 'Registration error'
			console.log(data)
			alert(errorMessage)
		},
		onSuccess: async response => {
			console.log('User created:', response)
			try {
				await SignInUser({
					username: data.username,
					password: data.password,
				})
				login(data.username)
			} catch (error) {
				console.log(data)
				console.error('Sign-in failed after registration:', error)
			}
		},
	})

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		const requestData = { ...data, avatar_url: data.avatar_url || undefined }

		if (!isAuthType) {
			await registerAsync(requestData)
		} else {
			await SignInUser(requestData).then(() => login(data.username))
		}
	}

	const [token, setToken] = useState<string | null>(localStorage.getItem('accessToken'))

	useEffect(() => {
		const token = localStorage.getItem('accessToken')
		setToken(token)
	}, [])

	useEffect(() => {
		if (token) {
			socket.connect()
			socket.emit('authenticate', { token })
		}
	}, [token])

	return { handleSubmit, isAuthType, setData, data, setType }
}

export { useRegistration }
