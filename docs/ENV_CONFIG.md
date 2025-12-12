# Environment Variables Configuration

## For Development

No environment variables needed - everything is configured with defaults.

## For Production

Create a `.env` file in the `server/` directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=production

# Database
DATABASE_PATH=./bakery.db

# Admin Credentials (CHANGE THESE!)
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin@123

# CORS Configuration
CORS_ORIGIN=https://yourdomain.com

# Logging
LOG_LEVEL=info
```

## Frontend Configuration

Create a `.env` file in the root directory:

```env
VITE_API_URL=https://api.yourdomain.com
VITE_APP_NAME=Corbett Bakers
```

Then update `src/App.jsx`:

```javascript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
```

## How to Use Environment Variables

### Backend (Node.js)

Update `server/server.js`:

```javascript
import dotenv from 'dotenv';
dotenv.config();

const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Update admin login
app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body;
  const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin@123';
  
  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    res.json({ success: true, token: 'admin-token-' + Date.now() });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});
```

Install dotenv:
```bash
cd server
npm install dotenv
```

### Frontend (Vite)

Create `.env.local` in root directory:

```env
VITE_API_URL=http://localhost:5000/api
```

Create `.env.production` for production:

```env
VITE_API_URL=https://api.yourdomain.com/api
```

Update `src/App.jsx`:

```javascript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
```

## Environment Variables Reference

### Server Variables

| Variable | Default | Description |
|----------|---------|-------------|
| PORT | 5000 | Server port |
| NODE_ENV | development | Environment (development/production) |
| DATABASE_PATH | ./bakery.db | SQLite database file path |
| ADMIN_USERNAME | admin | Admin username for login |
| ADMIN_PASSWORD | admin@123 | Admin password for login |
| CORS_ORIGIN | * | CORS allowed origins |
| LOG_LEVEL | info | Logging level |

### Frontend Variables

| Variable | Default | Description |
|----------|---------|-------------|
| VITE_API_URL | http://localhost:5000/api | Backend API URL |
| VITE_APP_NAME | Corbett Bakers | Application name |

## Security Best Practices

1. **Never commit .env files** - Add to .gitignore
2. **Use strong passwords** - Min 12 characters, mix of upper/lower/numbers/symbols
3. **Change default credentials** - Update ADMIN_USERNAME and ADMIN_PASSWORD
4. **Use HTTPS** - Always use HTTPS in production
5. **Rotate secrets** - Change passwords periodically
6. **Use process.env** - Never hardcode secrets in code

## Example .gitignore

```
# Environment variables
.env
.env.local
.env.*.local

# Database
server/bakery.db
server/bakery.db-wal
server/bakery.db-shm

# Dependencies
node_modules/
server/node_modules/

# Build
dist/
server/dist/

# Logs
logs/
*.log

# IDE
.vscode/
.idea/
*.swp
*.swo
```

## Deployment Examples

### Heroku

Set environment variables:
```bash
heroku config:set ADMIN_USERNAME=yourname
heroku config:set ADMIN_PASSWORD=yourpassword
heroku config:set CORS_ORIGIN=https://yourdomain.com
```

### Railway.app

Set in project settings:
```
PORT=5000
NODE_ENV=production
ADMIN_USERNAME=yourname
ADMIN_PASSWORD=yourpassword
```

### Vercel (Frontend)

Add in project settings → Environment Variables:
```
VITE_API_URL=https://api.yourdomain.com
```

## Using .env in Development

### Create server/.env

```env
PORT=5000
NODE_ENV=development
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin@123
```

### Create .env

```env
VITE_API_URL=http://localhost:5000/api
```

### Run development servers

Both servers will automatically load environment variables.

## Testing Environment Variables

Update `server/server.js` to log configuration:

```javascript
console.log('Configuration:');
console.log('  Port:', process.env.PORT || 5000);
console.log('  Environment:', process.env.NODE_ENV || 'development');
console.log('  Database:', process.env.DATABASE_PATH || './bakery.db');
console.log('  CORS Origin:', process.env.CORS_ORIGIN || '*');
```

And `src/App.jsx` to log API URL:

```javascript
console.log('API URL:', API_URL);
```

Check console logs to verify correct configuration.

## Common Issues

**API URL not updating?**
- Restart dev server after changing .env
- Check VITE_API_URL is set correctly
- Verify no hardcoded URLs in code

**Admin login not working?**
- Check ADMIN_USERNAME and ADMIN_PASSWORD match
- Verify .env file is in server/ directory
- Check server logs for actual values

**CORS errors?**
- Set CORS_ORIGIN to your frontend domain
- Or set to * for development
- Restart server after changing

---

That's it! Your environment variables are now configured.
