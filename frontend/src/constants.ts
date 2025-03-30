export const REGEX = {
	USERNAME: /^[a-zA-Zа-яА-ЯёЁЇїІіЄєҐґ0-9_\-!@#$%^&*()]{3,20}$/,
	PASSWORD: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{6,20}$/,
	AVATAR_URL: /^https?:\/\/.*\.(jpg|jpeg|png|gif)$/i,
}
