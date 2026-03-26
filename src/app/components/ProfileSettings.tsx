import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Separator } from './ui/separator';
import { Badge } from './ui/badge';
import { 
  User, Mail, Phone, Shield, Bell, Lock, 
  Eye, EyeOff, Upload, Check, X, AlertTriangle,
  Activity, Globe, Smartphone, Clock, MapPin, Save
} from 'lucide-react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from './ui/dialog';

interface ProfileSettingsProps {
  user: { email: string; name: string; profileImage?: string } | null;
  onClose: () => void;
  onUpdateUser: (userData: { email: string; name: string; profileImage?: string }) => void;
}

interface UserAccount {
  email: string;
  password: string;
  fullName: string;
  mobileNumber: string;
  profileImage?: string;
  createdAt: string;
}

export function ProfileSettings({ user, onClose, onUpdateUser }: ProfileSettingsProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [mobileNumber, setMobileNumber] = useState('');
  const [profileImage, setProfileImage] = useState<string | null>(user?.profileImage || null);
  const [newProfileImage, setNewProfileImage] = useState<string | null>(null);
  
  // Password change
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Notification settings
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [threatAlerts, setThreatAlerts] = useState(true);
  const [systemUpdates, setSystemUpdates] = useState(true);
  const [weeklyReports, setWeeklyReports] = useState(false);
  
  // Security settings
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);
  const [sessionTimeout, setSessionTimeout] = useState(30);
  const [loginNotifications, setLoginNotifications] = useState(true);
  
  // Account info
  const [accountCreatedDate, setAccountCreatedDate] = useState('');
  const [lastLoginDate, setLastLoginDate] = useState('');

  // Load user data from localStorage
  useEffect(() => {
    const usersData = localStorage.getItem('threadxai_users');
    if (usersData && user) {
      const users: UserAccount[] = JSON.parse(usersData);
      const userAccount = users.find(u => u.email === user.email);
      if (userAccount) {
        setMobileNumber(userAccount.mobileNumber || '');
        setAccountCreatedDate(userAccount.createdAt);
      }
    }
    
    // Set last login to current time
    setLastLoginDate(new Date().toISOString());
    
    // Load notification preferences
    const notifPrefs = localStorage.getItem(`threadxai_notif_${user?.email}`);
    if (notifPrefs) {
      const prefs = JSON.parse(notifPrefs);
      setEmailNotifications(prefs.emailNotifications ?? true);
      setThreatAlerts(prefs.threatAlerts ?? true);
      setSystemUpdates(prefs.systemUpdates ?? true);
      setWeeklyReports(prefs.weeklyReports ?? false);
    }
    
    // Load security preferences
    const securityPrefs = localStorage.getItem(`threadxai_security_${user?.email}`);
    if (securityPrefs) {
      const prefs = JSON.parse(securityPrefs);
      setTwoFactorAuth(prefs.twoFactorAuth ?? false);
      setSessionTimeout(prefs.sessionTimeout ?? 30);
      setLoginNotifications(prefs.loginNotifications ?? true);
    }
  }, [user]);

  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = () => {
    const usersData = localStorage.getItem('threadxai_users');
    if (usersData && user) {
      const users: UserAccount[] = JSON.parse(usersData);
      const userIndex = users.findIndex(u => u.email === user.email);
      
      if (userIndex !== -1) {
        users[userIndex].fullName = fullName;
        users[userIndex].mobileNumber = mobileNumber;
        
        // Update profile image if new one uploaded
        const finalProfileImage = newProfileImage || profileImage || undefined;
        if (finalProfileImage) {
          users[userIndex].profileImage = finalProfileImage;
        }
        
        localStorage.setItem('threadxai_users', JSON.stringify(users));
        
        // Update current user session
        const updatedUser = {
          email: user.email,
          name: fullName,
          profileImage: finalProfileImage
        };
        localStorage.setItem('threadxai_current_user', JSON.stringify(updatedUser));
        onUpdateUser(updatedUser);
        
        setProfileImage(finalProfileImage || null);
        setNewProfileImage(null);
        setIsEditing(false);
        toast.success('Profile updated successfully!');
      }
    }
  };

  const handleChangePassword = () => {
    if (!currentPassword || !newPassword || !confirmNewPassword) {
      toast.error('Please fill in all password fields');
      return;
    }

    if (newPassword !== confirmNewPassword) {
      toast.error('New passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    const usersData = localStorage.getItem('threadxai_users');
    if (usersData && user) {
      const users: UserAccount[] = JSON.parse(usersData);
      const userIndex = users.findIndex(u => u.email === user.email);
      
      if (userIndex !== -1 && users[userIndex].password === currentPassword) {
        users[userIndex].password = newPassword;
        localStorage.setItem('threadxai_users', JSON.stringify(users));
        
        setCurrentPassword('');
        setNewPassword('');
        setConfirmNewPassword('');
        toast.success('Password changed successfully!');
      } else {
        toast.error('Current password is incorrect');
      }
    }
  };

  const handleSaveNotifications = () => {
    const prefs = {
      emailNotifications,
      threatAlerts,
      systemUpdates,
      weeklyReports
    };
    localStorage.setItem(`threadxai_notif_${user?.email}`, JSON.stringify(prefs));
    toast.success('Notification preferences saved!');
  };

  const handleSaveSecurity = () => {
    const prefs = {
      twoFactorAuth,
      sessionTimeout,
      loginNotifications
    };
    localStorage.setItem(`threadxai_security_${user?.email}`, JSON.stringify(prefs));
    toast.success('Security settings saved!');
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
        <DialogHeader className="sr-only">
          <DialogTitle>Profile & Settings</DialogTitle>
          <DialogDescription>
            Manage your account and security preferences
          </DialogDescription>
        </DialogHeader>
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-semibold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
                Profile & Settings
              </h1>
              <p className="text-slate-500 dark:text-slate-400 mt-1">
                Manage your account and security preferences
              </p>
            </div>
          </div>

          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border border-slate-200 dark:border-slate-800">
              <TabsTrigger value="profile" className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span className="hidden sm:inline">Profile</span>
              </TabsTrigger>
              <TabsTrigger value="security" className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                <span className="hidden sm:inline">Security</span>
              </TabsTrigger>
              <TabsTrigger value="notifications" className="flex items-center gap-2">
                <Bell className="w-4 h-4" />
                <span className="hidden sm:inline">Notifications</span>
              </TabsTrigger>
              <TabsTrigger value="activity" className="flex items-center gap-2">
                <Activity className="w-4 h-4" />
                <span className="hidden sm:inline">Activity</span>
              </TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile" className="mt-6 space-y-6">
              <Card className="border-slate-200 dark:border-slate-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Personal Information
                  </CardTitle>
                  <CardDescription>
                    Update your personal details and profile picture
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Profile Picture */}
                  <div className="flex items-center gap-6">
                    <div className="relative">
                      {(newProfileImage || profileImage) ? (
                        <img 
                          src={newProfileImage || profileImage || ''} 
                          alt="Profile" 
                          className="w-24 h-24 rounded-full object-cover border-4 border-slate-200 dark:border-slate-700"
                        />
                      ) : (
                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold text-3xl border-4 border-slate-200 dark:border-slate-700">
                          {user?.name?.charAt(0).toUpperCase() || 'U'}
                        </div>
                      )}
                      {isEditing && (
                        <label className="absolute bottom-0 right-0 bg-cyan-600 hover:bg-cyan-700 text-white p-2 rounded-full cursor-pointer shadow-lg">
                          <Upload className="w-4 h-4" />
                          <input 
                            type="file" 
                            accept="image/*" 
                            onChange={handleProfileImageChange} 
                            className="hidden" 
                          />
                        </label>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{user?.name}</h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400">{user?.email}</p>
                      <Badge variant="outline" className="mt-2">
                        <Shield className="w-3 h-3 mr-1" />
                        Active Account
                      </Badge>
                    </div>
                    {!isEditing ? (
                      <Button onClick={() => setIsEditing(true)} variant="outline">
                        Edit Profile
                      </Button>
                    ) : (
                      <div className="flex gap-2">
                        <Button onClick={handleSaveProfile} className="bg-cyan-600 hover:bg-cyan-700">
                          <Save className="w-4 h-4 mr-2" />
                          Save
                        </Button>
                        <Button 
                          onClick={() => {
                            setIsEditing(false);
                            setNewProfileImage(null);
                            setFullName(user?.name || '');
                          }} 
                          variant="outline"
                        >
                          Cancel
                        </Button>
                      </div>
                    )}
                  </div>

                  <Separator />

                  {/* Form Fields */}
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="fullName">Full Name</Label>
                      <div className="relative">
                        <Input 
                          id="fullName" 
                          value={fullName} 
                          onChange={(e) => setFullName(e.target.value)}
                          disabled={!isEditing}
                          className="pl-10"
                        />
                        <User className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      </div>
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="email">Email Address</Label>
                      <div className="relative">
                        <Input 
                          id="email" 
                          type="email" 
                          value={email} 
                          disabled
                          className="pl-10 bg-slate-50 dark:bg-slate-900"
                        />
                        <Mail className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      </div>
                      <p className="text-xs text-slate-500">Email cannot be changed</p>
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="mobile">Mobile Number</Label>
                      <div className="relative">
                        <Input 
                          id="mobile" 
                          type="tel" 
                          value={mobileNumber}
                          onChange={(e) => setMobileNumber(e.target.value)}
                          disabled={!isEditing}
                          className="pl-10"
                        />
                        <Phone className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Account Information */}
              <Card className="border-slate-200 dark:border-slate-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    Account Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Account Created</p>
                      <p className="font-medium">{formatDate(accountCreatedDate)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Last Login</p>
                      <p className="font-medium">{formatDate(lastLoginDate)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Account Status</p>
                      <Badge className="bg-green-100 dark:bg-green-950/30 text-green-700 dark:text-green-400">
                        <Check className="w-3 h-3 mr-1" />
                        Verified
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Account Type</p>
                      <p className="font-medium">Security Administrator</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Security Tab */}
            <TabsContent value="security" className="mt-6 space-y-6">
              {/* Change Password */}
              <Card className="border-slate-200 dark:border-slate-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lock className="w-5 h-5" />
                    Change Password
                  </CardTitle>
                  <CardDescription>
                    Update your password to keep your account secure
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <div className="relative">
                      <Input 
                        id="currentPassword" 
                        type={showCurrentPassword ? 'text' : 'password'}
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                      >
                        {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <div className="relative">
                      <Input 
                        id="newPassword" 
                        type={showNewPassword ? 'text' : 'password'}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                      >
                        {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <div className="relative">
                      <Input 
                        id="confirmPassword" 
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={confirmNewPassword}
                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                        className="pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                      >
                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <Button onClick={handleChangePassword} className="bg-cyan-600 hover:bg-cyan-700">
                    Update Password
                  </Button>
                </CardContent>
              </Card>

              {/* Security Settings */}
              <Card className="border-slate-200 dark:border-slate-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Security Settings
                  </CardTitle>
                  <CardDescription>
                    Manage your account security preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="2fa">Two-Factor Authentication</Label>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        Add an extra layer of security to your account
                      </p>
                    </div>
                    <Switch 
                      id="2fa" 
                      checked={twoFactorAuth}
                      onCheckedChange={setTwoFactorAuth}
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="loginNotif">Login Notifications</Label>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        Get notified when someone logs into your account
                      </p>
                    </div>
                    <Switch 
                      id="loginNotif" 
                      checked={loginNotifications}
                      onCheckedChange={setLoginNotifications}
                    />
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <Label htmlFor="timeout">Session Timeout (minutes)</Label>
                    <Input 
                      id="timeout" 
                      type="number" 
                      value={sessionTimeout}
                      onChange={(e) => setSessionTimeout(parseInt(e.target.value))}
                      min="5"
                      max="120"
                    />
                    <p className="text-xs text-slate-500">
                      Automatically log out after {sessionTimeout} minutes of inactivity
                    </p>
                  </div>

                  <Button onClick={handleSaveSecurity} className="bg-cyan-600 hover:bg-cyan-700 w-full">
                    <Save className="w-4 h-4 mr-2" />
                    Save Security Settings
                  </Button>
                </CardContent>
              </Card>

              {/* Danger Zone */}
              <Card className="border-red-200 dark:border-red-900">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-red-600 dark:text-red-400">
                    <AlertTriangle className="w-5 h-5" />
                    Danger Zone
                  </CardTitle>
                  <CardDescription>
                    Irreversible and destructive actions
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-red-200 dark:border-red-900 rounded-lg">
                    <div>
                      <p className="font-medium">Delete Account</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        Permanently delete your account and all associated data
                      </p>
                    </div>
                    <Button variant="destructive">
                      Delete Account
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Notifications Tab */}
            <TabsContent value="notifications" className="mt-6 space-y-6">
              <Card className="border-slate-200 dark:border-slate-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="w-5 h-5" />
                    Notification Preferences
                  </CardTitle>
                  <CardDescription>
                    Choose what notifications you want to receive
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="emailNotif">Email Notifications</Label>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        Receive notifications via email
                      </p>
                    </div>
                    <Switch 
                      id="emailNotif" 
                      checked={emailNotifications}
                      onCheckedChange={setEmailNotifications}
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="threatAlert">Threat Alerts</Label>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        Get notified immediately when threats are detected
                      </p>
                    </div>
                    <Switch 
                      id="threatAlert" 
                      checked={threatAlerts}
                      onCheckedChange={setThreatAlerts}
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="systemUpdate">System Updates</Label>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        Receive notifications about system maintenance and updates
                      </p>
                    </div>
                    <Switch 
                      id="systemUpdate" 
                      checked={systemUpdates}
                      onCheckedChange={setSystemUpdates}
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="weeklyReport">Weekly Security Reports</Label>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        Get a weekly summary of security activities
                      </p>
                    </div>
                    <Switch 
                      id="weeklyReport" 
                      checked={weeklyReports}
                      onCheckedChange={setWeeklyReports}
                    />
                  </div>

                  <Separator />

                  <Button onClick={handleSaveNotifications} className="bg-cyan-600 hover:bg-cyan-700 w-full">
                    <Save className="w-4 h-4 mr-2" />
                    Save Notification Preferences
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Activity Tab */}
            <TabsContent value="activity" className="mt-6 space-y-6">
              <Card className="border-slate-200 dark:border-slate-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5" />
                    Recent Activity
                  </CardTitle>
                  <CardDescription>
                    View your recent account activity and sessions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start gap-4 p-4 border border-slate-200 dark:border-slate-800 rounded-lg">
                      <div className="p-2 bg-green-100 dark:bg-green-950/30 rounded-lg">
                        <Check className="w-5 h-5 text-green-600 dark:text-green-400" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">Successful Login</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          {formatDate(lastLoginDate)}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <Globe className="w-4 h-4 text-slate-400" />
                          <span className="text-xs text-slate-500">Chrome on Windows</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-4 p-4 border border-slate-200 dark:border-slate-800 rounded-lg">
                      <div className="p-2 bg-blue-100 dark:bg-blue-950/30 rounded-lg">
                        <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">Profile Updated</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          {formatDate(accountCreatedDate)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4 p-4 border border-slate-200 dark:border-slate-800 rounded-lg">
                      <div className="p-2 bg-purple-100 dark:bg-purple-950/30 rounded-lg">
                        <Shield className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">Security Settings Changed</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          Two-factor authentication {twoFactorAuth ? 'enabled' : 'disabled'}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Active Sessions */}
              <Card className="border-slate-200 dark:border-slate-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Smartphone className="w-5 h-5" />
                    Active Sessions
                  </CardTitle>
                  <CardDescription>
                    Manage your active sessions across devices
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start gap-4 p-4 border border-slate-200 dark:border-slate-800 rounded-lg bg-cyan-50 dark:bg-cyan-950/10">
                      <div className="p-2 bg-cyan-100 dark:bg-cyan-950/30 rounded-lg">
                        <Smartphone className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-medium">Current Session</p>
                          <Badge variant="outline" className="text-xs">Active Now</Badge>
                        </div>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                          Chrome on Windows • {new Date().toLocaleDateString()}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <MapPin className="w-4 h-4 text-slate-400" />
                          <span className="text-xs text-slate-500">United States</span>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        Current
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}