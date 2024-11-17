export interface IUserData {
	username: string
	password: string
}

export interface IResponse {
	message: string;
	id: string;
	error?: string;
	statusCode?: string;
	timestamp?: string;
}

