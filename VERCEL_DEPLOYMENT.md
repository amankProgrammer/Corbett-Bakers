# Vercel Deployment Guide

## 🚀 Deploy Your App to Vercel

This guide will help you deploy your Corbett Bakers application to Vercel with both the React frontend and Node.js backend.

---

## ✅ Prerequisites

1. **Node.js** installed (v18+)
2. **Git** installed and initialized
3. **GitHub account** (for easy Vercel integration)
4. **Vercel account** (free tier available)

---

## 📋 Step 1: Set Up Git Repository

If you haven't already, initialize a Git repository and push to GitHub:

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: Corbett Bakers App with dark mode"

# Push to GitHub
git remote add origin https://github.com/YOUR_USERNAME/corbett-bakers.git
git branch -M main
git push -u origin main
```

---

## 📝 Step 2: Create Vercel Account

1. Go to [vercel.com](https://vercel.com)
2. Click "Sign Up"
3. Choose "Continue with GitHub" (recommended)
4. Authorize Vercel to access your GitHub account

---

## 🔧 Step 3: Deploy to Vercel

### Option A: Using Vercel Dashboard (Easiest)

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click "Add New" → "Project"
3. Select your GitHub repository (corbett-bakers)
4. Vercel will auto-detect it's a Vite project
5. Click "Deploy"

### Option B: Using Vercel CLI

```bash
# Install Vercel CLI globally
npm install -g vercel

# Login to your Vercel account
vercel login

# Deploy the project
vercel

# For production deployment
vercel --prod
```

---

## ⚙️ Step 4: Configure Environment Variables

### In Vercel Dashboard:

1. Go to your project settings
2. Navigate to "Environment Variables"
3. Add the following variables:

| Variable | Value | Notes |
|----------|-------|-------|
| `VITE_API_URL` | `https://your-vercel-url.vercel.app/api` | Your production API URL |
| `NODE_ENV` | `production` | For production environment |
| `DB_PATH` | `./data/bakery.db` | Database path |

### Or use .env.production file locally:

```bash
VITE_API_URL=https://your-vercel-url.vercel.app/api
```

---

## 🔌 Step 5: Configure API Routes

Vercel uses the `/api` directory for serverless functions. Your routes are already configured:

- `/api/fastfood` → Your fastfood routes
- `/api/products` → Your products routes
- `/api/health` → Health check endpoint

The `vercel.json` file handles routing automatically.

---

## 📱 Step 6: Update Frontend API Calls

Update your API calls in the React app to use the production URL:

```javascript
// In your API calls
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Example fetch
fetch(`${API_URL}/products`)
  .then(res => res.json())
  .then(data => console.log(data));
```

---

## 🗄️ Step 7: Database Setup

### Option A: Use SQLite (Current Setup)
Your SQLite database will be created in the `/data` folder. 

**Note**: SQLite on Vercel is ephemeral (resets on deployment). For production, consider:

### Option B: Use PostgreSQL (Recommended for Production)

1. Sign up for [Neon.tech](https://neon.tech) (free PostgreSQL hosting)
2. Create a database
3. Get the connection string
4. Add to Vercel environment variables:
   ```
   DATABASE_URL=postgresql://user:password@host/database
   ```

### Option C: Use MongoDB (Alternative)

1. Sign up for [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Get the connection string
4. Add to environment variables

---

## 🚀 Step 8: Deploy

Once everything is configured:

```bash
# Option 1: Git push (auto-deploy)
git add .
git commit -m "Ready for Vercel deployment"
git push origin main

# Option 2: Manual CLI deploy
vercel --prod

# Option 3: Using npm script
npm run deploy
```

---

## ✅ Step 9: Verify Deployment

After deployment:

1. **Check Build Status**
   - Go to Vercel dashboard
   - Check "Deployments" tab
   - Ensure build completed successfully

2. **Test Your App**
   - Visit your Vercel URL: `https://your-project-name.vercel.app`
   - Test all pages and features
   - Check dark mode toggle
   - Test API calls to `/api/products`, `/api/fastfood`

3. **Monitor Logs**
   - In Vercel dashboard, check "Logs" tab
   - Monitor for errors in production

---

## 🔍 Troubleshooting

### Build Fails
**Error**: `npm run build` fails
- Check `vite.config.js` configuration
- Ensure all imports are correct
- Check for TypeScript errors

### API Not Working
**Error**: 404 on API calls
- Verify `VITE_API_URL` environment variable is set
- Check `vercel.json` routing rules
- Ensure backend routes are properly configured

### Database Issues
**Error**: Database file not found
- SQLite is ephemeral on Vercel
- Switch to PostgreSQL or MongoDB for production
- Or implement alternative data persistence

### CORS Issues
**Error**: CORS error on API calls
- Check CORS configuration in `api/index.js`
- Verify environment variable `VERCEL_URL` is set
- Add your Vercel domain to CORS whitelist

---

## 📊 Monitoring

### View Deployment Logs
```bash
# Using Vercel CLI
vercel logs

# Or check dashboard
# Project → Settings → Deployments
```

### Monitor Performance
- Vercel dashboard has built-in analytics
- Check "Analytics" tab for insights
- Monitor function execution time

---

## 🔄 Continuous Deployment

Once connected to GitHub, any push to `main` branch automatically:
1. Builds your app
2. Runs tests (if configured)
3. Deploys to preview URL
4. Deploys to production (if you approve)

---

## 📱 Custom Domain

To add a custom domain:

1. Go to Vercel dashboard
2. Project → Settings → Domains
3. Add your domain
4. Follow DNS configuration instructions
5. Wait for SSL certificate (usually 5-10 minutes)

---

## 🎯 Optimization Tips

### Bundle Size
```bash
# Analyze your bundle
npm run build -- --analyze
```

### Environment Variables
- Never commit `.env` files
- Use Vercel dashboard for secrets
- Use different values for preview vs production

### Build Cache
- Vercel caches dependencies
- If issues occur, use "Redeploy" button

---

## 🆘 Getting Help

1. **Vercel Docs**: https://vercel.com/docs
2. **Vite Docs**: https://vitejs.dev
3. **GitHub Issues**: Create issue in your repo
4. **Vercel Support**: Contact support in dashboard

---

## 📋 Deployment Checklist

- [ ] Git repository created and pushed to GitHub
- [ ] Vercel account created
- [ ] Project imported to Vercel
- [ ] Build scripts verified (`npm run build`)
- [ ] Environment variables set
- [ ] Database configured (SQLite/PostgreSQL/MongoDB)
- [ ] API routes tested locally
- [ ] Dark mode works in production
- [ ] Custom domain configured (optional)
- [ ] Monitoring and logs checked
- [ ] All features tested on production

---

## 🎉 Congratulations!

Your Corbett Bakers app is now deployed on Vercel! 

**Production URL**: `https://your-project-name.vercel.app`

**Next Steps**:
- Share your app with others
- Monitor performance
- Update content as needed
- Collect user feedback

---

## 💡 Pro Tips

1. **Preview Deployments**: Every push to non-main branch gets a preview URL
2. **Rollback**: Easy rollback to previous deployments
3. **Collaboration**: Invite team members to manage your project
4. **Webhooks**: Set up webhooks for notifications
5. **Analytics**: Track app performance and usage

---

**Last Updated**: December 2025
**Status**: Ready for Production ✅
