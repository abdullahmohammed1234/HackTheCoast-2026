# Exchangify - UBC Student Marketplace

A UBC-only marketplace where students can buy, sell, and trade dorm items and student essentials during move-in and move-out seasons. Built with Next.js 14, TypeScript, and MongoDB.

## 🎯 Features

### Core Marketplace
- **UBC Email Validation**: Only `@student.ubc.ca` emails can sign up
- **Listings Feed**: Browse items with filters by category, location, and price
- **Move-Out Mode**: Special filtering for dorm essentials and bundles during move-out season
- **Create Listings**: Upload images, set prices, and add items to move-out bundles
- **Location-Based Listings**: Filter by UBC residence locations (Orchard Commons, Marine Drive, etc.)

### Buying & Selling
- **Favorites**: Save listings to your favorites for quick access
- **Wishlist**: Set up wishlist alerts for items you're looking for
- **Price Alerts**: Get notified when items matching your criteria are listed
- **Offers System**: Make and negotiate offers on listings
- **Transaction Management**: Track completed transactions with status updates
- **Meetup Scheduling**: Schedule in-person meetups for exchanges

### Safety & Trust
- **User Reviews**: Leave and view reviews for verified transactions
- **User Blocking**: Block users to prevent unwanted interactions
- **Reporting System**: Report suspicious listings or users
- **Safety Tips**: Dedicated safety guidelines page for secure exchanges

### Notifications
- **Push Notifications**: Real-time notifications for messages, offers, and price alerts
- **Notification Preferences**: Customize which notifications you receive

### User Experience
- **Sustainability Impact Dashboard**: Track your contribution to sustainability (items reused, CO₂ saved, waste avoided)
- **Gamification**: Badges and achievements for active community members
- **Profile Management**: Custom avatars and impact statistics
- **Session Management**: Secure session handling with timeout warnings
- **Responsive Design**: Fully mobile-responsive with PWA support

## 🛠 Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Backend**: Next.js API routes, MongoDB Atlas, Mongoose ODM
- **Auth**: NextAuth.js (Credentials provider with UBC email validation)
- **Images**: Cloudinary for image uploads
- **Push Notifications**: Web Push (VAPID)
- **PWA**: Service Worker for offline capabilities

## 📁 Project Structure

```
Exchangify/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/[...nextauth]/route.ts
│   │   │   ├── auth/signup/route.ts
│   │   │   ├── blocks/route.ts
│   │   │   ├── favorites/route.ts
│   │   │   ├── listings/route.ts
│   │   │   ├── listings/[id]/route.ts
│   │   │   ├── locations/route.ts
│   │   │   ├── messages/route.ts
│   │   │   ├── notifications/
│   │   │   │   ├── preferences/route.ts
│   │   │   │   ├── subscribe/route.ts
│   │   │   │   └── vapid-key/route.ts
│   │   │   ├── offers/route.ts
│   │   │   ├── offers/[id]/route.ts
│   │   │   ├── price-alerts/route.ts
│   │   │   ├── profile/
│   │   │   │   ├── avatar/route.ts
│   │   │   │   ├── impact/route.ts
│   │   │   │   └── route.ts
│   │   │   ├── reports/route.ts
│   │   │   ├── reviews/route.ts
│   │   │   ├── seed/route.ts
│   │   │   ├── transactions/route.ts
│   │   │   ├── transactions/[id]/route.ts
│   │   │   ├── upload/route.ts
│   │   │   └── wishlist/route.ts
│   │   ├── home/page.tsx
│   │   ├── listings/
│   │   │   ├── create/page.tsx
│   │   │   └── [id]/page.tsx
│   │   ├── login/page.tsx
│   │   ├── messages/page.tsx
│   │   ├── offers/page.tsx
│   │   ├── price-alerts/page.tsx
│   │   ├── profile/page.tsx
│   │   ├── safety/page.tsx
│   │   ├── signup/page.tsx
│   │   ├── transactions/page.tsx
│   │   ├── wishlist/page.tsx
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── globals.css
│   ├── components/
│   │   ├── AvatarUpload.tsx
│   │   ├── BadgeDisplay.tsx
│   │   ├── BlockButton.tsx
│   │   ├── BlockedUsersList.tsx
│   │   ├── EmptyState.tsx
│   │   ├── ErrorBoundary.tsx
│   │   ├── FavoriteButton.tsx
│   │   ├── ImageCarousel.tsx
│   │   ├── ListingCard.tsx
│   │   ├── LocationPicker.tsx
│   │   ├── MeetupScheduler.tsx
│   │   ├── MoveOutToggle.tsx
│   │   ├── Navbar.tsx
│   │   ├── NotificationSettings.tsx
│   │   ├── OfferForm.tsx
│   │   ├── PageHeader.tsx
│   │   ├── Providers.tsx
│   │   ├── ReportModal.tsx
│   │   ├── ReviewForm.tsx
│   │   ├── ReviewList.tsx
│   │   ├── SessionTimeout.tsx
│   │   ├── Skeleton.tsx
│   │   ├── StarRating.tsx
│   │   ├── SustainabilityDashboard.tsx
│   │   ├── TransactionHistory.tsx
│   │   └── ZoomableImage.tsx
│   ├── hooks/
│   │   ├── usePushNotifications.ts
│   │   └── useServiceWorker.ts
│   ├── lib/
│   │   ├── auth.ts
│   │   ├── csrf.ts
│   │   ├── gamification.ts
│   │   ├── mongodb.ts
│   │   ├── notifications.ts
│   │   ├── rate-limit.ts
│   │   ├── sanitize.ts
│   │   ├── ubcLocations.ts
│   │   └── utils.ts
│   ├── models/
│   │   ├── Block.ts
│   │   ├── Bundle.ts
│   │   ├── Favorite.ts
│   │   ├── Listing.ts
│   │   ├── MeetupSchedule.ts
│   │   ├── Message.ts
│   │   ├── Offer.ts
│   │   ├── PriceAlert.ts
│   │   ├── PushSubscription.ts
│   │   ├── Report.ts
│   │   ├── Review.ts
│   │   ├── Transaction.ts
│   │   ├── User.ts
│   │   └── Wishlist.ts
│   └── types/
│       ├── next-auth.d.ts
│       ├── notifications.ts
│       └── web-push.d.ts
├── public/
│   ├── logo.webp
│   └── sw.js
├── scripts/
│   └── generate-vapid-keys.js
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── next.config.js
└── .env.example
```

## 🚀 Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

Required environment variables:
- `MONGODB_URI`: MongoDB Atlas connection string
- `NEXTAUTH_URL`: Your app URL (http://localhost:3000 for dev)
- `NEXTAUTH_SECRET`: Random secret string for NextAuth
- `CLOUDINARY_CLOUD_NAME`: Your Cloudinary cloud name
- `CLOUDINARY_API_KEY`: Cloudinary API key
- `CLOUDINARY_API_SECRET`: Cloudinary API secret

### Push Notifications (Optional)

To enable push notifications, generate VAPID keys:

```bash
node scripts/generate-vapid-keys.js
```

Add the keys to your `.env`:

```bash
VAPID_PUBLIC_KEY=your_public_key
VAPID_PRIVATE_KEY=your_private_key
```

### 3. Start Development Server

```bash
npm run dev
```

Visit `http://localhost:3000`

## 🔐 Authentication

This project uses NextAuth.js with a credentials provider:

- **Signup**: Only `@student.ubc.ca` email addresses are accepted
- **Login**: Email + password authentication
- **JWT Sessions**: Secure session management via NextAuth
- **CSRF Protection**: Built-in CSRF token validation

For production, this could integrate with UBC's official CWL OAuth2/OIDC provider.

## 📱 Mobile Responsive

All pages are fully responsive and work great on mobile devices. The app includes:
- PWA support with service worker
- Installable as a web app
- Optimized touch interactions

## 🎨 Design System

- **Primary Color**: UBC Red (#E31837)
- **Typography**: Inter (Google Fonts)
- **Icons**: Lucide React
- **Components**: Custom Tailwind components (shadcn/ui inspired)
- **Loading States**: Skeleton loaders for smooth UX
- **Error Handling**: Global error boundaries

## 📝 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET/POST | `/api/auth/signup` | User registration |
| GET/POST | `/api/auth/[...nextauth]` | Authentication endpoints |
| GET | `/api/listings` | Get all listings (with filters) |
| POST | `/api/listings` | Create a new listing |
| GET | `/api/listings/[id]` | Get single listing |
| PUT/DELETE | `/api/listings/[id]` | Update/delete listing |
| GET/POST | `/api/messages` | Get/send messages |
| GET/POST | `/api/offers` | Get/make offers |
| GET/PUT | `/api/offers/[id]` | Manage specific offer |
| GET/POST | `/api/transactions` | Get/create transactions |
| GET/PUT | `/api/transactions/[id]` | Manage transaction status |
| GET/POST | `/api/reviews` | Get/submit reviews |
| GET/POST | `/api/favorites` | Manage favorites |
| GET/POST | `/api/wishlist` | Manage wishlist |
| GET/POST | `/api/price-alerts` | Manage price alerts |
| GET/POST | `/api/blocks` | Block/unblock users |
| GET/POST | `/api/reports` | Report listings/users |
| POST | `/api/upload` | Upload image to Cloudinary |
| POST | `/api/notifications/subscribe` | Subscribe to push |
| GET | `/api/notifications/vapid-key` | Get VAPID public key |
| GET/PUT | `/api/notifications/preferences` | Notification settings |
| GET | `/api/profile` | Get user profile |
| PUT | `/api/profile/avatar` | Update avatar |
| GET | `/api/profile/impact` | Get sustainability impact |
| GET | `/api/seed` | Seed demo data |
| GET | `/api/locations` | Get UBC locations |

## 📊 Sustainability Impact

Track your contribution to a sustainable UBC community:
- **Items Reused**: Total items traded through the platform
- **CO₂ Saved**: Estimated carbon footprint reduction
- **Waste Avoided**: Prevention of items going to landfills
- **Community Rank**: Leaderboard based on sustainable practices

## 🏗️ Deployment

This project is ready for Vercel deployment:

1. Push to GitHub
2. Connect to Vercel
3. Add environment variables
4. Deploy!

## 🚀 What's Next

### Planned Features

1. **Real CWL Integration**
   - Full OAuth2/OIDC integration with UBC's Campus Wide Login
   - Automatic student verification
   - Single sign-on experience

2. **Advanced Search & Filters**
   - AI-powered search with natural language queries
   - Smart recommendations based on browsing history
   - Advanced price prediction tools

3. **In-App Payments**
   - Secure payment processing for deposits and purchases
   - Escrow-style transactions for safety
   - Payment plan options for high-value items

4. **Enhanced Safety Features**
   - Verified meetup locations on campus
   - In-app video calls for remote transactions
   - Transaction insurance options
   - Emergency contact integration

5. **Community Features**
   - Student group buy/sell channels
   - Dorm-specific marketplaces
   - Buyback programs with UBC Bookstore
   - Sustainability challenges and rewards

6. **Analytics Dashboard**
   - Market trends and pricing insights
   - Personal selling statistics
   - Demand forecasting for seasonal items

7. **Mobile App (Native)**
   - React Native mobile app
   - Push notification enhancements
   - Offline-first architecture
   - Camera integration for faster listings

8. **AI Features**
   - Automated listing categorization
   - Smart pricing suggestions
   - Fraud detection algorithms
   - Chatbot for user support

## 📄 License

MIT License - feel free to use for your hackathon projects!

---

Built with ❤️ for UBC students
