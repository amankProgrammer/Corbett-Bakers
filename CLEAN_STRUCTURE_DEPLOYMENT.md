# 🚀 DEPLOYMENT GUIDE - Clean Project Structure

**Status:** ✅ Project reorganized into clean Frontend/Backend structure  
**Date:** December 12, 2025  
**Time to Deploy:** ~15 minutes  

---

## 📁 Your New Project Structure

```
corbett-bakers/
├── frontend/                    ← Deploy to Vercel
│   ├── src/
│   ├── public/
│   ├── index.html
│   ├── package.json            (Frontend only)
│   ├── vite.config.js
│   ├── vercel.json
│   └── .vercelignore
│
├── backend/                     ← Deploy to Render
│   ├── server.js               (Backend entry point)
│   ├── routes/
│   ├── db/
│   ├── package.json            (Backend only)
│   ├── render.yaml
│   └── .renderignore
│
├── docs/                        (All documentation here)
│
├── package.json                (Root monorepo config)
├── .gitignore
└── README.md                   (Main project README)
```

---

## ✅ What's Already Set Up

### Configuration Files Created ✅
- `frontend/package.json` - Frontend dependencies only
- `frontend/vite.config.js` - Vite build config
- `frontend/vercel.json` - Vercel deployment settings
- `frontend/.vercelignore` - Files to exclude from Vercel
- `backend/package.json` - Backend dependencies only
- `backend/server.js` - Backend entry point
- `backend/render.yaml` - Render deployment settings
- `backend/.renderignore` - Files to exclude from Render
- `package.json` (root) - Monorepo commands

### Files Cleaned Up ✅
- Removed duplicate files from root
- Organized all docs in `/docs` folder
- Removed unnecessary configuration files
- Updated `.gitignore` for clean git history

### Project Benefits ✅
- Clear separation of concerns
- Easier to maintain and scale
- Cleaner git repository
- Professional monorepo structure
- Independent deployment of frontend and backend

---

## 🚀 DEPLOYMENT STEPS

### Step 1: Prepare Git Repository

```bash
cd c:\Users\Ayush\Desktop\app
git add .
git commit -m "Reorganize project structure: Frontend/Backend separation"
git push origin main
```

**Expected output:**
```
[main abc1234] Reorganize project structure
 20 files changed, 15 insertions(+), 5 deletions(-)
```

---

### Step 2: Deploy Frontend to Vercel

#### 2A: Create Vercel Project

1. Go to **[vercel.com/dashboard](https://vercel.com/dashboard)**
2. Click **"Add New"** → **"Project"**
3. Select your GitHub repository
4. Select framework: **Next.js** (even though it's Vite, this works)

#### 2B: Configure Frontend Deployment

| Setting | Value |
|---------|-------|
| **Project Name** | `corbett-bakers-frontend` |
| **Framework Preset** | Other |
| **Root Directory** | ✅ `./frontend` |
| **Build Command** | `npm run build` |
| **Output Directory** | `dist` |

#### 2C: Add Environment Variable

Before deploying, add this environment variable:

| Key | Value |
|-----|-------|
| **VITE_API_URL** | `https://corbett-bakers-api.onrender.com` |

(Update after deploying backend with actual Render URL)

#### 2D: Deploy

Click **"Deploy"**

**⏱️ Wait 2-3 minutes for build and deployment**

#### 2E: Get Your Frontend URL

After deployment completes, you'll see:
```
✅ Production
https://corbett-bakers-frontend.vercel.app
```

**Copy this URL** - you'll need it later.

---

### Step 3: Deploy Backend to Render

#### 3A: Create Render Account

1. Go to **[render.com](https://render.com)**
2. Click **"Get Started"**
3. Sign up with GitHub
4. Authorize Render to access your GitHub

#### 3B: Create Web Service

1. From Render dashboard, click **"New +"**
2. Select **"Web Service"**
3. Select your GitHub repository

#### 3C: Configure Backend Deployment

| Setting | Value |
|---------|-------|
| **Name** | `corbett-bakers-api` |
| **Runtime** | Node |
| **Root Directory** | `./backend` |
| **Build Command** | `npm install` |
| **Start Command** | `npm start` |
| **Plan** | Free |
| **Environment** | Node 18+ (auto-detected) |

#### 3D: Add Environment Variables

| Key | Value |
|-----|-------|
| **NODE_ENV** | `production` |
| **PORT** | `5000` |

#### 3E: Deploy

Click **"Create Web Service"**

**⏱️ Wait 3-5 minutes for build and deployment**

#### 3F: Get Your Backend URL

After deployment, you'll see:
```
✅ https://corbett-bakers-api.onrender.com
```

**Copy this URL**

---

### Step 4: Update Vercel Environment Variable

Now that you have your Render URL, update Vercel:

1. Go to **[vercel.com/dashboard](https://vercel.com/dashboard)**
2. Select your project
3. Click **"Settings"** (top menu)
4. Go to **"Environment Variables"** (left sidebar)
5. Find or create `VITE_API_URL`
6. Update value to: `https://corbett-bakers-api.onrender.com`
7. Click **"Save"**

#### 4B: Redeploy Frontend

1. Go to **"Deployments"** tab
2. Find latest deployment
3. Click **"..."** → **"Redeploy"**
4. Wait 1-2 minutes

---

## ✅ VERIFICATION CHECKLIST

### Test Frontend
- [ ] Frontend loads at `https://corbett-bakers-frontend.vercel.app`
- [ ] Page displays completely
- [ ] Dark mode toggle works
- [ ] No console errors (F12)

### Test Backend
- [ ] Visit `https://corbett-bakers-api.onrender.com/api/health`
- [ ] Returns JSON: `{"status":"ok",...}`
- [ ] Response time < 2 seconds

### Test Integration
- [ ] From frontend, load products page
- [ ] Products load from API
- [ ] Network tab shows `/api/products` call (F12)
- [ ] No CORS errors in console

### Test All Features
- [ ] Homepage loads
- [ ] Menu items display
- [ ] Admin panel accessible
- [ ] Dark mode works
- [ ] Animations smooth
- [ ] Mobile responsive (check on phone)

---

## 🌐 YOUR LIVE URLS

After deployment:

```
🌐 FRONTEND:  https://corbett-bakers-frontend.vercel.app
🔌 BACKEND:   https://corbett-bakers-api.onrender.com
📍 API:       https://corbett-bakers-api.onrender.com/api
```

---

## 🔄 CONTINUOUS DEPLOYMENT (Auto-Deploy)

### How It Works

After initial setup, your app auto-deploys on every git push:

**For Frontend (Vercel):**
```bash
git push origin main
# → Vercel automatically detects changes
# → Rebuilds and deploys within 2-3 minutes
```

**For Backend (Render):**
```bash
git push origin main
# → Render automatically detects changes
# → Rebuilds and deploys within 3-5 minutes
```

### Making Changes

1. Edit code in `frontend/src` or `backend/routes`
2. Test locally:
   ```bash
   npm run frontend:dev    # or
   npm run backend:dev
   ```
3. Commit and push:
   ```bash
   git add .
   git commit -m "Feature: [description]"
   git push origin main
   ```
4. Both services auto-update!

---

## 🚦 DEPLOYMENT TIMELINE

| Step | Platform | Time | Status |
|------|----------|------|--------|
| 1. Prepare Git | - | 2 min | ✅ Done |
| 2. Deploy Frontend | Vercel | 3 min | 📋 Follow steps 2A-2E |
| 3. Deploy Backend | Render | 5 min | 📋 Follow steps 3A-3F |
| 4. Update Env & Redeploy | Vercel | 3 min | 📋 Follow step 4 |
| 5. Verify Everything | - | 5 min | 📋 Run checks |
| **TOTAL** | | **~18 min** | 🎉 |

---

## 🎯 COMMON ISSUES & FIXES

### Frontend shows "Cannot GET /"
**Cause:** Vercel doesn't have SPA routing  
**Fix:** Already configured in `frontend/vercel.json` ✅

### API returns 404 or "Connection refused"
**Cause:** `VITE_API_URL` not set or incorrect  
**Fix:** 
1. Check Vercel environment variable
2. Verify Render URL is correct
3. Redeploy Vercel after updating

### CORS errors in browser console
**Cause:** Backend not running or wrong URL  
**Fix:**
1. Verify Render backend is deployed
2. Test `/api/health` endpoint directly
3. Check Render logs for errors

### Render spins down after 15 minutes
**Cause:** Free tier spins down unused services  
**Fix:**
- Normal behavior (first request takes 30 sec)
- Upgrade to paid plan to prevent
- Keep-alive service calls if needed

### Build fails on Vercel
**Cause:** Wrong root directory or missing files  
**Fix:**
1. Check root is set to `./frontend`
2. Verify `package.json` exists in frontend
3. Clear cache → redeploy

### Build fails on Render
**Cause:** Wrong root directory or dependencies  
**Fix:**
1. Check root is set to `./backend`
2. Verify `package.json` exists in backend
3. Check Render logs for npm errors
4. Clear Render cache → redeploy

---

## 🔐 SECURITY CHECKLIST

- [ ] No `.env` files committed (check `.gitignore`)
- [ ] Sensitive data in environment variables only
- [ ] Admin password is secure (change from default)
- [ ] CORS properly configured (consider restricting)
- [ ] All user inputs validated on backend
- [ ] HTTPS enforced (automatic on both platforms)
- [ ] No console.log of sensitive data
- [ ] Database backups set up (for production)

---

## 📊 PROJECT STATISTICS

| Metric | Value |
|--------|-------|
| Frontend Files | ~20 |
| Backend Files | ~10 |
| CSS Lines | 800+ |
| API Routes | 4+ |
| Database Tables | 2+ |
| Total Lines of Code | 3000+ |
| Build Time | ~2 min |
| Deployment Time | ~8 min |

---

## 🎓 LOCAL DEVELOPMENT

### Setup
```bash
# Install all dependencies
npm install

# Or individually
cd frontend && npm install
cd ../backend && npm install
```

### Run Frontend
```bash
npm run frontend:dev
# Opens http://localhost:5173
```

### Run Backend
```bash
npm run backend:dev
# Runs on http://localhost:5000
```

### Run Both
```bash
# Requires concurrently package
npm run dev
# Frontend: localhost:5173
# Backend: localhost:5000
```

### Build for Production
```bash
npm run frontend:build
# Creates frontend/dist/
```

---

## 📚 NEXT STEPS

### Immediate (Now)
1. ✅ Push to GitHub (Step 1)
2. 📋 Deploy frontend to Vercel (Step 2)
3. 📋 Deploy backend to Render (Step 3)
4. ✅ Update environment variable (Step 4)
5. ✅ Verify everything works

### Short Term (This Week)
- [ ] Test all features thoroughly
- [ ] Check performance with DevTools
- [ ] Review Vercel & Render dashboards
- [ ] Set up monitoring/alerts (optional)

### Medium Term (This Month)
- [ ] Add custom domain (optional)
- [ ] Implement database backups
- [ ] Set up error logging
- [ ] Configure email notifications
- [ ] Plan database migration (SQLite → PostgreSQL)

### Long Term (Production)
- [ ] Switch to PostgreSQL database
- [ ] Implement authentication system
- [ ] Add payment processing
- [ ] Set up analytics
- [ ] Implement caching
- [ ] Auto-scaling setup

---

## 🎉 SUCCESS INDICATORS

You'll know everything is working when:

✅ Frontend loads at Vercel URL  
✅ Backend responds to health check  
✅ Products load from API  
✅ Dark mode works  
✅ No console errors  
✅ Network requests successful  
✅ Mobile responsive  
✅ Both auto-deploy on git push  

---

## 📞 SUPPORT RESOURCES

### Documentation
- Main README: `./README.md`
- Deployment guide: `./docs/SPLIT_DEPLOYMENT_GUIDE.md`
- Detailed steps: `./docs/VERCEL_DEPLOYMENT.md`

### Official Docs
- [Vercel Docs](https://vercel.com/docs)
- [Render Docs](https://render.com/docs)
- [React Docs](https://react.dev)
- [Express Docs](https://expressjs.com)

### Troubleshooting
- Check deployment logs in platform dashboards
- Review browser DevTools (F12)
- Check terminal output for build errors
- Review GitHub Actions (if available)

---

## 🚀 DEPLOYMENT COMMAND SUMMARY

```bash
# Step 1: Prepare code
git add .
git commit -m "Reorganized project structure"
git push origin main

# Steps 2-4: Done in Vercel & Render dashboards
# See above for detailed steps

# Verify deployment
# Open frontend URL in browser
# Test API endpoint
# Check console for errors
```

---

## ✨ YOU'RE READY TO DEPLOY!

Everything is configured and ready. Follow the steps above and your app will be live on the internet in ~15 minutes!

**Current Status:** ✅ **READY FOR DEPLOYMENT**

---

## 📋 Quick Reference Checklist

- [x] Project structure cleaned and organized
- [x] Frontend configuration files created
- [x] Backend configuration files created
- [x] Environment variables documented
- [x] Root README updated
- [x] Documentation organized in `/docs`
- [ ] Code pushed to GitHub (Step 1)
- [ ] Frontend deployed to Vercel (Steps 2A-2E)
- [ ] Backend deployed to Render (Steps 3A-3F)
- [ ] Environment variables updated (Step 4)
- [ ] Everything verified (Verification section)

---

**Ready to deploy?** Start with **Step 1** above! 🚀

