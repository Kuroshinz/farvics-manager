# Supabase Local Development Workflow

This document outlines the workflow for developing locally with Supabase.

## Requirements
- Docker running locally.
- Supabase CLI installed.

## Services
The local Supabase setup runs a complete environment matching the cloud platform:
- **Local Database:** PostgreSQL instance.
- **Local Auth:** Supabase GoTrue for authentication.
- **Local Storage:** Storage API for managing files.
- **Edge Functions:** Deno runtime for edge functions.
- **Realtime:** Realtime server for subscriptions.

## Workflow Configuration
The configuration is stored in `supabase/config.toml`. All local services are pre-configured to mimic the production environment.
