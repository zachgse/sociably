# Mini-Facebook Clone 🧑‍🤝‍🧑📸💬

A full-stack MERN (MongoDB, Express.js, React, Node.js) mini-Facebook clone with real-time features powered by **Socket.IO**, built with modern best practices in authentication, UI, and state management.

---

## 🚀 Features

### 🖼️ Core Functionality
- User Authentication using **JWT (access + refresh tokens)**.
- Login with **Google OAuth2**.
- **Create**, **like**, and **comment** on posts.
- **Like comments** as well.
- **Photo upload** with **preview** when creating a post.
- View each post in a **modal**, similar to Facebook.
- Real-time synchronization of:
  - Post creation
  - Likes/unlikes
  - Comment creation
  - Comment likes

### 🔒 Authentication
- JWT-based:
  - **Access Token**: stored in memory (expires in 15 mins)
  - **Refresh Token**: stored in **HttpOnly cookie** (expires in 7 days)
- Managed globally with `AuthContext` in React.

### 🧠 State & Data Management
- **TanStack React Query** for caching and managing async data.
- **Axios** for API calls.
- **Socket.IO** for real-time communication (frontend + backend).
- **React Hook Form** for forms and validation.
- Global `ModalContext` for modal state management.

---

## 🧑‍💻 Tech Stack

### Frontend
Built with **React + Tailwind CSS**

#### Libraries & Tools:
- `@tanstack/react-query` – for fetching and caching
- `axios` – API requests
- `react-hook-form` – form handling
- `socket.io-client` – real-time event handling
- `@react-oauth/google` – Google login
- `jwt-decode`, `moment`, `sweetalert2`, etc.

### Backend
Built with **Node.js + Express + MongoDB (Mongoose)**

#### Packages:
- `bcryptjs` – password hashing
- `jsonwebtoken` – JWT creation & verification
- `cookie-parser` – parsing HttpOnly cookies
- `multer` – handling file uploads
- `socket.io` – real-time communication
- `google-auth-library` – OAuth2 validation


