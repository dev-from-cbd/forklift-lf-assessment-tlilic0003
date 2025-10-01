# Forklift Training & Assessment
<!-- Main project title using H1 markdown heading -->

## Security Notice
<!-- H2 section header for security-related information -->
This project contains sensitive information. Please follow these security guidelines:
<!-- Introductory text explaining the importance of security measures -->

1. Never commit `.env` files
<!-- Security rule #1: Environment files should not be version controlled -->
2. Never share API keys or secrets
<!-- Security rule #2: Sensitive credentials must remain private -->
3. Use environment variables for sensitive data
<!-- Security rule #3: Configuration should use environment variables -->
4. Keep Supabase credentials private
<!-- Security rule #4: Database credentials must be protected -->

## Setup
<!-- H2 section header for installation and setup instructions -->

1. Copy `.env.example` to `.env`:
<!-- Step 1: Create local environment file from template -->
```bash
cp .env.example .env
```
<!-- Bash command to copy environment template file -->

2. Fill in your environment variables in `.env`
<!-- Step 2: Configure environment variables with actual values -->

3. Install dependencies:
<!-- Step 3: Install Node.js project dependencies -->
```bash
npm install
```
<!-- NPM command to install all package dependencies -->

4. Start the development server:
<!-- Step 4: Launch local development server -->
```bash
npm run dev
```
<!-- NPM script command to start Vite development server -->

## Environment Variables
<!-- H2 section header for environment configuration documentation -->

Required environment variables:
<!-- Introductory text for mandatory configuration variables -->
- `VITE_SUPABASE_URL`: Your Supabase project URL
<!-- Environment variable for Supabase database connection URL -->
- `VITE_SUPABASE_ANON_KEY`: Your Supabase anonymous key
<!-- Environment variable for Supabase public API authentication key -->
- `JWT_SECRET`: Secret for JWT token generation
<!-- Environment variable for JSON Web Token signing secret -->

## Security Best Practices
<!-- H2 section header for security recommendations and guidelines -->

1. Always use environment variables for sensitive data
<!-- Best practice #1: Store sensitive configuration in environment variables -->
2. Never commit secrets or API keys
<!-- Best practice #2: Exclude sensitive data from version control -->
3. Keep the `.env` file private
<!-- Best practice #3: Environment files should remain local and private -->
4. Use HTTPS in production
<!-- Best practice #4: Secure communication protocol for production deployment -->
5. Implement proper authentication
<!-- Best practice #5: Secure user authentication and authorization -->
6. Sanitize user inputs
<!-- Best practice #6: Validate and clean user-provided data -->
7. Use secure headers
<!-- Best practice #7: Implement security headers for web protection -->
8. Regular security updates
<!-- Best practice #8: Keep dependencies and system updated for security -->