
'use client';

import { useState } from 'react';
import { useUser } from '@/context/user-context';
import { useActivityLog } from '@/context/activity-log-context';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useRouter } from 'next/navigation';
import { ConfirmationDialog } from './confirmation-dialog';
import { User, KeyRound, Bell, Languages, Shield, Trash2, LogOut, ChevronRight, Palette, LayoutDashboard, Calendar, DollarSign, FileText, AlertTriangle, ArrowLeft } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useSettings } from '@/context/settings-context';

export default function SettingsClient() {
  const { user } = useUser();
  const { addLog, clearLogs } = useActivityLog();
  const { toast } = useToast();
  const router = useRouter();
  const { setTheme } = useTheme();
  const { settings, setSetting } = useSettings();


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

  const SettingRow = ({ icon: Icon, title, description, children }: { icon: React.ElementType, title: string, description: string, children: React.ReactNode }) => (
    <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
        <div className="flex items-center gap-4">
            <Icon className="w-5 h-5 text-primary" />
            <div>
                <p className="font-semibold">{title}</p>
                <p className="text-sm text-muted-foreground">{description}</p>
            </div>
        </div>
        <div>
            {children}
        </div>
    </div>
  );

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="flex items-center gap-4">
         <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
        </Button>
        <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
            <p className="text-muted-foreground">
            Manage your account settings, application preferences, and more.
            </p>
        </div>
      </div>

      {/* Account Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Account</CardTitle>
          <CardDescription>Manage your personal account details and security.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <SettingRow icon={User} title="Profile Information" description="Update your name, email, and avatar.">
              <Button variant="outline" size="sm" onClick={() => router.push('/profile')}>
                  Edit Profile <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
          </SettingRow>
          
          <SettingRow icon={KeyRound} title="Change Password" description="Update your current password.">
              <Button variant="outline" size="sm" disabled>Update</Button>
          </SettingRow>

          <SettingRow icon={Shield} title="Two-Factor Authentication" description="Add an extra layer of security.">
            <Switch id="2fa" checked={settings.twoFactorEnabled} onCheckedChange={(checked) => setSetting('twoFactorEnabled', checked)} />
          </SettingRow>

          <SettingRow icon={LayoutDashboard} title="Default Landing Page" description="Choose the page you see after login.">
            <Select value={settings.defaultLandingPage} onValueChange={(value) => setSetting('defaultLandingPage', value)}>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select Page" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="dashboard">Dashboard</SelectItem>
                    <SelectItem value="analytics">Analytics</SelectItem>
                    <SelectItem value="external-data">Forecast</SelectItem>
                </SelectContent>
            </Select>
          </SettingRow>

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
        <CardContent className="space-y-4">
           <SettingRow icon={Palette} title="Theme" description="Switch between light and dark mode.">
             <Select onValueChange={setTheme} defaultValue="system">
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Theme" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                </SelectContent>
            </Select>
           </SettingRow>
           <SettingRow icon={Languages} title="Language" description="Choose your preferred language.">
            <Select value={settings.language} onValueChange={(value) => setSetting('language', value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="es" disabled>Spanish (Coming Soon)</SelectItem>
                <SelectItem value="fr" disabled>French (Coming Soon)</SelectItem>
              </SelectContent>
            </Select>
          </SettingRow>
          <SettingRow icon={Bell} title="Enable Notifications" description="Control whether you receive toast alerts.">
            <Switch id="notifications" checked={settings.notificationsEnabled} onCheckedChange={(checked) => setSetting('notificationsEnabled', checked)} />
          </SettingRow>
          <SettingRow icon={Calendar} title="Date Format" description="Set your preferred date display format.">
            <Select value={settings.dateFormat} onValueChange={(value) => setSetting('dateFormat', value)}>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Date Format" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                    <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                    <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                </SelectContent>
            </Select>
          </SettingRow>
          <SettingRow icon={DollarSign} title="Currency Format" description="Set your preferred currency symbol.">
             <Select value={settings.currency} onValueChange={(value) => setSetting('currency', value)}>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Currency" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="INR">₹ (INR)</SelectItem>
                    <SelectItem value="USD">$ (USD)</SelectItem>
                    <SelectItem value="EUR">€ (EUR)</SelectItem>
                </SelectContent>
            </Select>
          </SettingRow>
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
             <SettingRow icon={Shield} title="Manage Roles and Permissions" description="Go to the User Management dashboard.">
                <Button variant="outline" size="sm" onClick={() => router.push('/admin')}>
                    View Admin Panel <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
            </SettingRow>
             <SettingRow icon={FileText} title="Enable Audit Logs" description="Keep detailed logs of all system activities.">
                <Switch checked={settings.auditLogsEnabled} onCheckedChange={(checked) => setSetting('auditLogsEnabled', checked)} />
            </SettingRow>
             <SettingRow icon={AlertTriangle} title="Configure System Alerts" description="Notify on low forecast accuracy.">
                <Switch checked={settings.systemAlertsEnabled} onCheckedChange={(checked) => setSetting('systemAlertsEnabled', checked)} />
            </SettingRow>
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
