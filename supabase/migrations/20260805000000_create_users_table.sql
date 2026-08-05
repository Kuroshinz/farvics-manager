-- Purpose: Create the users table and synchronize with Supabase Auth
-- Module: Identity
-- Related ADR: N/A
-- Sprint: Wave 3
-- Author: Antigravity
-- Creation Date: 2026-08-05
-- Dependencies: None
-- Risk Level: Medium

-- 1. Create the public.users table
CREATE TABLE public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    first_name TEXT,
    last_name TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ,
    version INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT uq_users_email UNIQUE (email)
);

-- 2. Indexes
CREATE UNIQUE INDEX uq_idx_users_email ON public.users(email) WHERE deleted_at IS NULL;

-- 3. Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

CREATE POLICY pol_users_read_own 
    ON public.users 
    FOR SELECT 
    USING (auth.uid() = id);

CREATE POLICY pol_users_update_own 
    ON public.users 
    FOR UPDATE 
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- 4. Audit & Concurrency Triggers
CREATE OR REPLACE FUNCTION public.fn_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_users_updated_at
    BEFORE UPDATE ON public.users
    FOR EACH ROW
    EXECUTE FUNCTION public.fn_set_updated_at();

CREATE OR REPLACE FUNCTION public.fn_increment_version()
RETURNS TRIGGER AS $$
BEGIN
    NEW.version = OLD.version + 1;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_users_increment_version
    BEFORE UPDATE ON public.users
    FOR EACH ROW
    EXECUTE FUNCTION public.fn_increment_version();

-- 5. Sync trigger from auth.users to public.users
CREATE OR REPLACE FUNCTION public.fn_sync_user()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        INSERT INTO public.users (id, email, first_name, last_name)
        VALUES (
            NEW.id,
            NEW.email,
            NEW.raw_user_meta_data->>'first_name',
            NEW.raw_user_meta_data->>'last_name'
        );
    ELSIF TG_OP = 'UPDATE' THEN
        UPDATE public.users
        SET email = NEW.email
        WHERE id = NEW.id;
    ELSIF TG_OP = 'DELETE' THEN
        -- We soft delete the public user
        UPDATE public.users
        SET deleted_at = NOW()
        WHERE id = OLD.id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger attached to auth.users (owned by Supabase, but we can add a trigger)
CREATE TRIGGER trg_sync_auth_user
    AFTER INSERT OR UPDATE OR DELETE ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.fn_sync_user();
