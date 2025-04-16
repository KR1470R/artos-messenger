import { REGEX } from '@/constants'
import { useProfile } from '@/Hooks/useProfile'
import { Notification } from '@/UI/Notification/Notification'
import { WarningModal } from '@/UI/WarningModal/WarningModal'
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa'
import { SlArrowDown, SlArrowUp } from 'react-icons/sl'

import './MyProfile.css'

const MyProfile = () => {
	const {
		handleSubmit,
		onSubmit,
		avatarUrl,
		register,
		errors,
		showPasswordFields,
		setShowPasswordFields,
		showPassword,
		setShowPassword,
		passwordWarning,
		setPasswordWarning,
		deleteWarning,
		setDeleteWarning,
		isSubmitting,
		confirmDeleteMe,
		confirmPasswordUpdate,
		notification,
		setNotification,
		user,
	} = useProfile()
	return (
		<>
			<div className='profileContainer'>
				<form onSubmit={handleSubmit(onSubmit)} className='profile-form'>
					<div className='personalData'>
						<div className='personalImage'>
							<img src={avatarUrl} alt='User avatar' />
						</div>
						<div className='personalInput'>
							<p className='nameInput'>
								<input
									{...register('username', {
										pattern: {
											value: REGEX.USERNAME,
											message:
												'Username should be between 3 and 20 characters long and contain only letters, digits, and special characters.',
										},
									})}
									placeholder='Enter new username'
								/>
								{errors.username && (
									<span className='inputError'>{errors.username.message}</span>
								)}
							</p>
							<hr />
							<p className='urlInput'>
								<input
									{...register('avatar_url', {
										pattern: {
											value: REGEX.AVATAR_URL,
											message:
												'Please enter a valid avatar URL (e.g. .jpg, .jpeg, .png, .gif).',
										},
									})}
									placeholder='Enter avatar URL'
								/>
								{errors.avatar_url && (
									<span className='inputError'>{errors.avatar_url.message}</span>
								)}
							</p>
						</div>
					</div>
					<p
						className='changePasswordText'
						onClick={() => setShowPasswordFields(!showPasswordFields)}
					>
						{showPasswordFields ? 'Hide password fields' : 'Change password'}
						<span>{showPasswordFields ? <SlArrowUp /> : <SlArrowDown />}</span>
					</p>
					<div className={`passwordFields ${showPasswordFields ? 'open' : ''}`}>
						<p className='passwordInput'>
							<input
								type={showPassword.old_password ? 'text' : 'password'}
								{...register('old_password')}
								placeholder='Enter old password'
							/>
							<span
								className='eyeIcon'
								onClick={() =>
									setShowPassword(prevState => ({
										...prevState,
										old_password: !prevState.old_password,
									}))
								}
							>
								{showPassword.old_password ? <FaRegEye /> : <FaRegEyeSlash />}
							</span>
						</p>
						<hr />
						<p className='passwordInput'>
							<input
								type={showPassword.new_password ? 'text' : 'password'}
								{...register('password', {
									pattern: {
										value: REGEX.PASSWORD,
										message:
											'Password should be between 6 and 20 characters and contain at least one letter and one number.',
									},
								})}
								placeholder='Enter new password'
							/>
							<span
								className='eyeIcon'
								onClick={() =>
									setShowPassword(prevState => ({
										...prevState,
										new_password: !prevState.new_password,
									}))
								}
							>
								{showPassword.new_password ? <FaRegEye /> : <FaRegEyeSlash />}
							</span>
							{errors.password && (
								<span className='inputError'>{errors.password.message}</span>
							)}
						</p>
					</div>

					<button className='submitButton' type='submit' disabled={isSubmitting}>
						{isSubmitting ? 'Updating...' : 'Update'}
					</button>
				</form>
				<button className='deleteMe' onClick={() => setDeleteWarning(true)}>
					Delete me
				</button>
			</div>
			<WarningModal
				open={passwordWarning}
				onClose={() => setPasswordWarning(false)}
				onConfirm={confirmPasswordUpdate}
				message='You are changing your password. Are you sure you want to proceed?'
				confirmText='Confirm'
				cancelText='Cancel'
				title='Password Change Warning'
			/>
			<WarningModal
				open={deleteWarning}
				onClose={() => setDeleteWarning(false)}
				onConfirm={confirmDeleteMe}
				message='Are you sure you want to delete your account?'
				confirmText='Delete'
				cancelText='Cancel'
				title={user?.username}
			/>

			{notification && (
				<Notification
					message={notification.message}
					type={notification.type}
					open={Boolean(notification)}
					onClose={() => setNotification(null)}
				/>
			)}
		</>
	)
}

export { MyProfile }
