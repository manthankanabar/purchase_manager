# CI/CD Pipeline Setup

This document explains the continuous integration and deployment (CI/CD) setup for the Purchase Manager application.

## Overview

The CI/CD pipeline consists of:
1. GitHub Actions for continuous integration
2. Vercel for deployment

## GitHub Actions Workflows

### CI Workflow (`ci.yml`)

This workflow runs on every push to the main/master branch and on pull requests:

- Checks out the code
- Sets up Node.js environment
- Installs dependencies
- Runs linting
- Builds the application

This ensures code quality before deployment.

### Deployment Workflow (`deploy.yml`)

This workflow runs on every push to the main/master branch:

- Checks out the code
- Sets up Node.js environment
- Installs Vercel CLI
- Deploys to Vercel production environment

## Vercel Configuration

The `vercel.json` file contains the configuration for Vercel deployment:

```json
{
  "version": 2,
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "nextjs",
  "outputDirectory": ".next",
  "env": {
    "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY": "@next_public_clerk_publishable_key",
    "CLERK_SECRET_KEY": "@clerk_secret_key",
    "DATABASE_URL": "@database_url"
  }
}
```

## Setup Instructions

### 1. Vercel Setup

1. Create a Vercel account at [vercel.com](https://vercel.com)
2. Create a new project and link your GitHub repository
3. Configure environment variables in Vercel:
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - `CLERK_SECRET_KEY`
   - `DATABASE_URL`
4. Get your Vercel API token, project ID, and organization ID:
   - API token: From your Vercel account settings
   - Project ID: From your project settings
   - Organization ID: From your organization settings

### 2. GitHub Secrets

Add the following secrets to your GitHub repository:

1. Go to your GitHub repository → Settings → Secrets and variables → Actions
2. Add the following repository secrets:
   - `VERCEL_TOKEN`: Your Vercel API token
   - `VERCEL_PROJECT_ID`: Your Vercel project ID
   - `VERCEL_ORG_ID`: Your Vercel organization ID
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`: Your Clerk publishable key
   - `CLERK_SECRET_KEY`: Your Clerk secret key
   - `DATABASE_URL`: Your Neon database URL

### 3. Manual Deployment

You can also manually deploy the application using the Vercel CLI:

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy to production
vercel --prod
```

## Troubleshooting

### Common Issues

1. **Deployment fails with authentication errors**:
   - Check that your Vercel token is correct and has not expired
   - Verify that the project ID and organization ID are correct

2. **Build fails due to environment variables**:
   - Ensure all required environment variables are set in GitHub secrets
   - Check that the variable names match exactly what's expected in the code

3. **CI checks fail**:
   - Run `npm run lint` and `npm run build` locally to identify issues
   - Fix any linting or build errors before pushing again
