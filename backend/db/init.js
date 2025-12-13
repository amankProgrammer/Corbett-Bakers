import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, 'bakery.db');

export const db = new sqlite3.Database(dbPath, (err) => {
  if (err) console.error('Database connection error:', err);
  else console.log('Connected to SQLite database');
});

export function initializeDB() {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // Products table
      db.run(
        `CREATE TABLE IF NOT EXISTS products (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          description TEXT,
          price INTEGER NOT NULL,
          category TEXT NOT NULL,
          image TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`,
        (err) => {
          if (err) console.error('Error creating products table:', err);
          else console.log('Products table initialized');
        }
      );

      // Fast Food Items table
      db.run(
        `CREATE TABLE IF NOT EXISTS fastfood (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          category TEXT NOT NULL,
          image TEXT,
          price_half INTEGER,
          price_full INTEGER,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`,
        (err) => {
          if (err) console.error('Error creating fastfood table:', err);
          else console.log('FastFood table initialized');
        }
      );

      // Check if tables are empty and seed with default data
      db.get('SELECT COUNT(*) as count FROM products', (err, row) => {
        if (!err && row.count === 0) {
          seedDefaultData();
        }
      });

      resolve();
    });
  });
}

function seedDefaultData() {
  const products = [
    { id: 'cake1', name: 'Chocolate Truffle Cake', description: 'Rich cocoa layers with ganache', price: 799, category: 'Cakes', image: '/images/cake_1.jpg' },
    { id: 'cake2', name: 'Red Velvet Cake', description: 'Cream cheese frosting, classic favorite', price: 899, category: 'Cakes', image: '/images/cake_2.jpg' },
    { id: 'pastry1', name: 'Strawberry Pastry', description: 'Light sponge, fresh berries', price: 129, category: 'Pastries', image: '/images/cake_3.jpg' },
    { id: 'cookie1', name: 'Choco Chip Cookies', description: 'Crispy edges, gooey center', price: 99, category: 'Cookies', image: '/images/cake_4.jpg' },
    { id: 'cupcake1', name: 'Vanilla Cupcake', description: 'Buttercream swirl, sprinkles', price: 79, category: 'Cupcakes', image: '/images/cake_5.jpg' },
  ];

  const fastFood = [
    { id: 'ff1', name: 'Steam Momos (Veg.)', category: 'Momos', image: 'https://images.weserv.nl/?url=loremflickr.com/600/600/dumpling', price_half: 30, price_full: 50 },
    { id: 'ff8', name: 'Veg Chowmein', category: 'Chowmein', image: 'https://images.weserv.nl/?url=loremflickr.com/600/600/noodles', price_half: 30, price_full: 50 },
  ];

  products.forEach(p => {
    db.run(
      'INSERT INTO products (id, name, description, price, category, image) VALUES (?, ?, ?, ?, ?, ?)',
      [p.id, p.name, p.description, p.price, p.category, p.image],
      (err) => {
        if (err) console.error('Error inserting product:', err);
      }
    );
  });

  fastFood.forEach(f => {
    db.run(
      'INSERT INTO fastfood (id, name, category, image, price_half, price_full) VALUES (?, ?, ?, ?, ?, ?)',
      [f.id, f.name, f.category, f.image, f.price_half, f.price_full],
      (err) => {
        if (err) console.error('Error inserting fastfood:', err);
      }
    );
  });
}

export function runQuery(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

export function runUpdate(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) reject(err);
      else resolve({ lastID: this.lastID, changes: this.changes });
    });
  });
}
