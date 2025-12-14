import { useEffect, useMemo, useState } from 'react'
import './index.css'

// --- CONSTANTS ---
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'
const PAGES = { home: 'home', menu: 'menu', order: 'order', about: 'about', contact: 'contact', admin: 'admin' }

// --- DEFAULT CONFIG (Fallback) ---
const DEFAULT_CONFIG = {
  shopName: 'Corbett Bakers',
  tagline: 'Homemade happiness',
  whatsapp: '918433138312', // Default number if DB is empty
  address: 'Bannakhera, Uttarakhand',
  heroTitle: 'Baked with Love, Served Fresh',
  heroSubtitle: 'Warm, cozy, and inviting bakes for every sweet moment.',
  bannerTitle: 'Planning a Special Occasion?',
  bannerText: 'From weddings to birthdays, we create custom cakes that taste as good as they look.',
  // Chef Defaults
  chefTitle: 'The Red Velvet Supreme',
  chefDesc: 'Our signature creation. Three layers of moist, cocoa-infused red sponge layered with our secret cream cheese frosting.',
  chefPrice: 899,
  chefTag: 'Today Spcl',
  chefImage: ''
};

// --- DATA: CATEGORIES & SOCIAL ---
const HEART_CATEGORIES = [
  { id: 1, label: 'Birthday', image: 'https://images.unsplash.com/photo-1558301211-0d8c8ddee6ec?auto=format&fit=crop&w=300&q=80' },
  { id: 2, label: 'Anniversary', image: 'https://images.unsplash.com/photo-1535254973040-607b474cb50d?auto=format&fit=crop&w=300&q=80' },
  { id: 3, label: 'Choco Love', image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=300&q=80' },
  { id: 4, label: 'Fruit Cakes', image: './images/cake_4.jpg' },
  { id: 5, label: 'Cupcakes', image: 'https://images.pexels.com/photos/1179002/pexels-photo-1179002.jpeg' },
  { id: 6, label: 'Party Props', image: 'https://images.pexels.com/photos/17637268/pexels-photo-17637268.jpeg' },
];

const SOCIAL_ROW_1 = Array.from({ length: 6 }, (_, i) => ({ type: 'image', src: `/images/cake_${(i % 12) + 1}.jpg` }));
const SOCIAL_ROW_2 = Array.from({ length: 6 }, (_, i) => ({ type: 'image', src: `/images/cake_${(i % 12) + 5}.jpg` }));
const SOCIAL_ROW_3 = Array.from({ length: 6 }, (_, i) => ({ type: 'image', src: `/images/cake_${(i % 12) + 9}.jpg` }));

// --- HELPERS ---
const convertToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onload = () => resolve(fileReader.result);
    fileReader.onerror = (error) => reject(error);
  });
};

async function fetchProductsFromAPI() { try { return await (await fetch(`${API_URL}/api/products`)).json() } catch { return [] } }
async function fetchFastFoodFromAPI() { try { return await (await fetch(`${API_URL}/api/fastfood`)).json() } catch { return [] } }

// --- COMPONENTS ---

function ProductDetailsModal({ product, onClose, onAdd }) {
  if (!product) return null;
  const hasHalf = product.prices && typeof product.prices.half === 'number';
  const hasFull = product.prices && typeof product.prices.full === 'number';

  return (
    <div className="drawer-backdrop" onClick={onClose} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 3000 }}>
      <div className="card modal-card" style={{ width: '90%', maxWidth: '800px', maxHeight: '90vh', overflowY: 'auto', background: '#fff', position: 'relative', cursor: 'default' }} onClick={e => e.stopPropagation()}>
        <button onClick={onClose} style={{ position: 'absolute', top: '15px', right: '20px', background: 'rgba(0,0,0,0.5)', color:'white', border: 'none', borderRadius:'50%', width:'40px', height:'40px', fontSize: '1.5rem', cursor: 'pointer', zIndex: 10 }}>×</button>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
           <div style={{ width: '100%', height: '350px', backgroundColor: '#f9f9f9', display:'flex', alignItems:'center', justifyContent:'center' }}>
             <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} onError={(e) => e.target.src = 'https://placehold.co/800x600?text=No+Image'} />
           </div>
           <div style={{ padding: '30px' }}>
             <div className="chip" style={{ marginBottom: '10px' }}>{product.category}</div>
             <h2 className="card-title" style={{ fontSize: '1.8rem', marginBottom: '10px' }}>{product.name}</h2>
             <div style={{ fontSize: '1.4rem', fontWeight: 'bold', color: 'var(--brown-dark)', marginBottom: '20px' }}>
                {product.price ? `₹ ${product.price}` : ''}
                {hasHalf && `Half: ₹${product.prices.half}  `} 
                {hasFull && ` • Full: ₹${product.prices.full}`}
             </div>
             <h4 style={{ marginBottom: '8px' }}>Description</h4>
             <p style={{ lineHeight: '1.6', color: 'var(--text)', marginBottom: '30px' }}>{product.description || product.desc || "No description available."}</p>
             <div className="card-actions">
                {product.price && <button className="btn" onClick={() => { onAdd(product); onClose(); }}>Add to Cart (₹ {product.price})</button>}
                {hasHalf && <button className="btn outline" onClick={()=> { onAdd({ ...product, name: product.name + ' (Half)', price: product.prices.half }); onClose(); }}>Add Half (₹ {product.prices.half})</button>}
                {hasFull && <button className="btn" onClick={()=> { onAdd({ ...product, name: product.name + ' (Full)', price: product.prices.full }); onClose(); }}>Add Full (₹ {product.prices.full})</button>}
             </div>
           </div>
        </div>
      </div>
    </div>
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

function Header({ navigate, page, toggleDark, cartCount, onOpenCart, config }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleNavClick = (pageName) => {
    navigate(pageName);
    setMenuOpen(false); // Close menu on click
  };

  return (
    <header className="header">
      <div className="container header-inner">
        {/* Brand */}
        <div className="brand" onClick={() => handleNavClick(PAGES.home)} style={{ cursor: 'pointer' }}>
          <div className="brand-row">
            <svg className="brand-icon" viewBox="0 0 24 24" fill="none"><path d="M4 14c0-3 4-4 8-4s8 1 8 4-4 6-8 6-8-3-8-6Z" fill="#D7A86E"/><path d="M12 4c2 0 3 1 3 2s-1 2-3 2-3-1-3-2 1-2 3-2Z" fill="#F18FB0"/><circle cx="16.5" cy="9.5" r="1.2" fill="#F7C7D8"/><circle cx="9" cy="9" r="1" fill="#F7C7D8"/></svg>
            <div>{config.shopName}<small>{config.tagline}</small></div>
          </div>
        </div>

        {/* Mobile Toggle Button */}
        <button 
          className="mobile-toggle" 
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? '✕' : '☰'}
        </button>

        {/* Navigation Links */}
        <nav className={`nav ${menuOpen ? 'open' : ''}`}>
          <a href="#/home" onClick={(e)=>{e.preventDefault(); handleNavClick(PAGES.home)}} aria-current={page===PAGES.home}>Home</a>
          <a href="#/menu" onClick={(e)=>{e.preventDefault(); handleNavClick(PAGES.menu)}} aria-current={page===PAGES.menu}>Menu</a>
          <a href="#/order" onClick={(e)=>{e.preventDefault(); handleNavClick(PAGES.order)}} aria-current={page===PAGES.order}>Order</a>
          <a href="#/about" onClick={(e)=>{e.preventDefault(); handleNavClick(PAGES.about)}} aria-current={page===PAGES.about}>About</a>
          <a href="#/contact" onClick={(e)=>{e.preventDefault(); handleNavClick(PAGES.contact)}} aria-current={page===PAGES.contact}>Contact</a>
          
          <div style={{ display: 'flex', gap: '10px', marginTop: '5px' }}>
            <button className="btn outline" onClick={() => { toggleDark(); setMenuOpen(false); }}>
               Theme
            </button>
            <button className="btn outline" onClick={() => { onOpenCart(); setMenuOpen(false); }}>
               Cart ({cartCount})
            </button>
          </div>
          
          <a className="btn" href="#/order" onClick={(e)=>{e.preventDefault(); handleNavClick(PAGES.order)}}>Order Now</a>
        </nav>
      </div>
    </header>
  )
}

function Footer({ config }) {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div>
          <h4>{config.shopName}</h4>
          <p className="small">{config.heroSubtitle}</p>
          <div className="small">📍 {config.address} • ☎️ {config.whatsapp}</div>
        </div>
        <div>
          <h4>Hours</h4>
          <div className="small">Mon–Sun: 8:00am – 9:00pm</div>
          <div className="small">Fresh bakes daily</div>
        </div>
        <div>
          <h4>Newsletter</h4>
          <input className="input" placeholder="Email address" aria-label="Email address" />
          <button className="btn mt-2" onClick={()=>alert('Subscribed!')}>Subscribe</button>
        </div>
      </div>
    </footer>
  )
}

function ProductCard({ item, onView }) {
  return (
    <div className="card product-card" onClick={() => onView(item)} style={{ cursor: 'pointer' }}>
      <div className="card-image" style={{ height: '200px', width: '100%', overflow: 'hidden' }}>
         <img src={item.image} alt={item.name} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e)=>e.target.src='https://placehold.co/600x400?text=No+Image'} />
      </div>
      <div className="card-body" style={{ display: 'flex', flexDirection: 'column' }}>
        <div className="chip">{item.category}</div>
        <div className="card-title">{item.name}</div>
        <div className="card-desc" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginBottom: '10px' }}>{item.description || item.desc}</div>
        <div className="card-price" style={{ marginTop: 'auto' }}>₹ {item.price}</div>
        <button className="btn outline mt-2" style={{ width: '100%' }}>View Details</button>
      </div>
    </div>
  )
}

function FastFoodCard({ item, onView }) {
  const hasHalf = item.prices && typeof item.prices.half === 'number';
  const hasFull = item.prices && typeof item.prices.full === 'number';
  return (
    <div className="card product-card" onClick={() => onView(item)} style={{ cursor: 'pointer' }}>
      <div className="card-image" style={{ height: '200px', width: '100%', overflow: 'hidden' }}>
        <img src={item.image} alt={item.name} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e)=>e.target.src='https://placehold.co/600x400?text=No+Image'} />
      </div>
      <div className="card-body">
        <div className="chip">{item.category}</div>
        <div className="card-title">{item.name}</div>
        <div className="card-desc" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: '#888' }}>Freshly made to order...</div>
        <div className="card-price" style={{ marginTop: 'auto' }}>{hasHalf ? `From ₹ ${item.prices.half}` : `₹ ${item.prices.full}`}</div>
        <button className="btn outline mt-2" style={{ width: '100%' }}>View Options</button>
      </div>
    </div>
  )
}

// --- HOME PAGE ---

function Home({ navigate, onViewProduct, config }) {
  const [products, setProducts] = useState([])
  const [fastFood, setFastFood] = useState([])
  const [loading, setLoading] = useState(true)

  // 1. UPDATED SLIDES DATA WITH TEXT
  const slides = useMemo(() => [
    { 
      src: '/images/shop.jpg', 
      title: 'Welcome to Corbett Bakers', 
      subtitle: 'Where every crumb tells a story' 
    },
    { 
      src: '/images/signature_cake.jpg', 
      title: 'Signature Choco Truffle', 
      subtitle: 'Rich, dark, and decadent' 
    },
    { 
      src: '/images/pastry.jpg', 
      title: 'Fresh Strawberry Pastries', 
      subtitle: 'Baked fresh every morning' 
    },
  ], [])
  
  const [index, setIndex] = useState(0)
  
  useEffect(() => { const t = setInterval(()=> setIndex((i)=> (i+1)%slides.length), 4000); return ()=> clearInterval(t) }, [slides.length])
  
  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      const [p, f] = await Promise.all([fetchProductsFromAPI(), fetchFastFoodFromAPI()])
      setProducts(p); setFastFood(f); setLoading(false)
    }
    loadData()
  }, [])

  // This remembers the random order so it doesn't change on every render
  const randomFastFood = useMemo(() => [...fastFood].sort(() => 0.5 - Math.random()).slice(0, 4), [fastFood]);

  return (
    <main>
      {/* 1. HERO */}
      <section className="hero">
        <div className="container hero-inner">
          <div>
            <h1>{config.heroTitle}</h1>
            <p>{config.heroSubtitle}</p>
            <div className="hero-actions">
              <button className="btn" onClick={()=>navigate(PAGES.order)}>Order Now</button>
              <button className="btn outline" onClick={()=>navigate(PAGES.menu)}>View Menu</button>
            </div>
          </div>
          
          <div className="carousel" style={{ position: 'relative', overflow: 'hidden', width: '100%', height: '400px', borderRadius: '24px' }}>
              <div className="carousel-track" style={{ display: 'flex', height: '100%', transition: 'transform 0.6s cubic-bezier(0.25, 1, 0.5, 1)', transform: `translateX(-${index*100}%)` }}>
                {slides.map((s, i)=> (
                  <div className="carousel-slide" key={i} style={{ minWidth: '100%', height: '100%' }}>
                    <div className="hero-card" style={{ width: '100%', height: '100%' }}>
                      <img 
                        src={s.src} 
                        alt={s.title} 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                        onError={(e)=>e.target.src='https://placehold.co/800x400?text=Corbett+Bakers'} 
                      />
                      
                      {/* 2. NEW TEXT OVERLAY */}
                      <div className="hero-overlay">
                        <div className="hero-text-content">
                           <h3>{s.title}</h3>
                           <span>{s.subtitle}</span>
                        </div>
                      </div>

                    </div>
                  </div>
                ))}
              </div>
              
              {/* Optional: Slide Indicators */}
              <div className="carousel-nav">
                 {slides.map((_, i) => (
                    <div key={i} className={`dot ${i===index ? 'active' : ''}`} onClick={()=>setIndex(i)} />
                 ))}
              </div>
          </div>
        </div>
      </section>

      {/* 2. WHAT'S IN YOUR HEART */}
      <section className="section heart-section">
        <div className="container">
           <div className="section-title text-center" style={{ textAlign:'center', fontSize: '2rem' }}>What’s In Your Heart?</div>
           <div className="heart-grid">
              {HEART_CATEGORIES.map(cat => (
                <div key={cat.id} className="heart-item" onClick={()=>navigate(PAGES.menu)}>
                   <div className="heart-img-box"><img src={cat.image} alt={cat.label} loading="lazy" /></div>
                   <div className="heart-label">{cat.label}</div>
                </div>
              ))}
           </div>
        </div>
      </section>

      {/* 3. CHEF'S SPOTLIGHT */}
      <section className="section section-alt">
        <div className="container">
           <div style={{ textAlign: 'center', marginBottom: '2rem' }}><div className="chip">Chef's Favorite</div></div>
           <div className="spotlight-wrapper">
              <div className="spotlight-image">
                 <img 
                    src={config.chefImage || "/images/cake_9.jpg"} 
                    alt="Spotlight" 
                    loading="lazy" 
                    onError={(e) => e.target.src = 'https://images.unsplash.com/photo-1586788680434-30d3244363c3?auto=format&fit=crop&w=1000&q=80'} 
                 />
                 <div className="sticker" style={{ top: '20px', left: '20px' }}><div><small>{config.chefTag}</small></div></div>
              </div>
              <div className="spotlight-content">
                 <h2 className="fancy-title" style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{config.chefTitle}</h2>
                 <p className="muted" style={{ lineHeight: '1.8', marginBottom: '1.5rem', fontSize: '1.1rem' }}>{config.chefDesc}</p>
                 <div className="flex gap-2 items-center">
                    <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--brown-dark)' }}>₹{config.chefPrice}</span>
                    <button className="btn" onClick={()=>navigate(PAGES.menu)}>Order This Now</button>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* 4. BEST SELLERS */}
      <section className="section">
        <div className="container">
          <div className="section-title">Best Sellers</div>
          {loading && <div className="text-center">Loading fresh bakes...</div>}
          <div className="grid">
            {!loading && products.slice(0,4).map((p)=> <ProductCard key={p.id} item={p} onView={onViewProduct} />)}
          </div>
        </div>
      </section>

      {/* 5. CUSTOM BANNER */}
      <section className="section" style={{ background: '#222', color: '#fff', padding: '60px 0', textAlign: 'center' }}>
        <div className="container">
           <h2 style={{ fontSize: '2rem', marginBottom: '15px', color: '#fff' }}>{config.bannerTitle}</h2>
           <p style={{ maxWidth: '600px', margin: '0 auto 25px auto', color: '#ccc' }}>{config.bannerText}</p>
           <button className="btn" style={{ background: '#fff', color: '#333' }} onClick={()=>navigate(PAGES.contact)}>Contact Us</button>
        </div>
      </section>

      {/* 6. QUICK BITES */}
      <section className="section">
        <div className="container">
          <div className="section-title">Quick Bites & Snacks</div>
          <p className="muted" style={{marginTop:'-8px', marginBottom: '20px'}}>Perfect for tea time, office breaks, or anytime cravings.</p>
          <div className="grid">
              {!loading && randomFastFood.map((ff) => <FastFoodCard key={ff.id} item={ff} onView={onViewProduct} />)}
          </div>
          <div className="mt-3 text-center">
             <button className="btn outline" onClick={()=>navigate(PAGES.menu)}>View Full Menu</button>
          </div>
        </div>
      </section>

      {/* 7. TESTIMONIALS */}
      <section className="section section-alt">
        <div className="container">
           <div className="section-title">Customer Love</div>
           <div className="testimonial-grid">
              <div className="testimonial-card">
                 <p className="testimonial-text">"The Red Velvet cake was the highlight of our party! Absolutely moist and delicious. Everyone asked where we got it from."</p>
                 <div className="testimonial-author"><div className="author-avatar">R</div><div className="author-info"><strong>Rahul Sharma</strong><span>Birthday Celebration</span></div></div>
              </div>
              <div className="testimonial-card">
                 <p className="testimonial-text">"Best momos in town. The chutney is spicy and authentic. I order from here almost every weekend. Highly recommended!"</p>
                 <div className="testimonial-author"><div className="author-avatar">A</div><div className="author-info"><strong>Anjali Kapoor</strong><span>Regular Customer</span></div></div>
              </div>
              <div className="testimonial-card">
                 <p className="testimonial-text">"Ordered a custom photo cake for my son. It was perfect design-wise and tasted amazing. Thank you Corbett Bakers!"</p>
                 <div className="testimonial-author"><div className="author-avatar">V</div><div className="author-info"><strong>Vikram Singh</strong><span>Custom Order</span></div></div>
              </div>
           </div>
        </div>
      </section>

      {/* 8. SOCIAL WORLD */}
      <section className="social-section">
         <div className="container social-header">
            <h2 className="section-title" style={{ fontSize: '2.5rem' }}>A glimpse from our social world!</h2>
            <p className="muted">Follow us @{config.shopName.replace(/\s+/g, '').toLowerCase()}</p>
         </div>
         <div className="social-track-wrapper"><div className="social-track scroll-left slow">{[...SOCIAL_ROW_1, ...SOCIAL_ROW_1].map((item, i) => (<div key={i} className="glass-card"><img src={item.src} loading="lazy" /></div>))}</div></div>
         <div className="social-track-wrapper"><div className="social-track scroll-right fast">{[...SOCIAL_ROW_2, ...SOCIAL_ROW_2].map((item, i) => (<div key={i} className="glass-card"><img src={item.src} loading="lazy" />{item.type==='video'&&<div className="play-icon"></div>}</div>))}</div></div>
         <div className="social-track-wrapper"><div className="social-track scroll-left">{[...SOCIAL_ROW_3, ...SOCIAL_ROW_3].map((item, i) => (<div key={i} className="glass-card"><img src={item.src} loading="lazy" /></div>))}</div></div>
      </section>
    </main>
  )
}

function Menu({ onViewProduct, onAdd }) {
  const [products, setProducts] = useState([])
  const [fastFood, setFastFood] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const [p, f] = await Promise.all([fetchProductsFromAPI(), fetchFastFoodFromAPI()]);
      setProducts(p);
      setFastFood(f);
      setLoading(false)
    }
    load()
  }, [])

  const categories = useMemo(() => {
    const allItems = [...products, ...fastFood];
    const uniqueCats = ['All', ...new Set(allItems.map(item => item.category))];
    return uniqueCats.sort(); 
  }, [products, fastFood]);

  const allItems = [...products, ...fastFood];
  const filteredItems = allItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  // Use all fast food items for the card
  const specialItems = fastFood;

  return (
    <main style={{ minHeight: '100vh' }}>
      
      {/* 1. MENU HERO */}
      <section className="menu-hero">
        <div className="container">
           <div className="section-title fancy-title" style={{ marginBottom: '0.5rem' }}>Our Menu</div>
           <p className="muted">Fresh from the oven, straight to your heart.</p>
        </div>
      </section>

      {/* 2. THE COMPACT PHYSICAL MENU CARD */}
      {!loading && specialItems.length > 0 && (
        <section className="physical-menu-section">
            <div className="physical-menu-card">
                <div className="pm-header">
                    <h2 className="pm-title">Cafe Menu</h2>
                    <div className="pm-subtitle">Fast Food Delights</div>
                </div>
                
                <ul className="pm-list">
                    {specialItems.map((item, i) => {
                        // LOGIC: Determine how to show price
                        let priceDisplay = '';
                        const isBurger = item.category.toLowerCase().includes('burger');
                        
                        if (isBurger) {
                            // If Burger, only show one price (Full prefered, else standard)
                            priceDisplay = `₹${item.prices?.full || item.price}`;
                        } 
                        else if (item.prices?.half && item.prices?.full) {
                            // If both Half and Full exist, show both
                            priceDisplay = `H: ₹${item.prices.half} | F: ₹${item.prices.full}`;
                        } 
                        else {
                            // Fallback for single price items
                            priceDisplay = `₹${item.prices?.full || item.prices?.half || item.price}`;
                        }

                        return (
                            <li key={i}>
                                <div className="pm-item">
                                    <span className="pm-name">{item.name}</span>
                                    <span className="pm-dots"></span>
                                    <span className="pm-price">{priceDisplay}</span>
                                </div>
                            </li>
                        );
                    })}
                </ul>

                <div style={{ textAlign: 'center', marginTop: '1.5rem', borderTop:'1px solid rgba(0,0,0,0.1)', paddingTop:'10px', fontSize: '0.8rem', opacity: 0.6, fontStyle:'italic' }}>
                    * Customization available on request
                </div>
            </div>
        </section>
      )}

      {/* 3. SEARCH & FILTER */}
      <div className="search-wrapper" style={{ marginTop: '-25px', position: 'relative', zIndex: 10, padding: '0 1rem' }}>
          <span className="search-icon">🔍</span>
          <input 
            className="search-input" 
            placeholder="Search full menu..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
      </div>

      {/* 4. CATEGORY PILLS */}
      <div className="category-strip-wrapper">
         <div className="container">
            <div className="category-track">
               {categories.map(cat => (
                 <div 
                   key={cat} 
                   className={`category-pill ${activeCategory === cat ? 'active' : ''}`}
                   onClick={() => setActiveCategory(cat)}
                 >
                   {cat}
                 </div>
               ))}
            </div>
         </div>
      </div>

      {/* 5. FOOD GRID */}
      <div className="container section" style={{ paddingTop: '0' }}>
        {loading && <div className="text-center muted" style={{ marginTop: '2rem' }}>Loading menu...</div>}

        {!loading && (
          <>
            {filteredItems.length === 0 ? (
               <div className="text-center" style={{ padding: '4rem 0', opacity: 0.7 }}>
                  <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🥖</div>
                  <h3>No items found</h3>
                  <button className="btn outline mt-2" onClick={()=>{setSearchTerm(''); setActiveCategory('All')}}>Clear Filters</button>
               </div>
            ) : (
               <div className="grid">
                  {filteredItems.map(item => {
                     const isProduct = item.price !== undefined;
                     return isProduct 
                        ? <ProductCard key={item.id} item={item} onView={onViewProduct} />
                        : <FastFoodCard key={item.id} item={item} onView={onViewProduct} />
                  })}
               </div>
            )}
          </>
        )}
      </div>
    </main>
  )
}

// --- ORDER PAGE (New Stylish Version) ---
function Order({ cart, config }) {
  const [form, setForm] = useState({ name: '', contact: '', date: '', items: '', notes: '' })
  const cartTotal = cart.reduce((sum, item) => sum + item.price, 0);
  const isCartOrder = cart.length > 0;

  const onSubmit = (e) => {
    e.preventDefault()
    let itemDetails = isCartOrder ? cart.map((i, idx) => `${idx+1}. ${i.name} (₹${i.price})`).join('\n') : (form.items || 'Custom Order');
    let finalTotal = isCartOrder ? `*Total:* ₹${cartTotal}` : 'Total to be confirmed.';
    const message = `*🍰 Order Request - ${config.shopName}*\n\n*Name:* ${form.name}\n*Contact:* ${form.contact}\n*Date:* ${form.date}\n\n*Items:*\n${itemDetails}\n\n${finalTotal}\n\n*Notes:* ${form.notes||'None'}`;
    window.open(`https://wa.me/${config.whatsapp}?text=${encodeURIComponent(message)}`, '_blank');
  }

  return (
    <main className="section"><div className="container">
        <div className="section-title text-center" style={{marginBottom:'2rem'}}>Finalize Your Order</div>
        <div className="order-card">
            {isCartOrder && (
                <div className="order-summary">
                    <div className="order-summary-header"><h4>Receipt</h4><span>{new Date().toLocaleDateString()}</span></div>
                    <ul className="order-list">{cart.map((item, i) => <li key={i}><span>{item.name}</span><strong>₹{item.price}</strong></li>)}</ul>
                    <div className="order-divider"><span className="total-label">Total</span><span className="total-highlight">₹{cartTotal}</span></div>
                </div>
            )}
            <form onSubmit={onSubmit}>
                <div className="form-row">
                    <div className="form-group"><label>Name</label><input className="input" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} required /></div>
                    <div className="form-group"><label>Phone</label><input className="input" value={form.contact} onChange={e=>setForm({...form,contact:e.target.value})} required /></div>
                </div>
                <div className="form-row">
                    <div className="form-group"><label>Date</label><input type="date" className="input" value={form.date} onChange={e=>setForm({...form,date:e.target.value})} required /></div>
                    {!isCartOrder && <div className="form-group"><label>Items</label><input className="input" value={form.items} onChange={e=>setForm({...form,items:e.target.value})} /></div>}
                </div>
                <div className="form-group"><label>Notes</label><textarea rows={3} className="input" value={form.notes} onChange={e=>setForm({...form,notes:e.target.value})} /></div>
                <button className="btn btn-whatsapp mt-4" type="submit">Place Order on WhatsApp</button>
            </form>
        </div>
    </div></main>
  )
}

// --- ADMIN ---
function AdminLogin({ onLogin }) {
  const [creds, setCreds] = useState({username:'', password:''});
  const [error, setError] = useState('');
  const submit = async (e) => {
    e.preventDefault();
    try {
        const res = await fetch(`${API_URL}/api/admin/login`, { method: 'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(creds) });
        if(res.ok) { const data = await res.json(); sessionStorage.setItem('adminAuth','true'); sessionStorage.setItem('adminToken', data.token); onLogin(); }
        else setError('Invalid Credentials');
    } catch { setError('Login failed'); }
  }
  return <main className="section"><div className="container" style={{maxWidth:'400px'}}><div className="section-title">Admin Login</div>{error&&<p style={{color:'red'}}>{error}</p>}<form onSubmit={submit}><input className="input mb-2" placeholder="Username" value={creds.username} onChange={e=>setCreds({...creds,username:e.target.value})}/><input type="password" className="input mb-2" placeholder="Password" value={creds.password} onChange={e=>setCreds({...creds,password:e.target.value})}/><button className="btn">Login</button></form></div></main>
}

function AdminDashboard({ config, onUpdateConfig }) {
  const [tab, setTab] = useState('products');
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({});
  const [settingsForm, setSettingsForm] = useState(config || {});
  const [loading, setLoading] = useState(false);

  useEffect(() => { if(tab!=='settings') loadItems() }, [tab]);

  const loadItems = async () => { const res = await fetch(`${API_URL}/api/${tab}`); setItems(await res.json()); }
  const handleUpload = async (e) => {
      const file = e.target.files[0]; if(!file)return;
      if(file.size > 2*1024*1024) { alert('File > 2MB'); return; }
      setForm({...form, image: await convertToBase64(file)});
  }
  
  // Specific handler for Settings Image (Chef Spotlight)
  const handleSettingsUpload = async (e) => {
      const file = e.target.files[0]; if(!file)return;
      if(file.size > 2*1024*1024) { alert('File > 2MB'); return; }
      setSettingsForm({...settingsForm, chefImage: await convertToBase64(file)});
  }

  const saveItem = async () => {
      setLoading(true); const id = form.id || (tab==='products'?'p':'ff')+Date.now();
      const body = { ...form, id, price: Number(form.price), prices: form.prices };
      const url = form.id 
        ? `${API_URL}/api/${tab}/${id}` 
        : `${API_URL}/api/${tab}`;

      await fetch(url, { 
          method: form.id ? 'PUT' : 'POST', 
          headers:{'Content-Type':'application/json'}, 
          body:JSON.stringify(body) 
      });
      setForm({}); loadItems(); setLoading(false);
  }
  const deleteItem = async (id) => { if(confirm('Delete?')) await fetch(`${API_URL}/api/${tab}/${id}`, {method:'DELETE'}); loadItems(); }
  
  const saveSettings = async () => {
      const res = await fetch(`${API_URL}/api/config`, { method:'PUT', headers:{'Content-Type':'application/json'}, body:JSON.stringify(settingsForm) });
      onUpdateConfig(await res.json()); alert('Settings Saved!');
  }

  const logout = () => { sessionStorage.removeItem('adminAuth'); window.location.hash = `#/${PAGES.home}`; }

  return (
    <main className="section"><div className="container">
       <div className="section-title">Admin Dashboard</div>
       <div className="flex gap-2 mb-3">
           <button className={`btn ${tab!=='products'?'outline':''}`} onClick={()=>setTab('products')}>Products</button>
           <button className={`btn ${tab!=='fastfood'?'outline':''}`} onClick={()=>setTab('fastfood')}>Fast Food</button>
           <button className={`btn ${tab!=='settings'?'outline':''}`} onClick={()=>setTab('settings')}>⚙️ Settings</button>
           <button className="btn outline" onClick={logout}>Logout</button>
       </div>

       {tab === 'settings' ? (
           <div className="card p-3">
               <h4>General Info</h4>
               <div className="form-row">
                   <div><label>Shop Name</label><input className="input" value={settingsForm.shopName} onChange={e=>setSettingsForm({...settingsForm, shopName:e.target.value})} /></div>
                   <div><label>WhatsApp (No +)</label><input className="input" value={settingsForm.whatsapp} onChange={e=>setSettingsForm({...settingsForm, whatsapp:e.target.value})} /></div>
               </div>
               <div className="mt-2"><label>Address</label><input className="input" value={settingsForm.address} onChange={e=>setSettingsForm({...settingsForm, address:e.target.value})} /></div>
               
               <h4 className="mt-4">Hero & Banner</h4>
               <div className="mt-2"><label>Hero Title</label><input className="input" value={settingsForm.heroTitle} onChange={e=>setSettingsForm({...settingsForm, heroTitle:e.target.value})} /></div>
               <div className="mt-2"><label>Hero Subtitle</label><textarea className="input" value={settingsForm.heroSubtitle} onChange={e=>setSettingsForm({...settingsForm, heroSubtitle:e.target.value})} /></div>
               <div className="mt-2"><label>Banner Title</label><input className="input" value={settingsForm.bannerTitle} onChange={e=>setSettingsForm({...settingsForm, bannerTitle:e.target.value})} /></div>
               <div className="mt-2"><label>Banner Text</label><input className="input" value={settingsForm.bannerText} onChange={e=>setSettingsForm({...settingsForm, bannerText:e.target.value})} /></div>

               <h4 className="mt-4">Chef's Spotlight</h4>
               <div className="form-row">
                   <div><label>Title</label><input className="input" value={settingsForm.chefTitle} onChange={e=>setSettingsForm({...settingsForm, chefTitle:e.target.value})} /></div>
                   <div><label>Price</label><input className="input" type="number" value={settingsForm.chefPrice} onChange={e=>setSettingsForm({...settingsForm, chefPrice:Number(e.target.value)})} /></div>
               </div>
               <div className="mt-2"><label>Tag (e.g. Today Spcl)</label><input className="input" value={settingsForm.chefTag} onChange={e=>setSettingsForm({...settingsForm, chefTag:e.target.value})} /></div>
               <div className="mt-2"><label>Description</label><textarea className="input" value={settingsForm.chefDesc} onChange={e=>setSettingsForm({...settingsForm, chefDesc:e.target.value})} /></div>
               <div className="mt-2">
                   <label>Spotlight Image</label>
                   <input type="file" className="input" onChange={handleSettingsUpload} />
                   {settingsForm.chefImage && <img src={settingsForm.chefImage} style={{height:'80px', marginTop:'5px', objectFit:'contain'}} />}
               </div>

               <button className="btn mt-4" onClick={saveSettings}>Save Changes</button>
           </div>
       ) : (
           <>
             <div className="card p-3 mb-3">
                 <h4>{form.id?'Edit':'Add'} {tab}</h4>
                 <div className="form-row">
                     <input className="input" placeholder="Name" value={form.name||''} onChange={e=>setForm({...form,name:e.target.value})}/>
                     <input className="input" placeholder="Category" value={form.category||''} onChange={e=>setForm({...form,category:e.target.value})}/>
                 </div>
                 {tab==='products' ? <input className="input mt-2" placeholder="Price" value={form.price||''} onChange={e=>setForm({...form,price:e.target.value})} /> : 
                 <div className="form-row mt-2"><input className="input" placeholder="Half Price" value={form.prices?.half||''} onChange={e=>setForm({...form,prices:{...form.prices,half:e.target.value}})} /><input className="input" placeholder="Full Price" value={form.prices?.full||''} onChange={e=>setForm({...form,prices:{...form.prices,full:e.target.value}})} /></div>}
                 <div className="mt-2"><input type="file" className="input" onChange={handleUpload} />{form.image && <img src={form.image} style={{height:'50px'}} />}</div>
                 <textarea className="input mt-2" placeholder="Description" value={form.description||''} onChange={e=>setForm({...form,description:e.target.value})} />
                 <button className="btn mt-2" onClick={saveItem} disabled={loading}>{loading?'Saving...':'Save'}</button>
                 {form.id && <button className="btn outline mt-2 ml-2" onClick={()=>setForm({})}>Cancel</button>}
             </div>
             <div className="grid">{items.map(i=><div className="card" key={i.id}><div className="card-body"><div><b>{i.name}</b></div><div className="flex gap-2 mt-2"><button className="btn small" onClick={()=>setForm(i)}>Edit</button><button className="btn small outline" onClick={()=>deleteItem(i.id)}>Delete</button></div></div></div>)}</div>
           </>
       )}
    </div></main>
  )
}

function Admin({ config, onUpdateConfig }) {
  const [authed, setAuthed] = useState(sessionStorage.getItem('adminAuth') === 'true')
  return authed ? <AdminDashboard config={config} onUpdateConfig={onUpdateConfig} /> : <AdminLogin onLogin={()=>setAuthed(true)} />
}

function About() {
  return (
    <main className="section"><div className="container"><div className="section-title">About Us</div><p>We believe in homemade happiness. Our bakery started with a simple mission: craft warm, cozy, and inviting bakes that bring people together.</p><div className="grid mt-3"><div className="card"><img src="https://placehold.co/600x400/fff7eb/6b4f3b?text=Team" /></div><div className="card"><img src="https://placehold.co/600x400/fff7eb/6b4f3b?text=Kitchen" /></div></div></div></main>
  )
}

function Contact({ config }) {
  return (
    <main className="section"><div className="container"><div className="section-title">Contact Us</div><p>📍 {config.address} <br/> ☎️ +{config.whatsapp}</p><div className="hero-card mt-3"><iframe title="Map" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3481.444601166025!2d79.1594372!3d29.239886900000002!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390a6f51a968a4e7%3A0x418435b96c967134!2sCorbett%20Bakers!5e0!3m2!1sen!2sin!4v1765628347488!5m2!1sen!2sin" width="100%" height="320" style={{ border: 0 }} allowFullScreen="" loading="lazy"></iframe></div></div></main>
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
  const [config, setConfig] = useState(DEFAULT_CONFIG)

  useEffect(() => {
      fetch(`${API_URL}/api/config`).then(r=>r.json()).then(d=>d && setConfig(prev=>({...prev, ...d}))).catch(console.error);
  }, []);

  useEffect(()=> { document.documentElement.classList.toggle('dark', dark) }, [dark])

  const onAdd = (item) => { setCart(c => [...c, item]); setToast(`Added ${item.name}`); setTimeout(()=>setToast(null), 2000); }

  return (
    <>
      <Header navigate={navigate} page={page} toggleDark={()=>setDark(!dark)} cartCount={cart.length} onOpenCart={()=>setCartOpen(true)} config={config} />
      
      {page===PAGES.home && <Home navigate={navigate} onViewProduct={setSelectedProduct} config={config} />}
      {page===PAGES.menu && <Menu onViewProduct={setSelectedProduct} onAdd={onAdd} />} 
      {page===PAGES.order && <Order cart={cart} config={config} />}
      {page===PAGES.about && <About />}
      {page===PAGES.contact && <Contact config={config} />}
      {page===PAGES.admin && <Admin config={config} onUpdateConfig={setConfig} />}
      
      {selectedProduct && <ProductDetailsModal product={selectedProduct} onClose={() => setSelectedProduct(null)} onAdd={onAdd} />}

      {cartOpen && (
        <div className="drawer-backdrop" onClick={()=>setCartOpen(false)}>
          <aside className="drawer" onClick={e=>e.stopPropagation()}>
            <div className="drawer-header">Cart ({cart.length})</div>
            <div className="drawer-body">
                {cart.length === 0 && <p className="small">Cart is empty</p>}
                {cart.map((item, i) => <div className="drawer-item" key={i}><div>{item.name}</div><div>₹{item.price}</div><button onClick={()=>setCart(c=>c.filter((_,idx)=>idx!==i))}>x</button></div>)}
            </div>
            <div className="drawer-footer"><div className="flex gap-2 justify-between mb-2"><strong>Total</strong><strong>₹{cart.reduce((a,b)=>a+b.price,0)}</strong></div><button className="btn" onClick={()=>{setCartOpen(false); navigate(PAGES.order)}}>Checkout</button></div>
          </aside>
        </div>
      )}

      {toast && <div style={{position:'fixed', bottom:'20px', left:'50%', transform:'translateX(-50%)', background:'#333', color:'#fff', padding:'10px 20px', borderRadius:'20px', zIndex:4000}}>{toast}</div>}
      <a className="fab" href={`https://wa.me/${config.whatsapp}`} target="_blank" rel="noreferrer">Chat</a>
      <Footer config={config} />
    </>
  )
}

export default App