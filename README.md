# Harbor & Key - Property Rental & Booking Platform

**Live URL:** [Insert Vercel/Netlify URL Here]

## 🎯 Project Purpose
The Property Rental & Booking Platform helps property owners list rental properties and allows tenants to discover, book, and pay reservation fees online. The system connects tenants and property owners through a transparent and secure rental marketplace, facilitating role-based access control, property management, booking workflows, secure payments, and administrative moderation.

## ⭐ Key Features
- **Role-Based Access Control:** Distinct dashboards and permissions for Tenants, Owners, and Admins.
- **Secure Authentication:** JWT-based login with Better Auth, plus Google Social Login.
- **Property Management:** Owners can add, edit, and delete properties. Admins can approve or reject properties with feedback.
- **Booking & Payments:** Tenants can securely book properties via Stripe payment gateway.
- **Dynamic Dashboards:** Real-time analytics, charts (Recharts), and activity logs tailored to each role.
- **Search & Filtering:** Backend-driven search by location, property type, and price sorting.
- **Favorites & Reviews:** Tenants can save favorite properties and leave ratings/reviews.

## 📦 NPM Packages Used
### Frontend (Client)
- `next` (App Router)
- `react`, `react-dom`
- `tailwindcss`
- `framer-motion` (Animations)
- `lucide-react` (Icons)
- `recharts` (Analytics charts)
- `@stripe/stripe-js` (Payments)
- `better-auth` (Authentication)

### Backend (Server)
- `express`
- `mongoose`
- `stripe`
- `jsonwebtoken` / `jose`
- `cors`, `dotenv`

## 🏃‍♂️ Getting Started
1. Clone the repository and configure your `.env` variables for both client and server (MongoDB, Stripe, Better Auth).
2. Start the server: `cd server && npm install && npm run dev`
3. Start the client: `cd client && npm install && npm run dev`
