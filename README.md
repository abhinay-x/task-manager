# Task Manager Dashboard

A modern, responsive full-stack task management application with user authentication, dashboard stats, and robust CRUD capabilities. Built as part of the Frontend Developer Intern assignment.

## 🚀 Tech Stack

### Frontend
- **Framework**: React.js (Vite)
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **Routing**: React Router DOM (v7)

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose)
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: bcryptjs (Password Hashing)

---

## 🛠️ Setup Steps

### 1. Clone the Repository
```bash
git clone <repository-url>
cd task-manager-dashboard
```

### 2. Backend Setup
Navigate to the `backend` folder and install dependencies:
```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory with the following variables:
```env
PORT=5000
MONGO_URI=mongodb+srv://<your_username>:<your_password>@cluster0.example.mongodb.net/taskmanager?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key
NODE_ENV=development
```

### 3. Frontend Setup
Navigate to the `frontend` folder and install dependencies:
```bash
cd ../frontend
npm install
```

Create a `.env` file in the `frontend` directory:
```env
VITE_API_URL=http://localhost:5000
```
*(Note: If deploying, update `VITE_API_URL` to your production backend URL)*

---

## ▶️ How to Run

1. **Start the Backend Server:**
   ```bash
   cd backend
   npm start
   ```
   *The server will run on http://localhost:5000*

2. **Start the Frontend Application:**
   ```bash
   cd frontend
   npm run dev
   ```
   *The application will run on http://localhost:5173*

---

## 🔑 Demo Credentials

You can use these credentials to quickly test the application, or simply sign up with a new account.

- **Email**: `test@example.com`
- **Password**: `password123`

---

## 📚 API Documentation & Postman

A Postman collection is included in the root directory: `postman_collection.json`. Import this into Postman to test the API endpoints directly.

### Main Endpoints:
- **Auth**: `POST /auth/signup`, `POST /auth/login`
- **Profile**: `GET /me`, `PUT /me`
- **Tasks**: `GET /tasks`, `POST /tasks`, `PUT /tasks/:id`, `DELETE /tasks/:id`

---

## 📈 Scaling for Production

To scale this application for a production environment handling high traffic, I would implement the following:

1.  **Deployment & Infrastructure**: Containerize both services using **Docker** and orchestrate with **Kubernetes** or ECS for auto-scaling. Use a reverse proxy like **Nginx** for load balancing.
2.  **Database Optimization**: Add **database indexing** on frequently queried fields (e.g., `user` ID in tasks, `email` in users) to speed up reads. Use **MongoDB Atlas** for managed scaling and sharding if data grows significantly.
3.  **Caching**: Implement **Redis** to cache user sessions and frequently accessed task lists to reduce database load.
4.  **Security**: Configure **CORS** strictly for the production domain. Implement **Rate Limiting** (using `express-rate-limit`) to prevent API abuse. Rotate JWT secrets and use shorter expiration times with refresh tokens.
5.  **Environment Management**: Use strict separation of concerns for environment variables (Development, Staging, Production) using a secrets manager.

---

## ✅ Evaluation Criteria Checklist

- **Responsive UI**: Fully responsive Dashboard and Auth pages using Tailwind CSS.
- **Integration**: Seamless Axios integration with JWT interceptors for auto-attaching tokens.
- **Security**: Passwords hashed with `bcryptjs`. Protected routes wrapper in React.
- **Code Quality**: Modular component structure (`/pages`, `/components`, `/services`).
