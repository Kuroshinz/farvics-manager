DROP POLICY IF EXISTS pol_members_isolation ON public.workspace_members;
CREATE POLICY pol_members_isolation ON public.workspace_members FOR ALL USING (user_id = auth.uid());
