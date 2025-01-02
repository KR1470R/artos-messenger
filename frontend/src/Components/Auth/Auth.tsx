import { useRegistration } from '@/Hooks/useRegistration'
import { useAuthStore } from '@/Store/useAuthStore'
import { ErrorMessages } from '@/UI/ErrorMessages/ErrorMessages'
import './Auth.css'

const Auth = () => {
	const { handleSubmit, isAuthType, register, setType, errors } = useRegistration()
	const errorsState = useAuthStore(state => state.errorsState)

	return (
		<div className='wrapper'>
			<form onSubmit={handleSubmit} className='formSignIn'>
				<h2 className='formSignInHeading'>{isAuthType ? 'Login' : 'Registration'}</h2>
				<div className='formGroup'>
					<input
						type='text'
						className={`formControl ${errors.username ? 'formError' : ''}`}
						placeholder='User name'
						{...register('username')}
					/>
					{errorsState.length > 0 && <ErrorMessages errorsState={errorsState} />}
					{errors.username && (
						<span className='errorText'>{errors.username.message}</span>
					)}
				</div>
				<div className='formGroup'>
					<input
						type='password'
						className={`formControl ${errors.password ? 'formError' : ''}`}
						placeholder='Password'
						{...register('password')}
					/>
					{errors.password && (
						<span className='errorText'>{errors.password.message}</span>
					)}
				</div>
				{!isAuthType && (
					<div className='formGroup'>
						<input
							type='text'
							className={`formControl ${errors.avatar_url ? 'formError' : ''}`}
							placeholder='Avatar URL'
							{...register('avatar_url')}
						/>
						{errors.avatar_url && (
							<span className='errorText'>{errors.avatar_url.message}</span>
						)}
					</div>
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
