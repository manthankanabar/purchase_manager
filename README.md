# Purchase Manager

A multi-entity purchase management system built for construction companies in India. This application streamlines purchase requisitions, approvals, and vendor management across multiple business entities.

## Tech Stack

- **Frontend**: Next.js, React, TypeScript, Shadcn UI (with Tailwind CSS and Radix UI)
- **Backend**: Next.js API Routes
- **Database**: Neon PostgreSQL with Drizzle ORM
- **Authentication**: Clerk

## Features

- Multi-entity support for managing purchases across different business units
- Comprehensive purchase request workflow with multi-level approvals
- Vendor management system with detailed information tracking
- Role-based access control for different user types
- Dashboard with analytics and reporting

## Project Structure

```
src/
├── app/                  # Next.js App Router
│   ├── dashboard/        # Dashboard pages
│   ├── sign-in/          # Authentication pages
│   └── page.tsx          # Landing page
├── components/           # UI components
│   └── ui/               # Shadcn UI components
├── db/                   # Database configuration
│   ├── migrations/       # Drizzle migrations
│   └── schema/           # Database schema
└── middleware.ts        # Clerk authentication middleware
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Neon PostgreSQL database
- Clerk account for authentication

### Environment Setup

Create a `.env.local` file in the root directory with the following variables:

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
DATABASE_URL=your_neon_database_url
```

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Run database migrations:

```bash
npm run db:generate
npm run db:push
```

4. Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Database Schema

The database includes the following tables:

- **users**: User accounts with role-based permissions
- **entities**: Business entities within the organization
- **vendors**: Supplier information and details
- **categories**: Purchase categories for classification
- **purchase_requests**: Main purchase requisition records
- **purchase_request_items**: Line items within purchase requests
- **approvals**: Approval workflow tracking

## CI/CD Pipeline

This project uses GitHub Actions and Vercel for continuous integration and deployment:

### CI Workflow

- Automatically runs on push to main/master branches and pull requests
- Runs linting and builds the application
- Ensures code quality before deployment

### Deployment Workflow

- Automatically deploys to Vercel when changes are pushed to main/master
- Uses Vercel CLI for production deployments

### Vercel Setup

1. Create a Vercel account and link your GitHub repository
2. Set up the following environment variables in Vercel:
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - `CLERK_SECRET_KEY`
   - `DATABASE_URL`
3. For GitHub Actions deployment, add these secrets to your GitHub repository:
   - `VERCEL_TOKEN`: Your Vercel API token
   - `VERCEL_PROJECT_ID`: Your Vercel project ID
   - `VERCEL_ORG_ID`: Your Vercel organization ID

## License

This project is proprietary and confidential.
