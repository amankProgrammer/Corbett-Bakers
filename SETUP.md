# Corbett Bakers - Complete Setup Guide

## Features Implemented

✅ **Mobile-Friendly Design** - Fully responsive UI optimized for all devices
✅ **Admin Panel** - Complete CRUD interface for managing items
✅ **Backend API** - Node.js/Express with SQLite database
✅ **Authentication** - Admin login system
✅ **Product Management** - Add, edit, delete products with details
✅ **Fast Food Management** - Manage momos, noodles, and quick items with half/full pricing

---

## Installation & Setup

### 1. Install Frontend Dependencies
```bash
npm install
```

### 2. Install Backend Dependencies
```bash
cd server
npm install
cd ..
```

### 3. Start the Backend Server
Open a new terminal and run:
```bash
cd server
npm run dev
```
The backend will run on `http://localhost:5000`

### 4. Start the Frontend (Development)
In the original terminal, run:
```bash
npm run dev
```
The app will run on `http://localhost:5173` (or another port if 5173 is busy)

---

## Usage

### Accessing the Admin Panel
1. Navigate to `http://localhost:5173/#/admin`
2. **Default Credentials:**
   - Username: `admin`
   - Password: `admin@123`

### Admin Features

#### Products Tab
- **Add Product**: Fill in name, category, price, image URL, and description
- **Edit Product**: Click "Edit" on any product card
- **Delete Product**: Click "Delete" to remove a product
- Fields: Name, Category, Price, Image URL, Description

#### Fast Food Tab
- **Add Item**: Enter name, category, image URL, and pricing
- **Edit Item**: Modify existing items
- **Delete Item**: Remove items
- Fields: Name, Category, Half Price, Full Price, Image URL

---

## Project Structure

```
app/
├── src/
│   ├── App.jsx              # Main React component with all pages
│   ├── App.css              # Styling
│   ├── index.css            # Global styles (MOBILE RESPONSIVE)
│   ├── main.jsx
│   └── index.css
├── server/
│   ├── server.js            # Express server
│   ├── package.json         # Backend dependencies
│   ├── db/
│   │   └── init.js          # SQLite database setup
│   └── routes/
│       ├── products.js      # Product API endpoints
│       └── fastfood.js      # Fast Food API endpoints
├── public/
│   └── images/              # Product images
├── package.json
├── vite.config.js
└── eslint.config.js
```

---

## API Endpoints

### Products API
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Fast Food API
- `GET /api/fastfood` - Get all fast food items
- `GET /api/fastfood/:id` - Get single item
- `POST /api/fastfood` - Create item
- `PUT /api/fastfood/:id` - Update item
- `DELETE /api/fastfood/:id` - Delete item

### Admin API
- `POST /api/admin/login` - Admin authentication

---

## Mobile Responsive Features

The app is now fully mobile-friendly with:
- ✅ Responsive grid layouts (4 columns → 3 → 2 → 1 based on screen size)
- ✅ Touch-friendly buttons and spacing
- ✅ Mobile-optimized navigation
- ✅ Responsive header and footer
- ✅ Mobile drawer for shopping cart
- ✅ Optimized form layouts for mobile
- ✅ Proper touch targets (44px minimum)
- ✅ Readable font sizes on all devices

### Breakpoints
- **Desktop**: > 1024px (4 columns)
- **Tablet**: 768px - 1024px (3 columns, 2 columns)
- **Mobile**: < 768px (2 columns, 1 column)
- **Small Mobile**: < 480px (1 column)

---

## Database

The backend uses **SQLite** with two main tables:

### Products Table
```sql
CREATE TABLE products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price INTEGER NOT NULL,
  category TEXT NOT NULL,
  image TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
```

### Fast Food Table
```sql
CREATE TABLE fastfood (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  image TEXT,
  price_half INTEGER,
  price_full INTEGER,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
```

---

## Customization

### Change Admin Credentials
Edit `server/server.js` line ~55:
```javascript
app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body;
  if (username === 'YOUR_USERNAME' && password === 'YOUR_PASSWORD') {
    // ...
  }
});
```

### Change Backend Port
Edit `server/server.js` line ~4:
```javascript
const PORT = process.env.PORT || 5000; // Change 5000 to desired port
```

Also update `src/App.jsx` line ~4:
```javascript
const API_URL = 'http://localhost:5000/api' // Update port here too
```

### Add More Features
The app is built with React and uses local state management. Easy to extend with:
- Additional product categories
- Order management system
- Inventory tracking
- User authentication for customers
- Payment integration (Razorpay/Stripe)

---

## Troubleshooting

### Backend won't connect
1. Ensure backend is running on `http://localhost:5000`
2. Check if port 5000 is available
3. Verify CORS is enabled in server.js (it is by default)

### Admin login fails
- Check credentials: `admin` / `admin@123`
- Ensure backend server is running
- Check browser console for errors

### Images not loading
- Use absolute URLs (https://...)
- Or place images in `public/images/` folder
- Reference as `/images/filename.jpg`

### Database errors
- Backend creates `server/bakery.db` automatically
- If errors occur, delete `bakery.db` and restart server
- Server will re-create the database with seed data

---

## Production Deployment

### Frontend (Vite)
```bash
npm run build
```
Output goes to `dist/` folder. Deploy to Vercel, Netlify, or any static host.

### Backend (Node.js)
Deploy the `server/` folder to:
- Heroku
- Railway
- Render
- AWS EC2
- DigitalOcean

Update `API_URL` in `src/App.jsx` to your production backend URL.

---

## Support

For issues or questions, check:
1. Browser console for JavaScript errors
2. Network tab for API call failures
3. Backend logs in terminal
4. Make sure both frontend and backend are running

Happy Baking! 🍰
