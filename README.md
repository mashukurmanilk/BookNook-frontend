# BookNook – A Small Online Library

> **"Add a book, borrow a book, return a book."**

BookNook is a modern, community-driven online library web application built with Next.js (App Router), Better Auth with MongoDB Adapter, Tailwind CSS, and Express.js with JWT verification. It enables book lovers to discover captivating reads, contribute new books, borrow with automated copy tracking, and manage their personal reading loans seamlessly.

---

## 🌐 Live Application & Links

- **Live Client Site**: [https://booknook-library.vercel.app](https://booknook-library.vercel.app)
- **Live Backend API**: [https://booknook-backend.onrender.com](https://booknook-backend.onrender.com)
- **Client Repository**: [https://github.com/your-username/BookNook-frontend](https://github.com/your-username/BookNook-frontend)
- **Server Repository**: [https://github.com/your-username/BookNook-backend](https://github.com/your-username/BookNook-backend)

---

## ✨ Key Features

- **Dynamic Catalog & Real-Time Inventory Tracking**: Browse books across Fiction, Science, History, Kids, and more. Features instant client-side keyword search (title/author), genre filtering, sort by newest or alphabetical order, and live copy availability badges.
- **Atomic Borrow & Return Engine**: Experience the seamless borrow system where book copies are atomically decremented (`$inc: -1`) upon loan confirmation and incremented (`$inc: +1`) upon return. Double-borrowing prevention ensures a member cannot borrow multiple copies of the same book simultaneously.
- **Robust Authentication & JWT Authorization**: Built with Next.js App Router, Better Auth, and MongoDB Adapter. Supports both secure Email/Password credentials and Google OAuth. Sessions bridge effortlessly to the Express.js backend via signed JWT Bearer tokens verified via JWKS and symmetric secret fallbacks.
- **Cinematic Swiper.js Hero & Immersive UI**: High-impact banner slider featuring 3D book perspectives, structured reading highlights, promotional genre banners, animated floating support actions, and a responsive top navigation with dark/light mode toggles.
- **Comprehensive Contributor Management Suite**: Dedicated private portal allowing authenticated members to add new titles with ImgBB image upload, edit book details in-place, and remove listings with accessible custom confirmation modals (no default browser alerts).

---

## 🛠️ Technology Stack

| Domain | Technology |
|---|---|
| **Frontend Framework** | Next.js 15 (App Router, React 19, TypeScript) |
| **Styling & UI** | Tailwind CSS, Lucide React, Swiper.js, Canvas Confetti |
| **Authentication** | Better Auth with MongoDB Adapter & Google OAuth |
| **Notifications** | Sonner Toast System & next-themes Dark Mode |
| **Backend API** | Express.js 5, Node.js (ES Modules), Mongoose / MongoDB |
| **Security & Tokens** | Jose JWT signing, JWKS validation, CORS |
| **Database** | MongoDB Atlas |

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm or pnpm
- MongoDB Atlas database cluster

### 1. Environment Configuration

Create a `.env.local` file in the `BookNook-frontend` directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_APP_URL=http://localhost:3000
BETTER_AUTH_URL=http://localhost:3000
BETTER_AUTH_SECRET=booknook_super_secure_jwt_auth_secret_2026_key
MONGODB_URI=your_mongodb_connection_string
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
NEXT_PUBLIC_IMGBB_API_KEY=your_imgbb_api_key
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production

```bash
npm run build
npm start
```

---

## 📄 License

This project is created for educational and community demonstration purposes under the MIT License.
