import { io } from 'socket.io-client'

const socket = io('http://localhost:3000')

socket.on('connect', () => {
	console.log('Connected to WebSocket server')
})

socket.on('connect_error', err => {
	console.error('Connection Error:', err)
})

socket.on('error', err => {
	console.error('Socket Error:', err)
})

export { socket }
