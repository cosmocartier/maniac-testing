# Supabase Setup Guide

This guide will help you set up Supabase for the MirrorAI authentication system.

## Prerequisites

1. A Supabase account (sign up at [supabase.com](https://supabase.com))
2. Node.js and npm installed
3. This Next.js project

## Step 1: Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click "New Project"
3. Choose your organization
4. Enter a project name (e.g., "mirrorai-auth")
5. Enter a database password (save this securely)
6. Select a region close to your users
7. Click "Create new project"

## Step 2: Get Your Project Credentials

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (looks like `https://your-project-id.supabase.co`)
   - **anon/public key** (starts with `eyJ...`)

## Step 3: Configure Environment Variables

1. In your project root, copy `.env.local.example` to `.env.local`:
   \`\`\`bash
   cp .env.local.example .env.local
   \`\`\`

2. Edit `.env.local` and add your Supabase credentials:
   \`\`\`env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   \`\`\`

## Step 4: Set Up Database Schema

1. In your Supabase dashboard, go to **SQL Editor**
2. Run the SQL scripts in this order:
   - `scripts/01-setup-database-schema.sql`
   - `scripts/02-setup-rls-policies.sql`
   - `scripts/03-setup-functions.sql`
   - `scripts/04-setup-triggers.sql`
   - `scripts/05-setup-permissions.sql`

## Step 5: Configure Authentication

1. In your Supabase dashboard, go to **Authentication** → **Settings**
2. Configure the following:
   - **Site URL**: `http://localhost:3000` (for development)
   - **Redirect URLs**: Add your production domain when deploying
   - **Email Templates**: Customize if needed
   - **Email Settings**: Configure SMTP if you want custom email sending

## Step 6: Test the Setup

1. Start your development server:
   \`\`\`bash
   npm run dev
   \`\`\`

2. Navigate to `/auth/signup` or `/auth/signin`
3. Check the debug information (in development mode) to verify:
   - ✅ Connection Status: connected
   - ✅ Supabase Ready: ✅
   - ✅ URL Configured: ✅
   - ✅ Key Configured: ✅

## Troubleshooting

### "supabaseUrl is required" Error

This means your environment variables are not properly configured:

1. Verify `.env.local` exists in your project root
2. Check that the file contains the correct variable names:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Restart your development server after making changes
4. Ensure there are no extra spaces or quotes around the values

### Connection Errors

1. Verify your Supabase project is active and not paused
2. Check that your URL and key are correct
3. Ensure your database schema is properly set up
4. Check the browser console for detailed error messages

### Email Verification Issues

1. Check your Supabase email settings
2. Verify SMTP configuration if using custom email
3. Check spam folder for verification emails
4. Ensure your domain is properly configured

## Production Deployment

When deploying to production:

1. Add your production domain to Supabase redirect URLs
2. Update your environment variables in your hosting platform
3. Ensure your database is properly secured with RLS policies
4. Test the authentication flow thoroughly

## Security Notes

- Never commit `.env.local` to version control
- Use Row Level Security (RLS) policies in production
- Regularly rotate your API keys
- Monitor authentication logs for suspicious activity
- Use HTTPS in production
