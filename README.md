# Terra & Tide

> Engineered for Longevity — High-performance homewares crafted from traceable, organic materials.

A single-page e-commerce demo site built as a case study. No build tools, no frameworks — just vanilla HTML, CSS, and JavaScript.

---

## Stack

| Layer | Technology |
|---|---|
| Markup | HTML5 |
| Styling | CSS + Tailwind CSS (CDN) |
| Logic | Vanilla JavaScript |
| Icons | Lucide (CDN) |
| Fonts | Manrope + Space Mono (Google Fonts) |
| Backend | Supabase (Auth + Database) |

---

## Features

- **Product catalog** — 12 products across 4 categories (Textiles, Furniture, Fragrance, Objects) with category filtering and load-more pagination
- **Shopping cart** — Add/remove items, quantity controls, persistent cart badge
- **Authentication** — Sign up / sign in / sign out via Supabase Auth
- **3-step checkout** — Contact → Shipping → Review → Confirmation, with order saved to Supabase
- **Account dashboard** — View signed-in email and last order summary
- **Testimonial carousel** — Auto-advancing with manual controls
- **Scroll reveal animations** — Elements animate in as they enter the viewport
- **Marquee banner** — Animated scrolling brand values strip
- **Responsive layout** — Mobile-friendly with collapsible nav

---

## Project Structure

```
Terra & Tide/
├── index.html      # All markup and overlay panels
├── styles.css      # Custom styles, animations, and overrides
├── script.js       # All application logic and state
└── favicon.svg     # SVG favicon
```

---

## Setup

### 1. Clone / download

No install step required. Open `index.html` directly in a browser, or serve with any static file server:

```bash
npx serve .
# or
python3 -m http.server
```

### 2. Connect Supabase

1. Create a free project at [supabase.com](https://supabase.com)
2. Go to **Project Settings → API** and copy your URL and anon key
3. Replace the placeholders in `script.js` lines 28–29:

```js
const SUPABASE_URL = 'YOUR_SUPABASE_URL';
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';
```

### 3. Create the orders table

Run the following SQL in your Supabase **SQL Editor**:

```sql
create table orders (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete set null,
  order_number text not null,
  items jsonb not null,
  contact jsonb not null,
  shipping jsonb not null,
  shipping_method text not null,
  subtotal numeric not null,
  shipping_cost numeric not null,
  total numeric not null,
  status text default 'confirmed',
  created_at timestamptz default now()
);

alter table orders enable row level security;

create policy "Users can view own orders" on orders
  for select using (auth.uid() = user_id);

create policy "Users can insert own orders" on orders
  for insert with check (auth.uid() = user_id);
```

### 4. (Optional) Disable email confirmation

For development, go to **Authentication → Providers → Email** in Supabase and disable **Confirm email** so sign-ups work instantly.

---

## Design Tokens

| Token | Value |
|---|---|
| Page background | `#E5E5E5` |
| Panel background | `#F2F2F2` |
| Dark / ink | `#0A0A0A` |
| Border | `#D4D4D4` |
| Body font | Manrope |
| Mono / label font | Space Mono |

All labels use uppercase + wide letter-spacing (`tracking-widest`).

---

## Architecture Notes

- All state is held in global JS variables: `cart`, `currentUser`, `checkoutStep`, `checkoutData`
- Overlays use an `opacity-0 pointer-events-none` toggle pattern
- z-index stack: nav `z-40` → cart `z-50` → auth / checkout / account `z-[60]`
- Orders are saved to both Supabase (if signed in) and `localStorage`
