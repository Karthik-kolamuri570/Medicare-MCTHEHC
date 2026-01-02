# Medicare-MC: Advanced Healthcare Management System

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-Build-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Node.js](https://img.shields.io/badge/Node.js-Backend-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Database-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)

> [!IMPORTANT]
> **MSME FUNDING RECOGNITION**
> This project's working prototype has been awarded **₹7 Lakhs** in funding from the **MSME (Ministry of Micro, Small and Medium Enterprises)** for its innovation in digital healthcare accessibility.

Medicare-MC is a high-performance, full-stack healthcare platform designed to bridge the gap between patients, doctors, and critical medical resources like blood banks. Built with a focus on speed, reliability, and **"Elite Pro" aesthetics**.

---

## 🏗️ Architecture & Routing Strategy

The application follows a modern SPA (Single Page Application) architecture with a decoupled Backend API.

### **Vite Proxy System**
To avoid CORS issues and simplify environment management, the project uses a **Vite Proxy** system:
- **Client-Side Navigation**: All React Router paths are **clean and local** (e.g., `/patient/login`, `/doctor/dashboard`).
- **Server API Calls**: All backend requests are prefixed with `/api` (e.g., `axios.get('/api/patient/me')`).
- **Development Proxy**: The `vite.config.js` is configured to route all `/api` traffic from the frontend (port 5173) to the backend server (port 1600) automatically.

### **Security & Session**
- **Axios with Credentials**: Global configuration `axios.defaults.withCredentials = true` ensures HTTP-only cookies are passed for stateful authentication.
- **Protected Routes**: Custom React components wrap sensitive views to ensure only authorized Patients, Doctors, or Admins can access their respective portals.

---

## 🎨 Design Philosophy: "Elite Pro" UI

The application prioritizes **Visual Excellence** to provide a premium user experience:
- **Glassmorphism**: Subtle translucency and blur effects in modals and cards.
- **Micro-animations**: Powered by **Framer Motion** for smooth transitions and interactive feedback.
- **Dynamic Color Palettes**: High-contrast, accessibility-first colors using Tailwind CSS 4.0.
- **Responsive Layouts**: Optimized for seamless transitions between mobile, tablet, and desktop views.

---

## 🚀 Key Modules

### 🏥 Patient Experience
- **Smart Appointment Booking**: Find specialists by hospital, location, or department.
- **Get Second Opinion**: A specialized portal for expert medical reviews of existing diagnoses.
- **Online Consultations**: Virtual appointments via real-time video/chat integration.
- **Stripe Checkout**: Secure payment processing for all medical services.

### 🩺 Doctor Workspace
- **Dynamic Dashboard**: Manage daily schedules, patient queues, and medical history.
- **Authoring Tools**: Integrated blog management to share health tips and medical news.
- **Real-time Notifications**: Instant alerts for new bookings and consultation requests.

### 👑 Admin Command Center
- **Statistical Overview**: Visual charts (Recharts) for user growth and revenue tracking.
- **Blood Bank Network**:
  - **Bank Dashboard**: Manage inventory, donation requests, and blood supply levels.
  - **User Portal**: Locate nearby banks, request blood, or schedule donations.
  - **Camp Admin**: Organize and promote community blood donation drives.
- **Moderation**: Full control over blog posts, user verification, and doctor profiles.

---

## 🛠️ Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 19, Vite, Tailwind CSS 4.0, Framer Motion, Material UI, Shadcn UI |
| **Backend** | Node.js, Express, MongoDB, Mongoose |
| **Security** | JWT, Bcrypt, HTTP-only Cookies |
| **Payments** | Stripe API |
| **Real-time** | Stream.io (Video/Chat) |
| **Features** | Blood Bank Network, Smart Scheduling, Real-time Consultations |

---

## 📦 Installation & Setup

### Backend Setup
1. `cd backend`
2. `npm install`
3. Create `.env` with `PORT=1600`, `MONGO_URI`, `JWT_SECRET`, `STRIPE_SECRET_KEY`, `STREAM_API_KEY`, etc.
4. `npm run dev`

### Frontend Setup
1. `cd frontend`
2. `npm install`
3. `npm run dev` (Runs on port 5173, proxied to port 1600 via `/api`)

---

## 📩 Contact & Support

For collaborations or inquiries, reach out via:
- **Phone**: +91 9182615101
- **Email**: [kart91801@gmail.com](mailto:kart91801@gmail.com)

© 2025 Medicare-MC. Empowering Digital Health.
