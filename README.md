# 🍗 فرايد تشكين - Fried Chicken

Full Stack Restaurant Management App built with React, Node.js/Express, and MongoDB.

## Features

- 🌍 Multi-language support (Arabic, English, Kurdish)
- 🍗 Full menu management with categories (Crispy, Family, Sides)
- 📦 Order management with real-time status tracking
- 📍 Multi-branch support
- 👑 Admin dashboard with statistics
- 🔐 JWT authentication with role-based access (admin, manager, staff)

## Tech Stack

### Backend
- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication
- bcryptjs for password hashing
- Helmet, CORS, Rate Limiting

### Frontend
- React 18
- Axios for API calls
- Lucide React icons
- Multi-language translations

## Project Structure

```
fried-chicken/
├── backend/
│   ├── models/        # MongoDB schemas
│   ├── routes/        # API routes
│   ├── middleware/    # Auth middleware
│   ├── config/        # DB config & seeding
│   └── server.js      # Main server
└── frontend/
    ├── public/
    └── src/
        ├── App.jsx    # Main React component
        └── index.js
```

## API Endpoints

- `POST /api/auth/login` - Login
- `GET /api/menu` - Get menu items
- `POST /api/orders` - Create order
- `GET /api/orders/track/:orderNumber` - Track order
- `GET /api/branches` - Get branches
- `GET /api/stats/dashboard` - Admin stats

## Deployment

- **Backend**: Render.com
- **Frontend**: Vercel
- **Database**: MongoDB Atlas
