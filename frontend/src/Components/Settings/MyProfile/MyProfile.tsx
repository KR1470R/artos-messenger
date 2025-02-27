import { REGEX } from '@/constants'
import { DeleteCurrentUser } from '@/Services/users/DeleteCurrentUser.service'
import { PatchUser } from '@/Services/users/PatchUser.service'
import { useAuthStore } from '@/Store/useAuthStore'
import { IPatchUserRequest } from '@/Types/Services.interface'
import { Notification } from '@/UI/Notification/Notification'
import { Toolbar } from '@/UI/Toolbar/Toolbar'
import { WarningModal } from '@/UI/WarningModal/WarningModal'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa'
import { SlArrowDown, SlArrowUp } from 'react-icons/sl'
import './MyProfile.css'

const MyProfile = () => {
	const { user, setUser, logout } = useAuthStore()
	const [showPasswordFields, setShowPasswordFields] = useState(false)
	const [showPassword, setShowPassword] = useState({
		old_password: false,
		new_password: false,
	})
	const [deleteWarning, setDeleteWarning] = useState(false)
	const [passwordWarning, setPasswordWarning] = useState(false)
	const [pendingData, setPendingData] = useState<IPatchUserRequest | null>(null)
	const [notification, setNotification] = useState<{
		message: string
		type: 'success' | 'error'
	} | null>(null)

	const {
		register,
		handleSubmit,
		formState: { isSubmitting, errors },
		reset,
		watch,
	} = useForm<IPatchUserRequest>({
		mode: 'onChange',
		defaultValues: {
			username: user?.username || '',
			avatar_url: user?.avatar_url || '',
			old_password: '',
			password: '',
		},
	})

	const onSubmit = async (data: IPatchUserRequest) => {
		const isPasswordChanged = data.old_password || data.password
		if (isPasswordChanged) {
			setPendingData(data)
			setPasswordWarning(true)
		} else {
			await updateProfile(data)
		}
	}

	const updateProfile = async (data: IPatchUserRequest) => {
		const filteredData = Object.fromEntries(
			Object.entries(data).filter(
				([key]) => !['id', 'last_login_at', 'created_at', 'updated_at'].includes(key),
			),
		)

		try {
			await PatchUser(filteredData as IPatchUserRequest)
			const updatedUser = {
				...user,
				...filteredData,
				id: user?.id ?? 0,
				username: filteredData.username ?? user?.username ?? '',
				avatar_url: filteredData.avatar_url ?? user?.avatar_url ?? '',
			}
			setUser(updatedUser)
			reset({ ...updatedUser, old_password: '', password: '' })
			setNotification({
				message: 'Profile updated successfully!',
				type: 'success',
			})
		} catch (error: any) {
			let errorMessage = 'Failed to update profile.'
			if (error?.response?.data?.message)
				errorMessage = `Error: ${error.response.data.message}`
			else if (error?.message) errorMessage = `Error: ${error.message}`

			setNotification({
				message: errorMessage,
				type: 'error',
			})
		}
	}

	const confirmPasswordUpdate = async () => {
		if (pendingData) {
			await updateProfile(pendingData)
			setPendingData(null)
		}
		setPasswordWarning(false)
	}

	const avatarUrl = watch('avatar_url', user?.avatar_url)

	const deleteUser = async () => {
		try {
			await DeleteCurrentUser()
			logout()
			setNotification({ message: 'Account deleted successfully!', type: 'success' })
		} catch (err: any) {
			let errorMessage = 'Failed to delete account.'
			if (err?.response?.data?.message)
				errorMessage = `Error: ${err.response.data.message}`
			else if (err?.message) errorMessage = `Error: ${err.message}`
			setNotification({ message: errorMessage, type: 'error' })
		}
	}

	const confirmDeleteMe = () => {
		deleteUser()
		setDeleteWarning(false)
	}

	return (
		<>
			<Toolbar title='Profile' leftItems={[]} rightItems={[]} />
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
