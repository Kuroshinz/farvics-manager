
-- Wave 6.4.6 Enterprise Authentication & Security
CREATE TABLE public.user_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    device VARCHAR(255),
    browser VARCHAR(255),
    os VARCHAR(255),
    ip_address VARCHAR(45),
    location VARCHAR(255),
    last_active TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    is_current BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.user_security_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    event_type VARCHAR(100) NOT NULL,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.user_preferences (
    user_id UUID PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
    timezone VARCHAR(100) DEFAULT 'UTC',
    language VARCHAR(10) DEFAULT 'vi',
    currency VARCHAR(3) DEFAULT 'VND',
    theme VARCHAR(20) DEFAULT 'system',
    notifications JSONB DEFAULT '{"email": true, "push": true}'::jsonb,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_security_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY pol_sessions_read ON public.user_sessions FOR SELECT USING (user_id = auth.uid());
CREATE POLICY pol_security_logs_read ON public.user_security_logs FOR SELECT USING (user_id = auth.uid());
CREATE POLICY pol_preferences_all ON public.user_preferences FOR ALL USING (user_id = auth.uid());
