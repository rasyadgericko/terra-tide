/* ============================================
   TERRA & TIDE — Main Script
   ============================================ */

// --- Product Data ---
const PRODUCTS = [
  { id: 1, name: 'KOMOREBI LINEN', price: 240, category: 'TEXTILES', image: 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&q=80&w=1200', specs: 'ORGANIC FLAX / 400TC' },
  { id: 2, name: 'HINOKI TOTEM', price: 45, category: 'FRAGRANCE', image: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&q=80&w=1200', specs: 'SOY WAX / 80H BURN' },
  { id: 3, name: 'NAMI OAK STOOL', price: 310, category: 'FURNITURE', image: 'https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&q=80&w=1200', specs: 'RECLAIMED OAK / 4KG' },
  { id: 4, name: 'CERAMIC CARAFE', price: 85, category: 'OBJECTS', image: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&q=80&w=1200', specs: 'MATTE CLAY / 800ML' },
  { id: 5, name: 'SHOU SUGI SHELF', price: 195, category: 'FURNITURE', image: 'https://images.unsplash.com/photo-1532372576444-dda954194ad0?auto=format&fit=crop&q=80&w=1200', specs: 'CHARRED CEDAR / 2.4KG' },
  { id: 6, name: 'WABI THROW', price: 180, category: 'TEXTILES', image: 'https://images.unsplash.com/photo-1616627561950-9f746e330187?auto=format&fit=crop&q=80&w=1200', specs: 'MERINO WOOL / 150×200CM' },
  { id: 7, name: 'STONE MORTAR SET', price: 120, category: 'OBJECTS', image: 'https://images.unsplash.com/photo-1631125915902-d8abe9225ff2?auto=format&fit=crop&q=80&w=1200', specs: 'VOLCANIC BASALT / 1.8KG' },
  { id: 8, name: 'TATAMI CUSHION', price: 75, category: 'TEXTILES', image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=1200', specs: 'ORGANIC COTTON / 45×45CM' },
  { id: 9, name: 'KAZE DIFFUSER', price: 65, category: 'FRAGRANCE', image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&q=80&w=1200', specs: 'CERAMIC / 200ML' },
  { id: 10, name: 'TEAK SIDE TABLE', price: 420, category: 'FURNITURE', image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=1200&seed=table', specs: 'RECLAIMED TEAK / 6KG' },
  { id: 11, name: 'LAVA BOWL', price: 95, category: 'OBJECTS', image: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&q=80&w=1200', specs: 'STONEWARE / 28CM DIA' },
  { id: 12, name: 'CEDAR INCENSE', price: 28, category: 'FRAGRANCE', image: 'https://images.unsplash.com/photo-1616627451515-cbc80e5ece35?auto=format&fit=crop&q=80&w=1200', specs: 'JAPANESE CEDAR / 40 STICKS' }
];

const PRODUCTS_PER_PAGE = 4;
let visibleProducts = PRODUCTS_PER_PAGE;
let cart = [];

// ── SUPABASE ──────────────────────────────────────────────────────────────────
// IMPORTANT: Replace these with your Supabase project credentials.
// Find them in your Supabase dashboard → Project Settings → API
const SUPABASE_URL = 'https://nymxhmekhiwifkaccafc.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im55bXhobWVraGl3aWZrYWNjYWZjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIwMDM1OTQsImV4cCI6MjA4NzU3OTU5NH0.gkEX4CDqTcmu2odg-GlepcXuZe3pEvWrYaVKu4PmIuk';
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ── AUTH + CHECKOUT STATE ─────────────────────────────────────────────────────
let currentUser = null;
let checkoutStep = 1;
let checkoutData = {};

// --- Initialization ---
function init() {
  renderMarquee();
  renderProducts();
  renderCart();
  updateProductCount();
  initScrollReveal();
  initTestimonialCarousel();
  initAuth();
  lucide.createIcons();
}

// --- Marquee ---
function renderMarquee() {
  const container = document.getElementById('marquee-content');
  let html = '';
  for (let i = 0; i < 4; i++) {
    html += `
      <div class="flex items-center shrink-0">
        <span class="mx-8">Radical Transparency</span>
        <span class="w-1.5 h-1.5 bg-[#F2F2F2] rounded-full"></span>
        <span class="mx-8">Zero Waste Supply Chain</span>
        <span class="w-1.5 h-1.5 bg-[#F2F2F2] rounded-full"></span>
        <span class="mx-8">100% Traceable Materials</span>
        <span class="w-1.5 h-1.5 bg-[#F2F2F2] rounded-full"></span>
      </div>
    `;
  }
  container.innerHTML = html;
}

// --- Products ---
function renderProducts() {
  const container = document.getElementById('products-grid');
  const productsToShow = PRODUCTS.slice(0, visibleProducts);

  container.innerHTML = productsToShow.map((product, index) => `
    <div class="bg-[#F2F2F2] group flex flex-col relative product-card" style="animation: productFadeIn 0.5s ease ${index * 0.05}s both;">
      <div class="p-4 border-b border-[#D4D4D4] flex justify-between items-center bg-[#F2F2F2] z-10">
        <span class="text-[10px] font-bold tracking-widest uppercase">${product.category}</span>
        <span class="text-[10px] font-mono bg-gray-200 px-2 py-1">ID: ${String(product.id).padStart(2, '0')}</span>
      </div>
      
      <div class="relative aspect-square overflow-hidden bg-gray-100">
        <img 
          src="${product.image}" 
          class="w-full h-full object-cover filter contrast-[1.1] saturate-[0.85] transition-transform duration-700 group-hover:scale-110" 
          alt="${product.name} — ${product.specs}"
          loading="lazy"
          decoding="async"
        />
        <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-sm">
          <button 
            onclick="addToCart(${product.id})"
            aria-label="Add ${product.name} to cart"
            class="bg-[#F2F2F2] text-[#0A0A0A] px-6 py-3 text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-white hover:scale-105 transition-all flex items-center gap-2"
          >
            <i data-lucide="plus" width="14" height="14" aria-hidden="true"></i> Add to Cart
          </button>
        </div>
      </div>
      
      <div class="p-6 flex-1 flex flex-col justify-between bg-[#F2F2F2] z-10">
        <div class="mb-4">
          <h4 class="text-xl font-extrabold tracking-tight uppercase mb-1">${product.name}</h4>
          <p class="text-[10px] font-mono text-gray-500 uppercase">${product.specs}</p>
        </div>
        <div class="flex justify-between items-center pt-4 border-t border-[#D4D4D4]">
          <span class="font-mono text-lg font-bold">$${product.price}</span>
          <button 
            onclick="addToCart(${product.id})"
            aria-label="Add ${product.name} to cart"
            class="w-8 h-8 rounded-full border border-[#0A0A0A] flex items-center justify-center hover:bg-[#0A0A0A] hover:text-[#F2F2F2] transition-colors md:hidden"
          >
            <i data-lucide="plus" width="14" height="14" aria-hidden="true"></i>
          </button>
        </div>
      </div>
    </div>
  `).join('');

  updateLoadMoreButton();
  updateProductCount();
  lucide.createIcons();
}

function loadMoreProducts() {
  visibleProducts = Math.min(visibleProducts + PRODUCTS_PER_PAGE, PRODUCTS.length);
  renderProducts();
}

function updateLoadMoreButton() {
  const btn = document.getElementById('load-more-btn');
  if (!btn) return;

  const remaining = PRODUCTS.length - visibleProducts;
  if (remaining <= 0) {
    btn.style.display = 'none';
  } else {
    btn.style.display = 'flex';
    btn.querySelector('.load-more-count').textContent = `${remaining} more`;
  }
}

function updateProductCount() {
  const countEl = document.getElementById('products-count');
  if (countEl) {
    countEl.textContent = `[${String(visibleProducts).padStart(2, '0')} / ${String(PRODUCTS.length).padStart(2, '0')} ITEMS]`;
  }
}

// --- Cart Functions ---
function addToCart(productId) {
  const product = PRODUCTS.find(p => p.id === productId);
  const existing = cart.find(item => item.id === productId);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  openCart();
  renderCart();
}

function updateQty(productId, delta) {
  const item = cart.find(i => i.id === productId);
  if (item) {
    item.quantity = Math.max(1, item.quantity + delta);
    renderCart();
  }
}

function removeFromCart(productId) {
  cart = cart.filter(i => i.id !== productId);
  renderCart();
}

function openCart() {
  document.body.style.overflow = 'hidden';
  document.getElementById('cart-drawer').classList.remove('translate-x-full');
  document.getElementById('cart-overlay').classList.remove('opacity-0', 'pointer-events-none');
}

function closeCart() {
  document.body.style.overflow = 'unset';
  document.getElementById('cart-drawer').classList.add('translate-x-full');
  document.getElementById('cart-overlay').classList.add('opacity-0', 'pointer-events-none');
}

function renderCart() {
  const container = document.getElementById('cart-items-container');
  const footer = document.getElementById('cart-footer');

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  document.getElementById('cart-count-badge').textContent = totalItems;
  document.getElementById('cart-drawer-count').textContent = totalItems;

  if (cart.length === 0) {
    container.innerHTML = `
      <div class="h-full flex flex-col items-center justify-center text-center p-8">
        <p class="text-sm font-bold uppercase tracking-widest text-gray-400 mb-6">No items selected.</p>
        <button onclick="closeCart()" class="bg-[#0A0A0A] text-[#F2F2F2] px-8 py-4 text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-gray-800 w-full max-w-xs">
          Return to Shop
        </button>
      </div>
    `;
    footer.classList.add('hidden');
    footer.classList.remove('flex');
  } else {
    container.innerHTML = `
      <div class="flex flex-col">
        ${cart.map(item => `
          <div class="flex gap-4 p-4 border-b border-[#D4D4D4]">
            <div class="w-20 h-24 bg-gray-200 shrink-0 border border-[#D4D4D4]">
              <img src="${item.image}" class="w-full h-full object-cover filter contrast-[1.1]" alt="${item.name}" loading="lazy" decoding="async" />
            </div>
            <div class="flex-1 flex flex-col justify-between">
              <div>
                <div class="flex justify-between items-start mb-1">
                  <h4 class="font-bold text-sm tracking-tight uppercase pr-4">${item.name}</h4>
                  <button onclick="removeFromCart(${item.id})" aria-label="Remove ${item.name} from cart" class="text-gray-400 hover:text-red-500 transition-colors shrink-0">
                    <i data-lucide="x" width="16" height="16" aria-hidden="true"></i>
                  </button>
                </div>
                <p class="text-[10px] font-mono text-gray-500 uppercase">${item.category}</p>
              </div>
              
              <div class="flex justify-between items-end">
                <div class="flex items-center border border-[#D4D4D4] bg-white" role="group" aria-label="${item.name} quantity">
                  <button onclick="updateQty(${item.id}, -1)" aria-label="Decrease quantity" class="w-8 h-8 flex items-center justify-center hover:bg-gray-100 transition-colors">
                    <i data-lucide="minus" width="12" height="12" aria-hidden="true"></i>
                  </button>
                  <span class="w-8 text-center font-mono text-[11px] font-bold" aria-live="polite">${item.quantity}</span>
                  <button onclick="updateQty(${item.id}, 1)" aria-label="Increase quantity" class="w-8 h-8 flex items-center justify-center hover:bg-gray-100 transition-colors">
                    <i data-lucide="plus" width="12" height="12" aria-hidden="true"></i>
                  </button>
                </div>
                <span class="font-mono font-bold">$${item.price * item.quantity}</span>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    `;

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    document.getElementById('cart-total').textContent = `$${total}`;

    footer.classList.remove('hidden');
    footer.classList.add('flex');
  }

  lucide.createIcons();
}

// --- Scroll Reveal (Intersection Observer) ---
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');
  if (!reveals.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -40px 0px'
  });

  reveals.forEach(el => observer.observe(el));
}

// --- Testimonial Carousel ---
let testimonialIndex = 0;
let testimonialAutoplay = null;

function initTestimonialCarousel() {
  const track = document.getElementById('testimonial-track');
  if (!track) return;

  updateTestimonialPosition();
  startTestimonialAutoplay();

  // Pause autoplay on hover
  const wrapper = track.closest('.testimonial-track-wrapper');
  if (wrapper) {
    wrapper.addEventListener('mouseenter', stopTestimonialAutoplay);
    wrapper.addEventListener('mouseleave', startTestimonialAutoplay);
  }
}

function getTestimonialSlidesPerView() {
  if (window.innerWidth >= 1024) return 3;
  if (window.innerWidth >= 768) return 2;
  return 1;
}

function getTestimonialMaxIndex() {
  const cards = document.querySelectorAll('.testimonial-card');
  const perView = getTestimonialSlidesPerView();
  return Math.max(0, cards.length - perView);
}

function goToTestimonial(index) {
  testimonialIndex = Math.max(0, Math.min(index, getTestimonialMaxIndex()));
  updateTestimonialPosition();
  updateTestimonialDots();
}

function updateTestimonialPosition() {
  const track = document.getElementById('testimonial-track');
  if (!track) return;
  const perView = getTestimonialSlidesPerView();
  const offset = -(testimonialIndex * (100 / perView));
  track.style.transform = `translateX(${offset}%)`;
}

function updateTestimonialDots() {
  const dots = document.querySelectorAll('.testimonial-dot');
  dots.forEach((dot, i) => {
    const isActive = i === testimonialIndex;
    dot.classList.toggle('active', isActive);
    dot.setAttribute('aria-current', isActive ? 'true' : 'false');
  });
}

function startTestimonialAutoplay() {
  stopTestimonialAutoplay();
  testimonialAutoplay = setInterval(() => {
    const maxIndex = getTestimonialMaxIndex();
    testimonialIndex = testimonialIndex >= maxIndex ? 0 : testimonialIndex + 1;
    updateTestimonialPosition();
    updateTestimonialDots();
  }, 4500);
}

function stopTestimonialAutoplay() {
  if (testimonialAutoplay) {
    clearInterval(testimonialAutoplay);
    testimonialAutoplay = null;
  }
}

function prevTestimonial() {
  const maxIndex = getTestimonialMaxIndex();
  testimonialIndex = testimonialIndex <= 0 ? maxIndex : testimonialIndex - 1;
  updateTestimonialPosition();
  updateTestimonialDots();
  stopTestimonialAutoplay();
  startTestimonialAutoplay();
}

function nextTestimonial() {
  const maxIndex = getTestimonialMaxIndex();
  testimonialIndex = testimonialIndex >= maxIndex ? 0 : testimonialIndex + 1;
  updateTestimonialPosition();
  updateTestimonialDots();
  stopTestimonialAutoplay();
  startTestimonialAutoplay();
}

// Handle resize
window.addEventListener('resize', () => {
  updateTestimonialPosition();
  updateTestimonialDots();
});

// --- Back to Top ---
function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// --- Section Scroll ---
function scrollToSection(id) {
  const el = document.getElementById(id);
  if (!el) return;
  const top = el.getBoundingClientRect().top + window.pageYOffset - 72;
  window.scrollTo({ top, behavior: 'smooth' });
}

// --- Newsletter ---
function subscribeNewsletter() {
  const input = document.getElementById('newsletter-email');
  const btn = document.getElementById('newsletter-btn');
  const email = input.value.trim();

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    input.style.borderBottomColor = '#ef4444';
    input.focus();
    return;
  }

  input.style.borderBottomColor = '';
  input.value = '';
  input.placeholder = "You're on the list.";
  input.disabled = true;
  btn.textContent = 'Subscribed ✓';
  btn.disabled = true;
  btn.style.opacity = '0.7';
}

// --- Mobile Menu ---
function toggleMobileMenu() {
  const menu = document.getElementById('mobile-menu');
  const toggle = document.getElementById('mobile-menu-toggle');
  const isOpen = !menu.classList.contains('opacity-0');
  if (isOpen) {
    closeMobileMenu();
  } else {
    menu.classList.remove('opacity-0', 'pointer-events-none');
    document.body.style.overflow = 'hidden';
    if (toggle) toggle.setAttribute('aria-expanded', 'true');
    lucide.createIcons();
  }
}

function closeMobileMenu() {
  const menu = document.getElementById('mobile-menu');
  const toggle = document.getElementById('mobile-menu-toggle');
  menu.classList.add('opacity-0', 'pointer-events-none');
  document.body.style.overflow = '';
  if (toggle) toggle.setAttribute('aria-expanded', 'false');
}

// ══════════════════════════════════════════════════════════════════════════════
//  AUTH
// ══════════════════════════════════════════════════════════════════════════════

async function initAuth() {
  const { data: { session } } = await supabaseClient.auth.getSession();
  if (session?.user) {
    currentUser = session.user;
    updateNavForAuth(currentUser);
  }
  supabaseClient.auth.onAuthStateChange((_event, session) => {
    currentUser = session?.user ?? null;
    updateNavForAuth(currentUser);
  });
}

function handleAccountClick() {
  if (currentUser) {
    openAccountDashboard();
  } else {
    openAuthModal();
  }
}

function openAuthModal() {
  const overlay = document.getElementById('auth-overlay');
  overlay.classList.remove('opacity-0', 'pointer-events-none');
  document.body.style.overflow = 'hidden';
  document.getElementById('auth-error-signin').classList.add('hidden');
  document.getElementById('auth-error-signup').classList.add('hidden');
  document.getElementById('signin-email').value = '';
  document.getElementById('signin-password').value = '';
  document.getElementById('signup-name').value = '';
  document.getElementById('signup-email').value = '';
  document.getElementById('signup-password').value = '';
  switchAuthTab('signin');
  lucide.createIcons();
}

function closeAuthModal(e) {
  if (e && e.target !== document.getElementById('auth-overlay')) return;
  const overlay = document.getElementById('auth-overlay');
  overlay.classList.add('opacity-0', 'pointer-events-none');
  document.body.style.overflow = '';
}

function closeAuthModalDirect() {
  const overlay = document.getElementById('auth-overlay');
  overlay.classList.add('opacity-0', 'pointer-events-none');
  document.body.style.overflow = '';
}

function switchAuthTab(tab) {
  const signinForm = document.getElementById('auth-signin-form');
  const signupForm = document.getElementById('auth-signup-form');
  const tabSignin = document.getElementById('tab-signin');
  const tabSignup = document.getElementById('tab-signup');

  if (tab === 'signin') {
    signinForm.classList.remove('hidden');
    signupForm.classList.add('hidden');
    tabSignin.classList.add('active');
    tabSignup.classList.remove('active');
  } else {
    signinForm.classList.add('hidden');
    signupForm.classList.remove('hidden');
    tabSignin.classList.remove('active');
    tabSignup.classList.add('active');
  }
}

async function handleSignIn() {
  const email = document.getElementById('signin-email').value.trim();
  const password = document.getElementById('signin-password').value;
  const errorEl = document.getElementById('auth-error-signin');

  if (!email || !password) {
    errorEl.textContent = 'Please enter your email and password.';
    errorEl.classList.remove('hidden');
    return;
  }

  const btn = document.getElementById('signin-btn');
  btn.textContent = 'Signing in...';
  btn.disabled = true;

  const { error } = await supabaseClient.auth.signInWithPassword({ email, password });

  btn.textContent = 'Sign In';
  btn.disabled = false;

  if (error) {
    errorEl.textContent = error.message;
    errorEl.classList.remove('hidden');
  } else {
    errorEl.classList.add('hidden');
    closeAuthModalDirect();
  }
}

async function handleSignUp() {
  const name = document.getElementById('signup-name').value.trim();
  const email = document.getElementById('signup-email').value.trim();
  const password = document.getElementById('signup-password').value;
  const errorEl = document.getElementById('auth-error-signup');

  if (!name || !email || !password) {
    errorEl.textContent = 'All fields are required.';
    errorEl.classList.remove('hidden');
    return;
  }
  if (password.length < 6) {
    errorEl.textContent = 'Password must be at least 6 characters.';
    errorEl.classList.remove('hidden');
    return;
  }

  const btn = document.getElementById('signup-btn');
  btn.textContent = 'Creating account...';
  btn.disabled = true;

  const { error } = await supabaseClient.auth.signUp({
    email,
    password,
    options: { data: { full_name: name } }
  });

  btn.textContent = 'Create Account';
  btn.disabled = false;

  if (error) {
    errorEl.textContent = error.message;
    errorEl.classList.remove('hidden');
  } else {
    errorEl.classList.add('hidden');
    closeAuthModalDirect();
  }
}

async function handleSignOut() {
  await supabaseClient.auth.signOut();
  closeAccountDashboard();
}

function updateNavForAuth(user) {
  const btn = document.getElementById('account-nav-btn');
  if (!btn) return;
  if (user) {
    const name = user.user_metadata?.full_name?.split(' ')[0] || 'Account';
    btn.textContent = name;
  } else {
    btn.textContent = 'Account';
  }
}

// ══════════════════════════════════════════════════════════════════════════════
//  ACCOUNT DASHBOARD
// ══════════════════════════════════════════════════════════════════════════════

function openAccountDashboard() {
  const overlay = document.getElementById('account-overlay');
  overlay.classList.remove('opacity-0', 'pointer-events-none');
  document.body.style.overflow = 'hidden';
  renderAccountDashboard();
  lucide.createIcons();
}

function closeAccountDashboard() {
  const overlay = document.getElementById('account-overlay');
  overlay.classList.add('opacity-0', 'pointer-events-none');
  document.body.style.overflow = '';
}

function renderAccountDashboard() {
  if (!currentUser) return;

  const name = currentUser.user_metadata?.full_name || 'There';
  document.getElementById('account-welcome').textContent = `Welcome Back, ${name.split(' ')[0]}.`;
  document.getElementById('account-email-display').textContent = currentUser.email;

  const ordersSection = document.getElementById('account-orders-section');
  const lastOrder = JSON.parse(localStorage.getItem('lastOrder') || 'null');

  if (!lastOrder) {
    ordersSection.innerHTML = `
      <div class="account-section-card">
        <span class="text-[10px] font-mono text-gray-500 uppercase tracking-widest block mb-4">Order History</span>
        <p class="text-sm text-gray-400 uppercase tracking-wide font-medium">No orders yet.</p>
      </div>
    `;
    return;
  }

  const deliveryDate = new Date(lastOrder.createdAt);
  const days = lastOrder.shippingMethod === 'express' ? 2 : 6;
  deliveryDate.setDate(deliveryDate.getDate() + days);
  const deliveryStr = deliveryDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  ordersSection.innerHTML = `
    <div class="account-section-card">
      <span class="text-[10px] font-mono text-gray-500 uppercase tracking-widest block mb-6">Order History</span>
      <div class="account-order-card">
        <div class="flex justify-between items-start flex-wrap gap-4">
          <div>
            <span class="account-order-badge">${lastOrder.orderNumber}</span>
            <p class="text-[10px] font-mono text-gray-500 uppercase mt-3">Placed ${new Date(lastOrder.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
          </div>
          <div class="text-right">
            <span class="text-[10px] font-mono text-gray-500 uppercase tracking-widest block">Status</span>
            <span class="text-sm font-bold uppercase tracking-wide">Confirmed</span>
          </div>
        </div>
        <div class="border-t border-[#D4D4D4] pt-4 flex flex-col gap-3">
          ${lastOrder.items.map(item => `
            <div class="flex justify-between items-center">
              <div>
                <p class="text-sm font-bold uppercase tracking-wide">${item.name}</p>
                <p class="text-[10px] font-mono text-gray-500 uppercase">Qty: ${item.quantity}</p>
              </div>
              <span class="font-mono text-sm font-bold">$${item.price * item.quantity}</span>
            </div>
          `).join('')}
        </div>
        <div class="border-t border-[#D4D4D4] pt-4 flex flex-col gap-2">
          <div class="flex justify-between text-[11px] font-mono uppercase text-gray-500">
            <span>Shipping (${lastOrder.shippingMethod === 'express' ? 'Express' : 'Standard'})</span>
            <span>${lastOrder.shippingCost === 0 ? 'Free' : '$' + lastOrder.shippingCost}</span>
          </div>
          <div class="flex justify-between items-end">
            <span class="text-[11px] font-bold uppercase tracking-widest">Total</span>
            <span class="font-mono text-xl font-bold">$${lastOrder.total}</span>
          </div>
        </div>
        <div class="border-t border-[#D4D4D4] pt-4">
          <p class="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Est. Delivery</p>
          <p class="text-sm font-bold uppercase tracking-wide mt-1">${deliveryStr}</p>
        </div>
      </div>
    </div>
  `;
}

// ══════════════════════════════════════════════════════════════════════════════
//  CHECKOUT
// ══════════════════════════════════════════════════════════════════════════════

function openCheckout() {
  closeCart();
  checkoutStep = 1;
  checkoutData = { shippingMethod: 'standard', shippingCost: 0 };

  // Pre-fill email if logged in
  if (currentUser) {
    setTimeout(() => {
      const emailField = document.getElementById('co-email');
      if (emailField) emailField.value = currentUser.email;
    }, 50);
  }

  const overlay = document.getElementById('checkout-overlay');
  overlay.classList.remove('opacity-0', 'pointer-events-none');
  document.body.style.overflow = 'hidden';

  showCheckoutStep(1);
  lucide.createIcons();
}

function closeCheckout() {
  const overlay = document.getElementById('checkout-overlay');
  overlay.classList.add('opacity-0', 'pointer-events-none');
  document.body.style.overflow = '';
  checkoutStep = 1;
  checkoutData = {};
}

function showCheckoutStep(step) {
  const panels = ['checkout-step-1', 'checkout-step-2', 'checkout-step-3', 'checkout-confirmation'];
  panels.forEach(id => document.getElementById(id)?.classList.add('hidden'));

  if (step === 'confirm') {
    document.getElementById('checkout-confirmation').classList.remove('hidden');
  } else {
    document.getElementById(`checkout-step-${step}`)?.classList.remove('hidden');
  }

  // Update step indicators
  document.querySelectorAll('.checkout-step-indicator').forEach(el => {
    const s = parseInt(el.dataset.step);
    el.classList.remove('active', 'done');
    if (s === step) el.classList.add('active');
    else if (s < step) el.classList.add('done');
  });

  lucide.createIcons();
}

function validateStep(step) {
  if (step === 1) {
    const email = document.getElementById('co-email').value.trim();
    const phone = document.getElementById('co-phone').value.trim();
    const err = document.getElementById('co-error-1');
    if (!email || !phone) {
      err.textContent = 'Please fill in all fields.';
      err.classList.remove('hidden');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      err.textContent = 'Please enter a valid email address.';
      err.classList.remove('hidden');
      return false;
    }
    err.classList.add('hidden');
    checkoutData.email = email;
    checkoutData.phone = phone;
    return true;
  }

  if (step === 2) {
    const fields = ['co-name', 'co-address1', 'co-city', 'co-state', 'co-zip', 'co-country'];
    const values = fields.map(id => document.getElementById(id).value.trim());
    const err = document.getElementById('co-error-2');
    if (values.some(v => !v)) {
      err.textContent = 'Please fill in all required fields.';
      err.classList.remove('hidden');
      return false;
    }
    err.classList.add('hidden');
    checkoutData.name = values[0];
    checkoutData.address1 = values[1];
    checkoutData.address2 = document.getElementById('co-address2').value.trim();
    checkoutData.city = values[2];
    checkoutData.state = values[3];
    checkoutData.zip = values[4];
    checkoutData.country = values[5];
    return true;
  }

  return true;
}

function goToStep(step) {
  if (step > checkoutStep && !validateStep(checkoutStep)) return;
  if (step === 3) renderOrderSummary();
  checkoutStep = step;
  showCheckoutStep(step);
}

function selectShipping(method) {
  checkoutData.shippingMethod = method;
  checkoutData.shippingCost = method === 'express' ? 15 : 0;

  document.querySelectorAll('.checkout-shipping-option').forEach(el => {
    el.classList.toggle('selected', el.dataset.method === method);
  });
}

function renderOrderSummary() {
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shippingCost = checkoutData.shippingCost ?? 0;
  const total = subtotal + shippingCost;
  const method = checkoutData.shippingMethod === 'express' ? 'Express ($15)' : 'Standard (Free)';

  document.getElementById('checkout-order-summary').innerHTML = `
    <div class="flex flex-col gap-0 border border-[#D4D4D4] mb-8">
      ${cart.map(item => `
        <div class="checkout-summary-row px-6">
          <div class="checkout-summary-item">
            <div class="w-14 h-16 bg-gray-100 shrink-0 border border-[#D4D4D4] overflow-hidden">
              <img src="${item.image}" class="w-full h-full object-cover" alt="${item.name}" />
            </div>
            <div>
              <p class="text-sm font-bold uppercase tracking-wide">${item.name}</p>
              <p class="text-[10px] font-mono text-gray-500 uppercase">${item.category}</p>
              <p class="text-[10px] font-mono text-gray-500 mt-1">Qty: ${item.quantity}</p>
            </div>
          </div>
          <span class="font-mono font-bold text-sm">$${item.price * item.quantity}</span>
        </div>
      `).join('')}
      <div class="checkout-summary-row px-6">
        <span class="text-[11px] font-mono uppercase text-gray-500">Shipping</span>
        <span class="text-[11px] font-mono uppercase text-gray-500">${method}</span>
      </div>
      <div class="checkout-summary-row px-6 border-b-0">
        <span class="text-[11px] font-bold uppercase tracking-widest">Total</span>
        <span class="font-mono text-xl font-bold">$${total}</span>
      </div>
    </div>
    <div class="border border-[#D4D4D4] p-6 mb-8">
      <p class="text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-3">Shipping to</p>
      <p class="text-sm font-bold uppercase tracking-wide">${checkoutData.name}</p>
      <p class="text-[11px] font-mono text-gray-500 uppercase mt-1">${checkoutData.address1}${checkoutData.address2 ? ', ' + checkoutData.address2 : ''}, ${checkoutData.city}, ${checkoutData.state} ${checkoutData.zip}, ${checkoutData.country}</p>
    </div>
  `;
}

function generateOrderNumber() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = 'TT-';
  for (let i = 0; i < 6; i++) result += chars[Math.floor(Math.random() * chars.length)];
  return result;
}

async function submitOrder() {
  const btn = document.getElementById('place-order-btn');
  btn.textContent = 'Placing order...';
  btn.disabled = true;

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shippingCost = checkoutData.shippingCost ?? 0;
  const total = subtotal + shippingCost;
  const orderNumber = generateOrderNumber();
  const createdAt = new Date().toISOString();

  const orderPayload = {
    order_number: orderNumber,
    items: cart.map(i => ({ id: i.id, name: i.name, category: i.category, price: i.price, quantity: i.quantity })),
    contact: { email: checkoutData.email, phone: checkoutData.phone },
    shipping: {
      name: checkoutData.name, address1: checkoutData.address1,
      address2: checkoutData.address2, city: checkoutData.city,
      state: checkoutData.state, zip: checkoutData.zip, country: checkoutData.country
    },
    shipping_method: checkoutData.shippingMethod,
    subtotal,
    shipping_cost: shippingCost,
    total,
    status: 'confirmed'
  };

  // Save to Supabase if user is logged in
  if (currentUser) {
    await supabaseClient.from('orders').insert({ ...orderPayload, user_id: currentUser.id });
  }

  // Cache in localStorage for account dashboard
  localStorage.setItem('lastOrder', JSON.stringify({
    orderNumber,
    items: orderPayload.items,
    shippingMethod: checkoutData.shippingMethod,
    shippingCost,
    total,
    createdAt
  }));

  // Show confirmation
  showConfirmation(orderNumber, total);
  cart = [];
  renderCart();
}

function showConfirmation(orderNumber, total) {
  const deliveryDays = checkoutData.shippingMethod === 'express' ? 2 : 6;
  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + deliveryDays);
  const deliveryStr = deliveryDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  document.getElementById('co-order-number').textContent = `ORDER // ${orderNumber}`;
  document.getElementById('co-delivery-date').textContent = `Est. Delivery: ${deliveryStr}`;
  document.getElementById('co-confirm-total').textContent = `$${total}`;

  showCheckoutStep('confirm');
}

// --- DOM Ready ---
document.addEventListener('DOMContentLoaded', init);
