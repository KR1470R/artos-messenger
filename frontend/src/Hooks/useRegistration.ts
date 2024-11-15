import { RegisterUser } from '../Services/RegisterUser.service'
import { useAuthStore } from '../Store/useAuthStore'
import { IResponse } from '../Types/Services.interface'
import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'

const useRegistration = () => {
	const [data, setData] = useState<{
		name: string
		password: string
		avatar_url?: string
	}>({
		name: '',
		password: '',
	})

	const [type, setType] = useState('login')
	const isAuthType = type === 'login'
	const login = useAuthStore(state => state.login)

	const { mutateAsync: registerAsync } = useMutation<
		IResponse,
		Error,
		{ name: string; password: string; avatar_url?: string }
	>({
		mutationKey: ['register'],
		mutationFn: RegisterUser,
		onError: (err: any) => {
			const errorMessage = err.response?.data?.message || 'Registration error'
			console.log(data)
			alert(errorMessage)
		},
		onSuccess: response => {
			console.log('User created:', response)
			login(data.name)
		},
	})

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		const requestData = { ...data }
		if (!requestData.avatar_url) delete requestData.avatar_url
		if (!isAuthType) {
			await registerAsync(requestData)
		}
	}
	return { handleSubmit, isAuthType, setData, data, setType }
}
export { useRegistration }
