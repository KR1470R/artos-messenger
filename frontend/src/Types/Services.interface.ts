export interface IUserData {
	username: string
	password: string
	avatar_url?: string
}

export interface IResponse {
	token: string
	message: string
	id: string
	error?: string
	statusCode?: string
	timestamp?: string
}

export interface IUserAll {
	id: string
	username: string
	avatar_url: string
}
export interface IUser {
	id: string
	username: string
}
