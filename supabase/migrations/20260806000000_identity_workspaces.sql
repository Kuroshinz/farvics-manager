-- Purpose: Create Workspaces and Workspace Members for tenant isolation
-- Module: Identity
-- Author: Antigravity
-- Creation Date: 2026-08-06

-- 1. Add Profile Fields to Users
ALTER TABLE public.users 
ADD COLUMN avatar_url TEXT,
ADD COLUMN language VARCHAR(10) DEFAULT 'vi',
ADD COLUMN timezone VARCHAR(50) DEFAULT 'Asia/Ho_Chi_Minh';

-- 2. Create Workspaces Table
CREATE TABLE public.identity_workspaces (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ,
    version INTEGER NOT NULL DEFAULT 1,
    owner_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE
);

CREATE UNIQUE INDEX uq_idx_workspaces_owner_name ON public.identity_workspaces(owner_id, name) WHERE deleted_at IS NULL;

-- 3. Create Workspace Members Table
CREATE TABLE public.identity_workspace_members (
    workspace_id UUID NOT NULL REFERENCES public.identity_workspaces(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    role VARCHAR(50) NOT NULL, -- Admin, Manager, Member, Viewer
    joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    PRIMARY KEY (workspace_id, user_id)
);

-- 4. RLS Policies
ALTER TABLE public.identity_workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.identity_workspace_members ENABLE ROW LEVEL SECURITY;

-- A user can read workspaces they are a member of
CREATE POLICY pol_workspaces_read_member 
    ON public.identity_workspaces 
    FOR SELECT 
    USING (
        id IN (SELECT workspace_id FROM public.identity_workspace_members WHERE user_id = auth.uid())
    );

-- Only owners/admins can update the workspace
CREATE POLICY pol_workspaces_update_admin 
    ON public.identity_workspaces 
    FOR UPDATE 
    USING (
        id IN (SELECT workspace_id FROM public.identity_workspace_members WHERE user_id = auth.uid() AND role IN ('Admin', 'Owner'))
    );

-- Members can read other members in their workspaces
CREATE POLICY pol_workspace_members_read 
    ON public.identity_workspace_members 
    FOR SELECT 
    USING (
        workspace_id IN (SELECT workspace_id FROM public.identity_workspace_members WHERE user_id = auth.uid())
    );

-- Triggers for updated_at and version (Assuming fn_set_updated_at and fn_increment_version exist from user migration)
CREATE TRIGGER trg_workspaces_updated_at
    BEFORE UPDATE ON public.identity_workspaces
    FOR EACH ROW
    EXECUTE FUNCTION public.fn_set_updated_at();

CREATE TRIGGER trg_workspaces_increment_version
    BEFORE UPDATE ON public.identity_workspaces
    FOR EACH ROW
    EXECUTE FUNCTION public.fn_increment_version();
