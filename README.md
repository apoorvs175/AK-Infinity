# AK Infinity - Enterprise Grade Digital Agency

A complete, production-ready digital agency website and lead management platform.

## Features

### Frontend
- React 19 + TypeScript
- Vite
- Tailwind CSS
- Framer Motion
- React Router
- React Hook Form

### Backend
- Node.js + Express
- Supabase integration ready
- RESTful API

### Pages
- Homepage with hero, services, testimonials, CTA
- Services page
- Portfolio page
- About page
- Contact page with form
- Admin dashboard for lead management
- Admin login

## Getting Started

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Backend
```bash
cd backend
npm install
npm run dev
```

## Environment Variables

### Frontend (.env in frontend/
```
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

### Backend (.env in backend/)
```
PORT=5000
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
```

## Project Structure

```
AK Infinity/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── types/
│   │   ├── lib/
│   │   └── ...
└── backend/
    └── src/
```

## Technologies

- React
- TypeScript
- Vite
- Tailwind CSS
- Framer Motion
- Express.js
- Supabase (for database and auth)
