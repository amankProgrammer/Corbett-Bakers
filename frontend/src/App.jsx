import { useEffect, useMemo, useState } from 'react'
import './index.css'

// --- CONSTANTS & CONFIG ---
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000'
const PAGES = { home: 'home', menu: 'menu', order: 'order', gallery: 'gallery', about: 'about', contact: 'contact', admin: 'admin' }

// Build gallery from local images placed in public/images
const GALLERY_IMAGES = Array.from({ length: 16 }, (_, i) => `/images/cake_${i+1}.jpg`)

// --- HELPERS ---

// Helper to convert file to Base64 string for DB storage
const convertToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onload = () => resolve(fileReader.result);
    fileReader.onerror = (error) => reject(error);
  });
};

// --- COMPONENT: PRODUCT DETAILS MODAL ---
function ProductDetailsModal({ product, onClose, onAdd }) {
  if (!product) return null;

  const hasHalf = product.prices && typeof product.prices.half === 'number';
  const hasFull = product.prices && typeof product.prices.full === 'number';

  return (
    <div className="drawer-backdrop" onClick={onClose} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 3000 }}>
      <div 
        className="card" 
        style={{ width: '90%', maxWidth: '800px', maxHeight: '90vh', overflowY: 'auto', background: '#fff', position: 'relative', cursor: 'default' }}
        onClick={e => e.stopPropagation()} 
      >
        <button 
          onClick={onClose}
          style={{ position: 'absolute', top: '15px', right: '20px', background: 'rgba(0,0,0,0.5)', color:'white', border: 'none', borderRadius:'50%', width:'40px', height:'40px', fontSize: '1.5rem', cursor: 'pointer', zIndex: 10, display:'flex', alignItems:'center', justifyContent:'center' }}
        >
          ×
        </button>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0', padding: '0' }}>
           {/* Modal Image - Large */}
           <div style={{ width: '100%', height: '350px', backgroundColor: '#f9f9f9' }}>
             <img 
               src={product.image} 
               alt={product.name} 
               style={{ width: '100%', height: '100%', objectFit: 'contain' }}
               onError={(e) => e.target.src = 'https://placehold.co/800x600?text=No+Image'}
             />
           </div>

           {/* Modal Content */}
           <div style={{ padding: '30px' }}>
             <div className="chip" style={{ marginBottom: '10px' }}>{product.category}</div>
             <h2 className="card-title" style={{ fontSize: '1.8rem', marginBottom: '10px' }}>{product.name}</h2>
             
             {/* Price Display */}
             <div style={{ fontSize: '1.4rem', fontWeight: 'bold', color: '#D7A86E', marginBottom: '20px' }}>
                {product.price ? `₹ ${product.price}` : ''}
                {hasHalf && `Half: ₹${product.prices.half}  `} 
                {hasFull && ` • Full: ₹${product.prices.full}`}
             </div>

             <h4 style={{ marginBottom: '8px' }}>Description</h4>
             <p style={{ lineHeight: '1.6', color: '#555', marginBottom: '30px' }}>
               {product.description || product.desc || "No description available for this item."}
             </p>

             {/* Action Buttons */}
             <div className="card-actions">
                {product.price && (
                   <button className="btn" onClick={() => { onAdd(product); onClose(); }}>Add to Cart (₹ {product.price})</button>
                )}
                
                {hasHalf && (
                  <button className="btn outline" onClick={()=> { onAdd({ ...product, name: product.name + ' (Half)', price: product.prices.half }); onClose(); }}>
                    Add Half (₹ {product.prices.half})
                  </button>
                )}
                {hasFull && (
                  <button className="btn" onClick={()=> { onAdd({ ...product, name: product.name + ' (Full)', price: product.prices.full }); onClose(); }}>
                    Add Full (₹ {product.prices.full})
                  </button>
                )}
             </div>
           </div>
        </div>
      </div>
    </div>
  )
}

// --- SHARED COMPONENTS ---

function Gallery() {
  const [selectedImage, setSelectedImage] = useState(null)
  return (
    <main className="section">
      <div className="container">
        <div className="section-title">Our Creations</div>
        <p className="muted" style={{ marginTop: '-10px', marginBottom: '20px' }}>
          A glimpse into our kitchen and happy customers.
        </p>
        <div className="grid">
          {GALLERY_IMAGES.map((src, i) => (
            <div className="card" key={i} onClick={() => setSelectedImage(src)} style={{ cursor: 'pointer' }}>
              <div className="card-image">
                <img src={src} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover', aspectRatio: '1/1' }} 
                     onError={(e) => e.target.src = 'https://placehold.co/600x600/fde2e4/6b4f3b?text=Delicious'} />
              </div>
            </div>
          ))}
        </div>
        {selectedImage && (
          <div className="lightbox-overlay" onClick={() => setSelectedImage(null)} style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0,0,0,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000, cursor: 'zoom-out' }}>
             <button onClick={() => setSelectedImage(null)} style={{ position: 'absolute', top: '20px', right: '30px', background: 'transparent', border: 'none', color: '#fff', fontSize: '2rem', cursor: 'pointer' }}>×</button>
            <img src={selectedImage} style={{ maxWidth: '90%', maxHeight: '90%', borderRadius: '8px' }} onClick={(e) => e.stopPropagation()} />
          </div>
        )}
      </div>
    </main>
  )
}

function useHashRoute(defaultPage = PAGES.home) {
  const [page, setPage] = useState(() => (location.hash?.replace('#/', '') || defaultPage))
  useEffect(() => {
    const onHash = () => setPage(location.hash.replace('#/', '') || defaultPage)
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [defaultPage])
  const navigate = (to) => { location.hash = `/${to}` }
  return { page, navigate }
}

function Header({ navigate, page, toggleDark, cartCount, onOpenCart }) {
  return (
    <header className="header">
      <div className="container header-inner">
        <div className="brand" onClick={() => navigate(PAGES.home)} style={{ cursor: 'pointer' }}>
          <div className="brand-row">
            <svg className="brand-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path d="M4 14c0-3 4-4 8-4s8 1 8 4-4 6-8 6-8-3-8-6Z" fill="#D7A86E"/>
              <path d="M12 4c2 0 3 1 3 2s-1 2-3 2-3-1-3-2 1-2 3-2Z" fill="#F18FB0"/>
              <circle cx="16.5" cy="9.5" r="1.2" fill="#F7C7D8"/>
              <circle cx="9" cy="9" r="1" fill="#F7C7D8"/>
            </svg>
            <div>Corbett Bakers <small>Homemade happiness</small></div>
          </div>
        </div>
        <nav className="nav">
          <a href="#/home" onClick={(e)=>{e.preventDefault();navigate(PAGES.home)}} aria-current={page===PAGES.home}>Home</a>
          <a href="#/menu" onClick={(e)=>{e.preventDefault();navigate(PAGES.menu)}}>Menu</a>
          <a href="#/gallery" onClick={(e)=>{e.preventDefault();navigate(PAGES.gallery)}}>Gallery</a>
          <a href="#/order" onClick={(e)=>{e.preventDefault();navigate(PAGES.order)}}>Order</a>
          <a href="#/about" onClick={(e)=>{e.preventDefault();navigate(PAGES.about)}}>About</a>
          <a href="#/contact" onClick={(e)=>{e.preventDefault();navigate(PAGES.contact)}}>Contact</a>
          <button className="btn outline" onClick={toggleDark} title="Toggle dark mode">Dark/Light</button>
          <button className="btn outline" onClick={onOpenCart} title="View cart">Cart ({cartCount})</button>
        </nav>
      </div>
    </header>
  )
}

function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div>
          <h4>Corbett Bakers</h4>
          <p className="small">Baked with Love, Served Fresh. Homemade happiness in every bite.</p>
          <div className="small">📍 Bannakhera, Uttarakhand • ☎️ +91 99999 99999</div>
        </div>
        <div>
          <h4>Hours</h4>
          <div className="small">Mon–Sun: 8:00am – 9:00pm</div>
          <div className="small">Fresh bakes daily</div>
        </div>
      </div>
    </footer>
  )
}

// --- API HELPERS ---
async function fetchProductsFromAPI() {
  try { return await (await fetch(`${API_URL}/api/products`)).json() } catch { return [] }
}
async function fetchFastFoodFromAPI() {
  try { return await (await fetch(`${API_URL}/api/fastfood`)).json() } catch { return [] }
}

// --- CARDS WITH FIXED DIMENSIONS ---

function FastFoodCard({ item, onView }) {
  const hasHalf = item.prices && typeof item.prices.half === 'number'
  return (
    <div className="card product-card" onClick={() => onView(item)} style={{ cursor: 'pointer' }}>
      <div className="card-image" style={{ height: '200px', width: '100%', overflow: 'hidden' }}>
        <img 
            src={item.image} 
            alt={item.name} 
            loading="lazy" 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onError={(e)=>e.target.src='https://placehold.co/600x400?text=No+Image'}
        />
      </div>
      <div className="card-body">
        <div className="chip">{item.category}</div>
        <div className="card-title">{item.name}</div>
        <div className="card-desc" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: '#888' }}>
            Freshly made to order...
        </div>
        <div className="card-price" style={{ marginTop: 'auto' }}>
            {hasHalf ? `From ₹ ${item.prices.half}` : `₹ ${item.prices.full}`}
        </div>
        <button className="btn outline mt-2" style={{ width: '100%' }}>View Options</button>
      </div>
    </div>
  )
}

function ProductCard({ item, onView }) {
  return (
    <div className="card product-card" onClick={() => onView(item)} style={{ cursor: 'pointer' }}>
      <div className="card-image" style={{ height: '200px', width: '100%', overflow: 'hidden' }}>
         <img 
            src={item.image} 
            alt={item.name} 
            loading="lazy" 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onError={(e)=>e.target.src='https://placehold.co/600x400?text=No+Image'}
         />
      </div>
      <div className="card-body" style={{ display: 'flex', flexDirection: 'column' }}>
        <div className="chip">{item.category}</div>
        <div className="card-title">{item.name}</div>
        <div className="card-desc" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginBottom: '10px' }}>
            {item.description || item.desc}
        </div>
        <div className="card-price" style={{ marginTop: 'auto' }}>₹ {item.price}</div>
        <button className="btn outline mt-2" style={{ width: '100%' }}>View Details</button>
      </div>
    </div>
  )
}

// --- PAGES ---

function Home({ navigate, onViewProduct }) {
  const [products, setProducts] = useState([])
  const [fastFood, setFastFood] = useState([])
  const [loading, setLoading] = useState(true)

  const slides = useMemo(() => [
    { src: '/images/shop.jpg', caption: 'Welcome to Corbett Bakers' },
    { src: '/images/signature_cake.jpg', caption: 'Signature Choco Cake' },
    { src: '/images/pastry.jpg', caption: 'Fresh Strawberry Pastries' },
  ], [])
  const [index, setIndex] = useState(0)
  
  useEffect(() => { 
    const t = setInterval(()=> setIndex((i)=> (i+1)%slides.length), 3500)
    return ()=> clearInterval(t) 
  }, [slides.length])

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      const [p, f] = await Promise.all([fetchProductsFromAPI(), fetchFastFoodFromAPI()])
      setProducts(p); setFastFood(f); setLoading(false)
    }
    loadData()
  }, [])

  return (
    <main>
      <section className="hero">
        <div className="container hero-inner">
          <div>
            <h1>Baked with Love</h1>
            <p>Warm, cozy, and inviting bakes for every sweet moment.</p>
            <div className="hero-actions">
              <button className="btn" onClick={()=>navigate(PAGES.order)}>Order Now</button>
              <button className="btn outline" onClick={()=>navigate(PAGES.menu)}>View Menu</button>
            </div>
          </div>
          <div className="carousel" style={{ position: 'relative', overflow: 'hidden', width: '100%', height: '400px', borderRadius: '16px' }}>
              <div className="carousel-track" style={{ display: 'flex', height: '100%', transition: 'transform 0.5s ease-in-out', transform: `translateX(-${index*100}%)` }}>
                {slides.map((s, i)=> (
                  <div className="carousel-slide" key={i} style={{ minWidth: '100%', height: '100%', position: 'relative' }}>
                    <div className="hero-card" style={{ width: '100%', height: '100%' }}>
                      <img src={s.src} alt={s.caption} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} onError={(e)=>e.target.src='https://placehold.co/800x400?text=Corbett+Bakers'} />
                      <div className="caption" style={{ position: 'absolute', bottom: '20px', left: '20px', background: 'rgba(255,255,255,0.9)', padding: '8px 16px', borderRadius: '8px', fontSize: '0.9rem', fontWeight: 'bold' }}>{s.caption}</div>
                    </div>
                  </div>
                ))}
              </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-title">Best Sellers</div>
          {loading && <div className="text-center">Loading...</div>}
          <div className="grid">
            {!loading && products.slice(0,4).map((p)=> <ProductCard key={p.id} item={p} onView={onViewProduct} />)}
          </div>
        </div>
      </section>

      <section className="section accent">
        <div className="container">
          <div className="section-title">Birthday Specials</div>
          <div className="grid">
            {!loading && products.filter(p=> p.category==='Birthday').slice(0, 4).map((p)=> <ProductCard key={p.id} item={p} onView={onViewProduct} />)}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-title">Quick Bites</div>
          <div className="grid">
            {!loading && fastFood.slice(0, 8).map((ff)=> <FastFoodCard key={ff.id} item={ff} onView={onViewProduct} />)}
          </div>
        </div>
      </section>
    </main>
  )
}

function Menu({ onViewProduct, onAdd }) {
  const [products, setProducts] = useState([])
  const [fastFood, setFastFood] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState('All')

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const [p, f] = await Promise.all([fetchProductsFromAPI(), fetchFastFoodFromAPI()])
      setProducts(p); setFastFood(f); setLoading(false)
    }
    load()
  }, [])

  const allCategories = useMemo(() => ['All', ...new Set([...products.map(p=>p.category), ...fastFood.map(f=>f.category)])], [products, fastFood])
  
  const filteredProducts = products.filter(p => (filterCategory==='All' || p.category===filterCategory) && p.name.toLowerCase().includes(searchTerm.toLowerCase()))
  const filteredFastFood = fastFood.filter(f => (filterCategory==='All' || f.category===filterCategory) && f.name.toLowerCase().includes(searchTerm.toLowerCase()))

  return (
    <main className="section menu-page">
      <div className="container">
        <div className="menu-header"><div className="section-title fancy-title neon-title">Our Menu</div></div>
        
        <div className="menu-filters mb-3 flex gap-2" style={{ alignItems: 'flex-end' }}>
            <div style={{flex:1}}>
                <label>Search</label>
                <input className="input" placeholder="Search..." value={searchTerm} onChange={e=>setSearchTerm(e.target.value)} />
            </div>
            <div style={{flex:1}}>
                <label>Category</label>
                <select className="input" value={filterCategory} onChange={e=>setFilterCategory(e.target.value)}>
                    {allCategories.map(c=><option key={c} value={c}>{c}</option>)}
                </select>
            </div>
        </div>

        {loading && <div className="text-center">Loading menu...</div>}

        {!loading && (
          <div className="grid">
            {filteredProducts.map(p => <ProductCard key={p.id} item={p} onView={onViewProduct} />)}
            {filteredFastFood.map(f => <FastFoodCard key={f.id} item={f} onView={onViewProduct} />)}
            {filteredProducts.length === 0 && filteredFastFood.length === 0 && <div style={{gridColumn:'1/-1', textAlign:'center'}}>No items found.</div>}
          </div>
        )}
      </div>
    </main>
  )
}

// --- ADMIN PAGES ---

function AdminLogin({ onLogin }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const response = await fetch(`${API_URL}/api/admin/login`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username, password })
      })
      if (!response.ok) throw new Error('Invalid credentials')
      const data = await response.json()
      sessionStorage.setItem('adminAuth', 'true')
      sessionStorage.setItem('adminToken', data.token)
      onLogin()
    } catch (err) { setError('Invalid username or password') } finally { setLoading(false) }
  }

  return (
    <main className="section"><div className="container" style={{ maxWidth: '480px' }}>
        <div className="section-title">Admin Login</div>
        {error && <div className="card mb-3"><div className="card-body" style={{ color: 'crimson' }}>{error}</div></div>}
        <form onSubmit={submit}>
          <input className="input mb-2" value={username} onChange={e => setUsername(e.target.value)} placeholder="admin" disabled={loading} />
          <input className="input mb-2" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="admin@123" disabled={loading} />
          <button className="btn" type="submit" disabled={loading}>{loading ? 'Logging in...' : 'Login'}</button>
        </form>
    </div></main>
  )
}

function AdminDashboard() {
  const [tab, setTab] = useState('products')
  const [prodList, setProdList] = useState([])
  const [ffList, setFfList] = useState([])
  const [editing, setEditing] = useState(null)
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')

  const resetEditing = () => setEditing(null)
  const [pForm, setPForm] = useState({ id: '', name: '', description: '', price: '', category: '', image: '' })
  const [fForm, setFForm] = useState({ id: '', name: '', category: '', image: '', half: '', full: '' })

  useEffect(() => { fetchProducts(); fetchFastFood(); }, [])

  const fetchProducts = async () => {
    try { setProdList(await (await fetch(`${API_URL}/api/products`)).json()) } catch (err) { setMessage('Error loading products') } finally { setLoading(false) }
  }
  const fetchFastFood = async () => {
    try { setFfList(await (await fetch(`${API_URL}/api/fastfood`)).json()) } catch (err) { console.error(err) }
  }

  const startEditProduct = (p) => {
    setTab('products'); setEditing(p.id);
    setPForm({ id: p.id, name: p.name, description: p.description || '', price: String(p.price), category: p.category, image: p.image || '' })
  }
  const startEditFastFood = (f) => {
    setTab('fastfood'); setEditing(f.id);
    setFForm({ id: f.id, name: f.name, category: f.category, image: f.image || '', half: String(f.prices?.half || ''), full: String(f.prices?.full || '') })
  }

  const handleFileUpload = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { alert("⚠️ File too large! Max 2MB."); e.target.value = null; return; }
    try {
      const base64 = await convertToBase64(file);
      if (type === 'product') setPForm({ ...pForm, image: base64 });
      else setFForm({ ...fForm, image: base64 });
    } catch (err) { alert("Error processing image"); }
  };

  const saveProduct = async () => {
    try {
      setLoading(true); const id = editing || ('p' + Date.now());
      const method = editing ? 'PUT' : 'POST';
      const url = editing ? `${API_URL}/api/products/${id}` : `${API_URL}/api/products`;
      await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...pForm, id, price: Number(pForm.price) }) });
      await fetchProducts(); resetEditing(); setPForm({ id: '', name: '', description: '', price: '', category: '', image: '' });
      setMessage('Saved successfully');
    } catch (err) { setMessage('Error saving') } finally { setLoading(false) }
  }

  const saveFastFood = async () => {
    try {
      setLoading(true); const id = editing || ('ff' + Date.now());
      const method = editing ? 'PUT' : 'POST';
      const url = editing ? `${API_URL}/api/fastfood/${id}` : `${API_URL}/api/fastfood`;
      await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...fForm, id, prices: { half: Number(fForm.half), full: Number(fForm.full) } }) });
      await fetchFastFood(); resetEditing(); setFForm({ id: '', name: '', category: '', image: '', half: '', full: '' });
      setMessage('Saved successfully');
    } catch (err) { setMessage('Error saving') } finally { setLoading(false) }
  }

  const deleteItem = async (id, type) => {
      if (!confirm('Delete?')) return;
      setLoading(true);
      await fetch(`${API_URL}/api/${type}/${id}`, { method: 'DELETE' });
      if(type==='products') fetchProducts(); else fetchFastFood();
      setLoading(false);
  }

  const logout = () => { sessionStorage.removeItem('adminAuth'); sessionStorage.removeItem('adminToken'); window.location.hash = `#/${PAGES.home}`; }

  if (loading && prodList.length === 0 && ffList.length === 0) return <main className="section"><div className="container">Loading dashboard...</div></main>

  return (
    <main className="section"><div className="container">
        <div className="section-title">Admin Dashboard</div>
        {message && <div className="card mb-3"><div className="card-body">{message}</div></div>}
        <div className="flex gap-2 mb-3">
          <button className={`btn ${tab === 'products' ? '' : 'outline'}`} onClick={() => setTab('products')}>Products</button>
          <button className={`btn ${tab === 'fastfood' ? '' : 'outline'}`} onClick={() => setTab('fastfood')}>Fast Food</button>
          <button className="btn outline" onClick={logout}>Logout</button>
        </div>

        {tab === 'products' && (
          <div className="grid">
            <div className="card" style={{ gridColumn: '1/-1' }}>
              <div className="card-body">
                <h4>{editing ? 'Edit' : 'Add'} Product</h4>
                <div className="form-row">
                  <input className="input" placeholder="Name" value={pForm.name} onChange={e => setPForm({ ...pForm, name: e.target.value })} />
                  <input className="input" placeholder="Category" value={pForm.category} onChange={e => setPForm({ ...pForm, category: e.target.value })} />
                </div>
                <div className="form-row mt-2">
                  <input className="input" type="number" placeholder="Price" value={pForm.price} onChange={e => setPForm({ ...pForm, price: e.target.value })} />
                  <div>
                    <input type="file" accept="image/*" className="input" onChange={(e) => handleFileUpload(e, 'product')} />
                    {pForm.image && <img src={pForm.image} alt="Preview" style={{ height: '50px', marginTop: '5px' }} />}
                  </div>
                </div>
                <textarea className="input mt-2" placeholder="Description" value={pForm.description} onChange={e => setPForm({ ...pForm, description: e.target.value })} />
                <div className="flex gap-2 mt-2">
                  <button className="btn" onClick={saveProduct} disabled={loading}>Save</button>
                  {editing && <button className="btn outline" onClick={resetEditing}>Cancel</button>}
                </div>
              </div>
            </div>
            {prodList.map(p => (
              <div className="card" key={p.id}>
                <div className="card-body">
                  <div className="card-title">{p.name}</div>
                  <div className="card-desc">₹ {p.price}</div>
                  <div className="flex gap-2 mt-2">
                    <button className="btn small" onClick={() => startEditProduct(p)}>Edit</button>
                    <button className="btn small outline" onClick={() => deleteItem(p.id, 'products')}>Delete</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === 'fastfood' && (
          <div className="grid">
             <div className="card" style={{ gridColumn: '1/-1' }}>
              <div className="card-body">
                <h4>{editing ? 'Edit' : 'Add'} Fast Food</h4>
                <div className="form-row">
                  <input className="input" placeholder="Name" value={fForm.name} onChange={e => setFForm({ ...fForm, name: e.target.value })} />
                  <input className="input" placeholder="Category" value={fForm.category} onChange={e => setFForm({ ...fForm, category: e.target.value })} />
                </div>
                <div className="form-row mt-2">
                  <input className="input" type="number" placeholder="Half Price" value={fForm.half} onChange={e => setFForm({ ...fForm, half: e.target.value })} />
                  <input className="input" type="number" placeholder="Full Price" value={fForm.full} onChange={e => setFForm({ ...fForm, full: e.target.value })} />
                </div>
                <div className="mt-2">
                    <input type="file" accept="image/*" className="input" onChange={(e) => handleFileUpload(e, 'fastfood')} />
                    {fForm.image && <img src={fForm.image} alt="Preview" style={{ height: '50px', marginTop: '5px' }} />}
                </div>
                <div className="flex gap-2 mt-2">
                  <button className="btn" onClick={saveFastFood} disabled={loading}>Save</button>
                  {editing && <button className="btn outline" onClick={resetEditing}>Cancel</button>}
                </div>
              </div>
            </div>
            {ffList.map(f => (
              <div className="card" key={f.id}>
                <div className="card-body">
                  <div className="card-title">{f.name}</div>
                  <div className="card-desc">{f.prices?.half ? `Half: ${f.prices.half}` : ''} {f.prices?.full ? `Full: ${f.prices.full}` : ''}</div>
                  <div className="flex gap-2 mt-2">
                    <button className="btn small" onClick={() => startEditFastFood(f)}>Edit</button>
                    <button className="btn small outline" onClick={() => deleteItem(f.id, 'fastfood')}>Delete</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
    </div></main>
  )
}

function Admin() {
  const [authed, setAuthed] = useState(sessionStorage.getItem('adminAuth') === 'true')
  if (!authed) return <AdminLogin onLogin={() => setAuthed(true)} />
  return <AdminDashboard />
}

function Order({ cart }) {
  const [form, setForm] = useState({ name:'', contact:'', date:'', items:'', notes:'' })
  const WHATSAPP_NUMBER = '919999999999'
  const onSubmit = (e)=> {
    e.preventDefault()
    const orderItems = form.items || cart.map(i=> `${i.name} (₹${i.price})`).join(', ')
    const text = encodeURIComponent(`Order Request\nName: ${form.name}\nContact: ${form.contact}\nDate: ${form.date}\nItems: ${orderItems}\nNotes: ${form.notes}`)
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`
    window.open(url, '_blank')
  }
  return (
    <main className="section"><div className="container">
        <div className="section-title">Order</div>
        <form onSubmit={onSubmit}>
          <div className="form-row">
            <input className="input" placeholder="Name" value={form.name} onChange={e=>setForm({...form, name:e.target.value})} required />
            <input className="input" placeholder="Contact" value={form.contact} onChange={e=>setForm({...form, contact:e.target.value})} required />
          </div>
          <div className="form-row mt-2">
            <input type="date" className="input" value={form.date} onChange={e=>setForm({...form, date:e.target.value})} required />
            <input className="input" placeholder="Items (leave blank if using cart)" value={form.items} onChange={e=>setForm({...form, items:e.target.value})} />
          </div>
          <textarea className="input mt-2" placeholder="Notes" value={form.notes} onChange={e=>setForm({...form, notes:e.target.value})} />
          <button className="btn mt-2">Send on WhatsApp</button>
        </form>
    </div></main>
  )
}

function About() {
  return (
    <main className="section"><div className="container">
        <div className="section-title">About Us</div>
        <p>We believe in homemade happiness. Our bakery started with a simple mission: craft warm, cozy, and inviting bakes that bring people together.</p>
        <div className="grid mt-3">
             <div className="card"><img src="https://placehold.co/600x400/fff7eb/6b4f3b?text=Team" /></div>
             <div className="card"><img src="https://placehold.co/600x400/fff7eb/6b4f3b?text=Kitchen" /></div>
        </div>
    </div></main>
  )
}

function Contact() {
  return (
    <main className="section"><div className="container">
        <div className="section-title">Contact Us</div>
        <p>📍 Bannakhera, Uttarakhand <br/> ☎️ +91 99999 99999</p>
        <div className="hero-card mt-3">
            <iframe title="Map" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3431.8829893200686!2d79.126!3d29.397!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sRamnagar!5e0!3m2!1sen!2sin!4v1700000000000" width="100%" height="320" style={{ border: 0 }} allowFullScreen="" loading="lazy"></iframe>
        </div>
    </div></main>
  )
}

// --- MAIN APP ---

function App() {
  const { page, navigate } = useHashRoute(PAGES.home)
  const [cart, setCart] = useState([])
  const [cartOpen, setCartOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [toast, setToast] = useState(null)
  const [dark, setDark] = useState(false)

  useEffect(()=> { document.documentElement.classList.toggle('dark', dark) }, [dark])

  const onAdd = (item) => {
      setCart(c => [...c, item]);
      setToast(`Added ${item.name}`);
      setTimeout(()=>setToast(null), 2000);
  }

  return (
    <>
      <Header navigate={navigate} page={page} toggleDark={()=>setDark(!dark)} cartCount={cart.length} onOpenCart={()=>setCartOpen(true)} />
      
      {page===PAGES.home && <Home navigate={navigate} onViewProduct={setSelectedProduct} />}
      {page===PAGES.menu && <Menu onViewProduct={setSelectedProduct} onAdd={onAdd} />} 
      {page===PAGES.order && <Order cart={cart} />}
      {page===PAGES.about && <About />}
      {page===PAGES.contact && <Contact />}
      {page===PAGES.gallery && <Gallery />}
      {page===PAGES.admin && <Admin />}
      
      {/* Product Details Modal */}
      {selectedProduct && (
          <ProductDetailsModal product={selectedProduct} onClose={() => setSelectedProduct(null)} onAdd={onAdd} />
      )}

      {/* Cart Drawer */}
      {cartOpen && (
        <div className="drawer-backdrop" onClick={()=>setCartOpen(false)}>
          <aside className="drawer" onClick={e=>e.stopPropagation()}>
            <div className="drawer-header">Cart ({cart.length})</div>
            <div className="drawer-body">
                {cart.length === 0 && <p className="small">Cart is empty</p>}
                {cart.map((item, i) => (
                    <div className="drawer-item" key={i}>
                        <div>{item.name}</div>
                        <div>₹{item.price}</div>
                        <button onClick={()=>setCart(c=>c.filter((_,idx)=>idx!==i))}>x</button>
                    </div>
                ))}
            </div>
            <div className="drawer-footer">
                <div className="flex gap-2 justify-between mb-2"><strong>Total</strong><strong>₹{cart.reduce((a,b)=>a+b.price,0)}</strong></div>
                <button className="btn" onClick={()=>{setCartOpen(false); navigate(PAGES.order)}}>Checkout</button>
            </div>
          </aside>
        </div>
      )}

      {toast && <div style={{position:'fixed', bottom:'20px', left:'50%', transform:'translateX(-50%)', background:'#333', color:'#fff', padding:'10px 20px', borderRadius:'20px', zIndex:4000}}>{toast}</div>}
      
      <a className="fab" href="https://wa.me/919999999999" target="_blank" rel="noreferrer">Chat</a>
      <Footer />
    </>
  )
}

export default App