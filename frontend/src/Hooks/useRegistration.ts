import { TokenService } from '@/Services/authorization/AccessTokenMemory'
import { RegisterUser } from '@/Services/authorization/RegisterUser.service'
import { SignInUser } from '@/Services/authorization/SignInUser.service'
import { connectSocket, disconnectSocket, socket } from '@/Services/socket'
import { useAuthStore } from '@/Store/useAuthStore'
import { IUserData } from '@/Types/Services.interface'
import { useMutation } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'

const useRegistration = () => {
	const [type, setType] = useState<'login' | 'register'>('login')
	const isAuthType = type === 'login'
	const login = useAuthStore(state => state.login)

	const { register, handleSubmit, reset, watch } = useForm<IUserData>({
		defaultValues: {
			username: '',
			password: '',
			avatar_url: '',
		},
	})

	const { mutateAsync: registerAsync } = useMutation({
		mutationKey: ['register'],
		mutationFn: RegisterUser,
		onError: err => {
			console.error('Error during registration:', err)
		},
		onSuccess: async () => {
			try {
				const { username, password } = watch()
				await signInAsync({ username, password })
			} catch (err) {
				console.error('Sign-in failed after registration:', err)
			}
		},
	})

	const { mutateAsync: signInAsync } = useMutation({
		mutationKey: ['login'],
		mutationFn: SignInUser,
		onError: (err: any) => {
			if (err.response?.status === 401) {
				console.error('Login error: Invalid credentials provided.')
			} else {
				console.error('Login error: Unexpected server issue.', err)
			}
		},
		onSuccess: ({ id, username }) => {
			login(id, username)
			connectSocket()
		},
	})

	const onSubmit: SubmitHandler<IUserData> = async formData => {
		try {
			if (isAuthType) {
				await signInAsync({ username: formData.username, password: formData.password })
			} else {
				await registerAsync(formData)
			}
			reset()
		} catch (err) {
			console.error('Error during submission:', err)
		}
	}

	useEffect(() => {
		const token = TokenService.getToken()
		if (token) {
			socket.io.opts.extraHeaders = { Authorization: `Bearer ${token}` }
			connectSocket()
		}
		return () => {
			disconnectSocket()
		}
	}, [])

	return { handleSubmit: handleSubmit(onSubmit), isAuthType, register, setType }
}

export { useRegistration }
