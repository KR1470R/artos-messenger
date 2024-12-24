import { useRegistration } from '@/Hooks/useRegistration'
import './Auth.css'

const Auth = () => {
	const { handleSubmit, isAuthType, register, setType } = useRegistration()

	return (
		<div className='wrapper'>
			<form onSubmit={handleSubmit} className='formSignIn'>
				<h2 className='formSignInHeading'>{isAuthType ? 'Login' : 'Registration'}</h2>
				<input
					type='text'
					className='formControl'
					placeholder='User name'
					{...register('username', { required: true })}
				/>
				<input
					type='password'
					className='formControl'
					placeholder='Password'
					{...register('password', { required: true })}
				/>
				{!isAuthType && (
					<input
						type='text'
						className='formControl'
						placeholder='Avatar URL'
						{...register('avatar_url')}
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
