# 🍰 Corbett Bakers - Full Stack Application

A professional, production-ready web application for Corbett Bakers with a React frontend and Express.js backend.

## 📁 Project Structure

```
corbett-bakers/
├── frontend/                    # React + Vite (Deployed on Vercel)
│   ├── src/                    # React components & pages
│   ├── public/                 # Static assets
│   ├── index.html              # Entry HTML
│   ├── vite.config.js          # Vite configuration
│   ├── .vercelignore           # Vercel ignore patterns
│   └── package.json            # Frontend dependencies
│
├── backend/                     # Express.js API (Deployed on Render)
│   ├── server.js               # Main server file
│   ├── routes/                 # API routes
│   │   ├── products.js         # Products endpoint
│   │   └── fastfood.js         # Fastfood endpoint
|   |   |__ config.js           # Configuration endpoint
|   |   
│   ├── models/                 # Database tables
│   │   └── FastFood.js  
|   |   |__ Product.js
|   |   |__ SiteConfig.js
|   |       
│   ├── render.yaml             # Render deployment config
│   ├── .renderignore           # Render ignore patterns
│   └── package.json            # Backend dependencies
│
│
├── package.json                # Root monorepo config
├── .gitignore                  # Git ignore rules
└── README.md                   # This file
```

## 🚀 Deployment Architecture

```
┌─────────────────────────────────────────────────────┐
│                 Users                               │
└────────────┬──────────────────────────┬─────────────┘
             │                          │
             ▼                          ▼
    ┌──────────────────┐      ┌──────────────────┐
    │ Vercel (Frontend)│      │ Render (Backend) │
    │ React + Vite     │◄────►│ Express.js       │
    │ your-app         │ API  │ corbett-api      │
    │ .vercel.app      │      │ .onrender.com    │
    └──────────────────┘      └──────────────────┘
         Frontend                   Backend
```

## 🔧 Setup Instructions

### Prerequisites
- Node.js 18+ installed
- Git installed
- GitHub account
- Vercel & Render accounts (free)

### Local Development

**1. Install Dependencies**
```
npm install
```

**2. Run Frontend**
```
npm run frontend:dev
```
Opens at `http://localhost:5173`

**3. Run Backend**
```
npm run backend:dev
```
Runs at `http://localhost:5000`

**4. Run Both Together**
```
npm run dev
```



## ✅ Verification

**Frontend:** Visit 'https://corbett-bakers.vercel.app`
- Page loads completely
- Dark mode works
- No console errors

**Backend:** Visit `https://corbett-bakers-api.onrender.com/api/health`
- Returns: `{"status":"ok","timestamp":"..."}`

**Integration:** Check products load from API
- Network tab shows `/api/products` call
- No CORS errors

## 📚 Quick Commands

| Command | Purpose |
|---------|---------|
| `npm run frontend:dev` | Frontend development |
| `npm run backend:dev` | Backend development |
| `npm run dev` | Both together |
| `npm run frontend:build` | Build frontend |
| `git push origin main` | Auto-deploy to Vercel |


## 🎨 Features

✅ React 19 + Vite  
✅ Dark mode with neon effects  
✅ Smooth animations  
✅ Mobile responsive  
✅ Express.js API  
✅ MongoDB database  
✅ Admin authentication  
✅ Auto-deploy on git push  

## 🆘 Troubleshooting

**API returns 404:** Ensure backend URL is correct in `VITE_API_URL`  
**Frontend won't load:** Check Vercel logs and environment variables  
**CORS errors:** Verify backend is running, no trailing slash in API URL  
**Build fails:** Confirm root directory is set correctly in deployment platform  

## 📊 Project Info

- **Frontend:** React 19, Vite 7.2, 800+ CSS lines
- **Backend:** Express.js, SQLite, Node.js 18+
- **Deployment:** Vercel (Frontend) + Render (Backend)
- **Status:** ✅ Production Ready
- **Last Updated:** December 12, 2025

---