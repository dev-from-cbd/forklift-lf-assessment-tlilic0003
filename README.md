# Forklift Training & Assessment

## Security Notice
This project contains sensitive information. Please follow these security guidelines:

1. Never commit `.env` files
2. Never share API keys or secrets
3. Use environment variables for sensitive data
4. Keep Supabase credentials private

## Setup

1. Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

2. Fill in your environment variables in `.env`

3. Install dependencies:
```bash
npm install
```

4. Start the development server:
```bash
npm run dev
```

## Environment Variables

Required environment variables:
- `VITE_SUPABASE_URL`: Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY`: Your Supabase anonymous key
- `JWT_SECRET`: Secret for JWT token generation

## Security Best Practices

1. Always use environment variables for sensitive data
2. Never commit secrets or API keys
3. Keep the `.env` file private
4. Use HTTPS in production
5. Implement proper authentication
6. Sanitize user inputs
7. Use secure headers
8. Regular security updates