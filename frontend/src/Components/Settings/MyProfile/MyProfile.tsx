import { PatchUser } from '@/Services/users/PatchUser.service'
import { useAuthStore } from '@/Store/useAuthStore'
import { IPatchUserRequest } from '@/Types/Services.interface'
import { Toolbar } from '@/UI/Toolbar/Toolbar'
import { useForm } from 'react-hook-form'
import './MyProfile.css'

const MyProfile = () => {
	const { user, setUser } = useAuthStore()
	const {
		register,
		handleSubmit,
		formState: { isSubmitting },
		reset,
	} = useForm<IPatchUserRequest>({
		defaultValues: {
			username: user?.username || '',
			avatar_url: user?.avatar_url || '',
			old_password: '',
			password: '',
		},
	})
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

	return (
		<>
			<Toolbar title='My Profile' leftItems={[]} rightItems={[]} />
			<div className='container'>
				<form onSubmit={handleSubmit(onSubmit)} className='profile-form'>
					<input {...register('username')} placeholder='Enter new username' />
					<input
						type='password'
						{...register('old_password')}
						placeholder='Enter old password'
					/>
					<input
						type='password'
						{...register('password')}
						placeholder='Enter new password'
					/>
					<input {...register('avatar_url')} placeholder='Enter avatar URL' />
					<button type='submit' disabled={isSubmitting}>
						{isSubmitting ? 'Updating...' : 'Update'}
					</button>
				</form>
			</div>
		</>
	)
}

export { MyProfile }
