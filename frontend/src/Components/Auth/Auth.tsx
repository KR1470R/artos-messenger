import { useState } from 'react'

const Auth = () => {
	const [data, setData] = useState({
		username: '',
		password: '',
	})
	const [type, setType] = useState('auth')
	const isAuthType = 'auth' === type
	return (
		<div className='wrapper'>
			<form className='formSignIn'>
				<h2 className='formSignInHeading'>login</h2>
				<input
					type='text'
					className='formControl'
					name='username'
					placeholder='Email Address'
					required
					value={data.username}
					onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
						setData({ ...data, username: e.target.value })
					}
				/>
				<input
					type='password'
					className='formControl'
					name='password'
					placeholder='Password'
					required
					value={data.password}
					onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
						setData({ ...data, password: e.target.value })
					}
				/>
				<button className='btn'>Auth</button>
				<button
					onClick={() => setType(isAuthType ? 'Registration' : 'Login')}
					className='btn'
				>
					I want to {isAuthType ? 'Registration' : 'Login'}
				</button>
			</form>
		</div>
	)
}
export { Auth }
