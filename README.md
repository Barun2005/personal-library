# Personal Library

A modern, full-stack application to track and manage your personal book collection.

## Features

- **User Authentication**: Secure signup and login functionality.
- **Book Management**: Add, update, and remove books from your library.
- **Reading Status**: Track which books you are currently reading, want to read, or have completed.
- **Progress Tracking**: Visualize your reading habits with interactive charts.
- **Modern UI**: Clean, responsive dashboard built with Material UI.

## Tech Stack

- **Frontend**: React, Material UI, Chart.js
- **Backend**: Node.js, Express
- **Database**: MongoDB
- **Authentication**: JSON Web Tokens (JWT)

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm run install-all
   ```
3. Set up environment variables in `server/.env`:
   ```
   PORT=5000
   MONGODB_URI=your_mongodb_uri
   JWT_SECRET=your_secret_key
   ```
4. Start the application:
   ```bash
   # Start both client and server
   npm run dev # If you have a dev script in root
   # OR
   npm run server
   npm run client
   ```

## License

MIT
