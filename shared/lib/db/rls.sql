-- Enable RLS
alter table "organizations" enable row level security;
alter table "members" enable row level security;
alter table "invitations" enable row level security;

-- Helper function to prevent infinite recursion
create or replace function is_org_member(_org_id uuid)
returns boolean language sql security definer as $$
  select exists (
    select 1 from members
    where organization_id = _org_id
    and user_id = auth.uid()
  );
$$;

create or replace function is_org_owner(_org_id uuid)
returns boolean language sql security definer as $$
  select exists (
    select 1 from members
    where organization_id = _org_id
    and user_id = auth.uid()
    and role = 'OWNER'
  );
$$;

-- ORGANIZATIONS
create policy "Users can view organizations they belong to"
on "organizations" for select
using ( is_org_member(id) );

create policy "Users can create organizations"
on "organizations" for insert
with check ( auth.uid() is not null );

create policy "Owners can update their organizations"
on "organizations" for update
using ( is_org_owner(id) );

-- MEMBERS
create policy "Members can view other members of their org"
on "members" for select
using ( is_org_member(organization_id) );

create policy "Owners can insert members"
on "members" for insert
with check ( is_org_owner(organization_id) );

create policy "Owners can update members"
on "members" for update
using ( is_org_owner(organization_id) );

create policy "Owners can delete members"
on "members" for delete
using ( is_org_owner(organization_id) );

create policy "Users can leave (delete self)"
on "members" for delete
using ( user_id = auth.uid() );

-- INVITATIONS
create policy "Owners can view invitations"
on "invitations" for select
using ( is_org_owner(organization_id) );

-- Note: Viewing by email requires access to auth.users or matching against current user email.
-- For now, we restrict to Owners. Invite acceptance is usually done via token which bypasses RLS if using Service Role,
-- or needs a specific policy if using Client.

create policy "Owners can create invitations"
on "invitations" for insert
with check ( is_org_owner(organization_id) );

create policy "Owners can delete invitations"
on "invitations" for delete
using ( is_org_owner(organization_id) );
