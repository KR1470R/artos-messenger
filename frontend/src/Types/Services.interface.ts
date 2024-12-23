export interface IUserData {
	username: string
	password: string
	avatar_url?: string
}

export interface IResponse {
	token: string
	message: string
	id: number
	error?: string
	statusCode?: string
	timestamp?: string
}

export interface IUserAll {
	id: number
	username: string
	avatar_url: string
}

export interface IUser {
	id: number
	username: string
}
export interface IChat {
	id: number
	type: number
	created_at: string
	updated_at: string
}
