# InvestbotIQ Lead Management Platform

## Overview

The InvestbotIQ Lead Management Platform is a comprehensive solution for capturing, managing, and analyzing leads through a multi-step form interface. The platform is designed with role-based questions for different user types (Member, Freelancer, Parent, Student, Affiliated) and includes an admin dashboard for lead management.

## Features

### Multi-Step Lead Form
- Role selection at the start
- Dynamic questions based on selected role
- Progress bar showing form completion status
- Form validation with error handling
- Captcha protection against bots
- Mobile-first responsive design

### Admin Dashboard
- Secure login with Supabase Auth
- Comprehensive lead overview with filtering options
- Detailed view of individual leads
- Export functionality to Google Sheets
- Real-time updates for new leads

### Email Integration
- Automated confirmation emails to users upon form submission
- Internal notifications to admin email
- Customizable email templates

### Referral System
- Tracking of referral codes
- Visualization of referral chains in the admin dashboard

## Tech Stack

- **Frontend**: React 18 with Vite
- **Styling**: TailwindCSS with tailwindcss-animate plugin
- **UI Components**: Shadcn UI + Radix UI
- **Animations**: Framer Motion
- **Backend**: Supabase (Auth, Database, Storage, Edge Functions)
- **Email**: Resend API integration
- **External Integration**: Google Sheets via Edge Functions/webhooks
- **Form Handling**: React Hook Form + Zod validation
- **State Management**: React Query for server state

## Project Structure

```
/src
  /components
    /LeadForm
      - LeadForm.jsx             # Main form container
      - LeadFormStep1.jsx        # Role selection
      - LeadFormStep2.jsx        # Personal information
      - LeadFormStep3.jsx        # Additional information
      - LeadFormRoleSpecific.jsx # Role-specific questions
      - LeadFormSuccess.jsx      # Success confirmation
      - FormProgressBar.jsx      # Progress indicator
    /Dashboard
      - Dashboard.jsx            # Admin dashboard container
      - LeadsTable.jsx           # Leads overview table
      - LeadDetailsModal.jsx     # Detailed lead view
    /Shared
      - Button.jsx               # Reusable button component
      - InputField.jsx           # Reusable input component
      - SelectField.jsx          # Reusable select component
  /hooks
    - useMultiStepForm.jsx      # Hook for managing form steps
    - useSupabaseClient.jsx     # Hook for Supabase operations
  /lib
    - supabaseClient.js         # Supabase client configuration
    - resendClient.js           # Resend API client
    - sheetsWebhook.js          # Google Sheets integration
  /pages
    - index.jsx                 # Lead form landing page
    - admin.jsx                 # Admin dashboard page
  /supabase
    - schema.sql                # Database schema and policies
  /utils
    - roleBasedQuestions.js     # Configuration for dynamic questions
    - cn.js                     # Utility for class name merging
```

## Setup and Installation

### Prerequisites
- Node.js (v16+)
- npm or yarn
- Supabase account
- Resend API account (for email functionality)

### Installation Steps

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/investbotiq-lead-platform.git
   cd investbotiq-lead-platform
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Create a `.env` file based on `.env.example`
   ```bash
   cp .env.example .env
   ```

4. Update the `.env` file with your Supabase and Resend API credentials

5. Start the development server
   ```bash
   npm run dev
   ```

### Supabase Setup

1. Create a new Supabase project
2. Execute the SQL schema in `src/supabase/schema.sql`
3. Set up authentication with email/password provider
4. Create an admin user and assign the 'admin' role

## Deployment

### Frontend Deployment

1. Build the project
   ```bash
   npm run build
   ```

2. Deploy the `dist` folder to your preferred hosting service (Netlify, Vercel, etc.)

### Supabase Edge Functions

1. Install Supabase CLI
2. Deploy the edge functions for email and Google Sheets integration

## Customization

### Adding New Roles

1. Update the `roleBasedQuestions.js` file with the new role and its questions
2. Add a new table in the Supabase schema for the role
3. Update the UI components to include the new role

### Modifying Form Fields

1. Update the relevant question configurations in `roleBasedQuestions.js`
2. Ensure any new required fields are added to the database schema

## Security Considerations

- Row Level Security (RLS) policies are implemented to protect lead data
- Only admin users can access the dashboard and view leads
- Form submissions are validated on both client and server sides

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

For questions or support, please contact: investbotiq@gmail.com
