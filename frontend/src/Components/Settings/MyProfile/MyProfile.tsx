import { PatchUser } from '@/Services/users/PatchUser.service'
import { useAuthStore } from '@/Store/useAuthStore'
import { IPatchUserRequest } from '@/Types/Services.interface'
import { Toolbar } from '@/UI/Toolbar/Toolbar'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa'
import { SlArrowDown, SlArrowUp } from 'react-icons/sl'
import './MyProfile.css'

const MyProfile = () => {
	const { user, setUser } = useAuthStore()
	const [showPasswordFields, setShowPasswordFields] = useState(false)
	const [showPassword, setShowPassword] = useState({
		old_password: false,
		new_password: false,
	})
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

	const usernameRegex = /^[a-zA-Zа-яА-ЯёЁЇїІіЄєҐґ0-9_\-!@#$%^&*()]{3,20}$/
	const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{6,20}$/
	const avatarUrlRegex = /^https?:\/\/.*\.(jpg|jpeg|png|gif)$/i

	const onSubmit = async (data: IPatchUserRequest) => {
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
		} catch (error) {
			console.error('Failed to update profile:', error)
		}
	}
	const avatarUrl = watch('avatar_url', user?.avatar_url)

	return (
		<>
			<Toolbar title='Profile' leftItems={[]} rightItems={[]} />
			<div className='profileContainer'>
				<form onSubmit={handleSubmit(onSubmit)} className='profile-form'>
					<div className='personalData'>
						<div className='personalImage'>
							<img src={avatarUrl} alt='' />
						</div>
						<div className='personalInput'>
							<p className='nameInput'>
								<input
									{...register('username', {
										pattern: {
											value: usernameRegex,
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
											value: avatarUrlRegex,
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
										value: passwordRegex,
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
			</div>
		</>
	)
}

export { MyProfile }
