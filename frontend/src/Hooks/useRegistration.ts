import { REGEX } from '@/constants'
import { TokenService } from '@/Services/authorization/AccessTokenMemory'
import { RegisterUser } from '@/Services/authorization/RegisterUser.service'
import { SignInUser } from '@/Services/authorization/SignInUser.service'
import { connectSocket, disconnectSocket, socket } from '@/Services/socket'
import { useAuthStore } from '@/Store/useAuthStore'
import { IResponseError, IUserData } from '@/Types/Services.interface'
import { useMutation } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useE2EE } from '@/Hooks/useE2EE'

const useRegistration = () => {
  const [type, setType] = useState<'login' | 'register'>('login')
  const isAuthType = type === 'login'
  const [showPassword, setShowPassword] = useState(false)
  const [showPassphrase, setShowPassphrase] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string>('')

  const { initE2EERegister, initE2EELogin } = useE2EE()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<IUserData>({
    mode: 'onChange',
    defaultValues: { username: '', password: '', passphrase: '', avatar_url: '' },
  })

  const { mutateAsync: registerAsync } = useMutation({
    mutationKey: ['register'],
    mutationFn: RegisterUser,
    onError: (err: IResponseError) => {
      setErrorMessage(err.message)
    },
  })

  const { mutateAsync: signInAsync } = useMutation({
    mutationKey: ['login'],
    mutationFn: SignInUser,
    onError: (err: IResponseError) => {
      if (err.statusCode === 401) {
        setErrorMessage('Invalid username or password.')
      } else {
        setErrorMessage(`Login error: ${err.message}`)
      }
    },
  })

  const onSubmit: SubmitHandler<IUserData> = async formData => {
    try {
      setErrorMessage('')

      if (isAuthType) {
        // Login flow
        const loginFormData = {
          username: formData.username,
	        password: formData.password,
        }
        await signInAsync(loginFormData)
        const hasE2EEKey = useAuthStore.getState().hasE2EEKey
        if (hasE2EEKey) {
          try {
            await initE2EELogin(formData.passphrase)
          } catch {
            // Wrong passphrase — block login, clear token
            TokenService.clearToken()
            useAuthStore.getState().logout()
            setErrorMessage('Incorrect passphrase. Please try again.')
            return
          }
        }
      } else {
        const registerFormData = {
          username: formData.username,
	        password: formData.password,
          avatar_url: formData.avatar_url,
        }
        // Register flow
        await registerAsync(registerFormData)

        const loginFormData = {
          username: formData.username,
	        password: formData.password,
        }
        await signInAsync(loginFormData)
        await initE2EERegister(formData.passphrase)
      }

      connectSocket()
      reset()
    } catch (err) {
      // Errors already handled in mutation onError, nothing to do
    }
  }

  useEffect(() => {
    const token = TokenService.getToken()
    if (token) {
      socket.io.opts.extraHeaders = { Authorization: `Bearer ${token}` }
      connectSocket()
    }
    return () => {
      disconnectSocket()
    }
  }, [])

  return {
    handleSubmit: handleSubmit(onSubmit),
    isAuthType,
    register: (field: keyof IUserData) => {
      switch (field) {
        case 'username':
          return register(field, {
            required: 'Username is required',
            pattern: {
              value: REGEX.USERNAME,
              message: 'Username must be 3-20 characters, letters, numbers, underscores or dashes',
            },
          })
        case 'password':
          return register(field, {
            required: 'Password is required',
            pattern: {
              value: REGEX.PASSWORD,
              message: 'Password must be 6-20 characters with at least one letter and one number',
            },
          })
        case 'passphrase':
          return register(field, {
            required: 'Passphrase is required',
          })
        case 'avatar_url':
          return register(field, {
            required: !isAuthType ? 'Avatar URL is required for registration' : undefined,
            pattern: {
              value: REGEX.AVATAR_URL,
              message: 'Avatar URL must be a valid image link (jpg, jpeg, png, gif)',
            },
          })
        default:
          return register(field)
      }
    },
    setType,
    errors,
    showPassword,
    setShowPassword,
    showPassphrase,
    setShowPassphrase,
    errorMessage,
    setErrorMessage,
  }
}

export { useRegistration }