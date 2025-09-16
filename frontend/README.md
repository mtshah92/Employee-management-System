# Employee Leave Management System - Frontend

A modern Next.js frontend application for managing employee leave requests with role-based access control and responsive design.

## Features

- **Authentication**
  - User login and registration
  - JWT token-based authentication
  - Automatic token management with cookies

- **Role-Based Access**
  - Employee dashboard for personal leave management
  - Admin dashboard for managing all leave requests
  - Protected routes based on user roles

- **Leave Management**
  - Apply for leave with file attachments
  - View leave history with pagination
  - Real-time status updates
  - Admin approval/rejection workflow

- **Modern UI/UX**
  - Responsive design with Tailwind CSS
  - Clean and intuitive interface
  - Loading states and error handling
  - Form validation with React Hook Form

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Hooks + Custom Hooks
- **HTTP Client**: Axios
- **Forms**: React Hook Form
- **Icons**: Lucide React
- **Authentication**: JWT with js-cookie

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Backend API running on http://localhost:5000

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Configuration

The `.env.local` file is already configured with:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

Update this if your backend runs on a different URL.

### 3. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### 4. Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
src/
├── app/                 # Next.js App Router pages
│   ├── dashboard/       # Dashboard page
│   ├── login/          # Login page
│   ├── register/       # Registration page
│   ├── layout.tsx      # Root layout
│   ├── page.tsx        # Home page (redirects)
│   └── globals.css     # Global styles
├── components/         # Reusable components
│   └── Layout.tsx      # Main layout component
├── hooks/              # Custom React hooks
│   └── useAuth.ts      # Authentication hook
├── lib/                # Utility libraries
│   ├── api.ts          # API client configuration
│   └── auth.ts         # Authentication utilities
└── types/              # TypeScript type definitions
    └── index.ts        # Shared interfaces
```

## Key Features

### Authentication Flow
1. Users can register with email, password, and role selection
2. Login with email/password returns JWT token
3. Token stored in secure cookies with 7-day expiration
4. Automatic token inclusion in API requests
5. Route protection based on authentication status

### Employee Features
- **Dashboard**: View personal leave requests with status
- **Apply for Leave**: Submit new leave requests with:
  - Leave type selection (Annual, Sick, Personal, Emergency)
  - Date range picker
  - Reason text area
  - Optional file attachment
- **Leave History**: Paginated view of all personal requests

### Admin Features
- **Admin Dashboard**: View all employee leave requests
- **Approval Workflow**: Approve or reject pending requests
- **Employee Information**: See which employee submitted each request
- **Bulk Management**: Handle multiple requests efficiently

### UI Components
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Loading States**: Smooth loading indicators
- **Error Handling**: User-friendly error messages
- **Form Validation**: Real-time validation with helpful messages
- **Status Indicators**: Visual status badges and icons

## API Integration

The frontend integrates with the backend API endpoints:

- `POST /auth/login` - User authentication
- `POST /auth/register` - User registration
- `GET /leaves/my` - Get user's leave requests
- `GET /leaves` - Get all leave requests (admin)
- `POST /leaves` - Create new leave request
- `PUT /leaves/:id` - Update leave request status (admin)

## Environment Variables

- `NEXT_PUBLIC_API_URL`: Backend API base URL (default: http://localhost:5000/api)

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Follow TypeScript best practices
2. Use Tailwind CSS for styling
3. Implement proper error handling
4. Add loading states for async operations
5. Ensure responsive design
6. Test on multiple browsers

## License

MIT License