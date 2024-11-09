import { useMutation } from '@tanstack/react-query'
import React, { useState } from 'react'
import { AuthService } from '../../Services/auth.service'
import { useAuthStore } from '../../Store/useAuthStore'
import './Auth.css'

const Auth = () => {
	const [data, setData] = useState<{ username: string; password: string }>({
		username: '',
		password: '',
	})
	const [type, setType] = useState('login')
	const isAuthType = type === 'login'
	const login = useAuthStore(state => state.login)
	const { mutateAsync: loginAsync } = useMutation({
		mutationKey: ['login'],
		mutationFn: () => AuthService.login(data.username, data.password),
		onError: err => {
			alert(err)
		},
		onSuccess: () => {
			login(data.username)
		},
	})
	const { mutateAsync: registerAsync } = useMutation({
		mutationKey: ['login'],
		mutationFn: () => AuthService.login(data.username, data.password),
		onError: err => {
			alert(err)
		},
		onSuccess: () => {
			login(data.username)
		},
	})
	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		if (isAuthType) {
			await loginAsync()
		} else {
			await registerAsync()
		}
	}

	return (
		<div className='wrapper'>
			<form onSubmit={handleSubmit} className='formSignIn'>
				<h2 className='formSignInHeading'>Login</h2>
				<input
					type='text'
					className='formControl'
					name='username'
					placeholder='User name'
					required
					value={data.username}
					onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
						setData({ ...data, username: e.target.value })
					}
				/>
				<input
					type='password'
					className='formControl'
					name='password'
					placeholder='Password'
					required
					value={data.password}
					onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
						setData({ ...data, password: e.target.value })
					}
				/>
				<button className='btn' type='submit'>
					{isAuthType ? 'Login' : 'Register'}
				</button>
				<div
					onClick={() => setType(isAuthType ? 'register' : 'login')}
					className='btn_register'
				>
					I want to {isAuthType ? 'Register' : 'Login'}
				</div>
			</form>
		</div>
	)
}
export { Auth }
