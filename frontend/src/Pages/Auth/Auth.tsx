import { useRegistration } from '@/Hooks/useRegistration'
import { Notification } from '@/UI/Notification/Notification'
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa'
import './Auth.css'

const Auth = () => {
	const {
		handleSubmit,
		isAuthType,
		register,
		setType,
		errors,
		showPassword,
		setShowPassword,
		errorMessage,
		setErrorMessage,
	} = useRegistration()

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
				</div>
				<div className='formGroup'>
					<input
						type={showPassword ? 'text' : 'password'}
						className={`formControl ${errors.password ? 'formError' : ''}`}
						placeholder='Password'
						{...register('password')}
					/>
					<span className='eyeIcon' onClick={() => setShowPassword(!showPassword)}>
						{showPassword ? <FaRegEye /> : <FaRegEyeSlash />}
					</span>
				</div>
				{!isAuthType && (
					<div className='formGroup'>
						<input
							type='text'
							className={`formControl ${errors.avatar_url ? 'formError' : ''}`}
							placeholder='Avatar URL'
							{...register('avatar_url')}
						/>
					</div>
				)}
				<div
					onClick={() => setType(isAuthType ? 'register' : 'login')}
					className='btn_register'
				>
					I want to {isAuthType ? 'Register' : 'Login'}
				</div>
				<button className='btn_login' type='submit'>
					{isAuthType ? 'Login' : 'Register'}
				</button>
				{Object.keys(errors).length > 0 && (
					<div className='errorContainer'>
						{Object.values(errors).map((error, index) => (
							<p key={index} className='errorText'>
								{error.message}
							</p>
						))}
					</div>
				)}
			</form>
			<Notification
				message={errorMessage}
				type='error'
				open={!!errorMessage}
				onClose={() => setErrorMessage('')}
			/>
		</div>
	)
}

export { Auth }
