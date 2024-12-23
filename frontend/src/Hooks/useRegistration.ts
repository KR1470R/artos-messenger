import { TokenService } from '@/Services/authorization/AccessTokenMemory'
import { RegisterUser } from '@/Services/authorization/RegisterUser.service'
import { SignInUser } from '@/Services/authorization/SignInUser.service'
import { connectSocket, disconnectSocket, socket } from '@/Services/socket'
import { useAuthStore } from '@/Store/useAuthStore'
import { IUserData } from '@/Types/Services.interface'
import { useMutation } from '@tanstack/react-query'
import { useEffect, useState } from 'react'

const useRegistration = () => {
	const [data, setData] = useState<IUserData>({
		username: '',
		password: '',
	})

	const [type, setType] = useState<'login' | 'register'>('login')
	const isAuthType = type === 'login'
	const login = useAuthStore(state => state.login)

	const { mutateAsync: registerAsync } = useMutation({
		mutationKey: ['register'],
		mutationFn: RegisterUser,
		onSuccess: async () =>
			await signInAsync({ username: data.username, password: data.password }),
	})

	const { mutateAsync: signInAsync } = useMutation({
		mutationKey: ['login'],
		mutationFn: SignInUser,

		onSuccess: ({ id, username }) => {
			login(id, username)
			connectSocket()
		},
	})

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		try {
			if (isAuthType) {
				const { username, password } = data
				await signInAsync({ username, password })
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
			connectSocket()
		} else {
			console.error('No token found. Socket connection is not established.')
		}

		return () => {
			disconnectSocket()
		}
	}, [])

	return { handleSubmit, isAuthType, setData, data, setType }
}

export { useRegistration }
