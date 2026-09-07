# Writora ✍️

**Writora** is a full-stack blogging platform built with the MERN stack, designed for writers who want a clean, distraction-free space to publish stories and for readers who want a personalized, engaging feed — inspired by the reading and writing experience of platforms like Medium.

---

## ✨ Features

### Writing & Publishing
- **Rich text editor powered by [Lexical](https://lexical.dev/)** — supports headings, paragraphs, bulleted/numbered lists, blockquotes, code blocks, and inline images (upload or by URL)
- Save posts as **drafts** or publish them instantly
- **Edit and delete** your own stories, with a confirmation prompt before deletion
- Automatic **slug generation**, **word count**, and **estimated read time** calculation
- Category tagging from a fixed set of topics (Technology, Programming, AI, Lifestyle, etc.)

### Reading Experience
- Clean, typography-focused reading view with custom-styled headings, lists, blockquotes, and code blocks
- **View tracking** — each story's view count increases once per unique reader
- **Like/unlike** stories with optimistic UI updates
- **Threaded comments** — post, edit, and delete your own comments
- Responsive images, dark-mode-aware styling, and mobile-first layouts

### Social & Discovery
- **Follow/unfollow authors**, with a per-author **email notification toggle**
- **Author profiles** — a single adaptive component that shows an "Edit Profile" action on your own profile and a "Follow" action (with a management dropdown) on others' profiles
- **Trending stories** sidebar, ranked by a weighted engagement score (views + likes + comments)
- **"Who to Follow"** suggestions for discovering new authors
- **Search** across stories (title, excerpt, tags) and people (name, bio), with topic and people suggestions in the sidebar

### Account & Personalization
- Email/password authentication with **JWT-based sessions**
- Auto-generated avatars for new users
- **Author dashboard (Stats)** — monthly views, likes, comments, and follower growth, visualized with a lightweight custom chart
- **Dark mode** support
- Toast notification system for real-time feedback (success, warning, error) with auto-dismiss and progress indicators

---

## 🛠️ Tech Stack

**Frontend**
- React (Vite)
- React Router
- Zustand — lightweight global state management (auth/session)
- Tailwind CSS
- [Lexical](https://lexical.dev/) — extensible rich text editor framework
- Lucide React — icon set
- Axios — API communication

**Backend**
- Node.js + Express
- MongoDB with Mongoose ODM
- JWT (jsonwebtoken) for authentication
- bcrypt for password hashing

**Architecture**
- RESTful API following a controller → service → model pattern
- Aggregation pipelines for computed data (trending stories, author stats, category breakdowns)
- Denormalized counters (likes, comment count, views) for fast list rendering, backed by event logs where time-series data is needed (e.g. daily view stats)

---

## 📂 Project Structure

```
Writora/
├── Client/                    # React frontend
│   └── src/
│       ├── Components/        # Reusable UI building blocks (Blog, Ui, Search, Profile, Stats...)
│       ├── Pages/              # Route-level pages (Home, Blog, Profile, Stats, Search, Auth...)
│       ├── Services/           # Axios API service modules
│       ├── Store/               # Zustand stores (auth, etc.)
│       ├── Layouts/             # Layout shells (Guest, App)
│       └── Constants/           # Shared constants (categories, etc.)
│
└── Server/                     # Express backend
    ├── models/                 # Mongoose schemas (User, Blog, Comment, BlogView)
    ├── controllers/             # Request handlers
    ├── services/                 # Business logic
    ├── routes/                   # Express route definitions
    └── middlewares/              # Auth guards (protect, optionalAuth), error handling
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- MongoDB (local instance or a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster)

### 1. Clone the repository
```bash
git clone https://github.com/Jayveer-kumar/Writora.git
cd Writora
```

### 2. Set up the backend
```bash
cd Server
npm install
```

Create a `.env` file in `Server/` with the following variables:
```env
PORT=8080
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```

Start the server:
```bash
npm run dev
```

### 3. Set up the frontend
```bash
cd ../Client
npm install
```

Create a `.env` file in `Client/` (if your API base URL is configurable):
```env
VITE_API_BASE_URL=http://localhost:8080/api
```

Start the development server:
```bash
npm run dev
```

The app should now be running at `http://localhost:5173` (or whichever port Vite assigns).

---

## 📖 Core Concepts

- **Content storage** — blog content is stored as Lexical's serialized JSON editor state, allowing exact reconstruction of the original formatting (headings, lists, images) when re-rendering a post
- **Optional authentication** — public routes like reading a blog use an "optional auth" middleware, so guests can browse freely, and only interactive actions (like, comment, follow) prompt a login
- **Consistent response shapes** — API responses follow a predictable `{ success, message, data }` structure across endpoints

---

## 🗺️ Roadmap

- [ ] Publication/collection support (multi-author blogs)
- [ ] Audience analytics tab (traffic sources, reader demographics)
- [ ] Notification center for likes, comments, and new followers
- [ ] Bookmarking / reading list
- [ ] Full-text search index for large-scale content search

---

## 👤 Author

**Jayveer Kumar**
Final-year BCA student, BIMT College Badaun (MJPRU University)
Full-stack developer focused on the MERN stack

---

## 📄 License

This project is open for learning and personal use. Feel free to fork and build upon it.
