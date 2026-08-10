CREATE POLICY pol_workspaces_insert_self ON public.workspaces FOR INSERT WITH CHECK (created_by = auth.uid());
CREATE POLICY pol_members_insert_self ON public.workspace_members FOR INSERT WITH CHECK (user_id = auth.uid());
