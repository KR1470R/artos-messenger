import { IUser } from '@/Types/User.interface'
import { useMutation } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { TokenService } from '../Services/authorization/AccessTokenMemory'
import { RegisterUser } from '../Services/authorization/RegisterUser.service'
import { SignInUser } from '../Services/authorization/SignInUser.service'
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

	const { mutateAsync: registerAsync } = useMutation<IResponse, Error, IUser>({
		mutationKey: ['register'],
		mutationFn: RegisterUser,
		onError: err => {
			console.error('Error during registration:', err)
		},
		onSuccess: async () => {
			try {
				signInAsync({ username: data.username, password: data.password })
			} catch (err) {
				console.error('Sign-in failed after registration:', err)
			}
		},
	})
	const { mutateAsync: signInAsync } = useMutation<IResponse, Error, IUser>({
		mutationKey: ['login'],
		mutationFn: SignInUser,
		onError: err => {
			console.error('Error during login:', err)
		},
		onSuccess: () => {
			login(data.username)
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
