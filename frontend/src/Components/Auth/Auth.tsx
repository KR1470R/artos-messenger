import React from 'react'
import { useRegistration } from '../../Hooks/useRegistration'
import './Auth.css'

const Auth = () => {
	const { handleSubmit, isAuthType, setData, data, setType } = useRegistration()
	return (
		<div className='wrapper'>
			<form onSubmit={handleSubmit} className='formSignIn'>
				<h2 className='formSignInHeading'>{isAuthType ? 'Login' : 'Registration'}</h2>
				<input
					type='text'
					className='formControl'
					name='username'
					placeholder='User name'
					required
					value={data.name}
					onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
						setData({ ...data, name: e.target.value })
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
				{isAuthType ? (
					''
				) : (
					<input
						type='text'
						className='formControl'
						name='avatarURL'
						placeholder='Avatar URL'
						value={data.avatar_url}
						onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
							setData({ ...data, avatar_url: e.target.value })
						}
					/>
				)}
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
