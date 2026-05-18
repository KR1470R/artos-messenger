export const REGEX = {
	USERNAME: /^[a-zA-Zа-яА-ЯёЁЇїІіЄєҐґ0-9_\-!@#$%^&*()]{3,20}$/,
	PASSWORD: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{6,20}$/,
	AVATAR_URL: /^https?:\/\/.*\.(jpg|jpeg|png|gif)$/i,
}

export const DEFAULT_AVATAR =
	'data:image/svg+xml;base64,' +
	btoa(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40">
		<rect width="40" height="40" rx="20" fill="#c8c8c8"/>
		<circle cx="20" cy="16" r="7" fill="#fff"/>
		<ellipse cx="20" cy="34" rx="11" ry="8" fill="#fff"/>
	</svg>`)
