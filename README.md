# ChatBot

[chatbot](#) 🔗 is a support chat application designed to facilitate communication between an admin and multiple users. Each user can initiate a chat session, all of which are directed to the admin. The admin acts as the central receiver for all user interactions, making the app ideal for managing support inquiries and providing assistance in real-time.


## Table of Contents

- [Prerequisites](#Prerequisites)
- [Getting Started](#getting-started)
- [Technologies Used](#technologies-used)
- [Folder Structure](#folder-structure)
- [Project Structure](#Project-structure)
- [Contributing](#Contributing)

## Prerequisites

Ensure you have the following installed on your machine:

- [Node.js](https://nodejs.org/)
- [npm](https://npmjs.com/)


## Getting Started

```bash
# Clone the repository
git clone https://github.com/Brayzonn/live-chat.git

# Install dependencies
cd server
npm install

cd ..
cd client
npm install

# Run the development server
cd server
npm run dev

# Run the development client
cd client
npm run dev

```

## Technologies Used

### Frontend

- **React**: JavaScript library for building user interfaces.
- **Tailwind CSS**: Utility-first CSS framework for styling.


### Backend / APIs

- **Express**: Node.js web application framework
- **WebSocket (Socket.IO)**: Real-time, bidirectional communication protocol 
- **MongoDB**: NoSQL database for storing user/chat data

### Development Tools

- **Vite**: Next-generation frontend tooling.
- **TypeScript**: Typed superset of JavaScript.
- **ESLint**: Pluggable linting utility for JavaScript and JSX.
- **Prettier**: Code formatter.



## Folder Structure

```
chat bot/
├── client/
│   ├── images/
│   ├── node_modules/
│   ├── public/
│   ├── src/
│          ── assets/
│          ── context/
│          ── pages/
│          ── Routes/
│          ── style/
│          ── App.tsx
│          ── Main.tsx
│          ── vite-env.d.ts
│   ├── .env
│   ├── .eslintrc.cjs
│   ├── .gitignore
│   ├── index.html
│   ├── package-lock.json
│   ├── package.json
│   ├── postcss.config.js
│   ├── README.md
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   ├── tsconfig.node.json
│   ├── vite.config.ts
|
├── server/
│   ├── dist
│   ├── public/
│   ├── src/
├       ── config/
├       ── controllers/
├       ── middleware/
├       ── models/
├       ── routes/
├       ── utils/
├       ── app.js
│   ├── test/
│   ├── .env
│   ├── .nodemon.json
│   ├── package-lock.json
│   ├── package.json
│   ├── tsconfig.json
├── .gitignore
├── README.md

```


## Project Structure

env variables

```
//client .env

VITE_BASE_URL = "http://localhost:{PORT}"

```

```
//server .env

senderEmail = {email used by nodemailer to send chat notifications}
emailPassword = {senderEmail password}
receiverEmail = {email address to receive the chat notification }

mongoURI = {mongoURI for database}
JWT_SECRET = {JWT Secret}
ENDPOINT = 'http://localhost:{PORT}'

```


## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Make your changes.
4. Commit your changes (`git commit -m 'Add some feature'`).
5. Push to the branch (`git push origin feature-branch`).
6. Open a pull request.





