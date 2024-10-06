<p align=center>
  <img src="https://github.com/KR1470R/artos-messenger/blob/c0f738bd51c5c5090b73531c20581c1b83ae36f2/assets/logo.jpg" width=300 height=300 align=center>
</p>
<h1 align=center>Artos Messenger<h1>
<h2 align=center>Fast, simple, connectable<h2>  

<hr>

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

# Usage
## Installation & Run
```bash
git clone git@github.com:KR1470R/artos-messenger.git
cd artos-messenger
```
Create an `.env` file with variables in the following format(see [./backend/configs/sample.env](https://github.com/KR1470R/artos-messenger/blob/c0f738bd51c5c5090b73531c20581c1b83ae36f2/backend/configs/sample.env)):
```env
APP_PORT=3000
DB_NAME=artosdb
DB_HOST=localhost
DB_PORT=3306
DB_USER=artos
DB_PASS=root
DB_MIN_CONN=1
DB_MAX_CONN=10
```
Then create docker container:
```bash
export NODE_ENV=development && docker-compose -f docker/docker-compose.yml --env-file .env up --build
```
After running the command above, access <http://localhost:3000/>.

# TODO
- [x] Create base Nest.js project
- [x] Create base React.js project
- [x] Create Docker container and build there the whole application
- [x] Implement DB schema & migrations
- [ ] Implement App Authentication via JWT tokens on back-end side
- [ ] Implement App Authentication via JWT tokens on front-end side
- [ ] Implement endpoints for manage users, groups, chats, messages
- [ ] Implement UI for manage users, groups, chats, messages
- [ ] Implement chat websocket channel for real time messages sharing between users
- [ ] Implement files attachments(i.e photos, files, etc) (optionally)
- [ ] Implement fully adaptive UI/UX
- [ ] Create ERD Diagram
- [ ] Integrate Swagger
- [ ] Deploy the application demo on a server
