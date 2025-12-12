# Deploy Frontend to Vercel + Backend to Render

This guide shows how to deploy your Corbett Bakers app with:
- **Frontend** (React) → Vercel
- **Backend** (Express) → Render

This is a professional, scalable setup! 🚀

---

## Architecture Overview

```
┌─────────────────────────────────────────────────┐
│                    Internet                     │
└────────────┬────────────────────────────┬────────┘
             │                            │
             ▼                            ▼
    ┌─────────────────┐        ┌──────────────────┐
    │  Vercel         │        │    Render        │
    │  (Frontend)     │        │    (Backend)     │
    │  React + Vite   │◄──────►│  Express.js      │
    │  your-app       │ API    │  corbett-api     │
    │  .vercel.app    │ calls  │  .onrender.com   │
    └─────────────────┘        └──────────────────┘
```

---

## Part 1: Deploy Backend to Render

### Step 1: Prepare the Repository

Push your code to GitHub (if not done already):
```bash
cd c:\Users\Ayush\Desktop\app
git add .
git commit -m "Setup split deployment: Vercel frontend + Render backend"
git push origin main
```

### Step 2: Create Render Account

1. Go to [render.com](https://render.com)
2. Click **Sign up** (or use GitHub sign-in for fastest option)
3. Authorize Render to access your GitHub account

### Step 3: Deploy Backend Service

1. In Render dashboard, click **+ New**
2. Select **Web Service**
3. Select your GitHub repository (corbett-bakers or whatever it's named)
4. Configure:
   - **Name**: `corbett-bakers-api` (or any name)
   - **Environment**: `Node`
   - **Build Command**: `npm install --prefix server`
   - **Start Command**: `node server/server.js`
   - **Plan**: Free (for testing) or Paid (for production)

5. Click **Create Web Service**
6. Wait 3-5 minutes for build & deployment
7. **Copy your Render URL** (looks like `https://corbett-bakers-api.onrender.com`)

✅ **Backend is now live!**

---

## Part 2: Deploy Frontend to Vercel

### Step 1: Update Environment Variable

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Select your project
3. Click **Settings** → **Environment Variables**
4. Update or create `VITE_API_URL`:

**Variable Name**: `VITE_API_URL`

**Value**: (Use your Render URL from Part 1)
```
https://corbett-bakers-api.onrender.com
```

5. Click **Save**

### Step 2: Redeploy Frontend

1. Go to **Deployments** tab
2. Find the latest deployment
3. Click **⋮** (three dots) → **Redeploy**
4. Wait 1-2 minutes

✅ **Frontend is updated with correct API URL!**

---

## Verify Everything Works

### Test Backend
Open in browser:
```
https://corbett-bakers-api.onrender.com/api/health
```

You should see:
```json
{
  "status": "ok",
  "timestamp": "2025-12-12T10:30:45.123Z"
}
```

### Test Frontend
Open:
```
https://your-app.vercel.app
```

Test these features:
- ✅ Page loads completely
- ✅ Dark mode works
- ✅ Products load from API
- ✅ Menu items display
- ✅ No console errors

---

## Your Live URLs

```
Frontend:  https://your-app.vercel.app
Backend:   https://corbett-bakers-api.onrender.com
API:       https://corbett-bakers-api.onrender.com/api
Products:  https://corbett-bakers-api.onrender.com/api/products
Health:    https://corbett-bakers-api.onrender.com/api/health
```

---

## Configuration Files

### What Changed

**vercel.json** - Now handles only frontend:
```json
{
  "version": 2,
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```

**render.yaml** - New file for backend deployment:
```yaml
services:
  - type: web
    name: corbett-bakers-api
    env: node
    plan: free
    buildCommand: npm install --prefix server
    startCommand: node server/server.js
```

---

## Auto-Deploy on Git Push

### Vercel (Automatic)
✅ Already set up!
- Push to GitHub → Automatic Vercel deploy
- Takes 1-2 minutes

### Render (Need to Configure)

1. In Render dashboard, go to your service
2. Click **Settings** (left sidebar)
3. Find **"Auto-Deploy"**
4. Set to **"Yes"** (if available on your plan)
5. Select branch: `main`

Now both auto-deploy on every git push!

---

## Environment Variables Setup

### On Vercel (Frontend)
```
VITE_API_URL = https://corbett-bakers-api.onrender.com
```

### On Render (Backend)
```
NODE_ENV = production
PORT = 5000
```

---

## Troubleshooting

### Backend won't start on Render
**Error**: `Cannot find module 'express'`
- Fix: Check **Build Command** is `npm install --prefix server`
- Or: Add `npm install` before server start

### Frontend shows API errors
**Error**: `Failed to fetch /api/products`
- Fix: Verify `VITE_API_URL` environment variable is set correctly
- Redeploy frontend after setting environment variable

### CORS errors in browser console
**Error**: `Access to XMLHttpRequest blocked by CORS`
- The server already has CORS enabled ✅
- This should not happen, but if it does:
  - Check Render backend is running (test `/api/health`)
  - Check VITE_API_URL doesn't have trailing slash

### Render backend keeps spinning up
**Info**: Free tier on Render spins down after 15 minutes of inactivity
- This is normal behavior
- First request after spin-down takes 30 seconds
- Upgrade to paid plan to prevent this

---

## Benefits of This Setup

### Frontend on Vercel
✅ Optimized for static assets & SPA  
✅ Global CDN for fast loading  
✅ Free tier very generous  
✅ Easy environment variable management  
✅ One-click deployments  

### Backend on Render
✅ Better for running server code  
✅ Can run background jobs  
✅ Better database integration options  
✅ Dedicated to API logic  
✅ Easy scaling  

---

## Database Options for Production

### Current Setup
- SQLite (local file)
- Data persists on Render

### Better for Production
- **PostgreSQL** (Render has built-in support)
- **MongoDB Atlas** (NoSQL option)
- **Supabase** (PostgreSQL + Auth)

#### Adding PostgreSQL to Render
1. In Render dashboard
2. Click **+ New** → **PostgreSQL**
3. Fill in details
4. Get connection string
5. Add to Render backend environment variables
6. Update `server/db/init.js` to use PostgreSQL

---

## Monitoring & Debugging

### Check Render Logs
1. Go to Render dashboard
2. Select your service
3. Click **Logs** tab
4. See real-time logs

### Check Vercel Logs
1. Go to Vercel dashboard
2. Select your project
3. Click **Deployments**
4. Select deployment → **View Deployment**
5. Check **Functions** and **Build** logs

---

## Cost Breakdown

| Service | Plan | Cost | Notes |
|---------|------|------|-------|
| Vercel | Free | $0/month | Generous free tier |
| Render | Free | $0/month | Spins down after 15 min inactivity |
| PostgreSQL (optional) | Free | $0/month | 1 free database |
| **Total** | | **$0/month** | Can grow as needed |

---

## Next Steps

### ✅ Completed
- [x] Split configuration set up
- [x] vercel.json updated
- [x] render.yaml created
- [x] Code pushed to GitHub

### 📋 You Need To Do
1. [ ] Deploy backend to Render (Part 1)
2. [ ] Copy Render URL
3. [ ] Update VITE_API_URL on Vercel
4. [ ] Redeploy frontend on Vercel
5. [ ] Test both URLs
6. [ ] Celebrate! 🎉

---

## Quick Reference

### Deploy Backend Command
```bash
# Render auto-detects from render.yaml
# Just connect your GitHub repo in Render dashboard
```

### Deploy Frontend Command
```bash
# Vercel auto-detects from vercel.json
# Just push to GitHub
git add .
git commit -m "Update config"
git push origin main
```

### Update API URL (if backend URL changes)
```
Vercel Dashboard → Settings → Environment Variables
Update VITE_API_URL → Redeploy
```

---

## Common Questions

**Q: Do I need to deploy manually?**  
A: No! After initial setup, both auto-deploy on git push.

**Q: Can I use different branches?**  
A: Yes! Set up preview environments in both Vercel and Render.

**Q: What if Render backend spins down?**  
A: First request takes 30 sec. Normal for free tier. Upgrade for always-on.

**Q: How do I add a custom domain?**  
A: Vercel Dashboard → Domains. Render Settings → Custom Domain. Both have guides.

**Q: Can I move the database?**  
A: Yes! SQLite → PostgreSQL guide in troubleshooting section.

---

## Success Indicators ✅

After deployment, verify:
- [ ] Frontend loads at `https://your-app.vercel.app`
- [ ] Backend responds to `https://api.onrender.com/api/health`
- [ ] Products load in the UI
- [ ] Dark mode works
- [ ] No errors in browser console
- [ ] API calls are successful (check Network tab)

---

## Production Checklist

- [ ] Backend deployed on Render
- [ ] Frontend deployed on Vercel
- [ ] VITE_API_URL environment variable set
- [ ] Both services have auto-deploy enabled
- [ ] Environment variables secured
- [ ] CORS properly configured
- [ ] Error handling in place
- [ ] Monitoring/logging set up
- [ ] Backup strategy in place
- [ ] Custom domain (optional)

---

## Support & Documentation

### Official Docs
- [Render Docs](https://render.com/docs)
- [Vercel Docs](https://vercel.com/docs)
- [Express.js Docs](https://expressjs.com)
- [React Docs](https://react.dev)

### Your Project Files
- `render.yaml` - Backend deployment config
- `vercel.json` - Frontend deployment config
- `server/server.js` - Backend entry point
- `src/main.jsx` - Frontend entry point

---

## 🎉 You're Ready!

This split deployment is professional and scalable:
- Frontend optimized on Vercel
- Backend optimized on Render
- Both auto-deploy on git push
- Easy to scale when needed
- Great for production use

**Time to deploy**: ~15 minutes  
**Cost**: Free (can grow as needed)  
**Performance**: Enterprise-grade  

---

## Next Action

1. **Deploy backend** (Part 1) - Follow steps to Render
2. **Update frontend** (Part 2) - Set environment variable
3. **Test everything** - Verify URLs work
4. **Push to production** - Done! 🚀

**Time invested**: 15 minutes  
**Results**: Professional deployment on web ✨

---

Good luck! Your Corbett Bakers app is going to be amazing on the internet! 🍰✨
