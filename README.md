# Mini Task Manager Dashboard

A simple Auth + Profile + Tasks CRUD dashboard.

## Tech Stack

**Frontend:**
- React.js (Vite)
- Tailwind CSS
- Axios
- React Router

**Backend:**
- Node.js + Express
- MongoDB (Mongoose)
- JWT for auth
- bcrypt for password hashing

## Setup Steps

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd task-manager-dashboard
   ```

2. **Backend Setup:**
   ```bash
   cd backend
   npm install
   ```
   Create a `.env` file in the `backend` directory and add the following:
   ```
   PORT=5000
   MONGO_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   ```

3. **Frontend Setup:**
   ```bash
   cd ../frontend
   npm install
   ```

## How to Run

1. **Run Backend:**
   ```bash
   cd backend
   node src/server.js
   ```

2. **Run Frontend:**
   ```bash
   cd frontend
   npm run dev
   ```

## API Routes

- **Auth:**
  - `POST /api/v1/auth/signup`
  - `POST /api/v1/auth/login`
- **Profile:**
  - `GET /api/v1/me`
  - `PUT /api/v1/me`
- **Tasks:**
  - `POST   /api/v1/tasks`
  - `GET    /api/v1/tasks`
  - `GET    /api/v1/tasks/:id`
  - `PUT    /api/v1/tasks/:id`
  - `DELETE /api/v1/tasks/:id`

## Demo Credentials

- **Email:** `test@example.com`
- **Password:** `password123`

## Scaling Note

This project is built with scalability in mind. For a production environment, we can introduce:
- **Docker:** for containerizing the application for consistent environments.
- **Environment Separation:** for managing different configurations for development, staging, and production.
- **Rate Limiting:** to prevent abuse of the API.
- **Pagination:** for handling large sets of data efficiently.
- **Indexing DB:** to improve database query performance.
- **Redis Caching:** for caching frequently accessed data.
- **Cloud Deployment:** using services like AWS or Vercel for hosting.
