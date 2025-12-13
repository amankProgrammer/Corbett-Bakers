import { useEffect, useMemo, useState } from 'react'
import './index.css'

const API_URL = 'http://localhost:5000/api'
const PAGES = { home: 'home', menu: 'menu', order: 'order', gallery: 'gallery', about: 'about', contact: 'contact', admin: 'admin' }
// Build gallery from local images placed in public/images
const GALLERY_IMAGES = Array.from({ length: 16 }, (_, i) => `/images/cake_${i+1}.jpg`)

function Gallery() {
  // 1. State to track the currently selected image (null means no image is open)
  const [selectedImage, setSelectedImage] = useState(null)

  return (
    <main className="section">
      <div className="container">
        <div className="section-title">Our Creations</div>
        <p className="muted" style={{ marginTop: '-10px', marginBottom: '20px' }}>
          A glimpse into our kitchen and happy customers.
        </p>
        
        {/* Gallery Grid */}
        <div className="grid">
          {GALLERY_IMAGES.map((src, i) => (
            <div 
              className="card" 
              key={i}
              // 2. Add click handler to open the image
              onClick={() => setSelectedImage(src)}
              style={{ cursor: 'pointer' }}
              title="Click to zoom"
            >
              <div className="card-image">
                <img 
                  src={src} 
                  alt={`Gallery item ${i + 1}`} 
                  loading="lazy" 
                  style={{ width: '100%', height: '100%', objectFit: 'cover', aspectRatio: '1/1' }}
                  onError={(e) => {
                     e.target.src = 'https://placehold.co/600x600/fde2e4/6b4f3b?text=Delicious' 
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* 3. The Lightbox Modal (Only shows if selectedImage is not null) */}
        {selectedImage && (
          <div 
            className="lightbox-overlay" 
            onClick={() => setSelectedImage(null)} // Close when clicking background
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              backgroundColor: 'rgba(0, 0, 0, 0.9)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 2000,
              cursor: 'zoom-out'
            }}
          >
            {/* Close Button */}
            <button 
              onClick={() => setSelectedImage(null)}
              style={{
                position: 'absolute',
                top: '20px',
                right: '30px',
                background: 'transparent',
                border: 'none',
                color: '#fff',
                fontSize: '2rem',
                cursor: 'pointer'
              }}
            >
              &times;
            </button>

            {/* Large Image */}
            <img 
              src={selectedImage} 
              alt="Enlarged view" 
              style={{
                maxWidth: '90%',
                maxHeight: '90%',
                borderRadius: '8px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
                cursor: 'default' 
              }}
              // Stop clicks on the image from closing the modal
              onClick={(e) => e.stopPropagation()} 
            />
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
            <div>
              Corbett Bakers
              <small>Homemade happiness</small>
            </div>
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
          <a className="btn" href="#/order" onClick={(e)=>{e.preventDefault();navigate(PAGES.order)}}>Order Now</a>
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
          <div className="small">Follow: <a href="https://instagram.com" target="_blank" rel="noreferrer">Instagram</a> • <a href="https://facebook.com" target="_blank" rel="noreferrer">Facebook</a></div>
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

const products = [
  { id: 'cake1', name: 'Chocolate Truffle Cake', desc: 'Rich cocoa layers with ganache', price: 799, image: '/images/cake_1.jpg' , category: 'Cakes'},
  { id: 'cake2', name: 'Red Velvet Cake', desc: 'Cream cheese frosting, classic favorite', price: 899, image: '/images/cake_2.jpg' , category: 'Cakes'},
  { id: 'pastry1', name: 'Strawberry Pastry', desc: 'Light sponge, fresh berries', price: 129, image: '/images/cake_3.jpg' , category: 'Pastries'},
  { id: 'cookie1', name: 'Choco Chip Cookies', desc: 'Crispy edges, gooey center', price: 99, image: '/images/cake_4.jpg' , category: 'Cookies'},
  { id: 'bread1', name: 'Whole Wheat Bread', desc: 'Made fresh every morning', price: 89, image: '/images/cake_6.jpg' , category: 'Bread'},
  { id: 'cupcake1', name: 'Vanilla Cupcake', desc: 'Buttercream swirl, sprinkles', price: 79, image: '/images/cake_5.jpg' , category: 'Cupcakes'},
  // Birthday specials
  { id: 'bday1', name: 'Birthday Theme Cake', desc: 'Custom design, eggless available', price: 1299, image: '/images/cake_11.jpg', category: 'Birthday' },
  { id: 'bday2', name: 'Photo Print Cake', desc: 'Edible photo topper, premium finish', price: 1599, image: '/images/cake_13.jpg', category: 'Birthday' },
  { id: 'bday3', name: 'Party Box Cupcakes (6)', desc: 'Assorted flavors • sprinkles & toppers', price: 499, image: '/images/cake_15.jpg', category: 'Birthday' },
  // Birthday decor & supplies
  { id: 'decor1', name: 'Balloon Pack (20)', desc: 'Colorful latex balloons', price: 199, image: 'https://images.weserv.nl/?url=loremflickr.com/600/600/balloons', category: 'Birthday Decor' },
  { id: 'decor2', name: 'Ribbon Roll', desc: 'Glossy gift ribbons', price: 99, image: 'https://images.weserv.nl/?url=loremflickr.com/600/600/ribbons', category: 'Birthday Decor' },
  { id: 'decor3', name: 'Candles Set (12)', desc: 'Assorted birthday candles', price: 89, image: 'https://images.weserv.nl/?url=loremflickr.com/600/600/birthday,candles', category: 'Birthday Decor' },
  { id: 'decor4', name: 'Party Poppers (4)', desc: 'Confetti poppers for celebrations', price: 149, image: 'https://images.weserv.nl/?url=loremflickr.com/600/600/party,poppers', category: 'Birthday Decor' },
  { id: 'decor5', name: 'Party Masks (6)', desc: 'Fun face masks for kids', price: 129, image: 'https://images.weserv.nl/?url=loremflickr.com/600/600/party,mask', category: 'Birthday Decor' },
  { id: 'decor6', name: 'Birthday Crown', desc: 'Gold crown for the star', price: 99, image: 'https://images.weserv.nl/?url=loremflickr.com/600/600/crown', category: 'Birthday Decor' },
  { id: 'decor7', name: 'Candies Jar', desc: 'Assorted sweets for party favors', price: 149, image: 'https://images.weserv.nl/?url=loremflickr.com/600/600/candies', category: 'Birthday Decor' },
]

// Fast Food Corner items with half/full pricing
const fastFoodItems = [
  { id:'ff1', name:'Steam Momos (Veg.)', category:'Momos', image:'https://images.weserv.nl/?url=loremflickr.com/600/600/dumpling', prices:{ half:30, full:50 } },
  { id:'ff2', name:'Steam Paneer or Mushroom Momos', category:'Momos', image:'https://images.weserv.nl/?url=loremflickr.com/600/600/dumplings,vegetarian', prices:{ half:50, full:100 } },
  { id:'ff3', name:'Fry Momos', category:'Momos', image:'https://images.weserv.nl/?url=loremflickr.com/600/600/fried%20dumplings', prices:{ half:40, full:60 } },
  { id:'ff4', name:'Tandoori Momos', category:'Momos', image:'https://images.weserv.nl/?url=loremflickr.com/600/600/spicy%20dumplings', prices:{ half:50, full:80 } },
  { id:'ff5', name:'Kurkure Momos (Veg.)', category:'Momos', image:'https://images.weserv.nl/?url=loremflickr.com/600/600/crispy%20dumplings', prices:{ half:50, full:80 } },
  { id:'ff6', name:'Kurkure Paneer or Mushroom Momos', category:'Momos', image:'https://images.weserv.nl/?url=loremflickr.com/600/600/crispy%20dumplings,paneer', prices:{ half:70, full:140 } },
  { id:'ff7', name:'Chilli Momos', category:'Momos', image:'https://images.weserv.nl/?url=loremflickr.com/600/600/spicy%20dumplings', prices:{ half:60, full:110 } },
  { id:'ff8', name:'Veg Chowmein', category:'Chowmein', image:'https://images.weserv.nl/?url=loremflickr.com/600/600/noodles', prices:{ half:30, full:50 } },
  { id:'ff9', name:'Hakka Noodles', category:'Chowmein', image:'https://images.weserv.nl/?url=loremflickr.com/600/600/hakka,noodles', prices:{ half:50, full:80 } },
  { id:'ff10', name:'Paneer Chowmein', category:'Chowmein', image:'https://images.weserv.nl/?url=loremflickr.com/600/600/paneer,noodles', prices:{ half:50, full:80 } },
  { id:'ff11', name:'Chilli Garlic Chowmein', category:'Chowmein', image:'https://images.weserv.nl/?url=loremflickr.com/600/600/garlic,noodles', prices:{ half:50, full:80 } },
  { id:'ff12', name:'Fried Rice', category:'Rice', image:'https://images.weserv.nl/?url=loremflickr.com/600/600/fried%20rice', prices:{ half:30, full:50 } },
  { id:'ff13', name:'Paneer Fried Rice', category:'Rice', image:'https://images.weserv.nl/?url=loremflickr.com/600/600/paneer,rice', prices:{ half:50, full:80 } },
  { id:'ff14', name:'Burger Aloo Tikki', category:'Burgers', image:'https://images.weserv.nl/?url=loremflickr.com/600/600/veg%20burger', prices:{ full:40 } },
  { id:'ff15', name:'Burger Paneer', category:'Burgers', image:'https://images.weserv.nl/?url=loremflickr.com/600/600/paneer,burger', prices:{ full:80 } },
  { id:'ff16', name:'Cheese Burger', category:'Burgers', image:'https://images.weserv.nl/?url=loremflickr.com/600/600/cheese,burger', prices:{ full:60 } },
  { id:'ff17', name:'Manchurian Veg. (Dry)', category:'Chinese', image:'https://images.weserv.nl/?url=loremflickr.com/600/600/manchurian', prices:{ half:80, full:150 } },
  { id:'ff18', name:'Manchurian Veg. (Gravy)', category:'Chinese', image:'https://images.weserv.nl/?url=loremflickr.com/600/600/manchurian,gravy', prices:{ half:100, full:180 } },
  { id:'ff19', name:'Chilli Paneer', category:'Chinese', image:'https://images.weserv.nl/?url=loremflickr.com/600/600/chilli%20paneer', prices:{ half:80, full:150 } },
  { id:'ff20', name:'Chilli Potato', category:'Chinese', image:'https://images.weserv.nl/?url=loremflickr.com/600/600/chilli%20potato', prices:{ half:80, full:150 } },
  { id:'ff21', name:'Spring Roll', category:'Snacks', image:'https://images.weserv.nl/?url=loremflickr.com/600/600/spring%20roll', prices:{ full:50 } },
  { id:'ff22', name:'Pasta', category:'Pasta', image:'https://images.weserv.nl/?url=loremflickr.com/600/600/pasta', prices:{ half:50, full:90 } },
]

// API-based data fetching
async function fetchProductsFromAPI() {
  try {
    const response = await fetch(`${API_URL}/products`)
    if (!response.ok) throw new Error('Failed to fetch products')
    return await response.json()
  } catch (err) {
    console.error('Error fetching products:', err)
    return []
  }
}

async function fetchFastFoodFromAPI() {
  try {
    const response = await fetch(`${API_URL}/fastfood`)
    if (!response.ok) throw new Error('Failed to fetch fast food items')
    return await response.json()
  } catch (err) {
    console.error('Error fetching fast food:', err)
    return []
  }
}

function FastFoodCard({ item, onAdd }) {
  const hasHalf = item.prices && typeof item.prices.half === 'number'
  const hasFull = item.prices && typeof item.prices.full === 'number'
  return (
    <div className="card">
      <img src={item.image} alt={item.name} loading="lazy" crossOrigin="anonymous" referrerPolicy="no-referrer" />
      <div className="card-body">
        <div className="chip" aria-label={item.category}>{item.category}</div>
        <div className="card-title">{item.name}</div>
        <div className="card-desc">Freshly made to order • Choose half or full</div>
        <div className="card-actions">
          {hasHalf && (
            <button className="btn outline" onClick={()=> onAdd({ ...item, name: item.name + ' (Half)', price: item.prices.half })}>
              Half ₹ {item.prices.half}
            </button>
          )}
          {hasFull && (
            <button className="btn" onClick={()=> onAdd({ ...item, name: item.name + ' (Full)', price: item.prices.full })}>
              Full ₹ {item.prices.full}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

function ProductCard({ item, onAdd }) {
  return (
    <div className="card">
      <div className="sticker"><div><small>only</small> ₹ {item.price}</div></div>
      <img src={item.image} alt={item.name} loading="lazy" crossOrigin="anonymous" referrerPolicy="no-referrer" />
      <div className="card-body">
        <div className="chip" aria-label={item.category}>{item.category}</div>
        <div className="card-title">{item.name}</div>
        <div className="card-desc">{item.desc}</div>
        <div className="card-price">₹ {item.price}</div>
        <div className="card-actions">
          <button className="btn" onClick={()=>onAdd(item)}>Add to Cart</button>
          <a className="btn outline" href="#/order">Pre-order</a>
        </div>
      </div>
    </div>
  )
}

function Home({ navigate }) {
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
      const [productsData, fastFoodData] = await Promise.all([
        fetchProductsFromAPI(),
        fetchFastFoodFromAPI()
      ])
      setProducts(productsData)
      setFastFood(fastFoodData)
      setLoading(false)
    }
    loadData()
  }, [])
  return (
    <main>
      <section className="hero">
        <div className="container hero-inner">
          <div>
            <h1>Baked with Love, Served Fresh</h1>
            <p>Warm, cozy, and inviting bakes for every sweet moment. From cakes to cookies, we craft homemade happiness daily. <span className="script">Fresh from our oven.</span></p>
            <div className="hero-actions">
              <button className="btn" onClick={()=>navigate(PAGES.order)}>Order Now</button>
              <button className="btn outline" onClick={()=>navigate(PAGES.menu)}>View Menu</button>
            </div>
            <div className="mt-3 small">Follow us on <a href="https://instagram.com" target="_blank" rel="noreferrer">Instagram</a></div>
          </div>
          <div>
              <div className="carousel" style={{ position: 'relative', overflow: 'hidden', width: '100%', height: '400px', borderRadius: '16px' }}>
                {/* Track: Added display:flex and height:100% to keep slides aligned */}
                <div className="carousel-track" style={{ display: 'flex', height: '100%', transition: 'transform 0.5s ease-in-out', transform: `translateX(-${index*100}%)` }}>
                  {slides.map((s, i)=> (
                    /* Slide: Added minWidth: 100% so it takes full width of the parent */
                    <div className="carousel-slide" key={i} style={{ minWidth: '100%', height: '100%', position: 'relative' }}>
                      <div className="hero-card" style={{ width: '100%', height: '100%' }}>
                        {/* Image: width/height 100% fills the box, objectFit: 'cover' prevents distortion */}
                        <img 
                          src={s.src} 
                          alt={s.caption} 
                          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} 
                        />
                        {/* Caption: Added absolute positioning to sit on top of the image */}
                        <div className="caption" style={{ position: 'absolute', bottom: '20px', left: '20px', background: 'rgba(255,255,255,0.9)', padding: '8px 16px', borderRadius: '8px', fontSize: '0.9rem', fontWeight: 'bold' }}>
                          {s.caption}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
  
                {/* Navigation Dots */}
                <div className="carousel-nav">
                  {slides.map((_, i)=> (
                    <div key={i} className={`dot ${i===index? 'active':''}`} onClick={()=> setIndex(i)} />
                  ))}
                </div>
            </div>
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <div className="section-title">Best Sellers</div>
          <div className="grid">
            {!loading && products.slice(0,4).map((p)=> <ProductCard key={p.id} item={p} onAdd={()=>{}} />)}
            {loading && <div className="small">Loading products...</div>}
          </div>
        </div>
      </section>
      <section className="section accent">
        <div className="container">
          <div className="section-title">Birthday Specials</div>
          <p className="muted" style={{marginTop:'-8px'}}>Theme cakes, photo cakes, and party boxes—made to celebrate.</p>
          <div className="grid">
            {!loading && products.filter(p=> p.category==='Birthday').map((p)=> (
              <ProductCard key={p.id} item={p} onAdd={()=>{}} />
            ))}
          </div>
          <div className="mt-2">
            <a className="btn" href="#/menu" onClick={(e)=>{e.preventDefault();navigate(PAGES.menu)}}>See Full Birthday Menu</a>
          </div>
          <div className="party-strip mt-3">
            <div className="party-chip">🎈 Balloons</div>
            <div className="party-chip">🎀 Ribbons</div>
            <div className="party-chip">🕯️ Candles</div>
            <div className="party-chip">🎉 Poppers</div>
            <div className="party-chip">🎭 Masks</div>
            <div className="party-chip">👑 Crown</div>
            <div className="party-chip">🍬 Candies</div>
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <div className="section-title">Quick Bites & Snacks</div>
          <p className="muted" style={{marginTop:'-8px'}}>Perfect for tea time, office breaks, or anytime cravings.</p>
          <div className="grid">
            {!loading && fastFood.slice(0, 8).map((ff)=> (
              <div key={ff.id} className="card product-card">
                <div className="card-image">
                  <img src={ff.image} alt={ff.name} loading="lazy" crossOrigin="anonymous" referrerPolicy="no-referrer" />
                </div>
                <div className="card-body">
                  <div className="card-title">{ff.name.split('(')[0].trim()}</div>
                  <div className="card-desc small">{ff.description}</div>
                  {ff.price && <div className="price mt-2">₹{ff.price}</div>}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-3 text-center">
            <a className="btn" href="#/menu" onClick={(e)=>{e.preventDefault();navigate(PAGES.menu)}}>View Full Menu</a>
          </div>
        </div>
      </section>
      <section className="section paper">
        <div className="container">
          <div className="section-title">Baker's Note</div>
          <div className="card">
            <div className="card-body">
              <div className="card-desc">We bake in small batches, using real butter, farm-fresh eggs, and seasonal fruits. Each recipe is perfected over years to bring a smile to your table.</div>
              <div className="mt-2 script">— Chef Jeetu</div>
            </div>
          </div>
        </div>
      </section>

    </main>
  )
}

function Menu({ onAdd }) {
  const [products, setProducts] = useState([])
  const [fastFood, setFastFood] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      const [productsData, fastFoodData] = await Promise.all([
        fetchProductsFromAPI(),
        fetchFastFoodFromAPI()
      ])
      setProducts(productsData)
      setFastFood(fastFoodData)
      setLoading(false)
    }
    loadData()
  }, [])

  return (
    <main className="section menu-page">
      <div className="container">
        <div className="menu-header">
          <div className="section-title fancy-title neon-title">Our Menu</div>
          <p className="muted tagline">Bakery delights & Fast Food favorites</p>
          <div className="title-decor neon-accent" aria-hidden="true"></div>
        </div>

        {loading && <div className="small">Loading menu...</div>}
        {!loading && (
          <div className="menu-board grid-2">
            <BakeryMenuBoard onAdd={onAdd} products={products} />
            <FastFoodMenuBoard onAdd={onAdd} fastFood={fastFood} />
          </div>
        )}
      </div>
    </main>
  )
}

function FastFoodSection({ onAdd }) {
  const [category, setCategory] = useState('All')
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState('none')
  const ffData = getFastFoodItemsData()
  const categories = ['All', ...Array.from(new Set(ffData.map(p=>p.category)))]
  let shown = ffData.filter(p=> category==='All' ? true : p.category===category)
  if (query.trim()) {
    const q = query.toLowerCase()
    shown = shown.filter(p=> p.name.toLowerCase().includes(q))
  }
  if (sort === 'price_asc') shown = shown.slice().sort((a,b)=> (a.prices.full ?? a.prices.half) - (b.prices.full ?? b.prices.half))
  if (sort === 'price_desc') shown = shown.slice().sort((a,b)=> (b.prices.full ?? b.prices.half) - (a.prices.full ?? a.prices.half))
  return (
    <section>
      <div className="mb-3">
        <div className="tabs">
          {categories.map(c=> (
            <div key={c} className={`tab ${c===category? 'active':''}`} onClick={()=> setCategory(c)}>{c}</div>
          ))}
        </div>
      </div>
      <div className="form-row mb-3">
        <div>
          <label>Search</label>
          <input className="input" placeholder="e.g., momos, chowmein" value={query} onChange={e=> setQuery(e.target.value)} />
        </div>
        <div>
          <label>Sort</label>
          <select className="input" value={sort} onChange={e=> setSort(e.target.value)}>
            <option value="none">Recommended</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
          </select>
        </div>
      </div>
      <div className="grid">
        {shown.map((p)=> <FastFoodCard key={p.id} item={p} onAdd={onAdd} />)}
      </div>
    </section>
  )
}

// Bakery menu board: grouped by category with dot leaders and aligned prices
function BakeryMenuBoard({ onAdd, products }) {
  const grouped = useMemo(()=> {
    const map = new Map()
    for (const p of products) {
      const list = map.get(p.category) || []
      list.push(p)
      map.set(p.category, list)
    }
    return Array.from(map.entries())
  }, [products])
  return (
    <section className="menu-column">
      <div className="neon-section-title">Bakery Menu</div>
      {grouped.length === 0 && <div className="small">No products available</div>}
      {grouped.map(([cat, items])=> (
        <div className="menu-category" key={cat}>
          <div className="category-title neon-sub">{cat}</div>
          <div className="menu-list">
            {items.map(item=> (
              <div className="menu-item" key={item.id}>
                <span className="item-name">{item.name}</span>
                <span className="spacer" aria-hidden="true"></span>
                <span className="item-price">₹ {item.price}</span>
                <button className="btn icon" aria-label={`Add ${item.name}`} onClick={()=> onAdd(item)} title="Add to cart">＋</button>
              </div>
            ))}
          </div>
        </div>
      ))}
    </section>
  )
}

// Fast food menu board: grouped by category with half/full prices
function FastFoodMenuBoard({ onAdd, fastFood }) {
  const grouped = useMemo(()=> {
    const map = new Map()
    for (const f of fastFood) {
      const list = map.get(f.category) || []
      list.push(f)
      map.set(f.category, list)
    }
    return Array.from(map.entries())
  }, [fastFood])
  return (
    <section className="menu-column">
      <div className="neon-section-title">Fast Food Corner</div>
      {grouped.length === 0 && <div className="small">No items available</div>}
      {grouped.map(([cat, items])=> (
        <div className="menu-category" key={cat}>
          <div className="category-title neon-sub">{cat}</div>
          <div className="menu-list">
            {items.map(item=> (
              <div className="menu-item" key={item.id}>
                <span className="item-name">{item.name}</span>
                <span className="spacer" aria-hidden="true"></span>
                <span className="item-price">
                  {item.prices?.half && <span className="price-variant">Half ₹ {item.prices.half}</span>}
                  {item.prices?.half && item.prices?.full && <span className="price-sep"> • </span>}
                  {item.prices?.full && <span className="price-variant">Full ₹ {item.prices.full}</span>}
                </span>
                <button className="btn icon" aria-label={`Add ${item.name}`} onClick={()=> onAdd({ id:item.id, name:item.name, price:item.prices?.full ?? item.prices?.half })} title="Add to cart">＋</button>
              </div>
            ))}
          </div>
        </div>
      ))}
    </section>
  )
}

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
      const response = await fetch(`${API_URL}/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      })
      if (!response.ok) throw new Error('Invalid credentials')
      const data = await response.json()
      sessionStorage.setItem('adminAuth', 'true')
      sessionStorage.setItem('adminToken', data.token)
      onLogin()
    } catch (err) {
      setError('Invalid username or password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="section">
      <div className="container" style={{ maxWidth: '480px' }}>
        <div className="section-title">Admin Login</div>
        {error && <div className="card"><div className="card-body"><div className="card-desc" style={{ color: 'crimson' }}>{error}</div></div></div>}
        <form onSubmit={submit} className="form-col">
          <div>
            <label>Username</label>
            <input className="input" value={username} onChange={e => setUsername(e.target.value)} placeholder="admin" disabled={loading} />
          </div>
          <div>
            <label>Password</label>
            <input className="input" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="admin@123" disabled={loading} />
          </div>
          <button className="btn mt-2" type="submit" disabled={loading}>{loading ? 'Logging in...' : 'Login'}</button>
        </form>
      </div>
    </main>
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

  // Products form state
  const [pForm, setPForm] = useState({ id: '', name: '', description: '', price: '', category: '', image: '' })
  // FastFood form state
  const [fForm, setFForm] = useState({ id: '', name: '', category: '', image: '', half: '', full: '' })

  // Fetch data from backend
  useEffect(() => {
    fetchProducts()
    fetchFastFood()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${API_URL}/products`)
      const data = await response.json()
      setProdList(data || [])
    } catch (err) {
      console.error('Error fetching products:', err)
      setMessage('Error loading products')
    } finally {
      setLoading(false)
    }
  }

  const fetchFastFood = async () => {
    try {
      const response = await fetch(`${API_URL}/fastfood`)
      const data = await response.json()
      setFfList(data || [])
    } catch (err) {
      console.error('Error fetching fast food:', err)
    }
  }

  const startEditProduct = (p) => {
    setTab('products')
    setEditing(p.id)
    setPForm({ id: p.id, name: p.name, description: p.description || '', price: String(p.price), category: p.category, image: p.image || '' })
  }

  const startEditFastFood = (f) => {
    setTab('fastfood')
    setEditing(f.id)
    setFForm({ id: f.id, name: f.name, category: f.category, image: f.image || '', half: String(f.prices?.half || ''), full: String(f.prices?.full || '') })
  }

  const saveProduct = async () => {
    if (!pForm.name || !pForm.price || !pForm.category) {
      setMessage('Please fill all required fields')
      return
    }

    try {
      setLoading(true)
      const id = editing || ('p' + Date.now())
      const url = editing ? `${API_URL}/products/${id}` : `${API_URL}/products`
      const method = editing ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id,
          name: pForm.name,
          description: pForm.description,
          price: Number(pForm.price),
          category: pForm.category,
          image: pForm.image
        })
      })

      if (!response.ok) throw new Error('Failed to save product')
      setMessage(editing ? 'Product updated successfully' : 'Product added successfully')
      await fetchProducts()
      resetEditing()
      setPForm({ id: '', name: '', description: '', price: '', category: '', image: '' })
    } catch (err) {
      setMessage('Error saving product: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  const deleteProduct = async (id) => {
    if (!window.confirm('Are you sure?')) return
    try {
      setLoading(true)
      const response = await fetch(`${API_URL}/products/${id}`, { method: 'DELETE' })
      if (!response.ok) throw new Error('Failed to delete')
      setMessage('Product deleted successfully')
      await fetchProducts()
    } catch (err) {
      setMessage('Error deleting product: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  const saveFastFood = async () => {
    if (!fForm.name || !fForm.category || (!fForm.half && !fForm.full)) {
      setMessage('Please fill required fields (at least one price)')
      return
    }

    try {
      setLoading(true)
      const id = editing || ('ff' + Date.now())
      const url = editing ? `${API_URL}/fastfood/${id}` : `${API_URL}/fastfood`
      const method = editing ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id,
          name: fForm.name,
          category: fForm.category,
          image: fForm.image,
          prices: {
            half: fForm.half ? Number(fForm.half) : null,
            full: fForm.full ? Number(fForm.full) : null
          }
        })
      })

      if (!response.ok) throw new Error('Failed to save item')
      setMessage(editing ? 'Item updated successfully' : 'Item added successfully')
      await fetchFastFood()
      resetEditing()
      setFForm({ id: '', name: '', category: '', image: '', half: '', full: '' })
    } catch (err) {
      setMessage('Error saving item: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  const deleteFastFood = async (id) => {
    if (!window.confirm('Are you sure?')) return
    try {
      setLoading(true)
      const response = await fetch(`${API_URL}/fastfood/${id}`, { method: 'DELETE' })
      if (!response.ok) throw new Error('Failed to delete')
      setMessage('Item deleted successfully')
      await fetchFastFood()
    } catch (err) {
      setMessage('Error deleting item: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    sessionStorage.removeItem('adminAuth')
    sessionStorage.removeItem('adminToken')
    window.location.hash = `#/${PAGES.home}`
  }

  if (loading && prodList.length === 0 && ffList.length === 0) {
    return <main className="section"><div className="container">Loading...</div></main>
  }

  return (
    <main className="section">
      <div className="container">
        <div className="section-title">Admin Dashboard</div>
        {message && <div className="card mb-3"><div className="card-body"><div className="card-desc">{message}</div></div></div>}
        <div className="flex gap-2 mb-3" style={{ flexWrap: 'wrap' }}>
          <button className={`btn ${tab === 'products' ? '' : 'outline'}`} onClick={() => setTab('products')}>Products</button>
          <button className={`btn ${tab === 'fastfood' ? '' : 'outline'}`} onClick={() => setTab('fastfood')}>Fast Food</button>
          <button className="btn outline" onClick={logout}>Logout</button>
        </div>

        {tab === 'products' && (
          <div className="grid">
            <div className="card" style={{ gridColumn: '1/-1' }}>
              <div className="card-body">
                <div className="card-title">{editing ? 'Edit Product' : 'Add Product'}</div>
                <div className="form-row">
                  <div><label>Name*</label><input className="input" value={pForm.name} onChange={e => setPForm({ ...pForm, name: e.target.value })} disabled={loading} /></div>
                  <div><label>Category*</label><input className="input" value={pForm.category} onChange={e => setPForm({ ...pForm, category: e.target.value })} disabled={loading} /></div>
                </div>
                <div className="form-row">
                  <div><label>Price*</label><input className="input" type="number" value={pForm.price} onChange={e => setPForm({ ...pForm, price: e.target.value })} disabled={loading} /></div>
                  <div><label>Image URL</label><input className="input" value={pForm.image} onChange={e => setPForm({ ...pForm, image: e.target.value })} disabled={loading} /></div>
                </div>
                <div><label>Description</label><textarea rows="3" className="input" value={pForm.description} onChange={e => setPForm({ ...pForm, description: e.target.value })} disabled={loading} /></div>
                <div className="flex gap-2 mt-2">
                  <button className="btn" onClick={saveProduct} disabled={loading}>{editing ? 'Save' : 'Add'}</button>
                  {editing && <button className="btn outline" onClick={resetEditing} disabled={loading}>Cancel</button>}
                </div>
              </div>
            </div>
            {prodList.map(p => (
              <div className="card" key={p.id}>
                {p.image && <img src={p.image} alt={p.name} loading="lazy" crossOrigin="anonymous" referrerPolicy="no-referrer" />}
                <div className="card-body">
                  <div className="chip" aria-label={p.category}>{p.category}</div>
                  <div className="card-title">{p.name}</div>
                  <div className="card-desc">₹ {p.price}</div>
                  <div className="card-actions">
                    <button className="btn" onClick={() => startEditProduct(p)} disabled={loading}>Edit</button>
                    <button className="btn outline" onClick={() => deleteProduct(p.id)} disabled={loading}>Delete</button>
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
                <div className="card-title">{editing ? 'Edit Fast Food Item' : 'Add Fast Food Item'}</div>
                <div className="form-row">
                  <div><label>Name*</label><input className="input" value={fForm.name} onChange={e => setFForm({ ...fForm, name: e.target.value })} disabled={loading} /></div>
                  <div><label>Category*</label><input className="input" value={fForm.category} onChange={e => setFForm({ ...fForm, category: e.target.value })} disabled={loading} /></div>
                </div>
                <div className="form-row">
                  <div><label>Half Price</label><input className="input" type="number" value={fForm.half} onChange={e => setFForm({ ...fForm, half: e.target.value })} disabled={loading} /></div>
                  <div><label>Full Price</label><input className="input" type="number" value={fForm.full} onChange={e => setFForm({ ...fForm, full: e.target.value })} disabled={loading} /></div>
                </div>
                <div><label>Image URL</label><input className="input" value={fForm.image} onChange={e => setFForm({ ...fForm, image: e.target.value })} disabled={loading} /></div>
                <div className="flex gap-2 mt-2">
                  <button className="btn" onClick={saveFastFood} disabled={loading}>{editing ? 'Save' : 'Add'}</button>
                  {editing && <button className="btn outline" onClick={resetEditing} disabled={loading}>Cancel</button>}
                </div>
              </div>
            </div>
            {ffList.map(f => (
              <div className="card" key={f.id}>
                {f.image && <img src={f.image} alt={f.name} loading="lazy" crossOrigin="anonymous" referrerPolicy="no-referrer" />}
                <div className="card-body">
                  <div className="chip" aria-label={f.category}>{f.category}</div>
                  <div className="card-title">{f.name}</div>
                  <div className="card-desc">{f.prices?.half ? `Half ₹ ${f.prices.half} • ` : ''}{f.prices?.full ? `Full ₹ ${f.prices.full}` : ''}</div>
                  <div className="card-actions">
                    <button className="btn" onClick={() => startEditFastFood(f)} disabled={loading}>Edit</button>
                    <button className="btn outline" onClick={() => deleteFastFood(f.id)} disabled={loading}>Delete</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
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
    const orderItems = form.items || cart.map(i=> `${i.name} x1`).join(', ')
    const text = encodeURIComponent(`Order Request\nName: ${form.name}\nContact: ${form.contact}\nDate: ${form.date}\nItems: ${orderItems}\nNotes: ${form.notes}`)
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`
    window.open(url, '_blank')
  }
  return (
    <main className="section">
      <div className="container">
        <div className="section-title">Order / Pre-Order</div>
        <form onSubmit={onSubmit}>
          <div className="form-row">
            <div>
              <label>Name</label>
              <input className="input" value={form.name} onChange={e=>setForm({...form, name:e.target.value})} required />
            </div>
            <div>
              <label>Contact</label>
              <input className="input" value={form.contact} onChange={e=>setForm({...form, contact:e.target.value})} placeholder="Phone or Email" required />
            </div>
          </div>
          <div className="form-row">
            <div>
              <label>Date</label>
              <input type="date" className="input" value={form.date} onChange={e=>setForm({...form, date:e.target.value})} required />
            </div>
            <div>
              <label>Items</label>
              <input className="input" value={form.items} onChange={e=>setForm({...form, items:e.target.value})} placeholder="Cakes, cookies, etc." />
            </div>
          </div>
          <div className="mb-3">
            <label>Custom Notes</label>
            <textarea rows={4} className="input" value={form.notes} onChange={e=>setForm({...form, notes:e.target.value})} placeholder="Write flavor, size, message, etc." />
          </div>
          <div className="flex gap-2">
            <button className="btn" type="submit">Send on WhatsApp</button>
            <button className="btn outline" type="button" onClick={()=> alert('Online payment integration placeholder (Razorpay/Stripe).')}>Pay Online</button>
          </div>
        </form>
      </div>
    </main>
  )
}

function About() {
  return (
    <main className="section">
      <div className="container">
        <div className="section-title">About Us</div>
        <p className="mb-3">We believe in homemade happiness. Our bakery started with a simple mission: craft warm, cozy, and inviting bakes that bring people together. From the first loaf to every celebration cake, we bake with love.</p>
          <div className="grid">
          <div className="card"><img src="https://placehold.co/1200x800/fff7eb/6b4f3b?text=Our+Team" alt="Team" /></div>
          <div className="card"><img src="https://placehold.co/1200x800/fff7eb/6b4f3b?text=Our+Kitchen" alt="Kitchen" /></div>
          <div className="card"><img src="https://placehold.co/1200x800/fff7eb/6b4f3b?text=Our+Shop" alt="Shop" /></div>
          <div className="card"><img src="https://placehold.co/1200x800/fff7eb/6b4f3b?text=Fresh+Bakes" alt="Fresh Bakes" /></div>
        </div>
      </div>
    </main>
  )
}

function Contact() {
  const [msg, setMsg] = useState({ name:'', email:'', text:'' })
  const onSubmit = (e) => {
    e.preventDefault()
    const mailto = `mailto:corbettbakers@example.com?subject=${encodeURIComponent('Website contact from '+msg.name)}&body=${encodeURIComponent(msg.text + '\n\nReply to: ' + msg.email)}`
    window.location.href = mailto
  }
  return (
    <main className="section">
      <div className="container">
        <div className="section-title">Contact Us</div>
        <form onSubmit={onSubmit}>
          <div className="form-row">
            <div>
              <label>Name</label>
              <input className="input" value={msg.name} onChange={e=>setMsg({...msg, name:e.target.value})} required />
            </div>
            <div>
              <label>Email</label>
              <input type="email" className="input" value={msg.email} onChange={e=>setMsg({...msg, email:e.target.value})} required />
            </div>
          </div>
          <div className="mb-3">
            <label>Message</label>
            <textarea rows={4} className="input" value={msg.text} onChange={e=>setMsg({...msg, text:e.target.value})} required />
          </div>
          <button className="btn" type="submit">Send Email</button>
        </form>
        <div className="mt-4">
          <div className="section-title">Find Us</div>
          <div className="hero-card">
            <iframe title="Map" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3431.8829893200686!2d79.126!3d29.397!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sRamnagar!5e0!3m2!1sen!2sin!4v1700000000000" width="100%" height="320" style={{ border: 0 }} allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
          </div>
        </div>
      </div>
    </main>
  )
}

function App() {
  const { page, navigate } = useHashRoute(PAGES.home)
  const [dark, setDark] = useState(false)
  const [cart, setCart] = useState([])
  const [cartOpen, setCartOpen] = useState(false)
  useEffect(()=> { document.documentElement.classList.toggle('dark', dark) }, [dark])
  const onAdd = (item)=> setCart((c)=> [...c, item])
  const removeFromCart = (idx)=> setCart((c)=> c.filter((_, i)=> i!==idx))
  const total = cart.reduce((sum, i)=> sum + i.price, 0)
  return (
    <>
      <Header navigate={navigate} page={page} toggleDark={()=> setDark(d=> !d)} cartCount={cart.length} onOpenCart={()=> setCartOpen(true)} />
      {page===PAGES.home && <Home navigate={navigate} />}
      {page===PAGES.menu && <Menu onAdd={onAdd} />}
      {page===PAGES.gallery && <Gallery />}
      {page===PAGES.order && <Order cart={cart} />}
      {page===PAGES.about && <About />}
      {page===PAGES.contact && <Contact />}
      {page===PAGES.admin && <Admin />}
      {cartOpen && (
        <>
          <div className="drawer-backdrop" onClick={()=> setCartOpen(false)} />
          <aside className="drawer">
            <div className="drawer-header">Your Cart ({cart.length})</div>
            <div className="drawer-body">
              {cart.length===0 && <div className="small">Your cart is empty.</div>}
              {cart.map((item, idx)=> (
                <div className="drawer-item" key={idx}>
                  <div>
                    <div className="card-title">{item.name}</div>
                    <div className="small">₹ {item.price}</div>
                  </div>
                  <button className="btn outline" onClick={()=> removeFromCart(idx)}>Remove</button>
                </div>
              ))}
            </div>
            <div className="drawer-footer">
              <div className="justify-between flex items-center mb-2">
                <div className="card-title">Total</div>
                <div className="card-title">₹ {total}</div>
              </div>
              <div className="flex gap-2">
                <button className="btn" onClick={()=> { setCartOpen(false); navigate(PAGES.order) }}>Checkout</button>
                <button className="btn outline" onClick={()=> setCartOpen(false)}>Continue Shopping</button>
              </div>
            </div>
          </aside>
        </>
      )}
      <a className="fab" href="https://wa.me/919999999999" target="_blank" rel="noreferrer">Chat on WhatsApp</a>
      <Footer />
    </>
  )
}

export default App
