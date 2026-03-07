# CLAUDE.md — Fried Chicken Restaurant Management App

## Project Overview

A full-stack restaurant ordering and management system for a fried chicken chain. Supports multilingual UI (Arabic, English, Kurdish), order tracking, menu management, branch management, and an admin dashboard with role-based access control.

## Repository Structure

```
fried-chicken/
├── CLAUDE.md
├── README.md
├── backend/
│   ├── package.json
│   ├── server.js              # Express entry point
│   ├── .env.example           # Environment variable template
│   ├── vercel.json            # Backend deployment config
│   ├── models/
│   │   ├── User.js            # Staff/admin accounts (bcrypt, JWT)
│   │   ├── MenuItem.js        # Menu items (multilingual names)
│   │   ├── Order.js           # Orders with status history
│   │   └── Branch.js          # Restaurant branch locations
│   ├── routes/
│   │   ├── auth.js            # Login, register, user management
│   │   ├── menu.js            # CRUD menu items
│   │   ├── orders.js          # Create/list/track/update orders
│   │   ├── branches.js        # CRUD branches
│   │   └── stats.js           # Dashboard analytics
│   └── middleware/
│       └── auth.js            # JWT protect + role authorize
└── frontend/
    ├── package.json
    ├── vercel.json            # Frontend deployment config + security headers
    ├── public/
    │   └── index.html         # SPA shell (RTL default, SEO meta, JSON-LD)
    └── src/
        ├── index.js           # React entry point
        ├── App.jsx            # Monolithic single-file app (~970 lines)
        └── styles.css         # All styles (~1060 lines)
```

## Tech Stack

- **Backend:** Node.js, Express 4, Mongoose 8, MongoDB Atlas
- **Frontend:** React 18 (Create React App), plain CSS
- **Auth:** JWT (jsonwebtoken) + bcryptjs password hashing
- **Security:** Helmet, CORS whitelist, express-rate-limit, express-validator
- **Deployment:** Backend on Render, Frontend on Vercel

## Development Commands

### Backend

```bash
cd backend
npm install
npm run dev          # Start with nodemon (hot reload)
npm start            # Production start
```

Backend runs on port 5000 by default. Requires `MONGODB_URI` and `JWT_SECRET` environment variables (see `backend/.env.example`).

### Frontend

```bash
cd frontend
npm install
npm start            # Dev server on port 3000 (proxied to backend)
npm run build        # Production build
npm test             # Jest/React Testing Library (no tests written yet)
```

The frontend `package.json` has `"proxy": "http://localhost:5000"` for local dev.

## API Endpoints

All routes prefixed with `/api`:

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | /auth/login | Public | Login, returns JWT |
| GET | /auth/me | Protected | Current user info |
| POST | /auth/register | Admin | Create user account |
| GET | /auth/users | Admin/Manager | List users |
| PUT | /auth/users/:id | Admin | Update user |
| GET | /menu | Public | List menu items (filter: category, available) |
| GET | /menu/:id | Public | Single menu item |
| POST | /menu | Admin/Manager | Create menu item |
| PUT | /menu/:id | Admin/Manager | Update menu item |
| DELETE | /menu/:id | Admin | Delete menu item |
| POST | /orders | Public | Place order |
| GET | /orders | Protected | List orders (paginated, filterable) |
| GET | /orders/:id | Protected | Single order |
| PUT | /orders/:id/status | Protected | Update order status |
| GET | /orders/track/:orderNumber | Public | Track order by number |
| GET | /branches | Public | List active branches |
| GET | /branches/:id | Public | Single branch |
| POST | /branches | Admin | Create branch |
| PUT | /branches/:id | Admin/Manager | Update branch |
| DELETE | /branches/:id | Admin | Delete branch |
| GET | /stats/dashboard | Admin/Manager | Revenue & order stats |
| GET | /stats/orders-by-status | Protected | Order counts by status |

## Key Architecture Decisions

### Backend
- **Middleware stack order:** helmet → cors → rate-limit → body-parser → morgan → routes
- **Role-based access:** Three roles — `admin`, `manager`, `staff`. Staff are restricted to their own branch's data.
- **Rate limiting:** Auth routes 10 req/15min, order creation 10 req/15min, general API 100 req/15min
- **Caching:** Menu and branches GET routes return `Cache-Control: public, max-age=300`
- **Order numbers:** Auto-incremented via pre-save hook on Order model
- **Status history:** Every order status change is tracked with timestamp and user reference

### Frontend
- **Single-file architecture:** All components live in `App.jsx` — no component splitting
- **No router:** Page navigation managed via `page` state variable in `AppContent`
- **No state management library:** Props passed down from `AppContent`, callbacks bubble up
- **Translations:** Inline `translations` object with keys for `ar`, `en`, `ku`
- **RTL/LTR:** Dynamically set via `document.documentElement.dir` based on language
- **localStorage keys:** `fc_lang`, `fc_token`, `fc_user`, `fc_cart`

## Data Model Conventions

- All multilingual fields use `{ ar, en, ku }` sub-objects (required for names, optional for descriptions)
- Boolean fields use `is*` prefix: `isOpen`, `isAvailable`, `isActive`
- All models include `timestamps: true` (auto `createdAt`, `updatedAt`)
- ObjectId references link Orders to Branches and Users to Branches
- Status enums: `pending`, `confirmed`, `preparing`, `ready`, `delivering`, `delivered`, `cancelled`
- Categories: `crispy`, `family`, `sides`
- User roles: `admin`, `manager`, `staff`

## Code Conventions

- **Backend route files:** Section markers with `// ─── Title ───`
- **Frontend:** Similar section markers in App.jsx
- **Naming:** camelCase for variables/functions, PascalCase for React components, RESTful route paths
- **Error handling:** try-catch in all route handlers returning appropriate HTTP status codes; frontend uses try-catch with toast notifications
- **Input validation:** express-validator on all mutation endpoints; frontend validates on submit
- **Security:** `sanitize()` helper in frontend strips HTML tags from user input; phone regex `/^[\d\s+()-]{7,15}$/`

## Environment Variables

Required backend env vars (see `backend/.env.example`):

| Variable | Description | Default |
|----------|-------------|---------|
| NODE_ENV | Environment | production |
| PORT | Server port | 5000 |
| MONGODB_URI | MongoDB connection string | — |
| JWT_SECRET | JWT signing secret | — |
| JWT_EXPIRE | Token expiry | 7d |
| RATE_LIMIT_WINDOW | Rate limit window (min) | 15 |
| RATE_LIMIT_MAX | Max requests per window | 100 |
| FRONTEND_URL | Allowed CORS origin | — |

Frontend env var: `REACT_APP_API_URL` (defaults to `http://localhost:5000/api`).

## Testing

No tests have been written yet. The frontend has CRA's default Jest/React Testing Library setup available via `npm test`. The backend has no test infrastructure.

## Deployment

- **Backend:** Deployed to Render via `backend/vercel.json` (also supports Vercel with `@vercel/node`)
- **Frontend:** Deployed to Vercel with SPA rewrites and security headers in `frontend/vercel.json`
- **Database:** MongoDB Atlas (cloud-hosted)
- **No CI/CD pipeline** — deployments are platform-triggered on push

## Common Tasks

### Adding a new API route
1. Create or edit the route file in `backend/routes/`
2. Add validation with express-validator
3. Use `protect` and `authorize()` middleware for protected endpoints
4. Register the route in `backend/server.js`

### Adding a new frontend page
1. Add translation keys to the `translations` object in `App.jsx`
2. Create the component function in `App.jsx`
3. Add navigation entry in the `Navbar` component
4. Add the page case in `AppContent`'s rendering logic

### Adding a new menu category
1. Update the `category` enum in `backend/models/MenuItem.js`
2. Add translations for the category name in `App.jsx`
3. Update category filter chips in the `MenuPage` component
