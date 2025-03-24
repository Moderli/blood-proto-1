# Blood Bank Management System

A comprehensive web application for managing blood bank operations, built with Next.js, TailwindCSS, and Supabase.

## Features

- Dashboard with real-time blood stock levels
- Blood stock management and tracking
- Donation request management
- Distribution and usage tracking
- Reports and analytics
- Authentication system

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- TailwindCSS
- Supabase (Authentication & Database)
- Recharts (Data Visualization)
- Headless UI (UI Components)

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a Supabase project and get your credentials

4. Create a `.env.local` file in the root directory and add your Supabase credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

5. Run the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

```
src/
├── app/                    # Next.js app router pages
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Dashboard and feature pages
│   └── layout.tsx         # Root layout
├── components/            # Reusable components
└── lib/                   # Utility functions and configurations
```

## Database Schema

The application uses the following Supabase tables:

1. blood_stock
   - id: uuid
   - blood_type: string
   - units: number
   - expiry_date: timestamp
   - created_at: timestamp

2. donation_requests
   - id: uuid
   - donor_name: string
   - blood_type: string
   - status: string
   - scheduled_date: timestamp
   - created_at: timestamp

3. distributions
   - id: uuid
   - hospital_name: string
   - blood_type: string
   - units: number
   - status: string
   - created_at: timestamp

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License.
