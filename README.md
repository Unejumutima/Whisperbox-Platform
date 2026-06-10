# 🕊️ Whisperbox Platform

Whisperbox is a full-stack anonymous messaging platform designed for students. It allows users to log in with Google, send anonymous messages ("whispers"), and interact through a secure role-based system. The platform includes a Spring Boot backend and a modern React + Tailwind CSS frontend.

---

## 🚀 Project Overview

Whisperbox is built to demonstrate real-world software engineering concepts including:

- Secure authentication (Google OAuth2 + JWT)
- Role-based access control (USER / ADMIN)
- CRUD operations
- Pagination & sorting
- Admin moderation system
- Clean REST API design
- Modern frontend UI integration

---

## 🏗️ Tech Stack

### Backend
- Java 21
- Spring Boot
- Spring Security (OAuth2 + JWT)
- Spring Data JPA
- PostgreSQL
- Maven
- Lombok

### Frontend
- React (Vite)
- Tailwind CSS
- Axios
- React Router

---

## 📁 Project Structure

### Backend

om.whisperboxBackend
│
├── controller # REST APIs (Whisper, Auth, Admin)
├── service # Business logic
├── repository # Database access
├── entity # JPA entities
├── dto # Data transfer objects
├── security # JWT + OAuth2 configuration
├── util # Helpers (anonymous names)
├── exception # Global exception handling
└── enums # Role, Status


### Frontend

src/
│
├── pages # All application pages
├── components # Reusable UI components
├── services # API calls (Axios)
├── hooks # Custom hooks (auth, etc.)
├── context # Auth context (JWT state)
├── assets # Images/icons
└── styles # Tailwind configuration


---

## 🔐 Authentication Flow

1. User logs in using Google OAuth2
2. Backend verifies Google identity
3. If user does not exist:
   - A new user is created
   - Role = `USER`
   - `approved = false`
4. Admin must approve user once
5. After approval:
   - JWT token is issued
   - User gains access to system
6. All whispers remain anonymous (no real identity shown)

---

## 💬 Core Features

### User Features
- Google login
- Create anonymous whispers
- View whispers (paginated)
- Mark whispers as seen
- Update or delete own whispers (if allowed)

### Admin Features
- View pending users
- Approve or reject users
- Manage system access

---

## 📡 API Endpoints

### Authentication
- `GET /oauth2/authorization/google` → Google login
- `GET /api/auth/me` → Current user info

### Whisper APIs
- `POST /api/whispers` → Create whisper
- `GET /api/whispers` → Get all whispers (paginated)
- `GET /api/whispers/{id}` → Get whisper by ID
- `PUT /api/whispers/{id}` → Update whisper
- `DELETE /api/whispers/{id}` → Delete whisper
- `PUT /api/whispers/{id}/seen` → Mark as seen

### Admin APIs
- `GET /api/admin/pending-users` → List unapproved users
- `PUT /api/admin/users/{id}/approve` → Approve user
- `PUT /api/admin/users/{id}/reject` → Reject user

---

## 🎨 Frontend Features

- Modern responsive UI (Tailwind CSS)
- Google login page
- Dashboard for whispers
- Anonymous feed display
- Admin dashboard
- Clean and minimal aesthetic design (based on provided UI reference)
- Fully responsive (mobile + desktop)

---

## 🧠 Key Concepts Implemented

- Spring Boot layered architecture
- OAuth2 authentication
- JWT token security
- Role-based authorization
- REST API design
- JPA relationships
- Pagination & sorting
- React component-based architecture
- API integration with Axios
- UI/UX design with Tailwind

---

## ⚙️ Setup Instructions

---

### 🖥️ Backend Setup

```bash
git clone <backend-repo>
cd whisperboxBackend
```

Configure database:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/whisperbox
spring.datasource.username=postgres
spring.datasource.password=your_password
```

Configure Google OAuth2:

```properties
spring.security.oauth2.client.registration.google.client-id=YOUR_CLIENT_ID
spring.security.oauth2.client.registration.google.client-secret=YOUR_CLIENT_SECRET
```

Run backend:

```bash
./mvnw spring-boot:run
```

Backend runs on:
```
http://localhost:8080
```

---

### 🌐 Frontend Setup

```bash
git clone <frontend-repo>
cd whisperboxFrontend
npm install
npm run dev
```

Frontend runs on:
```
http://localhost:5173
```

---

## 🔗 System Flow

```
React Frontend
      ↓
Spring Boot API
      ↓
PostgreSQL Database
      ↓
Google OAuth2 Login
      ↓
JWT Authentication Layer
```

---

## 🔒 Security Rules

- Only approved users can access the system
- Admin-only endpoints are protected
- JWT required for all secured requests
- Whispers are anonymous (no real identity exposed)
- Google OAuth2 used for authentication only

---

## 📌 Future Improvements

- Real-time chat (WebSockets)
- Notifications system
- Like / reaction system for whispers
- Advanced admin dashboard analytics
- Deployment (Render / Vercel / Railway)
- Email verification layer

---

## 👨‍💻 Author

github : https://github.com/Unejumutima/
