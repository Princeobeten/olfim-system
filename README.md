Online Lost and Found Resources Information Management System (OLFIM) for UNICROSS - Minimal Prototype
This README provides guidelines for building a minimal viable prototype (MVP) of the Online Lost and Found Resources Information Management System for the University of Cross River State (UNICROSS), as described in the seminar project by Aganyi Mathias Oko (20/CSC/011). The prototype uses Next.js (App Router) for the frontend and backend, MongoDB with Mongoose for data persistence, and React Context for global state management (e.g., authentication and database integration). The focus is on core features: user authentication, reporting/searching lost/found items, and a basic admin dashboard. Notifications are simulated via UI updates for the MVP.
The system streamlines reporting, tracking, and recovery of lost items, addressing inefficiencies in the manual UNICROSS process. Development prioritizes speed, modularity, and a clean UI/UX using pre-configured Tailwind CSS.
Folder Structure
├── /app                  # Next.js app directory (App Router)
│   ├── /api              # API routes (e.g., /api/auth/login, /api/items/report)
│   │   ├── /auth         # Auth-related routes (login, signup)
│   │   └── /items        # Item-related routes (report, search, match)
│   ├── /components       # Reusable UI components (e.g., ItemForm, SearchBar, AuthCheck)
│   ├── /dashboard        # Admin dashboard page
│   ├── /login            # Login page
│   ├── /report           # Report lost/found item page
│   ├── /search           # Search items page
│   └── layout.tsx        # Root layout with AppProvider
├── /hooks                # Custom hooks (e.g., useAuth, useItems)
├── /context              # Global state management
│   └── AppContext.tsx    # Central context for auth, user, and DB integration
├── /lib                  # Utilities
│   └── /utils            # Helper functions (e.g., validation, formatting)
├── /models               # Mongoose models (root level: User, Item)
├── /scripts              # Testing scripts
├── /public               # Static assets (e.g., images for items)
├── dbConnect.js          # MongoDB connection (root level, do not modify)
├── next.config.js        # Next.js config
├── tailwind.config.js    # Tailwind CSS config (pre-configured)
├── .env.local            # Environment variables (MONGODB_URI)
└── README.md             # This file

Key Files and Their Purpose

dbConnect.js (root): Pre-configured Mongoose connection to MongoDB. Do not modify. Uses a hardcoded URI for MVP; update .env.local for production.
models/ (root): Mongoose schemas (e.g., User.js for users, Item.js for lost/found items with fields like description, category, location, status, userId).
context/AppContext.tsx: Binds authentication, user state, and DB interactions. Wraps the app in layout.tsx to spread state globally. Integrates with hooks for API calls.
hooks/: Hooks like useAuth.tsx (for login/signup/logout) and useItems.tsx (for reporting/searching items) that call API routes via fetch.
app/api/: Serverless API routes using Mongoose for CRUD (e.g., /api/items/report for POST, /api/items/search for GET).
components/AuthCheck.tsx: Protects routes (e.g., dashboard, report) by checking auth via context.

Development Guidelines
1. Setup and Prerequisites

Node.js: v18+.
MongoDB: Use MongoDB Atlas (free tier) for cloud DB. Set MONGODB_URI in .env.local.
Tailwind CSS: Already configured in tailwind.config.js. Use utility classes for styling.
Install Dependencies (if not already installed):npm install next react react-dom mongoose react-hot-toast bcrypt


Run the Project:npm run dev  # Development server at http://localhost:3000



2. Database Integration

Connection: Import dbConnect in API routes to connect to MongoDB.
Models: Define in /models/:
User.js: { email: String, password: String (hashed), role: String ('user'|'admin') }.
Item.js: { type: String ('lost'|'found'), description: String, category: String, location: String, image: String, status: String ('pending'|'matched'|'claimed'), userId: ObjectId, createdAt: Date }.


Context Binding: In AppContext.tsx, use hooks to fetch/update data. Example: const { items, reportItem } = useItems(); spreads via useApp() hook.
APIView: Hooks (client-side) → API routes (server-side with Mongoose) → MongoDB.

3. Core Features for MVP
Implement these minimal features step-by-step:
a. Authentication (via Context and Hooks)

API Routes: /api/auth/signup, /api/auth/login (use bcrypt for hashing, JWT for tokens stored in localStorage).
Hook: useAuth.tsx (signup, login, logout, getCurrentUser). Exports to context.
Context: AppContext.tsx manages user, isAuthenticated, loading. Check auth on mount.
Pages: /login (form → login hook), protected routes redirect to login.

b. Reporting Lost/Found Items

API Route: /api/items/report (POST: validate, save to DB, return item ID).
Hook: useItems.tsx (reportItem async function with error handling).
Component: ItemForm.tsx (form for description, category, location, image upload).
Page: /report (use hook + context for auth).

c. Searching and Matching Items

API Route: /api/items/search (GET: query params for keywords, type; basic matching logic e.g., fuzzy search on description).
Hook: useItems.tsx (searchItems function).
Component: SearchBar.tsx and ItemList.tsx (display results with claim button).
Page: /search (search form → hook → list items).

d. Admin Dashboard

Protected: Wrap with AuthCheck (role: 'admin').
API Route: /api/items/admin (GET all items, update status).
Page: /dashboard (list items, approve/claim actions via hook).

e. Notifications (Simulated)

In context/hook: On match (basic algo in API), update UI state. For MVP, show toast/alert using react-hot-toast instead of email/SMS.

4. UI/UX Design

Styling: Use pre-configured Tailwind CSS for modern, clean design (blue theme for UNICROSS branding, e.g., bg-blue-500, text-blue-700).
Pages Layout: Responsive, intuitive (navbar with links: Home, Report, Search, Dashboard, Login/Logout).
Best Practices: Loading spinners (animate-spin), error toasts (react-hot-toast). Consistent typography/spacing (e.g., p-4, shadow-md).

5. Error Handling and Best Practices

Errors: In hooks/API: try-catch, log specifics (e.g., console.error('Report error:', error.message)), return { success: false, error: msg }.
Security (MVP): Basic (hashed passwords, role checks). No advanced auth.
Modularity: Hooks for API logic; context spreads state/DB access.
Testing: Add /scripts/test.js for basic API tests (e.g., using supertest). Run node scripts/test.js.
Performance: Use Next.js Image for uploads, server components where possible.

6. High-Level System Flow (Based on SSADM)

User registers/logs in (context).
Reports item (hook → API → DB).
Searches/matches (hook → API query → results).
Admin reviews (dashboard).
Claim/update status (notification sim).

Data Flow: Client (hooks/context) ↔ API (Mongoose) ↔ MongoDB.
Getting Started

Clone/Setup (if not already done):
cd project
npm install


Env Setup: Add MONGODB_URI=mongodb+srv://... to .env.local.

Build MVP:

Implement models and dbConnect.
Set up context and auth hook/API.
Add item model/hook/API.
Create pages/components.
Test flows.


Deploy: Use Vercel (free) for Next.js hosting.


Limitations (MVP)

No real notifications (UI toasts only).
Basic search (no AI matching).
No image storage (use Cloudinary later).
Single DB collection for items.

Goal
Build a functional, impressive MVP in 1-2 weeks: Authenticated users report/search items with a clean UI. Extendable for full SSADM implementation (DFD/ERD in docs).
For questions, reference the seminar document. Contribute via PRs!