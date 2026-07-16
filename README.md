# Plant Pot – Plant Shop (Frontend)

### **Programming Hero | Batch-13 | SCIC | Assignment on TypeScript | MERN Stack Development Project**

* **Project Name:** Plant Pot – Plant Shop (Frontend)
* **Client GitHub Repository:** [https://github.com/rahad404/plant-pot](https://github.com/rahad404/plant-pot)
* **Server GitHub Repository:** [https://github.com/rahad404/plant-pot-server](https://github.com/rahad404/plant-pot-server)

---

## Project Description

**Plant Pot** is a fully responsive MERN stack plant shop platform where users can browse, search, and purchase indoor and outdoor plants. The platform supports two user roles — **User** and **Admin** — each with dedicated dashboards. Users can explore the plant catalog with advanced search, filter by category/price/rating/light, sort results, and checkout with a streamlined flow. They can track their purchased plants with an automated care schedule, mark plants as watered, and manage their order history. Admins can manage the full plant inventory (CRUD), oversee all orders, update order statuses, and promote users to admin. The app features a dark/light theme, skeleton loading states, and toast notifications.

---

## Key Features

1. **Advanced Plant Discovery:**
   Debounced search, multi-filter sidebar (category, price range, rating, light level), sort options (newest, price asc/desc, rating, name), and URL-driven pagination for fully shareable and bookmarkable catalog views.

2. **Plant Detail & Reviews:**
   Image gallery navigation, care specifications (light, watering, fertilizer, treatment), star ratings, review submission with comments, and a related plants section.

3. **Automated Care Schedule:**
   When a user purchases a plant, a care schedule is automatically created. Users can track watering progress, mark plants as watered, and view compost/medicine info from their dashboard.

4. **Checkout Flow:**
   Shipping form (name, email, address, city, ZIP), order summary, mock payment with confirmation screen, and automatic order creation linked to the care schedule.

5. **Admin Plant Management:**
   Full CRUD operations with drag-and-drop image upload (ImgBB), search, edit, and delete with confirmation dialogs. Admins can manage categories, stock, pricing, and care specifications.

6. **Admin Order & User Management:**
   View all orders with search, update order statuses (paid, processing, shipped, delivered, cancelled), view all users, and promote users to admin.

7. **Dark/Light Theme:**
   Seamless theme toggling with system preference detection via `next-themes`.

8. **Responsive Design:**
   Mobile-first layouts with hamburger navigation, filter drawer on mobile, and adaptive grid columns.

---

## Tech Stack

* **Frontend Framework:** Next.js 16 (App Router)
* **UI Library:** React 19
* **Styling:** Tailwind CSS 4, shadcn/ui Components
* **Authentication:** Better Auth (Email/Password, Google OAuth, JWT)
* **Database (Auth):** MongoDB (via Better Auth adapter)
* **Icons:** Lucide React
* **Animations:** Embla Carousel React
* **Forms:** React Hook Form + @hookform/resolvers
* **Notifications:** Sonner
* **Theme:** next-themes
* **Image Hosting:** ImgBB
* **Language:** TypeScript 5

---

## NPM Packages Used

| Package | Purpose |
|---|---|
| `next` | React framework with App Router, SSR, API routes |
| `react`, `react-dom` | UI library |
| `better-auth` | Authentication (email/password, Google OAuth, JWT, sessions) |
| `mongodb` | MongoDB driver (Better Auth database adapter) |
| `radix-ui` | Headless UI primitives (powers shadcn/ui) |
| `shadcn` | Component toolkit for Radix-based UI components |
| `class-variance-authority` | Variant-based component styling |
| `clsx` | Conditional className joining |
| `tailwind-merge` | Intelligent Tailwind class merging |
| `tw-animate-css` | Tailwind CSS animation utilities |
| `next-themes` | Dark/light theme toggling |
| `lucide-react` | Icon library |
| `embla-carousel-react` | Carousel/slider component |
| `react-hook-form` | Form state management |
| `@hookform/resolvers` | Validation schema resolvers |
| `sonner` | Toast notifications |

---

## Frontend Routes

### Public Routes

| Route | Description |
|---|---|
| `/` | Home page — Hero carousel, featured plants, shop by category, benefits, care tips, testimonials, newsletter, CTA |
| `/about` | About page — Company story, mission, values, team profiles |
| `/contact` | Contact page — Contact form, contact info, social links |
| `/login` | Login — Email/password form + Google OAuth |
| `/signup` | Signup — Name, email, password, confirm password + Google OAuth |
| `/plants` | Plant catalog — Search, filter (category, price, rating, light), sort, pagination |
| `/plants/[id]` | Plant detail — Image gallery, care specs, reviews, related plants |

### Private Routes (Requires Login)

| Route | Description |
|---|---|
| `/checkout/[id]` | Checkout — Shipping form, mock payment, order confirmation |
| `/dashboard` | Dashboard overview — Stats (plants owned, need watering, total orders), recent orders |
| `/dashboard/my-plants` | My plants — Care schedules, watering tracker, compost/medicine info |
| `/dashboard/orders` | My orders — Order history, status badges, expandable order cards |
| `/dashboard/profile` | Profile — Edit name, profile image URL |

### Admin Routes (Requires Admin Role)

| Route | Description |
|---|---|
| `/admin` | Admin dashboard — Stats (plants, orders, users, revenue), recent orders |
| `/admin/plants` | Manage plants — List, search, edit, delete |
| `/admin/plants/add` | Add plant — Full form with drag-and-drop image upload |
| `/admin/plants/[id]/edit` | Edit plant — Pre-populated form with existing data |
| `/admin/orders` | Manage orders — List, search, update status |
| `/admin/users` | Manage users — List, search, promote to admin |

---

## Getting Started (Local Setup)

### 1. Clone the repository
```bash
git clone https://github.com/rahad404/plant-pot.git
cd plant-pot
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up environment variables
Create a `.env` file in the root folder and add the following keys:
```env
BETTER_AUTH_SECRET=your_better_auth_secret
MONGODB_URI=your_mongodb_connection_string
DB_NAME=plantShopDB
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000
NEXT_PUBLIC_APP_URL=http://localhost:3000
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
NEXT_PUBLIC_IMAGE_UPLOAD_API=your_imgbb_api_key
```

### 4. Start the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

### 5. Run the backend server
Clone and set up the server from [plant-pot-server](https://github.com/rahad404/plant-pot-server) with its own `.env` file.

---

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Next.js development server |
| `npm run build` | Build the production bundle |
| `npm start` | Start the production server |
| `npm run lint` | Run ESLint |

---

## Project Structure

```
src/
├── app/                          # Next.js App Router pages
│   ├── layout.tsx                # Root layout (ThemeProvider, Navbar, Footer)
│   ├── page.tsx                  # Home page
│   ├── globals.css               # Tailwind v4 + shadcn CSS variables
│   ├── about/page.tsx
│   ├── contact/page.tsx
│   ├── login/page.tsx
│   ├── signup/page.tsx
│   ├── plants/
│   │   ├── page.tsx              # Plant catalog
│   │   └── [id]/page.tsx         # Plant detail
│   ├── checkout/[id]/page.tsx    # Checkout
│   ├── dashboard/
│   │   ├── layout.tsx            # Dashboard layout + auth guard
│   │   ├── page.tsx              # Dashboard overview
│   │   ├── my-plants/page.tsx    # Care schedules
│   │   ├── orders/page.tsx       # Order history
│   │   └── profile/page.tsx      # Profile settings
│   ├── admin/
│   │   ├── layout.tsx            # Admin layout + role guard
│   │   ├── page.tsx              # Admin dashboard
│   │   ├── plants/
│   │   │   ├── page.tsx          # Manage plants
│   │   │   ├── add/page.tsx      # Add plant
│   │   │   └── [id]/edit/page.tsx # Edit plant
│   │   ├── orders/page.tsx       # Manage orders
│   │   └── users/page.tsx        # Manage users
│   └── api/auth/[...all]/route.ts # Better Auth API route
├── components/
│   ├── navbar.tsx                # Sticky navbar + mobile menu
│   ├── footer.tsx
│   ├── plant-card.tsx
│   ├── plant-filters.tsx
│   ├── star-rating.tsx
│   ├── admin/plant-form.tsx
│   └── ui/                       # shadcn/ui components (17 total)
├── lib/
│   ├── api.ts                    # API client (public + authenticated)
│   ├── auth.ts                   # Better Auth server config
│   ├── auth-client.ts            # Better Auth client
│   ├── mongodb.ts                # MongoDB client singleton
│   ├── permissions.ts            # RBAC roles
│   ├── utils.ts                  # cn() utility
│   └── image-upload.ts           # ImgBB image upload
└── middleware.ts                  # Route protection middleware
```

---

## License

This project is part of **Programming Hero | Batch-13 | SCIC** coursework.
