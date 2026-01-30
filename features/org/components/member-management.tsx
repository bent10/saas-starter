'use client';

import { useState, useTransition, useEffect, useActionState } from 'react';
import { inviteMember, removeMember, updateMemberRole, type ActionState } from '../actions/org-actions';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/components/ui/table';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu"
import { MoreHorizontal, Plus, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { type InferSelectModel } from 'drizzle-orm';
import { members, users } from '@/shared/lib/db/schema';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar';

type MemberWithUser = InferSelectModel<typeof members> & {
  user: InferSelectModel<typeof users>
}

interface MemberManagementProps {
  orgId: string;
  members: MemberWithUser[];
  currentUserRole: 'OWNER' | 'MEMBER';
  currentUserId: string;
}

const initialState: ActionState = {
  success: false,
  message: '',
};

export function MemberManagement({ orgId, members, currentUserRole, currentUserId }: MemberManagementProps) {
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [inviteState, inviteAction, isInvitePending] = useActionState(inviteMember, initialState);

  useEffect(() => {
    if (inviteState.success) {
      setIsInviteOpen(false);
      toast.success(inviteState.message);
    } else if (inviteState.message && !inviteState.success) {
      toast.error(inviteState.message);
    }
  }, [inviteState]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
            <h2 className="text-xl font-semibold tracking-tight">Members</h2>
            <p className="text-sm text-muted-foreground">Manage your organization members and their roles.</p>
        </div>
        {currentUserRole === 'OWNER' && (
          <Dialog open={isInviteOpen} onOpenChange={setIsInviteOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Invite Member
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Invite Member</DialogTitle>
                <DialogDescription>
                  Send an invitation to a new member to join your organization.
                </DialogDescription>
              </DialogHeader>
              <form action={inviteAction} className="space-y-4">
                <input type="hidden" name="organizationId" value={orgId} />
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    name="email" 
                    type="email" 
                    placeholder="colleague@example.com" 
                    required 
                  />
                  {inviteState.errors?.email && (
                    <p className="text-sm text-destructive">{inviteState.errors.email.join(', ')}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Select name="role" defaultValue="MEMBER">
                    <SelectTrigger>
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MEMBER">Member</SelectItem>
                      <SelectItem value="OWNER">Owner</SelectItem>
                    </SelectContent>
                  </Select>
                  {inviteState.errors?.role && (
                    <p className="text-sm text-destructive">{inviteState.errors.role.join(', ')}</p>
                  )}
                </div>
                <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setIsInviteOpen(false)}>Cancel</Button>
                    <Button type="submit" disabled={isInvitePending}>
                        {isInvitePending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Send Invitation
                    </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {members.map((member) => (
              <MemberRow 
                key={member.id} 
                member={member} 
                orgId={orgId} 
                currentUserRole={currentUserRole}
                currentUserId={currentUserId}
              />
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

function MemberRow({ member, orgId, currentUserRole, currentUserId }: { member: MemberWithUser, orgId: string, currentUserRole: string, currentUserId: string }) {
    const [isPending, startTransition] = useTransition();

    const handleRemove = () => {
        if (!confirm('Are you sure you want to remove this member?')) return;
        
        startTransition(async () => {
            const result = await removeMember(orgId, member.id);
            if (result.success) {
                toast.success(result.message);
            } else {
                toast.error(result.message);
            }
        });
    };

    const handleRoleChange = (newRole: 'OWNER' | 'MEMBER') => {
        startTransition(async () => {
            const result = await updateMemberRole(orgId, member.id, newRole);
             if (result.success) {
                toast.success(result.message);
            } else {
                toast.error(result.message);
            }
        });
    }

    const isSelf = member.userId === currentUserId;
    const canManage = currentUserRole === 'OWNER' && !isSelf;

    return (
        <TableRow>
            <TableCell className="flex items-center gap-3">
                <Avatar>
                    <AvatarImage src="" /> 
                    <AvatarFallback>{member.user?.email?.substring(0, 2).toUpperCase() || 'U'}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                    <span className="font-medium">{member.user?.email}</span>
                </div>
            </TableCell>
            <TableCell>
                {member.role}
            </TableCell>
            <TableCell>
                {new Date(member.createdAt).toLocaleDateString()}
            </TableCell>
            <TableCell>
                {canManage ? (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" disabled={isPending}>
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Actions</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleRoleChange(member.role === 'OWNER' ? 'MEMBER' : 'OWNER')}>
                                {member.role === 'OWNER' ? 'Demote to Member' : 'Promote to Owner'}
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={handleRemove}>
                                Remove Member
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                ) : null}
            </TableCell>
        </TableRow>
    )
}
