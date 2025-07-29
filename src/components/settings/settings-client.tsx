
'use client';

import { useState } from 'react';
import { useUser } from '@/context/user-context';
import { useActivityLog } from '@/context/activity-log-context';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useRouter } from 'next/navigation';
import { ConfirmationDialog } from './confirmation-dialog';
import { User, KeyRound, Bell, Languages, Shield, Trash2, LogOut, ChevronRight } from 'lucide-react';

export default function SettingsClient() {
  const { user } = useUser();
  const { addLog, clearLogs } = useActivityLog();
  const { toast } = useToast();
  const router = useRouter();

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [isClearLogsDialogOpen, setIsClearLogsDialogOpen] = useState(false);
  const [isDeleteAccountDialogOpen, setIsDeleteAccountDialogOpen] = useState(false);

  const handleClearLogs = () => {
    clearLogs();
    if(user) {
        addLog({
            user: user.name,
            action: 'Logs Cleared',
            details: 'All activity logs have been cleared.'
        });
    }
    toast({
        variant: 'info',
        title: 'Activity Logs Cleared',
        description: 'The activity log has been successfully cleared.'
    });
    setIsClearLogsDialogOpen(false);
  };

  const handleDeleteAccount = () => {
    // In a real app, this would be a more complex process
    toast({
        variant: 'warning',
        title: 'Account Deleted',
        description: 'Your account has been successfully deleted.'
    });
    setIsDeleteAccountDialogOpen(false);
    router.push('/login');
  };

  if (!user) {
    return null; // Or a loading skeleton
  }

  const isAdmin = user.role === 'Administrator';

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings, application preferences, and more.
        </p>
      </div>

      {/* Account Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Account</CardTitle>
          <CardDescription>Manage your personal account details and security.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <button onClick={() => router.push('/profile')} className="flex items-center justify-between w-full p-4 rounded-lg hover:bg-muted transition-colors border">
            <div className="flex items-center gap-4">
              <User className="w-5 h-5 text-primary" />
              <div>
                <p className="font-semibold">Profile Information</p>
                <p className="text-sm text-muted-foreground">Update your name, email, and avatar.</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </button>
          
          <div className="space-y-2 p-4 border rounded-lg">
            <Label htmlFor="password">Change Password</Label>
            <div className="flex gap-2">
              <Input id="password" type="password" placeholder="Current Password" />
              <Input type="password" placeholder="New Password" />
              <Button>Update</Button>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="space-y-1">
              <Label htmlFor="2fa" className="font-semibold">Two-Factor Authentication</Label>
              <p className="text-sm text-muted-foreground">Add an extra layer of security to your account.</p>
            </div>
            <Switch id="2fa" checked={twoFactorEnabled} onCheckedChange={setTwoFactorEnabled} />
          </div>
        </CardContent>
        <CardFooter className="border-t pt-6">
            <Button variant="destructive" onClick={() => setIsDeleteAccountDialogOpen(true)} className="flex items-center gap-2">
                <Trash2 className="w-4 h-4" />
                Delete Account
            </Button>
        </CardFooter>
      </Card>

      {/* Application Preferences */}
      <Card>
        <CardHeader>
          <CardTitle>Application Preferences</CardTitle>
          <CardDescription>Customize your experience across the app.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
           <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="space-y-1">
              <Label htmlFor="language" className="font-semibold">Language</Label>
               <p className="text-sm text-muted-foreground">Choose your preferred language.</p>
            </div>
            <Select defaultValue="en">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="es" disabled>Spanish (Coming Soon)</SelectItem>
                <SelectItem value="fr" disabled>French (Coming Soon)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="space-y-1">
              <Label htmlFor="notifications" className="font-semibold">Enable Notifications</Label>
              <p className="text-sm text-muted-foreground">Control whether you receive toast alerts.</p>
            </div>
            <Switch id="notifications" checked={notificationsEnabled} onCheckedChange={setNotificationsEnabled} />
          </div>
        </CardContent>
      </Card>
      
      {/* Admin Settings */}
      {isAdmin && (
        <Card>
          <CardHeader>
            <CardTitle>Admin Settings</CardTitle>
            <CardDescription>Manage system-level configurations.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <button onClick={() => router.push('/admin')} className="flex items-center justify-between w-full p-4 rounded-lg hover:bg-muted transition-colors border">
                <div className="flex items-center gap-4">
                <Shield className="w-5 h-5 text-primary" />
                <div>
                    <p className="font-semibold">Manage Roles and Permissions</p>
                    <p className="text-sm text-muted-foreground">Go to the User Management dashboard.</p>
                </div>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>
            <div className="flex items-center justify-between p-4 border rounded-lg">
                 <div className="space-y-1">
                    <Label className="font-semibold">Enable Audit Logs</Label>
                    <p className="text-sm text-muted-foreground">Keep detailed logs of all system activities.</p>
                </div>
                <Switch defaultChecked />
            </div>
             <div className="flex items-center justify-between p-4 border rounded-lg">
                 <div className="space-y-1">
                    <Label className="font-semibold">Configure System Alerts</Label>
                    <p className="text-sm text-muted-foreground">Notify on low forecast accuracy.</p>
                </div>
                <Switch />
            </div>
          </CardContent>
           <CardFooter className="border-t pt-6">
            <Button variant="outline" onClick={() => setIsClearLogsDialogOpen(true)}>
              Clear Activity Logs
            </Button>
          </CardFooter>
        </Card>
      )}

      {/* Confirmation Dialogs */}
      <ConfirmationDialog
        isOpen={isClearLogsDialogOpen}
        onClose={() => setIsClearLogsDialogOpen(false)}
        onConfirm={handleClearLogs}
        title="Are you absolutely sure?"
        description="This action cannot be undone. This will permanently delete all activity logs from the system."
        confirmButtonText="Yes, clear logs"
      />
       <ConfirmationDialog
        isOpen={isDeleteAccountDialogOpen}
        onClose={() => setIsDeleteAccountDialogOpen(false)}
        onConfirm={handleDeleteAccount}
        title="Delete Account?"
        description="This action is permanent and cannot be undone. All your data will be permanently removed."
        confirmButtonText="Yes, delete my account"
        variant="destructive"
      />
    </div>
  );
}
