
'use client';

import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useUser } from '@/context/user-context';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { UserRole } from '@/context/user-context';
import { Shield } from 'lucide-react';


export function LoginForm() {
  const router = useRouter();
  const { setUser } = useUser();

  const handleLogin = (event: React.FormEvent) => {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    const role = formData.get('role') as UserRole;
    
    setUser({
        name: 'Demo User',
        role: role || 'Product Manager'
    });
    
    router.push('/dashboard');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <div className="flex items-center justify-center gap-2 mb-4">
            <Shield className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold tracking-tight">predicTo</h1>
          </div>
          <CardTitle className="text-2xl text-center">Login</CardTitle>
          <CardDescription className="text-center">
            Select a role to explore the application.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                defaultValue="demo@example.com"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" defaultValue="password" required />
            </div>
             <div className="grid gap-2">
                <Label htmlFor="role">Role</Label>
                <Select name="role" defaultValue="Product Manager">
                  <SelectTrigger id="role">
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Product Manager">Product Manager</SelectItem>
                    <SelectItem value="Marketing Team">Marketing Team</SelectItem>
                    <SelectItem value="Data Scientist">Data Scientist</SelectItem>
                    <SelectItem value="Administrator">Administrator</SelectItem>
                  </SelectContent>
                </Select>
             </div>
            <Button type="submit" className="w-full">
              Login
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
