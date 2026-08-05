# Configuration Specification

## `.env.example`
```env
# Supabase (Database & Auth)
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-key" # Server-only

# App Config
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NODE_ENV="development"

# Feature Flags
NEXT_PUBLIC_ENABLE_AI_INSIGHTS="false"
```

## Configuration Strategy
- **Development**: Local Supabase instance via Docker (`npx supabase start`).
- **Production**: Hosted Supabase. Vercel environment variables.
