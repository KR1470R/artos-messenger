
<p align=center>
  <img src="https://github.com/KR1470R/artos-messenger/blob/c0f738bd51c5c5090b73531c20581c1b83ae36f2/assets/logo.jpg" width=300 height=300 align=center>
</p>
<h1 align=center>Artos Messenger<h1>
<h2 align=center>Fast, simple, connectable<h2>

<hr>

# Documentation Content
1. [About](#about)
2. [Demo](#demo)
3. [Supported Systems](#supported-systems)
5. [API](#api)
	1) [HTTP API](#http-api)
	2) [Websockets API](#websockets-api)
		1) [/messages](#messages-namespace)
			1) [join_chat](#join_chat)
			2) [leave_chat](#leave_chat)
			3) [CRUD events](#crud-events)
				1) [create_message](#create_message)
				2) [update_message](#update_message)
				3) [delete_message](#delete_message)
				4) [find_many_messages](#find_many_messages)
6. [Usage](#usage)
	1) [Installation](#installation)
	2) [Running using Docker](running-using-docker)
	3) [Running without Docket](running-without-docker)
7. [ERD Diagram](#erd-diagram)
8. [TODO](#todo)
9. [Contribution](#contribution)
10. [License](#license)

# About
Real-time chat application.

# Requirements
<div>
	<img alt="" src="https://badgen.net/badge/node.js/>=18/green">
	<img alt="" src="https://badgen.net/badge/react/>=18/blue">
	<img alt="" src="https://badgen.net/badge/docker/any">
</div>

# Supported systems
<div>
	<img alt="" src="https://badgen.net/badge/Windows/any/blue">
	<img alt="" src="https://badgen.net/badge/Linux/any/yellow">
	<img alt="" src="https://badgen.net/badge/MacOS/any/red">
</div>

# Demo
https://artos-messanger.xyz 

# API
## HTTP API
The HTTP REST API docs illustrated via Swagger UI [here](https://artos-messanger.xyz/docs).
Production REST API URL - `https://artos-messanger.xyz/api/v1/` 
## Websockets API
Production Websocket URL - `ws://artos-messanger.xyz:8080/`
### /messages namespace
This application uses websocket gateway for real-time messages exchange between chat members.

Diagrams below illustrates test-cases, when members communicate with each other in the same chat, what events they should emit and what events they should subscribe.
#### join_chat:
Bind user to a chat in the system.
First of all, when user opens a chat, the client should connect to the WS, and ask the server to join the target chat.
<p align=center>
  <img src="https://github.com/KR1470R/artos-messenger/blob/041b6c7a798d390a827df356efd991aa4edaf257/assets/ws-diagrams/messages/join_chat.event.png" align=center>
</p>

#### leave_chat:
Unbind user from a chat in the system.
When user disconnects from the socket, the server automatically deletes from the joined(binded) sockets related to the chat and the user, thus events of any manipulation with the chat messages will be stopped.

The user can also manually leave from the chat:
<p align=center>
  <img src="https://github.com/KR1470R/artos-messenger/blob/041b6c7a798d390a827df356efd991aa4edaf257/assets/ws-diagrams/messages/leave_chat.event.png" align=center>
</p>

#### CRUD events
When client connected and joined to the chat, the WS server is ready to listen for events and process operations.
##### create_message:
<p align=center>
  <img src="https://github.com/KR1470R/artos-messenger/blob/041b6c7a798d390a827df356efd991aa4edaf257/assets/ws-diagrams/messages/crud/create_message.event.png" align=center>
</p>

##### update_message:
<p align=center>
  <img src="https://github.com/KR1470R/artos-messenger/blob/041b6c7a798d390a827df356efd991aa4edaf257/assets/ws-diagrams/messages/crud/update_message.event.png" align=center>
</p>

##### delete_message:
<p align=center>
  <img src="https://github.com/KR1470R/artos-messenger/blob/041b6c7a798d390a827df356efd991aa4edaf257/assets/ws-diagrams/messages/crud/delete_message.event.png" align=center>
</p>

##### find_many_messages:
<p align=center>
  <img src="https://github.com/KR1470R/artos-messenger/blob/041b6c7a798d390a827df356efd991aa4edaf257/assets/ws-diagrams/messages/crud/find_many_messages.event.png" align=center>
</p>

# Usage
## Installation
```bash
git clone git@github.com:KR1470R/artos-messenger.git
cd artos-messenger
```
Create an `.env.development` file with variables in the following format(see [./backend/configs/.env.example](https://github.com/KR1470R/artos-messenger/blob/main/backend/configs/.env.example)):
```env
APP_PORT=3000
DB_NAME=artosdb
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=artos
DB_PASS=root
DB_MIN_CONN=1
DB_MAX_CONN=10
JWT_TOKEN_SECRET=secret
JWT_REFRESH_TOKEN_SECRET=secret
```
### Running using Docker
Create docker container:
```bash
export NODE_ENV=development && docker-compose -f docker/docker-compose.yml --env-file .env.development up --build
```
Run database migrations when container is running:
```bash
export NODE_ENV=development && npm run migrate:up
```

### Runnning without Docker
Install dependencies:
```bash
npm install
```
Run database migrations when container is running:
```bash
export NODE_ENV=development && npm run migrate:up
```
Now run the application:
```bash
npm run build && NODE_ENV=development npm run start:dev
```

After running the commands above, access <http://localhost:3000/>.

# ERD Diagram
<p align=center>
  <img src="https://github.com/KR1470R/artos-messenger/blob/041b6c7a798d390a827df356efd991aa4edaf257/assets/persistence-diagrams/artosdb.erd.png" align=center>
</p>

# TODO
- [x] Create base Nest.js project
- [x] Create base React.js project
- [x] Create Docker container and build there the whole application
- [x] Implement DB schema & migrations
- [x] Implement App Authentication via JWT tokens on back-end side
- [ ] Implement App Authentication via JWT tokens on front-end side
- [x] Implement endpoints for manage users, groups, chats, messages
- [ ] Implement UI for manage users, groups, chats, messages
- [x] Implement chat websocket channel for real time messages sharing between users
- [x] Implement jwt guards over messages sockets
- [ ] Implement files attachments(i.e photos, files, etc) (optionally)
- [ ] Implement fully adaptive UI/UX
- [x] Create ERD Diagram
- [x] Integrate Swagger
- [ ] Deploy the application demo on a serve

# Contribution
Feel free to create issues.

# License
<div>
	<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/Cc.logo.circle.svg/1920px-Cc.logo.circle.svg.png">
	<img src="https://upload.wikimedia.org/wikipedia/commons/f/f8/License_icon-mit-88x31-2.svg">
</div>
