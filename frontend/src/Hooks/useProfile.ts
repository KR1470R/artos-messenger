import { DeleteCurrentUser } from '@/Services/users/DeleteCurrentUser.service'
import { PatchUser } from '@/Services/users/PatchUser.service'
import { useAuthStore } from '@/Store/useAuthStore'
import { IPatchUserRequest } from '@/Types/Services.interface'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
const useProfile = () => {
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
	return {
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
	}
}
export { useProfile }
