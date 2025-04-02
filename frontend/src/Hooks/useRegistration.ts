import { REGEX } from '@/constants'
import { TokenService } from '@/Services/authorization/AccessTokenMemory'
import { RegisterUser } from '@/Services/authorization/RegisterUser.service'
import { SignInUser } from '@/Services/authorization/SignInUser.service'
import { connectSocket, disconnectSocket, socket } from '@/Services/socket'
import { GetCurrentUser } from '@/Services/users/GetCurrentUser.service'
import { IResponseError, IUserData } from '@/Types/Services.interface'
import { useMutation } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'

const useRegistration = () => {
	const [type, setType] = useState<'login' | 'register'>('login')
	const isAuthType = type === 'login'
	const [showPassword, setShowPassword] = useState(false)
	const [errorMessage, setErrorMessage] = useState<string>('')

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

	const { mutateAsync: registerAsync } = useMutation({
		mutationKey: ['register'],
		mutationFn: RegisterUser,
		onError: (err: IResponseError) => {
			console.error('Error during registration:', err)
			setErrorMessage(err.message)
		},
		onSuccess: async () => {
			try {
				const { username, password } = watch()
				await signInAsync({ username, password })
			} catch (err) {
				console.error('Sign-in failed after registration:', err)
				setErrorMessage(`Sign-in failed after registration: ${err}`)
			}
		},
	})

	const { mutateAsync: signInAsync } = useMutation({
		mutationKey: ['login'],
		mutationFn: SignInUser,
		onError: (err: IResponseError) => {
			if (err.statusCode === 401) {
				console.error('Login error: Invalid credentials provided.')
				setErrorMessage('Invalid username or password.')
			} else {
				console.error('Login error: Unexpected server issue.', err)
				setErrorMessage(`Login error: Unexpected server issue. ${err}`)
			}
		},
		onSuccess: async () => {
			try {
				await GetCurrentUser()
				connectSocket()
			} catch (err) {
				console.error('Error fetching user data after login:', err)
				setErrorMessage('Failed to retrieve user data after login.')
			}
		},
	})

	const onSubmit: SubmitHandler<IUserData> = async formData => {
		try {
			setErrorMessage('')
			if (isAuthType)
				await signInAsync({ username: formData.username, password: formData.password })
			else await registerAsync(formData)
			reset()
		} catch (err) {
			console.error('Error during submission:', err)
			setErrorMessage(`Error during submission: ${err}`)
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
							value: REGEX.USERNAME,
							message:
								'Username must be 3-20 characters and contain only letters, numbers, underscores, or dashes',
						},
					})
				case 'password':
					return register(field, {
						required: 'Password is required',
						pattern: {
							value: REGEX.PASSWORD,
							message:
								'Password must be 6-20 characters, include at least one letter and one number',
						},
					})
				case 'avatar_url':
					return register(field, {
						required: !isAuthType ? 'Avatar URL is required for registration' : undefined,
						pattern: {
							value: REGEX.AVATAR_URL,
							message: 'Avatar URL must be a valid image link (jpg, jpeg, png, gif)',
						},
					})
				default:
					return register(field)
			}
		},
		setType,
		errors,
		showPassword,
		setShowPassword,
		errorMessage,
		setErrorMessage,
	}
}

export { useRegistration }
