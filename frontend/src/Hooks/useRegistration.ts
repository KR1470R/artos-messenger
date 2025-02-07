import { TokenService } from '@/Services/authorization/accessTokenMemory'
import { RegisterUser } from '@/Services/authorization/RegisterUser.service'
import { SignInUser } from '@/Services/authorization/SignInUser.service'
import { connectSocket, disconnectSocket, socket } from '@/Services/socket'
import { GetCurrentUser } from '@/Services/users/GetCurrentUser.service'
import { useAuthStore } from '@/Store/useAuthStore'
import { IResponseError, IUserData } from '@/Types/Services.interface'
import { useMutation } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'

const useRegistration = () => {
	const [type, setType] = useState<'login' | 'register'>('login')
	const isAuthType = type === 'login'
	const clearErrors = useAuthStore(state => state.clearErrors)

	const {
		register,
		handleSubmit,
		reset,
		watch,
		formState: { errors },
	} = useForm<IUserData>({
		mode: 'onChange',
		defaultValues: {
			username: '',
			password: '',
			avatar_url: '',
		},
	})

	const usernameRegex = /^[a-zA-Zа-яА-ЯёЁЇїІіЄєҐґ0-9_\-!@#$%^&*()]{3,20}$/
	const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{6,20}$/
	const avatarUrlRegex = /^https?:\/\/.*\.(jpg|jpeg|png|gif)$/i

	const { mutateAsync: registerAsync } = useMutation({
		mutationKey: ['register'],
		mutationFn: RegisterUser,
		onError: err => {
			console.error('Error during registration:', err)
		},
		onSuccess: async () => {
			try {
				clearErrors()
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
		onError: (err: IResponseError) => {
			if (err.statusCode === 401) {
				console.error('Login error: Invalid credentials provided.')
			} else {
				console.error('Login error: Unexpected server issue.', err)
			}
		},
		onSuccess: async () => {
			try {
				clearErrors()
				await GetCurrentUser()
				connectSocket()
			} catch (err) {
				console.error('Error fetching user data after login:', err)
			}
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

	return {
		handleSubmit: handleSubmit(onSubmit),
		isAuthType,
		register: (field: any) => {
			switch (field) {
				case 'username':
					return register(field, {
						required: 'Username is required',
						pattern: {
							value: usernameRegex,
							message:
								'Username must be 3-20 characters and contain only letters, numbers, underscores, or dashes',
						},
					})
				case 'password':
					return register(field, {
						required: 'Password is required',
						pattern: {
							value: passwordRegex,
							message:
								'Password must be 6-20 characters, include at least one letter and one number',
						},
					})
				case 'avatar_url':
					return register(field, {
						required: !isAuthType ? 'Avatar URL is required for registration' : undefined,
						pattern: {
							value: avatarUrlRegex,
							message: 'Avatar URL must be a valid image link (jpg, jpeg, png, gif)',
						},
					})
				default:
					return register(field)
			}
		},
		setType,
		errors,
	}
}

export { useRegistration }
