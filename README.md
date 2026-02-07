# DormLoop - UBC Student Marketplace

A UBC-only marketplace where students can buy, sell, and trade dorm items and student essentials during move-in and move-out seasons.

## 🎯 Features

- **UBC Email Validation**: Only `@student.ubc.ca` emails can sign up (mocks CWL SSO for hackathon)
- **Listings Feed**: Browse items with filters by category, location, and price
- **Move-Out Mode**: Special filtering for dorm essentials and bundles during move-out season
- **Create Listings**: Upload images, set prices, and add items to move-out bundles
- **Messaging**: In-app messaging between buyers and sellers
- **Sustainability Impact**: Track items reused and waste avoided

## 🛠 Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Backend**: Next.js API routes, MongoDB Atlas, Mongoose ODM
- **Auth**: NextAuth.js (Credentials provider with UBC email validation)
- **Images**: Cloudinary for image uploads

## 📁 Project Structure

```
dormloop/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/[...nextauth]/route.ts
│   │   │   ├── auth/signup/route.ts
│   │   │   ├── listings/route.ts
│   │   │   ├── listings/[id]/route.ts
│   │   │   ├── messages/route.ts
│   │   │   ├── upload/route.ts
│   │   │   └── seed/route.ts
│   │   ├── listings/
│   │   │   ├── create/page.tsx
│   │   │   └── [id]/page.tsx
│   │   ├── messages/page.tsx
│   │   ├── login/page.tsx
│   │   ├── signup/page.tsx
│   │   ├── page.tsx
│   │   ├── layout.tsx
│   │   └── globals.css
│   ├── components/
│   │   ├── Navbar.tsx
│   │   ├── ListingCard.tsx
│   │   ├── MoveOutToggle.tsx
│   │   └── Providers.tsx
│   ├── lib/
│   │   ├── mongodb.ts
│   │   ├── auth.ts
│   │   └── utils.ts
│   ├── models/
│   │   ├── User.ts
│   │   ├── Listing.ts
│   │   ├── Bundle.ts
│   │   └── Message.ts
│   └── types/
│       └── next-auth.d.ts
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

### 3. Start Development Server

```bash
npm run dev
```

Visit `http://localhost:3000`

## 🎤 Demo Flow for Judges

1. **Login**: Sign up with any `@student.ubc.ca` email (e.g., `demo@student.ubc.ca`)
2. **Browse**: Show listings filtered by residence and category
3. **Move-Out Mode**: Toggle to show dorm essentials bundles
4. **Create Listing**: Show how easy it is to sell an item with image upload
5. **Message Seller**: Demonstrate the messaging system
6. **Sustainability Impact**: Point out the "items reused" counter on the homepage

## 🔐 Authentication (CWL SSO Mock)

This hackathon demo mocks UBC's CWL (Campus Wide Login) SSO:

- **Signup**: Only `@student.ubc.ca` email addresses are accepted
- **Login**: Email + password authentication
- **JWT Sessions**: Secure session management via NextAuth

For production, this would integrate with UBC's official CWL OAuth2/OIDC provider.

## 📱 Mobile Responsive

All pages are fully responsive and work great on mobile devices.

## 🎨 Design System

- **Primary Color**: UBC Red (#E31837)
- **Typography**: Inter (Google Fonts)
- **Icons**: Lucide React
- **Components**: Custom Tailwind components (shadcn/ui inspired)

## 📝 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/listings` | Get all listings (with filters) |
| POST | `/api/listings` | Create a new listing |
| GET | `/api/listings/[id]` | Get single listing |
| DELETE | `/api/listings/[id]` | Delete a listing |
| GET | `/api/messages` | Get user's messages |
| POST | `/api/messages` | Send a message |
| POST | `/api/upload` | Upload image to Cloudinary |
| GET | `/api/seed` | Seed demo data |

## 🏗️ Deployment

This project is ready for Vercel deployment:

1. Push to GitHub
2. Connect to Vercel
3. Add environment variables
4. Deploy!

## 📄 License

MIT License - feel free to use for your hackathon projects!

---

Built with ❤️ for UBC students
