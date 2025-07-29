
"use client";

import { useState } from "react";
import type { UserRole } from "@/context/user-context";
import { useUser } from "@/context/user-context";
import { useActivityLog } from "@/context/activity-log-context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

type User = {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  status: "Active" | "Inactive";
};

const initialUsers: User[] = [
  { id: 1, name: "Admin User", email: "admin@example.com", role: "Administrator", status: "Active" },
  { id: 2, name: "Product Manager", email: "pm@example.com", role: "Product Manager", status: "Active" },
  { id: 3, name: "Marketing Lead", email: "mktg@example.com", role: "Marketing Team", status: "Active" },
  { id: 4, name: "Data Scientist", email: "data@example.com", role: "Data Scientist", status: "Active" },
  { id: 5, name: "Inactive User", email: "inactive@example.com", role: "Product Manager", status: "Inactive" },
];

const allRoles: UserRole[] = ["Administrator", "Product Manager", "Marketing Team", "Data Scientist"];

export default function UserManagementClient() {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const { user: adminUser } = useUser();
  const { addLog } = useActivityLog();
  const { toast } = useToast();
  const router = useRouter();

  const handleRoleChange = (userId: number, newRole: UserRole) => {
    const userToUpdate = users.find(u => u.id === userId);
    if (!userToUpdate || !adminUser) return;
    
    addLog({
        user: adminUser.name,
        action: 'Role Change',
        details: `Changed ${userToUpdate.name}'s role from ${userToUpdate.role} to ${newRole}`
    });
    setUsers(users.map(user => user.id === userId ? { ...user, role: newRole } : user));
    toast({
        variant: 'success',
        title: 'User Role Changed',
        description: `${userToUpdate.name}'s role has been updated to ${newRole}.`
    });
  };
  
  const handleStatusChange = (userId: number, newStatus: "Active" | "Inactive") => {
     const userToUpdate = users.find(u => u.id === userId);
     if (!userToUpdate || !adminUser) return;

     addLog({
        user: adminUser.name,
        action: 'Status Change',
        details: `${newStatus === 'Active' ? 'Activated' : 'Deactivated'} user ${userToUpdate.name}`
    });
     setUsers(users.map(user => user.id === userId ? { ...user, status: newStatus } : user));
     toast({
        variant: 'info',
        title: 'User Status Changed',
        description: `User ${userToUpdate.name} has been ${newStatus === 'Active' ? 'activated' : 'deactivated'}.`
    });
  }

  return (
    <div className="space-y-6">
       <div className="flex items-center gap-4">
         <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
        </Button>
        <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
            <p className="text-muted-foreground">
            View and manage user roles and permissions across the application.
            </p>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Users</CardTitle>
          <CardDescription>A list of all the users in the system.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead className="hidden md:table-cell">Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead className="hidden sm:table-cell">Status</TableHead>
                  <TableHead>
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell className="hidden md:table-cell text-muted-foreground">{user.email}</TableCell>
                    <TableCell>{user.role}</TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <Badge variant={user.status === 'Active' ? 'default' : 'secondary'}
                        className={user.status === 'Active' ? 'bg-green-500/20 text-green-700 border-green-400' : ''}
                      >
                          {user.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button aria-haspopup="true" size="icon" variant="ghost">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Toggle menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          {allRoles.map(role => (
                            <DropdownMenuItem key={role} onClick={() => handleRoleChange(user.id, role)} disabled={user.role === role}>
                              Set as {role}
                            </DropdownMenuItem>
                          ))}
                           <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleStatusChange(user.id, user.status === 'Active' ? 'Inactive' : 'Active')}>
                            {user.status === 'Active' ? 'Deactivate' : 'Activate'}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
